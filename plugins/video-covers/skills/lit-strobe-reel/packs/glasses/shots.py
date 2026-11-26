import numpy as np
def _empty(loc=(0,0,0), par=None, rot=(0,0,0)):
    e = bpy.data.objects.new("e", None); C.objects.link(e); e.location, e.rotation_euler, e.parent = loc, rot, par; return e
def _mesh(vs, fs, m, par=None, sharp=None):
    me = bpy.data.meshes.new("m"); me.from_pydata(vs, [], fs); me.update(); o = ob(me, m, par=par)
    bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
    if sharp is not None:
        for p in me.polygons: p.use_smooth = True
        me.set_sharp_from_angle(angle=math.radians(sharp))
    return o
def _nodes(m): nt = m.node_tree; return nt, nt.nodes.new, nt.links.new, nt.nodes["Principled BSDF"]
def _noise(N, L, src, scale, detail=6, rough=.55):
    n = N("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = detail; n.inputs["Roughness"].default_value = rough; L(src, n.inputs["Vector"]); return n.outputs["Fac"]
def _rng(N, L, v, a, b, lo=0., hi=1.):
    q = N("ShaderNodeMapRange"); q.inputs["From Min"].default_value, q.inputs["From Max"].default_value, q.inputs["To Min"].default_value, q.inputs["To Max"].default_value = a, b, lo, hi; L(v, q.inputs["Value"]); return q.outputs[0]
def _math(N, L, op, x, y=None):
    q = N("ShaderNodeMath"); q.operation = op
    for i, v in enumerate((x, y)):
        if v is None: continue
        if isinstance(v, (int, float)): q.inputs[i].default_value = v
        else: L(v, q.inputs[i])
    return q.outputs[0]
def _glass(ior=1.52):
    m = mat("gl", (.90,.975,.955), .02, Transmission_Weight=1.0, IOR=ior); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    sm = _noise(N, L, tc, 9, 8, .7); L(_rng(N, L, sm, .42, .72, .004, .11), b.inputs["Roughness"])
    bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .10; bp.inputs["Distance"].default_value = .0012; L(_noise(N, L, tc, 22, 3), bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"]);
    # prisms that light row by row (shot 10): emission below a level that pose raises
    lv = N("ShaderNodeValue"); lv.name = "lv"; lv.outputs[0].default_value = -9; gk = N("ShaderNodeValue"); gk.name = "gk"; gk.outputs[0].default_value = 0; zp = N("ShaderNodeSeparateXYZ"); L(N("ShaderNodeNewGeometry").outputs["Position"], zp.inputs[0])
    q = N("ShaderNodeMapRange"); q.inputs["To Min"].default_value, q.inputs["To Max"].default_value = 1., 0.; L(zp.outputs[2], q.inputs["Value"]); L(_math(N, L, "SUBTRACT", lv.outputs[0], .05), q.inputs["From Min"]); L(lv.outputs[0], q.inputs["From Max"])
    b.inputs["Emission Color"].default_value = (1,.55,.2,1); L(_math(N, L, "MULTIPLY", q.outputs[0], gk.outputs[0]), b.inputs["Emission Strength"]); return m
def _brass(dark=.5):
    m = mat("br", (.70,.44,.16), .3, Metallic=1.0); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    g = _rng(N, L, _noise(N, L, tc, 11, 10, .68), .40, .68); mx = N("ShaderNodeMixRGB"); mx.inputs[1].default_value = (.74,.47,.17,1); mx.inputs[2].default_value = (.10*dark*2,.055*dark*2,.022*dark*2,1); L(g, mx.inputs[0]); L(mx.outputs[0], b.inputs["Base Color"])
    r = N("ShaderNodeMath"); r.operation = "ADD"; L(_rng(N, L, _noise(N, L, tc, 5, 9, .7), .35, .7, .14, .42), r.inputs[0]); L(_math(N, L, "MULTIPLY", g, .22), r.inputs[1]); L(r.outputs[0], b.inputs["Roughness"])
    mp = N("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1,1,14); L(tc, mp.inputs[0]); bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .16; bp.inputs["Distance"].default_value = .0015
    L(_math(N, L, "ADD", _noise(N, L, mp.outputs[0], 60, 4), _noise(N, L, tc, 240, 2)), bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"]); return m
def _iron(c=(.018,.020,.023), wet=.12):
    m = mat("ir", c, .4, Metallic=.0, Coat_Weight=.4, Coat_Roughness=.15); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    L(_rng(N, L, _noise(N, L, tc, 6, 9, .7), .35, .65, wet, .6), b.inputs["Roughness"]); bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .3; bp.inputs["Distance"].default_value = .004; L(_noise(N, L, tc, 45, 8, .7), bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"]); return m
def _rev(pr, m, loc=(0,0,0), seg=160, par=None, sharp=40):
    vs, fs, k = [], [], len(pr)
    for i in range(seg):
        t = 2*math.pi*i/seg
        for r, z in pr: vs.append((max(r,0)*math.cos(t), max(r,0)*math.sin(t), z))
    for i in range(seg):
        j = (i+1) % seg
        for q in range(k-1): fs.append((i*k+q, j*k+q, j*k+q+1, i*k+q+1))
    o = _mesh(vs, fs, m, par, sharp); o.location = loc; return o
def _ease(t, a, b): v = min(1, max(0, (t-a)/(b-a))); return v*v*(3-2*v)
def _lerp(pts, t):
    for (a, x0), (b, x1) in zip(pts, pts[1:]):
        if t <= b: u = (t-a)/(b-a) if b > a else 0; return x0+(x1-x0)*max(0,u)
    return pts[-1][1]
HOURS = [(0,5.3),(6,7.0),(14,11.0),(22,16.5),(28,19.6),(32,21.5)]
def _sun_at(h):
    ph = math.pi*(h-6.0)/13.5; el = math.radians(52)*math.sin(ph) if 0 <= ph <= math.pi else -math.radians(8)*min(1, abs(ph if ph < 0 else ph-math.pi)*3)
    return ph, el
def _soda(dirty=.3):
    m = mat("soda", (.96,.99,.975), .0, Transmission_Weight=1.0, IOR=1.52); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    sm = _noise(N, L, tc, 38, 8, .7); L(_rng(N, L, sm, .5, .78, .0, .16*dirty/.3), b.inputs["Roughness"]); return m
def _water():
    return mat("wat", (1,1,1), .0, Transmission_Weight=1.0, IOR=1.333)
def _wood():
    m = mat("wood", (.20,.11,.055), .45, Coat_Weight=.25, Coat_Roughness=.35); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    mp = N("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1.2,9,1); L(tc, mp.inputs[0]); w = N("ShaderNodeTexWave"); w.wave_type = "RINGS"; w.inputs["Scale"].default_value = 2.2; w.inputs["Distortion"].default_value = 9; w.inputs["Detail"].default_value = 6; L(mp.outputs[0], w.inputs["Vector"])
    cr = N("ShaderNodeValToRGB"); e = cr.color_ramp.elements; e[0].color = (.16,.08,.035,1); e[1].color = (.36,.21,.11,1); L(w.outputs["Fac"], cr.inputs[0]); mx = N("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; mx.inputs[0].default_value = .5; L(cr.outputs[0], mx.inputs[1]); L(_noise(N, L, tc, 3, 8, .6), mx.inputs[2]); L(mx.outputs[0], b.inputs["Base Color"])
    mp2 = N("ShaderNodeMapping"); mp2.inputs["Scale"].default_value = (120,3,1); mp2.inputs["Rotation"].default_value = (0,0,.25); L(tc, mp2.inputs[0]); sc = _rng(N, L, _noise(N, L, mp2.outputs[0], 1.5, 3, .5), .62, .70); L(_math(N, L, "ADD", _rng(N, L, _noise(N, L, tc, 6, 8, .6), .35, .7, .32, .55), _math(N, L, "MULTIPLY", sc, .25)), b.inputs["Roughness"])
    bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .25; bp.inputs["Distance"].default_value = .0008; L(_math(N, L, "ADD", w.outputs["Fac"], _math(N, L, "MULTIPLY", sc, 2.)), bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"]); return m
def _plaster(c=(.62,.60,.56)):
    m = mat("pl", c, .85); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]; bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .15; bp.inputs["Distance"].default_value = .002; L(_noise(N, L, tc, 40, 8, .7), bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"])
    mx = N("ShaderNodeMixRGB"); mx.inputs[1].default_value = (*c,1); mx.inputs[2].default_value = (c[0]*.8,c[1]*.78,c[2]*.74,1); L(_rng(N, L, _noise(N, L, tc, 2, 6), .4, .7), mx.inputs[0]); L(mx.outputs[0], b.inputs["Base Color"]); return m
def _glassprofile(h=.115, rb=.0345, rt=.0402, wall=.0018, base=.012):
    o = [(0,0),(rb-.0015,0),(rb+.0005,.0015),(rb+wall,.006),(rt+wall,h),(rt+wall*.7,h+.0012),(rt+wall*.2,h+.0012),(rt,h)]
    i = [(rb+.0015,base+.002),(rb-.002,base),(0,base)]
    return o+i
def _rin(z, h=.115, rb=.0345, rt=.0402, base=.012): return rb+(rt-rb)*max(0,(z-base))/(h-base)
def _waterbody(Lv, W):
    pr = [(0,.0121)]
    for k in range(8): z = .0121+(Lv-.0121)*k/7; pr.append((_rin(z)-.0003, z))
    pr += [(_rin(Lv)-.0003, Lv+.0008), (_rin(Lv)-.0015, Lv+.0002), (0, Lv)]
    return pr
def _shadowpass(m, tint):
    # light goes through glass, water and ice to their shadows (a tinted transparent for shadow rays)
    nt = m.node_tree; N = nt.nodes.new; L = nt.links.new; out = nt.nodes["Material Output"]; src = out.inputs["Surface"].links[0].from_socket
    lp = N("ShaderNodeLightPath"); tr = N("ShaderNodeBsdfTransparent"); tr.inputs[0].default_value = (*tint, 1); mx = N("ShaderNodeMixShader"); L(lp.outputs["Is Shadow Ray"], mx.inputs[0]); L(src, mx.inputs[1]); L(tr.outputs[0], mx.inputs[2]); L(mx.outputs[0], out.inputs["Surface"]); return m
def _caustic(seed):
    # the bright figure a glass of water throws into its own shadow, drawn on a plane laid on the table
    m = bpy.data.materials.new("ca"); m.use_nodes = True; nt = m.node_tree; N = nt.nodes.new; L = nt.links.new; nt.nodes.remove(nt.nodes["Principled BSDF"]); tc = N("ShaderNodeTexCoord").outputs["Object"]; sp = N("ShaderNodeSeparateXYZ"); L(tc, sp.inputs[0])
    x, y = sp.outputs[0], sp.outputs[1]; xx = _math(N, L, "MULTIPLY", _math(N, L, "SUBTRACT", x, .5), 2.); q = _math(N, L, "ADD", _math(N, L, "MULTIPLY", xx, xx), _math(N, L, "MULTIPLY", y, y)); rq = _math(N, L, "SQRT", q)
    body = _rng(N, L, rq, 1.0, .8); edge = _math(N, L, "EXPONENT", _math(N, L, "MULTIPLY", _math(N, L, "POWER", _math(N, L, "DIVIDE", _math(N, L, "SUBTRACT", rq, .74), .09), 2.), -1.))
    cx = _math(N, L, "SUBTRACT", x, .62); cusp = _math(N, L, "EXPONENT", _math(N, L, "MULTIPLY", _math(N, L, "ADD", _math(N, L, "DIVIDE", _math(N, L, "MULTIPLY", cx, cx), .006), _math(N, L, "DIVIDE", _math(N, L, "MULTIPLY", y, y), .05)), -1.))
    arm = _math(N, L, "EXPONENT", _math(N, L, "MULTIPLY", _math(N, L, "POWER", _math(N, L, "DIVIDE", _math(N, L, "SUBTRACT", _math(N, L, "ABSOLUTE", y), _math(N, L, "MULTIPLY", _math(N, L, "ABSOLUTE", _math(N, L, "SUBTRACT", x, .62)), 1.3)), .05), 2.), -1.))
    arm = _math(N, L, "MULTIPLY", arm, _rng(N, L, x, .25, .6))
    WV = N("ShaderNodeValue"); WV.name = "wv"; mp = N("ShaderNodeMapping"); L(tc, mp.inputs[0]); cb = N("ShaderNodeCombineXYZ"); L(WV.outputs[0], cb.inputs[2]); L(cb.outputs[0], mp.inputs["Location"]); vo = N("ShaderNodeTexVoronoi"); vo.feature = "DISTANCE_TO_EDGE"; vo.inputs["Scale"].default_value = 9; L(mp.outputs[0], vo.inputs["Vector"])
    rip = _rng(N, L, vo.outputs["Distance"], .0, .09, 1.6, .55)
    pat = _math(N, L, "MULTIPLY", _math(N, L, "ADD", _math(N, L, "ADD", _math(N, L, "MULTIPLY", body, .22), _math(N, L, "MULTIPLY", _math(N, L, "MULTIPLY", edge, body), .7)), _math(N, L, "ADD", _math(N, L, "MULTIPLY", cusp, 2.6), _math(N, L, "MULTIPLY", arm, .9))), rip)
    KV = N("ShaderNodeValue"); KV.name = "k"; em = N("ShaderNodeEmission"); CV = N("ShaderNodeRGB"); CV.name = "c"; L(CV.outputs[0], em.inputs[0]); L(_math(N, L, "MULTIPLY", pat, KV.outputs[0]), em.inputs[1]); tr = N("ShaderNodeBsdfTransparent"); ad = N("ShaderNodeAddShader"); L(em.outputs[0], ad.inputs[0]); L(tr.outputs[0], ad.inputs[1]); L(ad.outputs[0], nt.nodes["Material Output"].inputs[0])
    o = _mesh([(0,-1,0),(1,-1,0),(1,1,0),(0,1,0)], [(0,1,2,3)], m); o.visible_shadow = False; o.visible_diffuse = False; o.visible_glossy = False; return o, nt.nodes
def _wet():
    # a bead of water: a mirror at grazing angles, clear face on (no refraction, so no black beads)
    m = bpy.data.materials.new("wet"); m.use_nodes = True; nt = m.node_tree; N = nt.nodes.new; L = nt.links.new; nt.nodes.remove(nt.nodes["Principled BSDF"]); tr = N("ShaderNodeBsdfTransparent"); g = N("ShaderNodeBsdfGlossy"); g.inputs["Roughness"].default_value = .03; fr = N("ShaderNodeFresnel"); fr.inputs[0].default_value = 1.6; mx = N("ShaderNodeMixShader"); L(fr.outputs[0], mx.inputs[0]); L(tr.outputs[0], mx.inputs[1]); L(g.outputs[0], mx.inputs[2]); L(mx.outputs[0], nt.nodes["Material Output"].inputs[0]); return m
def day():
    rng = random.Random(4)
    # room: floor, walls, window in the wall the table stands against (y = .55)
    PL, WD, SODA, WAT = _plaster(), _wood(), _shadowpass(_soda(), (.86,.88,.87)), _shadowpass(_water(), (.95,.96,.96)); FR = mat("fr", (.70,.69,.65), .45)
    box((5,5,.02), mat("fl", (.09,.07,.05), .6), (0,0,-.76), .002)
    for p, s in (((0,-2.2,.5),(5,.1,2.6)),((-2.4,0,.5),(.1,5,2.6)),((2.4,0,.5),(.1,5,2.6)),((0,0,1.8),(5,5,.1))): box(s, PL, p, .01)
    W0, W1, Z0, Z1 = -.55, .55, .10, 1.35
    for p, s in (((0,.62,(Z0-.76)/2-.38+.38*0),(5,.14,Z0+.76)),((0,.62,(Z1+1.8)/2),(5,.14,1.8-Z1)),(((W0-2.5)/2,.62,(Z0+Z1)/2),(2.5+W0,.14,Z1-Z0)),(((W1+2.5)/2,.62,(Z0+Z1)/2),(2.5-W1,.14,Z1-Z0))):
        box(s, PL, (p[0], p[1], p[2] if s[2] != Z0+.76 else (Z0-.76)/2), .005)
    for x in (W0, 0, W1): box((.045,.07,Z1-Z0), FR, (x,.58,(Z0+Z1)/2), .006)
    for z in (Z0, .78, Z1): box((W1-W0,.07,.045), FR, (0,.58,z), .006)
    box((W1-W0+.1,.20,.03), FR, (0,.50,Z0-.01), .006)
    pn = bpy.data.materials.new("pn"); pn.use_nodes = True; nt = pn.node_tree; N = nt.nodes.new; L = nt.links.new; nt.nodes.remove(nt.nodes["Principled BSDF"]); tr = N("ShaderNodeBsdfTransparent"); g = N("ShaderNodeBsdfGlossy"); g.inputs["Roughness"].default_value = .01; fr = N("ShaderNodeFresnel"); fr.inputs[0].default_value = 1.5; mx = N("ShaderNodeMixShader"); L(fr.outputs[0], mx.inputs[0]); L(tr.outputs[0], mx.inputs[1]); L(g.outputs[0], mx.inputs[2]); L(mx.outputs[0], nt.nodes["Material Output"].inputs[0])
    o = _mesh([(W0,.585,Z0),(W1,.585,Z0),(W1,.585,Z1),(W0,.585,Z1)], [(0,1,2,3)], pn); o.visible_shadow = False
    # outside: a street, low buildings, a few lit windows at night
    box((80,40,.1), mat("st", (.05,.05,.05), .7), (0,22,-1.2), .01); NW = E("nw", (1,.72,.42), 0.0)
    for i in range(9):
        x = -14+i*3.6+rng.uniform(-.6,.6); h_ = rng.uniform(4,9); d = rng.uniform(16,24); box((rng.uniform(2.4,3.4),2,h_), _plaster((.42,.41,.39)), (x,d,-1.2+h_/2), .02)
        for k in range(3):
            if rng.random() < .55: box((.5,.05,.6), NW, (x+rng.uniform(-.9,.9), d-1.03, -.2+k*1.8), .01)
    # table
    tb = box((1.3,.85,.04), WD, (0,.10,-.02), .004); tb.cycles.is_caustics_receiver = True
    for x in (-.6,.6):
        for y in (-.27,.47): box((.05,.05,.74), WD, (x,y,-.41), .004)
    # glasses: A half drunk at left, B untouched with ice at right
    A = _rev(_glassprofile(), SODA, (-.13,.07,0)); B = _rev(_glassprofile(), SODA, (.12,-.01,0))
    for g_ in (A, B): g_.cycles.is_caustics_caster = True
    LIP = mat("lip", (.96,.98,.97), .32, Transmission_Weight=.85, IOR=1.52); lp = _rev([(_rin(.115)+.0019, .1015),(_rin(.115)+.0021, .1165)], LIP, (-.13,.07,0), 160); lp.scale = (1.002,1.002,1); bm = bmesh.new(); bm.from_mesh(lp.data)
    for f_ in list(bm.faces):
        c = f_.calc_center_median()
        if not (-.6 < math.atan2(c.y, c.x)+1.9 < .6): bm.faces.remove(f_)
    bm.to_mesh(lp.data); bm.free()
    wa = _rev(_waterbody(.058, 0), WAT, (-.13,.07,0)); wa.cycles.is_caustics_caster = True
    wb = _rev(_waterbody(.058, 0), WAT, (.12,-.01,0)); wb.cycles.is_caustics_caster = True
    # ice: three cubes, a cloudy heart in each
    ICE = mat("ice", (.97,.99,1), .03, Transmission_Weight=1.0, IOR=1.31); nt, N, L, b = _nodes(ICE); _shadowpass(ICE, (.8,.82,.84)); nt, N, L, b = _nodes(ICE); tc = N("ShaderNodeTexCoord").outputs["Object"]; L(_rng(N, L, _noise(N, L, tc, 60, 8, .7), .4, .75, .0, .18), b.inputs["Roughness"]); bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .2; bp.inputs["Distance"].default_value = .0006; L(_noise(N, L, tc, 90, 4), bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"])
    HEART = _shadowpass(mat("hrt", (.92,.95,1), .5, Transmission_Weight=.55, Subsurface_Weight=.3, IOR=1.31), (.6,.62,.64))
    ices = []
    for i, (x, y, z, rz) in enumerate(((-.012,-.007,0,.3),(.013,.009,0,-.2),(.0,.0,.026,.7))):
        e = _empty((.12+x,-.01+y,0)); c = box((.026,.026,.026), ICE, (0,0,0), .004, e, (0,0,0), seg=4); d = c.modifiers.new("d","DISPLACE"); tx = bpy.data.textures.new("t","CLOUDS"); tx.noise_scale = .006; d.texture = tx; d.strength = .0012; d.texture_coords = "OBJECT"; c.modifiers.move(1,0) if False else None
        sub = c.modifiers.new("s","SUBSURF"); sub.levels = sub.render_levels = 2; c.modifiers.move(len(c.modifiers)-1, 1)
        h_ = box((.011,.011,.008), HEART, (0,0,0), .003, e, (.3,.2,.5)); h_.visible_shadow = False; c.cycles.is_caustics_caster = True; ices.append((e, c, h_, x, y, z, rz))
    # frost on B, drops on B, the ring on the table
    FROST = bpy.data.materials.new("fro"); FROST.use_nodes = True; nt = FROST.node_tree; N = nt.nodes.new; L = nt.links.new; pb = nt.nodes["Principled BSDF"]; pb.inputs["Base Color"].default_value = (.85,.9,.93,1); pb.inputs["Roughness"].default_value = .55; pb.inputs["Transmission Weight"].default_value = .4; FV = N("ShaderNodeValue"); FV.outputs[0].default_value = 1
    tr = N("ShaderNodeBsdfTransparent"); mx = N("ShaderNodeMixShader"); tc = N("ShaderNodeTexCoord").outputs["Object"]; L(_math(N, L, "MULTIPLY", _rng(N, L, _noise(N, L, tc, 260, 5, .7), .35, .62), FV.outputs[0]), mx.inputs[0]); L(tr.outputs[0], mx.inputs[1]); L(pb.outputs[0], mx.inputs[2]); L(mx.outputs[0], nt.nodes["Material Output"].inputs[0])
    fz = _rev([(r+.0019+.0003, z) for r, z in [(.0345,.008),(.0402,.112)]], FROST, (.12,-.01,0)); fz.visible_shadow = False
    DR = _wet(); dr = ob(bpy.data.meshes.new("d0"), None); dr.visible_shadow = False
    seeds = [(rng.uniform(0,2*math.pi), rng.uniform(.012,.108), rng.random(), rng.random()) for _ in range(240)]
    ring = ob(bpy.data.meshes.new("r0"), None)
    def drops(t):
        vs, fs = [], []; U, V_ = 10, 4; grow = _ease(t, 5.5, 14)
        for a, z, s1, s2 in seeds:
            R_ = (.0006+.0026*s1**2)*grow
            if R_ < .0003: continue
            if s1 > .82: z = z - .09*_ease(t, 13+s2*7, 15.5+s2*7)
            if z < .005: continue
            r0 = _rin(z)+.0019; cx, cy = r0*math.cos(a), r0*math.sin(a); b_ = len(vs)
            for j in range(V_+1):
                p_ = math.pi/2*j/V_
                for k in range(U):
                    q = 2*math.pi*k/U; ta = R_*math.cos(q)*math.cos(p_)/r0; dz = R_*1.25*math.sin(q)*math.cos(p_); rr = r0+R_*.55*math.sin(p_); vs.append(((rr)*math.cos(a+ta)+.12, rr*math.sin(a+ta)-.01, z+dz))
            for j in range(V_):
                for k in range(U): k2 = (k+1) % U; fs.append((b_+j*U+k, b_+j*U+k2, b_+(j+1)*U+k2, b_+(j+1)*U+k))
            fs.append(tuple(b_+k for k in range(U)))
        me = bpy.data.meshes.new("d"); me.from_pydata(vs, [], fs); me.update(); bm = bmesh.new(); bm.from_mesh(me); bmesh.ops.recalc_face_normals(bm, faces=bm.faces); bm.to_mesh(me); bm.free()
        for p in me.polygons: p.use_smooth = True
        me.materials.append(DR); old = dr.data; dr.data = me; bpy.data.meshes.remove(old)
        k = _ease(t, 14, 26); rr = .0365+.012*k; vs, fs = [], []; n = 96
        if k > .01:
            for i in range(n):
                th = 2*math.pi*i/n; w_ = rr*(1+.06*math.sin(th*3+1)+.04*math.sin(th*7)); vs += [(.12+.0362*math.cos(th), -.01+.0362*math.sin(th), .0001), (.12+w_*math.cos(th), -.01+w_*math.sin(th), .0001), (.12+(w_-.0012)*math.cos(th), -.01+(w_-.0012)*math.sin(th), .0007)]
            for i in range(n): j = (i+1) % n; fs += [(i*3, j*3, j*3+2, i*3+2), (i*3+2, j*3+2, j*3+1, i*3+1)]
        me = bpy.data.meshes.new("r"); me.from_pydata(vs, [], fs); me.update()
        for p in me.polygons: p.use_smooth = True
        me.materials.append(DR); old = ring.data; ring.data = me; bpy.data.meshes.remove(old)
    # dust in the light
    vs, fs = [], []
    for i in range(500):
        c = Vector((rng.uniform(-.5,.5), rng.uniform(-.3,.5), rng.uniform(.02,.9))); s = rng.uniform(.0003,.0008); b_ = len(vs); vs += [tuple(c+Vector(v)*s) for v in ((1,0,0),(-1,0,0),(0,1,0),(0,-1,0),(0,0,1),(0,0,-1))]; fs += [(b_+i,b_+j,b_+l_) for i in (0,1) for j in (2,3) for l_ in (4,5)]
    dust = _mesh(vs, fs, mat("du", (.9,.88,.85), .9, Transmission_Weight=.3)); dust.visible_shadow = False
    # sun, sky and a car at night
    sl = bpy.data.lights.new("sun", "SUN"); sl.angle = math.radians(.53); sl.cycles.is_caustics_light = True; so = bpy.data.objects.new("sun", sl); C.objects.link(so)
    CA = [(_caustic(0), Vector((-.13,.07,0)), .7), (_caustic(1), Vector((.12,-.01,0)), 1.0)]
    cars = []
    for dx in (-.75,.75):
        l = bpy.data.lights.new("car", "SPOT"); l.color = (1,.92,.78); l.spot_size = math.radians(7); l.spot_blend = .25; l.shadow_soft_size = .08; o = bpy.data.objects.new("car", l); C.objects.link(o); o.visible_camera = False; cars.append((o, l, dx))
    W_ = {}
    def world():
        w = S.world; w["d"] = 1; nt = w.node_tree; N = nt.nodes.new; L = nt.links.new; bg = nt.nodes["Background"]; sky = N("ShaderNodeTexSky"); sky.sky_type = "MULTIPLE_SCATTERING"; sky.sun_disc = False; sky.altitude = 50; sky.air_density = 1.2; sky.ozone_density = 1.5
        ad = N("ShaderNodeMixRGB"); ad.blend_type = "ADD"; ad.inputs[0].default_value = 1; ad.inputs[2].default_value = (.0010,.0016,.0034,1); L(sky.outputs[0], ad.inputs[1]); L(ad.outputs[0], bg.inputs[0]); W_.update(sky=sky, bg=bg)
    def car(t):
        u = (t-29.0)/1.5
        for o, l, dx in cars:
            o.location = (8-16*u+dx*.0, 9.5, -.55+dx*0) if 0 <= u <= 1 else (40,40,0); o.location.x += dx; o.rotation_euler = (Vector((0,0,.05))-o.location).to_track_quat("-Z","Y").to_euler(); l.energy = 3e4 if 0 <= u <= 1 else 0
    def pose(f):
        if not S.world.get("d"): world()
        sky, bg = W_["sky"], W_["bg"]
        t = f/30; h = _lerp(HOURS, t); ph, el = _sun_at(h); S.frame_set(f)
        d = Vector((.42*math.cos(ph)*math.cos(el), max(.0, math.sin(ph))*math.cos(el)+.25*math.cos(el), math.sin(el))).normalized(); so.rotation_euler = d.to_track_quat("Z","Y").to_euler()
        warm = _ease(math.degrees(el), 2, 24); sl.color = (1, .50+.46*warm, .26+.66*warm); sl.energy = 6.5*_ease(math.degrees(el), -1.5, 5)
        sky.sun_elevation = el; sky.sun_rotation = math.atan2(d.x, d.y)+math.pi*0; bg.inputs[1].default_value = .35*max(.004, _ease(math.degrees(el), -8, 4))+.0
        car(t)
        hd = Vector((d.x, d.y, 0)); hl = hd.length
        for (co_, nd), c0, kk in CA:
            if hl < 1e-4 or d.z <= .005: nd["k"].outputs[0].default_value = 0; continue
            hd_ = hd/hl; Ls = min(.30, .085*hl/max(d.z,.05)); co_.location = c0 - hd_*.03 + Vector((0,0,.0004)); co_.rotation_euler = (0,0,math.atan2(-hd_.y, -hd_.x)); co_.scale = (Ls, .036, 1)
            nd["k"].outputs[0].default_value = sl.energy*.28*kk*(1 if sl.type == "SUN" else 1/(3.1416*625)); nd["c"].outputs[0].default_value = (sl.color[0], sl.color[1]*.97, sl.color[2]*.9, 1); nd["wv"].outputs[0].default_value = t*.05
        for e, c, h_, x, y, z, rz in ices:
            m = _ease(t, 7.5, 23.0); s = max(.001, (1-m)**.55); top = z > 0
            drop = _ease(t, 16.9, 17.05) if top else 0; e.scale = (s,s,s)
            Lv = .058+.008*_ease(t, 7.5, 23)
            zz = (Lv-.026*s*.40) if not top else (Lv-.026*s*.40+.022*s*(1-drop)); e.location = (.12+x*(.6+.4*s)+(.004*drop if top else 0), -.01+y*(.6+.4*s), zz); e.rotation_euler = (.0+(.5*drop if top else 0)+.05*math.sin(t*.4+x*90), (.25*(1-drop) if top else .03), rz+.08*t)
            c.hide_render = h_.hide_render = s < .03
        Lb = .058+.008*_ease(t, 7.5, 23); wb.scale.z = 1+(Lb-.058)/.046
        FV.outputs[0].default_value = 1-_ease(t, 3.5, 10.5); drops(t)
        dust.location = (.01*math.sin(t*.3), .01*math.cos(t*.2), .004*t)
        # camera: a slow third of a circle round B, closing in, ending over its water
        u = _ease(t, 0, 32)*.85+.15*(t/32); a = math.radians(-150+120*u); R = .60-.43*_ease(t, 0, 32)**1.3; ctr = Vector((.12,-.01,.055)); p = ctr+Vector((R*math.cos(a), R*math.sin(a), .045+.13*_ease(t, 20, 32)))
        tg = ctr.lerp(Vector((.0,.04,.06)), .55*(1-_ease(t, 10, 26)))+Vector((0,0,.005-.02*_ease(t, 22, 32)))
        look(p, tg, 75, ctr+Vector((0,0,.02*_ease(t, 20, 32))), 2.8, 0)
        ev = _lerp([(0,2.2),(6,1.2),(10,-.1),(18,-.4),(24,.3),(27,1.2),(29,1.8),(32,1.8)], t)
        S.view_settings.look = "AgX - Medium High Contrast"; S.view_settings.exposure = ev; S.cycles.samples = max(S.cycles.samples, 48); S.cycles.caustics_refractive = True; S.cycles.max_bounces = 16; S.cycles.transmission_bounces = 14; S.cycles.transparent_max_bounces = 16; S.cycles.sample_clamp_indirect = 8; S.cycles.blur_glossy = .3; S.render.use_motion_blur = False; cam.clip_start = .005
    return pose
def parts(G):
    for g in G: lathe([(0,1),(.7,1),(1,.5),(1,0),(0,0)], STEEL, (0,0,0), g)
def props(): pass
