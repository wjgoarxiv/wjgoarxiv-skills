def key():
    box((14,18,.3), ALU, (0,0,-.15), .04); box((2.5,2.5,.06), BLK, (0,0,0), .06); key = bpy.data.objects.new("k", None); C.objects.link(key)
    box((2.2,2.2,.7), WHT, (0,0,.42), .16, key, taper=.86, seg=10); text(W1, .86, INK, (0,.02,.775), par=key, mw=1.5); ring = lathe([(.1,.772),(.1,.778),(0,.778)], RED, (.66,.66,0), key)
    for i in range(-3,4):
        for j in range(-4,5):
            if abs(i) < 1 and abs(j) < 1: continue
            x, y = i*2.9, j*2.9
            box((2.5,2.5,.06), BLK, (x,y,0), .06); M = [GRY,BLK,GRY,BLU][(i*3+j*5) % 4]; box((2.2,2.2,.7), M, (x,y,.42), .16, taper=.86, seg=10)
            g = (i+2*j) % 3
            if g == 0: lathe([(.42,.772),(.42,.778),(0,.778)], WHT, (x,y,0))
            elif g == 1: box((.75,.75,.008), WHT, (x,y,.775), .001)
            else:
                me = bpy.data.meshes.new("t"); me.from_pydata([(-.48,-.4,0),(.48,-.4,0),(0,.45,0)], [], [(0,1,2)]); ob(me, WHT, (x,y,.778))
    for x in (-1.45,1.45):
        for y in (-1.45,1.45): screw(x, y)
    led = [lathe([(0,.12),(.09,.11),(.13,.06),(.13,0)], LIM, (q,-1.45,0), seg=48) for q in (-.6,0,.6)]
    light((-4,5,6), (.80,.90,1), 900, 2.2, sy=7); light((6,-1,3.2), (1,1,1), 420, 1, sy=6); light((-5,-5,2.0), (.35,.45,1), 260, 3); glow = light((0,0,3.5), (1,1,1), 0, 2)
    def pose(f):
        u = f-11; d = 0 if u < 0 else (.34 if u < 2 else .34*(1-ez((u-2)/11))); key.location.z = -d; led_e = 0 if u < 0 else 14
        LIM.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = led_e; glow.data.energy = 900 if 0 <= u < 1 else 0
        k = .05*math.exp(-u*.5) if u >= 0 else 0; look((2.4-.03*f+k, -5.4+.03*f, 4.6-.02*f-k), (-.75,.15+k,.3), 70, (0,-.15,.7), .8, .10)
    return pose
def dial():
    box((40,40,.3), CONC, (0,0,-.15), .04); lathe([(2.35,.0),(2.35,.05),(2.15,.07),(1.65,.07),(1.65,0)], BLK); knob = bpy.data.objects.new("k", None); C.objects.link(knob)
    lathe([(1.5,0),(1.5,.28),(1.36,.36),(1.36,1.02),(1.28,1.12),(.98,1.12),(.93,1.08),(0,1.06)], ALU, (0,0,0), knob, 256, .035, (.35,1.04)); box((.07,.62,.03), RED, (0,1.0,1.12), .01, knob); lathe([(.12,1.06),(.12,1.10),(0,1.11)], CHR, (0,0,0), knob)
    for i in range(61):
        t = math.radians(150-5*i); r = 2.0; big = i % 10 == 0; box((.035 if big else .016, .24 if big else .13, .006), WHT, (r*math.cos(t), r*math.sin(t), .075), .001, rot=(0,0,t-math.pi/2))
    for s, d in ((W1,146),(W2,90),(W3,34)):
        t = math.radians(d); text(s, .95 if d == 90 else .5, INK, (3.15*math.cos(t), 3.0*math.sin(t)+(.25 if d == 90 else 0), .008), mw=3.2 if d == 90 else 1.5)
    for x, y, s in ((-1.9,-2.8,"CIRCLE"),(0,-2.8,"SQUARE"),(1.9,-2.8,"TRIANGLE")):
        lathe([(.34,0),(.34,.1),(.28,.16),(0,.16)], {"CIRCLE":RED,"SQUARE":BLK,"TRIANGLE":BLU}[s], (x,y,0))
    for x in (-3.4,3.4):
        for y in (-4,4.3): screw(x,y)
    light((-5,4,5), (.82,.9,1), 1000, 1.6, sy=7); light((5,3,2.2), (1,.97,.92), 520, .7, sy=6); light((0,-6,3), (.4,.5,1), 200, 4)
    def pose(f):
        u = f-11; an = 56*(1-ez((f-3)/7)) if f < 11 else 0
        if f < 3: an = 56
        if u >= 0: an = -3*math.exp(-u*.9)*math.cos(u*2.2)
        knob.rotation_euler.z = math.radians(an); look((-1.2+.03*f,-4.4+.02*f,6.4), (-1.55,.75,.3), 56, (0,1.5,.95), .7, -.07)
    return pose
