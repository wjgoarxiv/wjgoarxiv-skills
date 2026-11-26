YEL = mat("yel", tuple(v*.9 for v in PAL["flood"]), .38); LAMP = E("lamp", PAL["flood"], 0.0); WARM = E("warm", (1,.83,.58), 1.6); GLS = mat("gls", (.02,.025,.03), .06, Coat_Weight=1.0); RUB = mat("rub", (.012,.012,.013), .75)
def _empty(loc=(0,0,0), par=None, rot=(0,0,0)):
    e = bpy.data.objects.new("e", None); C.objects.link(e); e.location, e.rotation_euler, e.parent = loc, rot, par; return e
def _rod(p, q, r, m, par=None, ball=True):
    p, q = Vector(p), Vector(q); L = (q-p).length; e = _empty(p, par); e.rotation_mode = "QUATERNION"; e.rotation_quaternion = (q-p).to_track_quat("Z", "Y")
    lathe([(0,0),(r,0),(r,L),(r*.9,L+r*.25),(0,L+r*.4)] if ball else [(0,0),(r,0),(r,L),(0,L)], m, (0,0,0), e, 64); return e
def flap():
    root = _empty((0,0,0), rot=(math.pi/2,0,0)); n = len(W1); w, gap = 1.36, .10; tw = n*(w+gap)
    box((tw+1.0,3.1,.5), BLK, (0,0,-.42), .08, root); box((tw+.3,2.5,.2), INK, (0,0,-.22), .03, root)
    for x in (-tw/2-.32, tw/2+.32):
        for y in (-1.3,1.3): lathe([(.085,0),(.09,.02),(.075,.04),(0,.04)], CHR, (x,y,-.17), root, 48)
    for r in (-1,1):
        for i in range(n*3): box((.10,.02,.02), STEEL, ((i-n*1.5+.5)*.45, r*1.42, -.16), .004, root)
    def half(ch, up):
        o = text(ch, 1.95, WHT, (0,0,0), ex=.004); bpy.context.view_layer.update(); me = bpy.data.meshes.new_from_object(o.evaluated_get(bpy.context.evaluated_depsgraph_get())); bpy.data.objects.remove(o)
        bm = bmesh.new(); bm.from_mesh(me)
        for v in bm.verts: v.co.y -= 0.0
        wd = max((v.co.x for v in bm.verts), default=0)-min((v.co.x for v in bm.verts), default=0); k = min(1, 1.18/wd) if wd else 1
        for v in bm.verts: v.co.x *= k; v.co.y = v.co.y - MID
        bmesh.ops.bisect_plane(bm, geom=bm.verts[:]+bm.edges[:]+bm.faces[:], plane_co=(0,.03 if up else -.03,0), plane_no=(0,1,0), clear_inner=up, clear_outer=not up)
        bm.to_mesh(me); bm.free(); return me
    o = text("H", 1.95, WHT, (0,0,0)); bpy.context.view_layer.update(); bb = [v[1] for v in o.bound_box]; MID = (min(bb)+max(bb))/2; bpy.data.objects.remove(o)
    cells = []
    for c in range(n):
        gl = [random.choice("ABCDEFGHJKLNOPRSTUVXYZ0123456789") for _ in range(5)]+[W1[c]]; x = (c-(n-1)/2)*(w+gap)
        base = _empty((x,0,0), root); pan = lambda par, y: box((w,1.17,.035), BLK, (0,y,0), .02, par)
        pan(base, .60); pan(base, -.60); U, D = [], []
        for ch in gl: U.append(ob(half(ch,True), WHT, (0,0,.024), par=base)); D.append(ob(half(ch,False), WHT, (0,0,.024), par=base))
        piv = _empty((0,0,.045), base); pan(piv, .60); FU, FD = [], []
        for ch in gl:
            FU.append(ob(half(ch,True), WHT, (0,0,.024), par=piv)); m = half(ch,False)
            for v in m.vertices: v.co.y, v.co.z = -v.co.y, -v.co.z
            FD.append(ob(m, WHT, (0,0,-.024), par=piv))
        for k in (-1,1): lathe([(0,0),(.05,0),(.05,.10),(0,.10)], STEEL, (k*(w/2-.02),0,.0), base, 32)
        cells.append((piv,U,D,FU,FD))
    k = 5.2/max(n,5)*1.0; root.scale = (k,k,k); box((30,30,.2), CONC, (0,2.2,0), .02, rot=(math.pi/2,0,0))
    light((-5,-5,4.5), (1,.93,.8), 900, 1.4, sy=6); light((6,-3,2.5), (1,.75,.35), 420, 1, sy=6); light((0,-7,-3), (.5,.6,1), 160, 5); glow = light((0,-4,0), (1,.9,.7), 0, 5)
    def pose(f):
        for c, (piv,U,D,FU,FD) in enumerate(cells):
            land = 7+round(c*4/max(1,n-1)); s = (f-(land-10))/2; q = int(max(0,min(5,math.floor(s)))); mv = 0 <= s < 5; fr = (s-math.floor(s)) if mv else 0; a_ = (38 if fr < .5 else 128) if mv else 0
            nx = min(5, q+1) if mv else q
            for j in range(6):
                U[j].hide_render = j != nx; D[j].hide_render = j != q; FU[j].hide_render = j != q or not mv; FD[j].hide_render = j != nx or not mv
            piv.rotation_euler.x = math.radians(a_)
            for ch in piv.children:
                if ch.type == "MESH" and ch not in FU and ch not in FD: ch.hide_render = not mv
            if not mv: U[q].hide_render = False
        u = f-11; glow.data.energy = 500 if 0 <= u < 1 else 0; j = .06*math.exp(-u*.5) if u >= 0 else 0
        look((-3.5+.06*f, -5.6+.02*f, 1.5-.03*f+j), (-.35+.02*f, 0, -.05-j), 50, (.2,0,.1), 1.0, .09-.002*f)
    return pose
