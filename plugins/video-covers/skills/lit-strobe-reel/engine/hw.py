import bpy, bmesh, json, math, random, sys
from mathutils import Vector, Matrix
a = sys.argv[sys.argv.index("--")+1:]; SHOT, OUT, PCT, SPP, FRAMES, FONT, CFG, NF, PACK = a[0], a[1], int(a[2]), int(a[3]), a[4], a[5], json.load(open(a[6])), int(a[7]), a[8]
W1, W2, W3 = [w.upper() for w in CFG["words"]]
def lin(h): return tuple(((int(h[i:i+2],16)/255+.055)/1.055)**2.4 if int(h[i:i+2],16) > 10 else int(h[i:i+2],16)/255/12.92 for i in (1,3,5))
PAL = {k: lin(v) for k, v in CFG["palette"].items()}
random.seed(3); bpy.ops.wm.read_factory_settings(use_empty=True); S = bpy.context.scene; C = S.collection
fnt = bpy.data.fonts.load(FONT)
def mat(n, c, r=.5, **k):
    m = bpy.data.materials.new(n); m.use_nodes = True; b = m.node_tree.nodes["Principled BSDF"]; b.inputs["Base Color"].default_value = (*c, 1); b.inputs["Roughness"].default_value = r
    for q, v in k.items():
        i = b.inputs[q.replace("_", " ")]; i.default_value = (*v, 1) if isinstance(v, tuple) and len(i.default_value) == 4 else v
    return m