def blade():
    box((60,60,.2), BLK, (0,0,-.14), .02)
    halves = []
    for k in (-1,1):
        e = bpy.data.objects.new("h", None); C.objects.link(e); halves.append(e)
        A = 2.15; B = 3.2; s = .95   # a card cut along the diagonal y = s*x
        pts = [(-A,-s*A),(A,s*A),(A,-B),(-A,-B)] if k < 0 else [(-A,-s*A),(-A,B),(A,B),(A,s*A)]
        bm = bmesh.new(); vs = [bm.verts.new((x,y,.0)) for x,y in pts]; fc = bm.faces.new(vs); bmesh.ops.recalc_face_normals(bm, faces=[fc])
        if fc.normal.z < 0: fc.normal_flip()
        uv = bm.loops.layers.uv.new("u")
        for l in fc.loops: l[uv].uv = ((l.vert.co.x+A)/(2*A), (l.vert.co.y+B)/(2*B))
        me = bpy.data.meshes.new("h"); bm.to_mesh(me); bm.free(); o = ob(me, None, par=e); d = o.modifiers.new("s","SOLIDIFY"); d.thickness = .05; d.offset = -1
        m = grit(mat("card", (.85,.86,.86), .75), 500, .12, .002); im = m.node_tree.nodes.new("ShaderNodeTexImage"); im.image = bpy.data.images.load(OUT.rsplit("/",1)[0]+"/card.png"); m.node_tree.links.new(im.outputs[0], m.node_tree.nodes["Principled BSDF"].inputs["Base Color"]); me.materials.append(m)
    bl = bpy.data.objects.new("b", None); C.objects.link(bl); th = math.atan(.95)
    bm = bmesh.new(); Lb, hb = 9.0, 1.5
    P = [(-Lb,0,0),(Lb,0,.0),(Lb,-.10,.45),(-Lb,-.10,.45),(Lb,.10,.45),(-Lb,.10,.45),(Lb,-.10,hb),(-Lb,-.10,hb),(Lb,.10,hb),(-Lb,.10,hb)]
    v = [bm.verts.new(p) for p in P]
    for f in ((0,1,2,3),(1,0,5,4),(3,2,6,7),(4,5,9,8),(7,6,8,9),(1,4,8,6,2),(0,3,7,9,5)): bm.faces.new([v[i] for i in f])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:]); me = bpy.data.meshes.new("bl"); bm.to_mesh(me); bm.free(); ob(me, STEEL, par=bl)
    text(W3, .34, INK, (-1.0,-.108,.95), (math.pi/2,0,0), bl); bl.rotation_euler.z = th
    light((-4,-2,6), (.85,.92,1), 900, 2, sy=8); light((5,4,3), (1,1,1), 600, .8, sy=7); light((-6,5,1.5), (.25,.35,1), 500, 2); light((2,-7,2.5), (.9,.95,1), 260, 3)
    def pose(f):
        u = f-11; z = 3.6 if f < 7 else 3.6*(1-((f-7)/4)**2) if f < 11 else 0
        if u >= 2: z = (u-2)**2*.16
        bl.location = (0,0,z-.03); sep = 0 if u < 0 else .55*ez(u/6); nx = Vector((math.sin(th), -math.cos(th), 0)); tx = Vector((math.cos(th), math.sin(th), 0))
        halves[0].location = nx*sep*.55 - tx*sep*.35; halves[1].location = -nx*sep*.55 + tx*sep*.35
        for h, k in zip(halves,(1,-1)): h.rotation_euler = (0,0,-k*.06*sep/.55) if u >= 0 else (0,0,0)
        k = .07*math.exp(-u*.5) if u >= 0 else 0; look((1.2+.03*f,-5.0+k,6.2-.03*f), (.35,.15,.1+k), 47, (0,-.2,.05), .9, .12)
    return pose
