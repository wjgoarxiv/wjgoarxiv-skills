def _nodes(m): nt = m.node_tree; return nt, nt.nodes.new, nt.links.new, nt.nodes["Principled BSDF"]
def _noise(N, L, src, scale, detail=6, rough=.55):
    n = N("ShaderNodeTexNoise"); n.inputs["Scale"].default_value = scale; n.inputs["Detail"].default_value = detail; n.inputs["Roughness"].default_value = rough; L(src, n.inputs["Vector"]); return n.outputs["Fac"]
def _rng(N, L, v, a, b, lo=0., hi=1.):
    q = N("ShaderNodeMapRange"); q.inputs["From Min"].default_value, q.inputs["From Max"].default_value, q.inputs["To Min"].default_value, q.inputs["To Max"].default_value = a, b, lo, hi; L(v, q.inputs["Value"]); return q.outputs[0]
def _ease(t, a, b): v = min(1, max(0, (t-a)/(b-a))); return v*v*(3-2*v)
def _tiles(c, grout, sx, sz, rough=.18, dirt=.35):
    # glazed wall or floor tiles: a brick texture for the grout, soft grime in blotches, glossy where clean
    m = mat("tl", c, rough, Coat_Weight=.4, Coat_Roughness=.15); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    mp = N("ShaderNodeMapping"); mp.inputs["Scale"].default_value = (1/sx, 1/sx, 1/sz); L(tc, mp.inputs["Vector"])
    br = N("ShaderNodeTexBrick"); br.offset = 0.; br.inputs["Color1"].default_value = (*c, 1); br.inputs["Color2"].default_value = (*c, 1); br.inputs["Mortar"].default_value = (*grout, 1); br.inputs["Scale"].default_value = 1.; br.inputs["Mortar Size"].default_value = .03; br.inputs["Brick Width"].default_value = 1.; br.inputs["Row Height"].default_value = 1.; L(mp.outputs[0], br.inputs["Vector"])
    mx = N("ShaderNodeMixRGB"); mx.blend_type = "MULTIPLY"; L(_rng(N, L, _noise(N, L, tc, 1.2, 8, .7), .4, .75, 0., dirt), mx.inputs[0]); L(br.outputs["Color"], mx.inputs[1]); mx.inputs[2].default_value = (.35, .32, .26, 1); L(mx.outputs[0], b.inputs["Base Color"])
    L(_rng(N, L, br.outputs["Fac"], 0., 1., rough, .85), b.inputs["Roughness"])
    bp = N("ShaderNodeBump"); bp.inputs["Strength"].default_value = .25; bp.inputs["Distance"].default_value = .004; bp.invert = True; L(br.outputs["Fac"], bp.inputs["Height"]); L(bp.outputs[0], b.inputs["Normal"]); return m
def _grime(c, rough=.6, scale=6.):
    m = mat("gr", c, rough); nt, N, L, b = _nodes(m); tc = N("ShaderNodeTexCoord").outputs["Object"]
    mx = N("ShaderNodeMixRGB"); mx.inputs[1].default_value = (*c, 1); mx.inputs[2].default_value = (*(v*.55 for v in c), 1); L(_rng(N, L, _noise(N, L, tc, scale, 8, .65), .35, .75), mx.inputs[0]); L(mx.outputs[0], b.inputs["Base Color"])
    L(_rng(N, L, _noise(N, L, tc, scale*3, 6), .4, .7, rough-.25, rough+.2), b.inputs["Roughness"]); return m
