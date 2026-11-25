// The depth kit for 3D stage films, served at /lit/depth-kit.js (references/depth.md). Written for this
// skill; the only outside source is the kelvin curve fit credited in depth-math.js. Every pose is a pure function of t, so a frame drawn directly equals the
// same frame reached by stepping: the determinism replay depends on it.
//
//   import { createDof, lensFov, kelvin, character, spring, hop, squash, blink, lag } from "/lit/depth-kit.js";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { blink, cocPx, hop, kelvinRgb, lag, lensFov, spring, squash } from "./depth-math.js";

export { blink, cocPx, hop, lag, lensFov, spring, squash };

/** A light colour for a black-body temperature in kelvin (3200 warm tungsten, 5600 daylight, 7500 shade). */
export function kelvin(k) {
  const [r, g, b] = kelvinRgb(k);
  return new THREE.Color().setRGB(r, g, b, THREE.SRGBColorSpace);
}

const DOF_VERT = /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

const DOF_FRAG = /* glsl */ `
#include <packing>
uniform sampler2D tColor;
uniform sampler2D tDepth;
uniform vec2 resolution;
uniform float near;
uniform float far;
uniform float focus;
uniform float lensK;
uniform float maxBlur;
varying vec2 vUv;
const int TAPS = 64;
const float GOLDEN = 2.39996323;
float viewDist(vec2 uv) {
  return -perspectiveDepthToViewZ(texture2D(tDepth, uv).x, near, far);
}
float coc(float z) {
  return min(maxBlur, lensK * abs(z - focus) / z);
}
void main() {
  float z0 = viewDist(vUv);
  float c0 = coc(z0);
  // 64 taps over a wide circle leave gaps a small bright light falls between (speckled bokeh), so each
  // tap reads the mip level whose texel matches the spacing between taps
  float lod = c0 > 0.5 ? log2(max(1.0, c0 * sqrt(3.14159265 / float(TAPS)))) : 0.0;
  vec4 sum = textureLod(tColor, vUv, lod);
  float wsum = 1.0;
  if (c0 > 0.5) {
    for (int i = 1; i < TAPS; i++) {
      float r = sqrt(float(i) / float(TAPS)) * c0;
      float a = float(i) * GOLDEN;
      vec2 uv = vUv + vec2(cos(a), sin(a)) * r / resolution;
      float zi = viewDist(uv);
      // a sample nearer than this pixel spreads only as far as its own circle, so a sharp subject in
      // front keeps its edge instead of being smeared by the blurred ground behind it
      float reach = zi < z0 ? coc(zi) : c0;
      float w = smoothstep(r - 1.0, r + 1.0, reach);
      sum += textureLod(tColor, uv, lod) * w;
      wsum += w;
    }
  }
  gl_FragColor = sum / wsum;
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`;

/**
 * A thin-lens depth of field for one renderer. `render(scene, cam, { focus, fstop })` draws the frame:
 * focus is the in-focus distance from the camera in scene units, fstop the aperture (1.4 shallow,
 * 16 deep); without both it draws sharp. `unitM` is how many metres one scene unit stands for (0.1 by
 * default: a tabletop world, where focus falls off as it does on a real macro lens).
 */
export function createDof(renderer, { width, height, unitM = 0.1, maxBlur = 24 } = {}) {
  const target = new THREE.WebGLRenderTarget(width, height, { type: THREE.HalfFloatType, samples: 4, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter });
  target.depthTexture = new THREE.DepthTexture(width, height);
  const material = new THREE.ShaderMaterial({
    uniforms: {
      tColor: { value: target.texture }, tDepth: { value: target.depthTexture }, resolution: { value: new THREE.Vector2(width, height) },
      near: { value: 0.1 }, far: { value: 100 }, focus: { value: 5 }, lensK: { value: 0 }, maxBlur: { value: maxBlur },
    },
    vertexShader: DOF_VERT,
    fragmentShader: DOF_FRAG,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NoBlending,
  });
  const post = new THREE.Scene();
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  quad.frustumCulled = false;
  post.add(quad);
  const flat = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return {
    render(scene, cam, { focus, fstop } = {}) {
      renderer.setRenderTarget(null);
      if (!(fstop > 0) || !Number.isFinite(fstop) || !(focus > 0)) {
        renderer.render(scene, cam);
        return;
      }
      renderer.setRenderTarget(target);
      renderer.clear();
      renderer.render(scene, cam);
      renderer.setRenderTarget(null);
      const f = cam.getFocalLength() / 1000;
      const s = focus * unitM;
      // the thin-lens circle in pixels is lensK * |z - focus| / z (cocPx in depth-math.js, rearranged)
      const lensK = s > f ? ((f / fstop) * f) / (s - f) / (cam.getFilmWidth() / 1000) * width : 0;
      material.uniforms.near.value = cam.near;
      material.uniforms.far.value = cam.far;
      material.uniforms.focus.value = focus;
      material.uniforms.lensK.value = lensK;
      renderer.render(post, flat);
    },
  };
}