def parts(G):
    def cap(par, M, s):
        box((2.2,2.2,.7), M, (0,0,.35), .16, par, taper=.86, seg=10)
        if s == "o": lathe([(.42,.702),(.42,.708),(0,.708)], BLK if M is WHT else WHT, (0,0,0), par)
        elif s == "q": box((.8,.8,.008), BLK if M is WHT else WHT, (0,0,.703), .001, par)
        else: text(s, .86, INK, (0,.02,.705), par=par, mw=1.5)
    cap(G[0], WHT, W1); cap(G[5], BLK, "q")
    lathe([(1.5,0),(1.5,.28),(1.36,.36),(1.36,1.02),(1.28,1.12),(.98,1.12),(.93,1.08),(0,1.06)], ALU, (0,0,0), G[1], 256, .035, (.35,1.04)); box((.07,.62,.03), RED, (0,1.0,1.12), .01, G[1])
    box((3.2,.10,1.5), STEEL, (0,0,.9), .03, G[2], rot=(.5,0,.3)); box((3.2,.04,.4), STEEL, (0,-.4,.06), .01, G[2], rot=(.5,0,.3))
    lathe([(.0,-.9),(.18,-.8),(.22,-.5),(.22,.0),(.75,.0),(.85,.15),(.8,.4),(.6,.52),(0,.55)], CHR, (0,0,.5), G[3], 96); box((1.3,.16,.2), INK, (0,0,1.02), .01, G[3], rot=(0,0,.5))
    lathe([(0,1.5),(.35,1.42),(.58,1.15),(.62,.8),(.62,0),(.78,0),(.78,-.15),(0,-.15)], mat("ld",PAL["accent"],.12,Coat_Weight=1.0), (0,0,.2), G[4], 96)
    for q in (-.25,.25): box((.09,.09,1.1), CHR, (q,0,-.4), .01, G[4])
    cv = bpy.data.curves.new("sp","CURVE"); cv.dimensions = "3D"; sp = cv.splines.new("POLY"); n = 400; sp.points.add(n-1)
    for i in range(n): t = i/n*2*math.pi*7; sp.points[i].co = (.75*math.cos(t), .75*math.sin(t), i/n*2.4-.5, 1)
    cv.bevel_depth = .085; cv.bevel_resolution = 6; cv.materials.append(CHR); so = bpy.data.objects.new("sp", cv); C.objects.link(so); so.parent = G[6]
    box((1.7,1.7,.9), BLK, (0,0,.2), .06, G[7]); box((1.3,1.3,.5), GRY, (0,0,.85), .08, G[7], taper=.8); box((.34,.9,.5), RED, (0,0,1.25), .03, G[7]); box((.9,.3,.5), RED, (0,0,1.25), .03, G[7])
def props():
    k = bpy.data.objects.new("k", None); C.objects.link(k); k.location = (-4.5,-1.9,0); k.scale = (.5,.5,.5); k.rotation_euler = (0,0,.3); box((2.2,2.2,.7), WHT, (0,0,.35), .16, k, taper=.86, seg=10); text(W1, .86, INK, (0,.02,.705), par=k, mw=1.5)
    kn = bpy.data.objects.new("k", None); C.objects.link(kn); kn.location = (4.75,1.6,0); kn.scale = (.55,.55,.55); lathe([(1.5,0),(1.5,.28),(1.36,.36),(1.36,1.02),(1.28,1.12),(.98,1.12),(.93,1.08),(0,1.06)], ALU, (0,0,0), kn, 256, .035, (.35,1.04)); box((.07,.62,.03), RED, (0,1.0,1.12), .01, kn)
    for x, y in ((4.5,-1.4),(4.8,-1.75),(-4.6,1.2)): screw(x,y)