def grit(m, scale=200, st=.12, dist=.004, rough=None, stretch=(1,1,1)):
    nt = m.node_tree; N = nt.nodes.new; L = nt.links.new; b = nt.nodes["Principled BSDF"]; tc = N("ShaderNodeTexCoord"); mp = N("ShaderNodeMapping"); mp.inputs["Scale"].default_value = stretch
    n = N("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = 6; bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = st; bp.inputs["Distance"].default_value = dist
    L(tc.outputs["Object"], mp.inputs[0]); L(mp.outputs[0], n.inputs["Vector"]); L(n.outputs["Fac"], bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"])
    if rough:
        n2 = N("ShaderNodeTexNoise"); n2.inputs["Scale"].default_value = 7; n2.inputs["Detail"].default_value = 8; mr = N("ShaderNodeMapRange"); mr.inputs["From Min"].default_value = .35; mr.inputs["From Max"].default_value = .65; mr.inputs["To Min"].default_value, mr.inputs["To Max"].default_value = rough
        L(tc.outputs["Object"], n2.inputs["Vector"]); L(n2.outputs["Fac"], mr.inputs["Value"]); L(mr.outputs[0], b.inputs["Roughness"])
    return m
def ob(me, m, loc=(0,0,0), rot=(0,0,0), par=None, smooth=False):
    o = bpy.data.objects.new("o", me); C.objects.link(o); o.location, o.rotation_euler, o.parent = loc, rot, par
    if m: me.materials.append(m)
    if smooth:
        for p in me.polygons: p.use_smooth = True
    return o
def box(s, m, loc, bev=.02, par=None, rot=(0,0,0), taper=1, seg=6):
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=1)
    for v in bm.verts:
        t = taper if v.co.z > 0 else 1; v.co = Vector((v.co.x*s[0]*t, v.co.y*s[1]*t, v.co.z*s[2]))
    me = bpy.data.meshes.new("b"); bm.to_mesh(me); bm.free(); o = ob(me, m, loc, rot, par, True); d = o.modifiers.new("b", "BEVEL"); d.width = bev; d.segments = seg; d.harden_normals = True; return o
def lathe(pr, m, loc=(0,0,0), par=None, seg=128, knurl=0, kz=(0,0)):
    vs, fs, k = [], [], len(pr)
    for i in range(seg):
        t = 2*math.pi*i/seg
        for r, z in pr:
            q = r - (knurl if knurl and kz[0] <= z <= kz[1] and i % 4 < 2 else 0); vs.append((q*math.cos(t), q*math.sin(t), z))
    for i in range(seg):
        j = (i+1) % seg
        for q in range(k-1): fs.append((i*k+q, j*k+q, j*k+q+1, i*k+q+1))
    me = bpy.data.meshes.new("l"); me.from_pydata(vs, [], fs); me.update(); o = ob(me, m, loc, (0,0,0), par, True)
    d = o.modifiers.new("b", "BEVEL"); d.width = .006; d.segments = 2; d.limit_method = "ANGLE"; return o
def text(s, size, m, loc, rot=(0,0,0), par=None, al="CENTER", ex=.002, mw=0):
    if len(s) > 1 and s.lower() not in CFG["copy"]: raise ValueError(f"text {s!r} is not in the film's copy")
    c = bpy.data.curves.new("t", "FONT"); c.body = s; c.font = fnt; c.size = size; c.align_x = al; c.align_y = "CENTER"; c.extrude = ex; c.materials.append(m)
    o = bpy.data.objects.new("t", c); C.objects.link(o); o.location, o.rotation_euler, o.parent = loc, rot, par
    if mw:
        bpy.context.view_layer.update(); w = o.dimensions.x
        if w > mw: c.size = size*mw/w
    return o
def light(loc, col, p, size, tgt=(0,0,0), sy=None):
    l = bpy.data.lights.new("a", "AREA"); l.color, l.energy, l.size = col, p, size
    if sy: l.shape = "RECTANGLE"; l.size_y = sy
    o = bpy.data.objects.new("a", l); C.objects.link(o); o.visible_camera = False; o.location = loc; o.rotation_euler = (Vector(tgt)-Vector(loc)).to_track_quat("-Z", "Y").to_euler(); return o
def E(n, c, s): return mat(n, c, .4, Emission_Color=c, Emission_Strength=s)
ALU = grit(mat("alu", (.55,.57,.59), .42, Metallic=1.0), 520, .03, .0006, (.35,.37)); CONC = grit(mat("conc", (.36,.37,.38), .9), 34, .5, .02, (.75,.95))
BLK = grit(mat("blk", (.014,.015,.017), .42), 500, .04, .0008, (.36,.46)); WHT = grit(mat("wht", (.80,.82,.82), .4), 500, .04, .0008, (.34,.42)); INK = mat("ink", (.008,.008,.01), .6)
BLU = mat("blu", tuple(v*.85 for v in PAL["flood"]), .35); LIM = E("lim", PAL["accent"], 0.0); RED = mat("red", tuple(v*.85 for v in PAL["signal"]), .3, Coat_Weight=.6); STEEL = grit(mat("steel", (.78,.80,.82), .16, Metallic=1.0), 30, .05, .0006, (.15,.17), (.4,1,30))
CHR = mat("chr", (.9,.9,.9), .08, Metallic=1.0); GRY = grit(mat("gry", (.20,.21,.22), .5), 300, .07, .002, (.4,.55))
cam = bpy.data.cameras.new("c"); co = bpy.data.objects.new("c", cam); C.objects.link(co); S.camera = co; cam.sensor_fit = "VERTICAL"; cam.sensor_height = 36
def look(loc, tgt, lens, foc, f, roll=0):
    co.location = loc; q = (Vector(tgt)-Vector(loc)).to_track_quat("-Z", "Y").to_matrix().to_4x4() @ Matrix.Rotation(roll, 4, "Z"); co.rotation_euler = q.to_euler(); cam.lens = lens; cam.dof.use_dof = True; cam.dof.focus_distance = (Vector(foc)-Vector(loc)).length; cam.dof.aperture_fstop = f
def screw(x, y, z=0):
    lathe([(0,.0),(.085,0),(.09,.02),(.075,.04),(0,.04)], CHR, (x,y,z), seg=48); box((.13,.018,.02), INK, (x,y,z+.036), .002, rot=(0,0,random.uniform(0,3)))
def ez(t): return 1-2**(-10*max(0,min(1,t)))
# ---- shots: one function per shot, returning pose(frame). A pack's shots.py adds its own, parts(G) for the specimens and props() for the print scene
def cols():
    im = bpy.data.images.load(OUT.rsplit("/",1)[0]+"/mask.png"); iw, ih = im.size; px = im.pixels[:]
    NX, NY = 250, 200; MX, MY = 112, 63
    def mk(i, j):
        i -= (NX-MX)//2; j -= (NY-MY)//2
        if not (0 <= i < MX and 0 <= j < MY): return False
        return px[(int((j+.5)/MY*ih)*iw + int((i+.5)/MX*iw))*4] > .5
    M = [[mk(i,j) for i in range(NX)] for j in range(NY)]; R = [[random.random() for i in range(NX)] for j in range(NY)]
    CC = grit(mat("cc", (.34,.355,.37), .88), 9, .35, .02, (.75,.95)); blk = bpy.data.objects.new("cols", bpy.data.meshes.new("m0")); C.objects.link(blk)
    free = [(abs(i-NX/2)+abs(j-NY/2), i, j) for j in range(70,130) for i in range(75,175) if not any(M[j+b][i+a_] for a_ in (-2,-1,0,1,2) for b in (-2,-1,0,1,2)) and any(M[j][i+a_] for a_ in range(-14,0)) and any(M[j][i+a_] for a_ in range(1,14))]
    RC = min(free)[1:] if free else (NX//2, NY//2-30)
    redb = box((.86,.86,1), RED, (RC[0]-NX/2+.5, RC[1]-NY/2+.5, 0), .04)
    sun = bpy.data.lights.new("s", "SUN"); sun.energy = 7.5; sun.angle = .012; sun.color = (1,.97,.93); so = bpy.data.objects.new("s", sun); C.objects.link(so); so.rotation_euler = (math.radians(66), 0, math.radians(-118))
    light((-60,30,40), (.55,.68,1), 9000, 40); light((0,-60,26), (.7,.8,1), 2500, 40)
    def pose(f):
        vs, fs = [], []; front = -30 + 12.5*min(f,15)
        for j in range(NY):
            for i in range(NX):
                d = front - ((i-69)*.9 + (j-68)*.55); a = max(0,min(1,d/14)); a = 1-(1-a)**3 if f < 15 else 1
                h = (.25 + 1.0*R[j][i]**4) if not M[j][i] else .25 + 5.2*a + (.25 if (i//2+j//2) % 2 else 0)*a
                if f < 15 and 0 < d < 16: h += 2.6*math.sin(math.pi*d/16)*R[j][i]
                x, y = i-NX/2+.5, j-NY/2+.5; w = .46; b = len(vs)
                vs += [(x-w,y-w,0),(x+w,y-w,0),(x+w,y+w,0),(x-w,y+w,0),(x-w,y-w,h),(x+w,y-w,h),(x+w,y+w,h),(x-w,y+w,h)]
                fs += [(b+4,b+5,b+6,b+7),(b,b+1,b+5,b+4),(b+1,b+2,b+6,b+5),(b+2,b+3,b+7,b+6),(b+3,b,b+4,b+7)]
        me = bpy.data.meshes.new("m"); me.from_pydata(vs, [], fs); me.materials.append(CC); me.update(); blk.data = me
        redb.scale = (3,3,8.4); redb.location.z = 4.2
        u = min(f,15)/15; e = 1-(1-u)**2.2
        look((-52+46*e+.12*f, -40+4*e, 9+56*e), (-14+14*e, -2-6*e, 2), 30+6*e, (-20+20*e,0,5), .10, .16-.16*e)
    return pose
def print_():
    box((60,60,.3), CONC, (0,0,-.15), .02)
    for q in range(5):
        bm = bmesh.new(); n = 40; uv = bm.loops.layers.uv.new("u"); G = [[None]*(n+1) for _ in range(n+1)]
        for a in range(n+1):
            for b in range(n+1):
                x, y = (a/n-.5)*8.0, (b/n-.5)*4.5; cz = .5*max(0,(x/4+y/2.25-1.25))**2 if q == 4 else 0
                G[a][b] = bm.verts.new((x,y,cz))
        for a in range(n):
            for b in range(n):
                F_ = bm.faces.new((G[a][b],G[a+1][b],G[a+1][b+1],G[a][b+1])); F_.smooth = True
                for l, (u_, v_) in zip(F_.loops, ((a,b),(a+1,b),(a+1,b+1),(a,b+1))): l[uv].uv = (u_/n, v_/n)
        me = bpy.data.meshes.new("sh"); bm.to_mesh(me); bm.free(); o = ob(me, None, (random.uniform(-.12,.12)*(q<4), random.uniform(-.1,.1)*(q<4), .02+q*.018), (0,0,random.uniform(-.03,.03)*(q<4)))
        d = o.modifiers.new("s","SOLIDIFY"); d.thickness = .014; m = grit(mat("pap", (.85,.86,.86), .7), 420, .10, .0015)
        if q == 4:
            nt = m.node_tree; im = nt.nodes.new("ShaderNodeTexImage"); im.image = bpy.data.images.load(OUT.rsplit("/",1)[0]+"/poster.png"); b_ = nt.nodes["Principled BSDF"]; nt.links.new(im.outputs[0], b_.inputs["Base Color"])
            mr = nt.nodes.new("ShaderNodeMapRange"); mr.inputs["To Min"].default_value = .42; mr.inputs["To Max"].default_value = .75; nt.links.new(im.outputs[0], mr.inputs["Value"]); nt.links.new(mr.outputs[0], b_.inputs["Roughness"])
        me.materials.append(m)
    props()
    light((-7,3,3.0), (1,.98,.95), 900, 1.2, sy=6); light((6,6,6), (.75,.86,1), 420, 4); light((0,-8,4), (.5,.6,1), 160, 5)
    def pose(f):
        u = f/35; e = u*u*(3-2*u); fc = min(1,max(0,(f-4)/10)); fc = fc*fc*(3-2*fc)
        look((-3.4+3.2*e, -6.2+.6*e, 3.6+4.2*e), (-1.5+1.6*e, -.5+.55*e, 0), 52-3*e, (-4.5+4.3*fc, -1.9+1.7*fc, .35*(1-fc)+.1), .7+.5*fc, .05*(1-e))
    return pose
def index():
    G = [bpy.data.objects.new("g%d" % i, None) for i in range(8)]
    for g in G: C.objects.link(g)
    parts(G)
    light((-4,-3,6), (1,1,1), 600, 3); light((5,-2,4), (1,1,1), 350, 2, sy=5); light((0,6,5), (.9,.95,1), 500, 3)
    def vis(o, v):
        o.hide_render = not v
        for c in o.children: vis(c, v)
    def pose(f):
        for i, g in enumerate(G): vis(g, i == f); g.rotation_euler = (0,0,-.5)
        S.render.film_transparent = True; S.render.image_settings.file_format = "PNG"; S.render.image_settings.color_mode = "RGBA"; S.render.resolution_x = S.render.resolution_y = 520
        look((0,-7.2,5.2), (0,0,.45), 58, (0,0,.5), 11)
    return pose
# ---- render
exec(compile(open(PACK).read(), PACK, "exec"))
pose = globals()["print_" if SHOT == "print" else SHOT]()
w = bpy.data.worlds.new("w"); S.world = w; w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (.12,.14,.17,1); w.node_tree.nodes["Background"].inputs[1].default_value = .35
S.render.engine = "CYCLES"; pr = bpy.context.preferences.addons["cycles"].preferences; pr.compute_device_type = "METAL"; pr.get_devices()
for d in pr.devices: d.use = d.type == "METAL"
S.cycles.device = "GPU"; S.cycles.samples = SPP; S.cycles.use_denoising = True; S.cycles.denoiser = "OPENIMAGEDENOISE"; S.cycles.sample_clamp_indirect = 8
S.render.resolution_x, S.render.resolution_y, S.render.resolution_percentage = 1280, 720, PCT; S.view_settings.view_transform = "AgX"; S.view_settings.look = "AgX - High Contrast"; S.render.image_settings.file_format = "JPEG"; S.render.image_settings.quality = 95
S.render.use_persistent_data = True
for f in ([int(q) for q in FRAMES.split(",")] if FRAMES != "all" else range(NF)):
    pose(f); S.render.filepath = f"{OUT}-{f:02d}." + ("png" if SHOT == "index" else "jpg"); bpy.ops.render.render(write_still=True)