def plat():
    sh = CFG["shot"]; rng = random.Random(11)
    WALL, FLOOR = _tiles((.55,.56,.50), (.16,.16,.14), .15, .30, .2, .75), _tiles((.24,.24,.22), (.08,.08,.07), .60, .60, .14, .7)
    CEIL, BED, CON = _grime((.26,.27,.26), .8, 3.), _grime((.10,.09,.08), .9, 9.), _grime((.34,.34,.32), .85, 4.)
    YEL = mat("ye", (.75,.55,.06), .5); RAIL = mat("ra", (.55,.55,.56), .18, Metallic=1.); RUST = _grime((.20,.12,.07), .8, 20.)
    Y0, Y1, PX, TX = -14., 62., -4.6, 5.2
    # platform floor, its edge strip and the drop to the track bed
    box((-PX, Y1-Y0, .3), FLOOR, (PX/2, (Y0+Y1)/2, -.15), .004)
    box((.5, Y1-Y0, .012), YEL, (-.42, (Y0+Y1)/2, .006), .002)
    box((.18, Y1-Y0, .06), CON, (-.09, (Y0+Y1)/2, -.02), .01)
    box((.3, Y1-Y0, 1.1), CON, (-.15, (Y0+Y1)/2, -.65), .01)
    box((TX, Y1-Y0+200, .2), BED, (TX/2, (Y0+Y1)/2+100, -1.2), .004)
    for x in (1.65, 3.15):
        box((.07, Y1-Y0+200, .14), RAIL, (x, (Y0+Y1)/2+100, -1.03), .006)
        box((.12, Y1-Y0+200, .03), RUST, (x, (Y0+Y1)/2+100, -1.1), .004)
    for i in range(int((Y1-Y0+200)/.6)):
        box((2.6, .22, .1), CON, (2.4, Y0+i*.6, -1.12), .01)
    # walls: tiles behind the platform and across the track, a low ceiling
    box((.2, Y1-Y0, 4.), WALL, (PX-.1, (Y0+Y1)/2, 1.8), .004)
    box((.2, Y1-Y0, 5.2), WALL, (TX+.1, (Y0+Y1)/2, 1.4), .004)
    box((TX-PX, Y1-Y0, .2), CEIL, ((TX+PX)/2, (Y0+Y1)/2, 3.7), .004)
    # the far end: a wall with the tunnel mouth over the track, dark inside; a signal lamp beside it
    box((-PX+.05, .3, 4.), WALL, ((PX+.05)/2, Y1, 1.8), .004); box((TX, .3, .6), WALL, (TX/2, Y1, 3.4), .004)
    box((TX, 200, .2), BED, (TX/2, Y1+100, 3.3), .004); box((.2, 200, 4.6), BED, (TX+.1, Y1+100, 1.), .004); box((.2, 200, 4.6), BED, (.05, Y1+100, 1.), .004)
    SIG = E("sig", (.2, 1., .45), 40.); box((.24, .1, .5), mat("sh", (.03,.03,.03), .5), (4.6, Y1-.2, 2.3), .02)
    lamp = lathe([(0,0),(.11,0),(.11,.03),(0,.03)], SIG, (4.6, Y1-.27, 2.42)); lamp.rotation_euler = (math.radians(90), 0, 0)
    # fluorescent tubes in a row over the platform
    TUBE, TOFF = E("tu", (.86, 1., .90), 5.), mat("to", (.7,.72,.7), .3)
    for i in range(16):
        y = Y0+3+i*4.6
        box((.16, 1.25, .05), mat("hs", (.5,.5,.48), .5), (-1.9, y, 3.56), .01); on = i % 3 != 1 and i not in (9, 13); box((.05, 1.2, .05), TUBE if on else TOFF, (-1.9, y, 3.52), .02, seg=4)
        if not on: continue
        a = bpy.data.lights.new("fl", "AREA"); a.shape = "RECTANGLE"; a.size, a.size_y = .12, 1.2; a.energy = 16; a.color = (.88, 1., .92); o = bpy.data.objects.new("fl", a); C.objects.link(o); o.location = (-1.9, y, 3.49); o.visible_camera = False
    # the bench: steel slats on two legs, scuffed
    BS = mat("bs", (.66,.67,.68), .28, Metallic=1.)
    for k in range(4): box((.09, 2.2, .025), BS, (-3.05+k*.11, 4.2, .45), .006)
    for k in range(2): box((.025, 2.2, .09), BS, (-3.42, 4.2, .62+k*.12), .006)
    for y in (3.35, 5.05): box((.45, .05, .45), BS, (-2.87, y, .22), .01)
    # the vending machine: a pale cabinet, a lit glass front with rows of blank cans, a tray at the bottom
    VB, VF = mat("vb", (.55,.58,.60), .4), E("vf", (.95,.97,1.), 2.2)
    box((.8, 1.1, 1.85), VB, (PX+.5, 8.4, .925), .02)
    box((.02, .78, 1.05), VF, (PX+.81, 8.3, 1.25), .004)
    for r in range(4):
        for c in range(6):
            col = [(.75,.12,.10),(.12,.30,.70),(.85,.72,.20),(.15,.55,.25),(.9,.9,.9),(.45,.12,.45)][(r*3+c) % 6]
            lathe([(.025,0),(.025,.085),(0,.085)], mat("cn", col, .3, Metallic=.5), (PX+.86, 7.98+c*.13, .82+r*.24), seg=24)
    box((.04, .5, .16), mat("tr", (.03,.03,.03), .6), (PX+.9, 8.35, .3), .01)
    CAN = lathe([(.05,0),(.05,.18),(0,.18)], mat("cd", (.80,.14,.10), .3, Metallic=.5), (PX+.9, 8.35, .5), seg=24); CAN.rotation_euler = (0, math.radians(90), 0)
    # a newspaper sheet the train's wind will lift
    pme = bpy.data.meshes.new("np"); pme.from_pydata([(-.2,-.28,0),(.2,-.28,0),(.2,.28,0),(-.2,.28,0)], [], [(0,1,2,3)]); pme.update()
    PAPER = mat("pa", (.70,.68,.62), .8, Subsurface_Weight=.2); NP = ob(pme, PAPER, (-1.4, 6., .01))
    # the train: four cars on one empty; each side facing the platform is panels and pillars round open windows
    tr = bpy.data.objects.new("tr", None); C.objects.link(tr)
    BODY, DARK = grit(mat("bd", (.40,.42,.43), .38, Metallic=.7), 60, .25, .002, (.3,.6)), mat("dk", (.05,.05,.055), .6)
    BAND = mat("bn", (.07,.08,.09), .4)
    INNER, SEAT = E("in", (1., .86, .62), .5), mat("se", (.25,.30,.38), .7)
    P, L_ = sh["pitch"], 18.
    for i in range(sh["cars"]):
        y1 = -i*P; y0 = y1-L_
        box((2.9, L_, 1.6), BODY, (2.4, y0+L_/2, .2), .04, par=tr); box((2.9, L_, 1.2), BODY, (2.4, y0+L_/2, 2.5), .04, par=tr)
        box((.06, L_, 3.6), BODY, (3.82, y0+L_/2, 1.2), .02, par=tr); box((2.9, L_, .1), DARK, (2.4, y0+L_/2, -.62), .02, par=tr)
        edges = [0.]+[w+s for w in sh["win"] for s in (-.8, .8)]+[L_]
        for a, b in zip(edges[0::2], edges[1::2]): box((.06, b-a, .9), BODY, (.98, y1-(a+b)/2, 1.45), .01, par=tr)
        box((.04, L_-.6, 2.2), INNER, (3.7, y0+L_/2, 1.2), .004, par=tr)
        box((.02, L_, .14), BAND, (.94, y0+L_/2, .9), .004, par=tr)
        for w in sh["win"]: box((.4, 1.4, .5), SEAT, (3.4, y1-w, 1.2), .03, par=tr)
        a = bpy.data.lights.new("cl", "AREA"); a.shape = "RECTANGLE"; a.size, a.size_y = .6, L_-1.; a.energy = 1500; a.color = (1., .85, .6); o = bpy.data.objects.new("cl", a); C.objects.link(o); o.parent = tr; o.location = (3.2, y0+L_/2, 1.45); o.rotation_euler = (0, math.radians(90), 0)
        for b_ in sh["bog"]: box((2.4, 2.6, .5), DARK, (2.4, y1-b_, -.75), .05, par=tr)
    # the nose: headlights that run ahead; the tail: two red lamps
    yh, yt = 0., -(sh["cars"]-1)*P-L_
    box((2.9, .3, 3.7), BODY, (2.4, yh+.15, 1.2), .2, par=tr); box((2.9, .3, 3.7), BODY, (2.4, yt-.15, 1.2), .2, par=tr)
    HL, TL = E("hl", (1., .96, .86), 40.), E("tl", (1., .08, .04), 30.)
    for x in (1.5, 3.3):
        l1 = lathe([(0,0),(.12,0),(.12,.03),(0,.03)], HL, (x, yh+.31, .3), par=tr); l1.rotation_euler = (math.radians(-90), 0, 0)
        l2 = lathe([(0,0),(.09,0),(.09,.03),(0,.03)], TL, (x, yt-.31, .3), par=tr); l2.rotation_euler = (math.radians(90), 0, 0)
        p = bpy.data.lights.new("tp", "POINT"); p.energy = 6; p.color = (1., .1, .05); p.shadow_soft_size = .05; po = bpy.data.objects.new("tp", p); C.objects.link(po); po.parent = tr; po.location = (x, yt-.5, .3)
    hs = bpy.data.lights.new("hs", "SPOT"); hs.energy = 0; hs.spot_size = math.radians(28); hs.spot_blend = .6; hs.color = (1., .95, .85); hs.shadow_soft_size = .3
    ho = bpy.data.objects.new("hs", hs); C.objects.link(ho); ho.parent = tr; ho.location = (2.4, yh+.6, .6); ho.rotation_euler = (math.radians(90), 0, 0)
    def pose(f):
        if not S.world.get("d"):
            S.world["d"] = 1; S.world.node_tree.nodes["Background"].inputs[1].default_value = 0.
        t = f/30; S.frame_set(f)
        # the nose crosses the bench (y 7) on frame sh["head"], at a steady speed, from far behind the camera
        tr.location = (0, 4.2+sh["v"]*(f-sh["head"])/30, 0)
        hs.energy = 30000*_ease(f, 20, 130)*(1 if f < sh["head"] else .4)
        # the signal turns red once the tail is in the tunnel
        red = (tr.location.y+yt) > Y1
        SIG.node_tree.nodes["Principled BSDF"].inputs["Emission Color"].default_value = (1., .06, .03, 1) if red else (.2, 1., .45, 1)
        # the wind lifts the newspaper and drags it down the platform
        w = _ease(f, sh["head"]-6, sh["head"]+60); NP.location = (-1.4+.5*w, 6.+9.*w+.6*math.sin(t*3)*w, .01+.25*w*abs(math.sin(t*4.1)))
        NP.rotation_euler = (.9*w*math.sin(t*5.), .5*w*math.cos(t*3.3), 2.4*w)
        # the can drops into the tray
        d = _ease(f, sh["can"]-3, sh["can"]); CAN.location = (PX+.9, 8.35, .5-.2*d); CAN.hide_render = f < sh["can"]-3
        # camera: fixed, a breath of drift
        look(Vector((-1.7+.01*math.sin(t*.7), -1.2, 1.45+.006*math.sin(t*.9))), Vector((.5, 40., 1.3)), 32, Vector((-2.9, 4.2, .5)).lerp(Vector((PX+.9, 8.4, .6)), _ease(f, sh["can"]-40, sh["can"]-10)), 4.0, 0)
        S.view_settings.look = "AgX - Medium High Contrast"; S.view_settings.exposure = .2; S.cycles.max_bounces = 6; S.render.use_motion_blur = True; S.render.motion_blur_shutter = .5; cam.clip_start = .05
    return pose
def parts(G):
    for g in G: lathe([(0,1),(.7,1),(1,.5),(1,0),(0,0)], STEEL, (0,0,0), g)
def props(): pass