/** A soft round shadow texture for contact shadows: a radial falloff, generated, no canvas. */
function shadowTexture(size = 64) {
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const d = Math.hypot(x + 0.5 - size / 2, y + 0.5 - size / 2) / (size / 2);
    const a = Math.max(0, 1 - d) ** 1.6;
    data.set([0, 0, 0, Math.round(a * 255)], (y * size + x) * 4);
  }
  const tex = new THREE.DataTexture(data, size, size);
  tex.magFilter = THREE.LinearFilter;
  tex.minFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

/**
 * A character to act with: a rounded body, two eyes that blink, `feet` stubby feet and a contact shadow,
 * built once (put `rig.root` in HERO) and posed per frame with `rig.pose({...})`. Colours are hex.
 *   body: { w, h, d, radius, color }      eyes: { size, gap, height, color }      feet: count
 * pose({ x, z, y, squash, blink, look: [x, y], lean, turn, feetLag }) where squash is the amount for
 * squash(), blink 0-1, look the pupils' offset (-1..1), lean and turn radians, feetLag a lift 0-1.
 */
export function character({ body = {}, eyes = {}, feet = 4 } = {}) {
  const B = { w: 1.3, h: 0.9, d: 1, radius: 0.22, color: 0xd9734e, ...body };
  const E = { size: 0.11, gap: 0.42, height: 0.6, color: 0x15161a, ...eyes };
  const skin = new THREE.MeshPhysicalMaterial({ color: B.color, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.6, sheen: 0.3, sheenColor: new THREE.Color(0xffffff) });
  const ink = new THREE.MeshStandardMaterial({ color: E.color, roughness: 0.25 });
  const root = new THREE.Group();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false, opacity: 0.55 }));
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.002;
  shadow.renderOrder = -1;
  root.add(shadow);
  const lift = new THREE.Group();
  root.add(lift);
  const squashGroup = new THREE.Group();
  lift.add(squashGroup);
  const bodyMesh = new THREE.Mesh(new RoundedBoxGeometry(B.w, B.h, B.d, 6, B.radius), skin);
  bodyMesh.position.y = B.h / 2;
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  squashGroup.add(bodyMesh);
  const eyeGeo = new THREE.CapsuleGeometry(E.size * 0.55, E.size * 0.9, 6, 12);
  const eyesList = [-1, 1].map((side) => {
    const eye = new THREE.Mesh(eyeGeo, ink);
    eye.position.set((side * E.gap) / 2, B.h * E.height, B.d / 2 + 0.005);
    squashGroup.add(eye);
    return eye;
  });
  const footGeo = new RoundedBoxGeometry(0.16, 0.16, 0.18, 3, 0.06);
  const feetList = Array.from({ length: feet }, (_, i) => {
    const foot = new THREE.Mesh(footGeo, skin);
    const u = feet === 1 ? 0 : i / (feet - 1) - 0.5;
    foot.position.set(u * B.w * 0.7, 0.06, B.d * 0.18);
    foot.castShadow = true;
    lift.add(foot);
    return foot;
  });
  const footBase = feetList.map((f) => f.position.clone());
  return {
    root,
    body: bodyMesh,
    eyes: eyesList,
    feet: feetList,
    pose({ x = 0, z = 0, y = 0, squash: a = 0, blink: c = 0, look = [0, 0], lean = 0, turn = 0, feetLag = 0 } = {}) {
      root.position.set(x, 0, z);
      root.rotation.y = turn;
      lift.position.y = Math.max(0, y);
      lift.rotation.z = lean;
      const s = squash(a);
      squashGroup.scale.set(s.x, s.y, s.z);
      for (const [i, eye] of eyesList.entries()) {
        eye.scale.y = Math.max(0.08, 1 - c);
        eye.position.x = ((i ? 1 : -1) * E.gap) / 2 + look[0] * E.size * 0.8;
        eye.position.y = B.h * E.height + look[1] * E.size * 0.6;
      }
      for (const [i, foot] of feetList.entries()) foot.position.y = footBase[i].y + feetLag * 0.12 * (i % 2 ? 1 : 0.7);
      // the contact shadow shrinks and fades as the body leaves the ground
      const k = 1 / (1 + y * 1.2);
      shadow.scale.set(B.w * 1.35 * k * s.x, B.d * 1.2 * k * s.z, 1);
      shadow.material.opacity = 0.55 * k;
    },
  };
}