def gate():
    box((40,40,.3), CONC, (0,0,-.15), .04)
    for i in range(-6,7): box((.03,40,.01), INK, (i*1.4,0,.002), .002); box((40,.03,.01), INK, (0,i*1.4,.002), .002)
    for x, sgn in ((-.9,1),(4.3,-1)):
        box((1.5,4.4,2.3), ALU, (x,0,1.25), .22, seg=10); box((1.54,4.1,.10), BLK, (x,0,2.42), .04); box((1.3,4.2,.14), BLK, (x,0,.07), .03); box((.9,.9,.05), GLS, (x,-1.3,2.48), .03)
        box((1.2,.03,.5), YEL, (x,-2.215,1.75), .01)
    text(W2, .34, INK, (-.9,-2.236,1.75), (math.pi/2,0,0), mw=1.05); text(W2, .34, INK, (4.3,-2.236,1.75), (math.pi/2,0,0), mw=1.05)
    lamp = lathe([(0,.10),(.14,.09),(.2,.05),(.2,0)], LAMP, (0,0,0), _empty((-.9,-2.2,.95), rot=(math.pi/2,0,0)), 64); ring = lathe([(.2,0),(.27,0),(.27,.05),(.2,.05)], CHR, (0,0,0), _empty((-.9,-2.2,.95), rot=(math.pi/2,0,0)), 64)
    ax = Vector((1,0,-1)).normalized(); base = _empty((-.16,-.6,1.95)); base.rotation_mode = "QUATERNION"; base.rotation_quaternion = ax.to_track_quat("Z", "Y"); hub = _empty(par=base)
    lathe([(0,-.1),(.42,-.1),(.42,.18),(.30,.30),(.22,.42),(0,.45)], STEEL, (0,0,0), hub, 96)
    g0 = None
    for i in range(3):
        best = 0
        t = 2*math.pi*i/3; d = Vector((math.sin(math.pi/4)*math.cos(t), math.sin(math.pi/4)*math.sin(t), math.cos(math.pi/4))); _rod(d*.25, d*2.55, .095, CHR, hub); _rod(d*2.3, d*2.6, .115, RUB if i else RED, hub)
    # spin so that arm 0 points along +x
    q = ax.to_track_quat("Z", "Y"); dx = q.inverted() @ Vector((1,0,0)); a0 = math.atan2(dx.y, dx.x)
    light((-5,-4,6), (1,.95,.86), 1000, 1.8, sy=7); light((6,-2,4), (1,.8,.5), 600, 1, sy=6); light((1.5,5,3), (.6,.75,1), 500, 4); glow = light((-.9,-3.2,1.0), PAL["flood"], 0, .6, (-.9,-1,1.0))
    def pose(f):
        u = f-11; e = 0 if f < 4 else 18*(f-4)/7 if u < 0 else 18+102*(1-math.exp(-u*.42)*math.cos(u*.55)); hub.rotation_euler.z = a0-math.radians(e)
        LAMP.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 22 if u >= 0 else .3; glow.data.energy = 120 if u >= 0 else 0
        k = .07*math.exp(-u*.45) if u >= 0 else 0; look((2.5-.03*f+k, -4.9+.05*f, 4.1-.03*f-k), (.75,-.45,1.15+k), 44, (.9,-.6,1.95), .9, -.16)
    return pose
def doors():
    box((40,16,.3), CONC, (0,-7.6,-.15), .03); box((40,.5,.34), YEL, (0,-1.2,-.15), .02); box((40,.16,.36), INK, (0,.30,-.18), .02)
    for i in range(-18,19):
        for j in (0,1): lathe([(0,.05),(.05,.045),(.085,.02),(.095,0)], YEL, (i*.24,-1.32+j*.24,.02), seg=24)
    for s in (-1,1):
        box((14,.5,6), ALU, (s*9.4,.95,2.9), .06); box((2.1,.1,1.5), GLS, (s*5.1,.69,3.2), .2)
        for z in (1.6,4.6): box((14,.06,.12), YEL, (s*9.4,.69,z), .01)
    box((40,.5,3.6), ALU, (0,.95,6.45), .04); box((4.6,.08,.8), BLK, (0,.69,5.2), .03); text(W3, .62, LAMP, (0,.635,5.2), (math.pi/2,0,0), mw=4.0)
    box((6,.2,7), WARM, (0,5,2.5), .02); box((3.2,.4,.5), RED, (0,4.6,.55), .12); box((3.2,.25,1.1), RED, (0,4.75,1.2), .12); box((7,6,.2), GRY, (0,3.5,.02), .02); box((.12,.12,5), CHR, (-.9,3,2.5), .05); box((.12,.12,5), CHR, (1.2,3.6,2.5), .05)
    P = []
    for s in (-1,1):
        e = _empty(); P.append(e)
        box((2.4,.16,4.6), STEEL, (s*1.22,.9,2.35), .05, e); box((1.5,.20,2.2), GLS, (s*1.22,.89,3.1), .22, e); box((.07,.22,4.6), RUB, (s*.03,.9,2.35), .02, e); box((.10,.12,.9), CHR, (s*.36,.80,1.6), .04, e)
        lathe([(0,0),(.2,0),(.2,.03),(0,.03)], RED, (0,0,0), _empty((s*1.22,.81,1.2), e, (math.pi/2,0,0)), 48)
    light((-6,-6,6), (.6,.72,1), 500, 4); light((5,-7,3), (.5,.6,1), 220, 4); spill = light((0,4.4,3.2), (1,.84,.6), 0, 3.4, (0,-4,0), sy=4)
    def pose(f):
        LAMP.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 5 if f % 6 < 4 or f > 11 else .4
        u = max(0,f-8); e = 0 if f < 8 else (1-2**(-u*.42)); d = .02+2.15*e; P[0].location.x = -d; P[1].location.x = d; spill.data.energy = 3000*e
        look((-1.7+.05*f, -6.4+.07*f, .95+.01*f), (.05,.6,2.55), 33, (0,.8,2.3), 1.2, .05)
    return pose
def parts(G):
    box((1.5,.06,2.2), BLK, (0,0,.6), .03, G[0]); text("8", 1.9, WHT, (0,-.035,.6), (math.pi/2,0,0), G[0]); box((1.6,.10,.05), STEEL, (0,0,.6), .01, G[0])
    lathe([(0,.16),(.85,.16),(.9,.12),(1.2,.12),(1.2,-.12),(0,-.12)], YEL, (0,0,.5), G[1], 128); box((.9,.18,.06), INK, (0,0,.67), .01, G[1]); box((.18,.9,.06), INK, (0,0,.67), .01, G[1])
    bpy.ops.mesh.primitive_torus_add(major_radius=.8, minor_radius=.13, major_segments=96, minor_segments=24); t = bpy.context.object; t.data.materials.append(BLK); t.parent = G[2]; t.location = (0,0,.2); t.rotation_euler = (math.pi/2,0,0); box((.34,.10,1.5), YEL, (0,0,1.5), .02, G[2])
    h = _empty((0,0,.6), G[3]); lathe([(0,-.1),(.42,-.1),(.42,.18),(.3,.3),(.22,.42),(0,.45)], STEEL, (0,0,0), h, 96)
    for i in range(3): a_ = 2*math.pi*i/3; _rod((0,0,.1), (1.5*math.cos(a_),1.5*math.sin(a_),.5), .10, CHR, h)
    lathe([(0,.35),(.25,.35),(.28,.2),(.9,.1),(1.05,.22),(1.2,.18),(1.2,-.05),(1.45,-.08),(1.45,-.28),(0,-.28)], STEEL, (0,0,.5), G[4], 160)
    for z, w, h_ in ((1.1,.72,.36),(.55,.22,1.0),(.05,1.5,.18)): box((3.0,w,h_), GRY if z < 1 else STEEL, (0,0,z), .05, G[5], (0,0,.3))
    lathe([(0,1.2),(.2,1.18),(.8,1.0),(1.05,.6),(1.15,.35),(1.15,.25),(0,.25)], BLK, (0,0,.2), G[6], 128); lathe([(0,.4),(.12,.38),(.15,.2),(0,.2)], RED, (0,0,1.2), G[6], 48)
    lathe([(0,.9),(.5,.8),(.75,.45),(.8,.1),(.8,0)], E("pl", PAL["flood"], 1.2), (0,0,.4), G[7], 96); lathe([(.8,0),(1.0,0),(1.0,-.3),(0,-.3)], STEEL, (0,0,.4), G[7], 96)
def props():
    for x, y, z in ((-5.05,-1.9,0),(-4.75,-1.5,.17)): lathe([(0,.16),(.38,.16),(.42,.14),(.52,.14),(.52,0),(0,0)], YEL, (x,y,z), None, 128)
    e = _empty((4.75,1.5,.13)); bpy.ops.mesh.primitive_torus_add(major_radius=.62, minor_radius=.12, major_segments=96, minor_segments=24); t = bpy.context.object; t.data.materials.append(BLK); t.parent = e; box((.28,1.3,.09), YEL, (0,1.2,0), .02, e, (0,0,0))
    e.rotation_euler = (0,0,-.5)
