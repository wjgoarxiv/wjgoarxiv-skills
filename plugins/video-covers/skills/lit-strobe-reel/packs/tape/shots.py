OXI = grit(mat("oxi", tuple(v*.75 for v in PAL["flood"]), .34), 700, .05, .001, (.28,.42)); CRM = grit(mat("crm", tuple(v*.92 for v in PAL["accent"]), .5), 300, .04, .001, (.45,.58)); BRS = grit(mat("brs", (.72,.50,.26), .3, Metallic=1.0), 60, .05, .0006, (.24,.32), (.4,1,30)); LAMP = E("lamp", PAL["signal"], 0.0); WOOD = grit(mat("wood", (.13,.052,.022), .45), 14, .25, .004, (.35,.55), (1,18,18))
def _empty(loc=(0,0,0), par=None, rot=(0,0,0)):
    e = bpy.data.objects.new("e", None); C.objects.link(e); e.location, e.rotation_euler, e.parent = loc, rot, par; return e
def _poly(pts, m, z, par, h=.05):
    bm = bmesh.new(); fc = bm.faces.new([bm.verts.new((x,y,0)) for x,y in pts]); bmesh.ops.recalc_face_normals(bm, faces=[fc])
    if fc.normal.z < 0: fc.normal_flip()
    r = bmesh.ops.extrude_face_region(bm, geom=[fc]); bmesh.ops.translate(bm, vec=(0,0,h), verts=[v for v in r["geom"] if isinstance(v, bmesh.types.BMVert)]); bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    me = bpy.data.meshes.new("p"); bm.to_mesh(me); bm.free(); return ob(me, m, (0,0,z), par=par)
def _reel(par, r, pack, rot=0):
    n = 64
    def flange(z):
        for k in range(3):
            a0 = rot+k*2*math.pi/3; pts = [(r*math.cos(a0+t*1.02/n), r*math.sin(a0+t*1.02/n)) for t in range(n+1)]+[(r*.30*math.cos(a0+t*1.02/n), r*.30*math.sin(a0+t*1.02/n)) for t in range(n,-1,-1)]; _poly(pts, STEEL, z, par, .04)
        lathe([(r*.86,0),(r,0),(r,.04),(r*.86,.04),(r*.86,0)], STEEL, (0,0,z), par, 160); lathe([(0,0),(r*.36,0),(r*.36,.04),(0,.04)], STEEL, (0,0,z), par, 96)
    flange(0); flange(.46); pr = [(r*.28,.05)]
    for i in range(60): q = r*.28+(pack-r*.28)*i/60; pr += [(q,.44),(q+.008,.43)]
    pr += [(pack,.43),(pack,.05)]; lathe(pr, OXI, (0,0,0), par, 160)
    lathe([(.0,.50),(r*.20,.50),(r*.20,.62),(r*.14,.70),(0,.70)], BLK, (0,0,0), par, 96)
    for k in range(3): t = rot+k*2*math.pi/3+.51; box((.10,r*.22,.06), CHR, (r*.11*math.cos(t), r*.11*math.sin(t), .72), .01, par, (0,0,t-math.pi/2))
def _band(p, q, m, z0=.06, h=.36):
    p, q = Vector((*p,0)), Vector((*q,0)); d = q-p; return box((d.length,.014,h), m, ((p.x+q.x)/2,(p.y+q.y)/2,z0+h/2), .001, rot=(0,0,math.atan2(d.y,d.x)))
def deck():
    box((20,14,.4), WOOD, (0,0,-.6), .06); box((15,8.6,.5), ALU, (0,.4,-.25), .14); box((12.6,3.7,.2), BLK, (0,-1.55,-.02), .06)
    for x in (-7,7):
        for y in (-3.4,4.2): screw(x,y)
    text(W1, 1.15, INK, (-3.9,1.55,.006), al="LEFT", mw=5); box((11.8,.04,.01), INK, (0,.75,.004), .001)
    for i in range(26): box((.16,1.1,.02), INK, (1.9+i*.2,1.75,.0), .01)
    lampb = lathe([(.0,.16),(.13,.13),(.18,.06),(.18,0)], LAMP, (-5.0,1.75,.0), None, 64); lathe([(.18,0),(.26,0),(.26,.06),(.18,.06)], CHR, (-5.0,1.75,0), None, 64)
    K_ = []
    for i in range(5):
        e = _empty(((i-2)*2.4,.1,.12)); K_.append(e); M = RED if i == 0 else CRM if i == 1 else GRY
        box((2.2,3.1,.62), M, (0,-1.6,.18), .14, e, seg=10); bx = box((2.0,.5,.12), M, (0,-2.85,.50), .05, e)
        z = .495; w = WHT if M in (RED,GRY) else INK
        if i == 0: lathe([(.40,0),(.40,.02),(0,.02)], WHT, (0,-1.45,z), e, 96)
        elif i == 1: _poly([(-.34,-1.85),(.46,-1.45),(-.34,-1.05)], w, z, e, .02)
        elif i == 2: _poly([(-.42,-1.8),(.0,-1.45),(-.42,-1.1)], w, z, e, .02); _poly([(.02,-1.8),(.44,-1.45),(.02,-1.1)], w, z, e, .02)
        elif i == 3: _poly([(.42,-1.8),(.0,-1.45),(.42,-1.1)], w, z, e, .02); _poly([(-.02,-1.8),(-.44,-1.45),(-.02,-1.1)], w, z, e, .02)
        else: box((.72,.72,.02), w, (0,-1.45,z), .01, e); box((1.1,.13,.024), M, (0,-1.45,z+.002), .001, e, (0,0,.785))
    light((-6,4,5), (1,.92,.8), 900, 2.4, sy=7); light((4,7,6), (1,.95,.88), 900, 4); light((7,0,3), (1,.75,.45), 420, 1, sy=6); light((-2,-7,2.5), (.5,.6,1), 240, 5); glow = light((-5,1.2,1.2), PAL["signal"], 0, .5, (-4.5,0,0))
    def pose(f):
        u = f-11; a_ = 0 if u < -1 else -.10 if u < 0 else -.16 if u < 1 else -.125+.02*math.exp(-u*.5)*math.cos(u*1.6); K_[0].rotation_euler.x = -a_
        LAMP.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 26 if u >= 0 else 0; glow.data.energy = 160 if u >= 0 else 0
        k = .06*math.exp(-u*.5) if u >= 0 else 0; look((-6.2+.05*f+k, -5.6+.02*f, 5.0-.03*f-k), (-2.9,-.95,.1+k), 44, (-4.7,-1.5,.5), .75, .12-.003*f)
    return pose
def reel():
    box((30,24,.4), ALU, (0,0,-.2), .05); A, B_ = _empty((-3.1,1.7,.06)), _empty((3.1,1.7,.06)); _reel(A, 2.75, 2.2); _reel(B_, 2.75, 1.35, .4)
    for x in (-3.1,3.1): lathe([(0,0),(2.95,0),(2.95,.02),(0,.02)], BLK, (x,1.7,0), None, 160)
    box((3.0,1.5,.9), BLK, (0,-2.55,.45), .12); text(W2, .62, WHT, (0,-2.55,.905), mw=2.5)
    for x in (-.7,0,.7): lathe([(.0,0),(.20,0),(.20,.6),(0,.6)], CHR, (x,-1.62,.0), None, 64)
    R_ = []
    for x in (-3.3,3.3):
        e = _empty((x,-2.0,0)); R_.append(e); lathe([(0,.0),(.42,0),(.42,.06),(.34,.10),(.34,.56),(.42,.60),(.42,.66),(0,.66)], BRS, (0,0,0), e, 96); box((.3,.05,.04), INK, (.17,0,.68), .01, e)
    cap_ = _empty((1.75,-1.35,0)); lathe([(0,0),(.13,0),(.13,.9),(0,.92)], CHR, (0,0,0), cap_, 64); pin = _empty((1.75,-1.9,0)); lathe([(0,.05),(.4,.05),(.4,.6),(0,.62)], mat("rub",(.02,.02,.02),.8), (0,0,0), pin, 96); lathe([(0,.6),(.12,.6),(.12,.75),(0,.76)], CHR, (0,0,0), pin, 48)
    P = [(-5.20,.95),(-3.63,-1.93),(-3.25,-1.62),(-.7,-1.40),(0,-1.38),(.7,-1.40),(3.25,-1.62),(3.63,-1.93),(4.42,1.45)]
    for p, q in zip(P, P[1:]): _band(p, q, OXI)
    marks_ = [box((.16,.02,.34), WHT, (0,0,.24), .002) for _ in range(3)]
    light((-6,5,5), (1,.93,.82), 1100, 1.4, sy=8); light((6,-4,4), (1,.8,.55), 900, 1.6, sy=6); light((0,8,6), (1,.96,.9), 700, 5); light((0,-8,2.2), (.55,.65,1), 220, 5)
    for x, y in ((-6.6,-3.4),(6.6,-3.4),(-6.6,4.8),(6.6,4.8)): screw(x,y)
    def pose(f):
        A.rotation_euler.z = .16*f*1.0; B_.rotation_euler.z = .25*f
        for e in R_: e.rotation_euler.z = .7*f
        pin.rotation_euler.z = -.8*f
        for i, m_ in enumerate(marks_):
            s = ((f*.36+i*2.2) % 6.6)-3.3; y = -1.62+.24*(1-abs(s)/3.25) if abs(s) > .7 else -1.39; m_.location = (s, y-.02, .24); m_.rotation_euler.z = -math.copysign(.085, s) if abs(s) > .7 else 0
        k = .02*math.sin(f*1.7); look((1.5-.07*f, -5.6+.02*f, 6.0-.03*f+k), (.1-.01*f, .1, .1), 38, (0,-1.5,.4), .9, -.10+.005*f)
    return pose
def needle():
    box((24,16,.4), ALU, (0,0,-.45), .06); root = _empty((0,0,0)); out_ = box((9.4,6.0,.5), BLK, (0,0,0), .22, root); box((8.6,5.2,.06), CRM, (0,0,.25), .10, root); box((8.6,.9,.10), BLK, (0,-2.25,.29), .02, root)
    cx, cy, R0 = 0, -2.2, 3.55
    for i in range(41):
        t = math.radians(140-2.5*i); big = i % 5 == 0; hot = i > 28; r = R0+(.14 if big else .06); box((.05 if big else .028, .36 if big else .2, .01), RED if hot else INK, (cx+r*math.cos(t), cy+r*math.sin(t), .285), .001, root, (0,0,t-math.pi/2))
    n = 48; a0, a1 = math.radians(140-2.5*28.5), math.radians(40); pts = [((R0-.10)*math.cos(a0+(a1-a0)*i/n)+cx, (R0-.10)*math.sin(a0+(a1-a0)*i/n)+cy) for i in range(n+1)]+[((R0-.32)*math.cos(a0+(a1-a0)*i/n)+cx, (R0-.32)*math.sin(a0+(a1-a0)*i/n)+cy) for i in range(n,-1,-1)]; _poly(pts, RED, .28, root, .01)
    for i, s in ((0,"20"),(10,"10"),(20,"5"),(28,"0"),(40,"+3")): t = math.radians(140-2.5*i); r = R0+.62; text(s, .42, RED if i > 28 else INK, (cx+r*math.cos(t), cy+r*math.sin(t), .285), (0,0,t-math.pi/2), root)
    text(W3, .95, INK, (0,-.55,.285), par=root, mw=3.6)
    nd = _empty((cx,cy,.40), root); box((.045,3.75,.03), INK, (0,1.875,0), .004, nd); box((.05,.6,.034), RED, (0,3.45,0), .004, nd); lathe([(0,0),(.4,0),(.4,.14),(.3,.2),(0,.2)], BLK, (0,0,-.08), nd, 96); box((.3,.05,.03), CHR, (0,0,.13), .005, nd)
    for x in (-4.35,4.35):
        for y in (-2.65,2.65): lathe([(0,.0),(.085,0),(.09,.02),(.075,.04),(0,.04)], CHR, (x,y,.25), root, 48)
    for x, s in ((-8,1),(8,1)): lathe([(1.4,0),(1.4,.25),(1.15,.35),(1.1,1.1),(1.0,1.2),(0,1.2)], BRS, (x,0,-.25), None, 160, .03, (.34,1.1))
    light((-5,5,5), (1,.94,.84), 1000, 1.4, sy=7); light((6,2,2.4), (1,.8,.5), 420, .8, sy=6); light((0,-7,3), (.5,.6,1), 200, 5); glow = light((2.6,1.2,1.6), PAL["signal"], 0, 1.4, (2.6,.8,0))
    def pose(f):
        u = f-11; a_ = 48-10*math.sin(min(f,10)*.5)*.5 if u < 0 else -47+30*math.exp(-u*.30)*math.cos(u*.95)*(-1 if u == 0 else 1)*.6; nd.rotation_euler.z = math.radians(max(-52,min(52,a_))); glow.data.energy = 70 if u >= 0 and u % 4 < 2 else 0
        k = .08*math.exp(-u*.4) if u >= 0 else 0; look((3.2-.05*f+k, -5.2+.03*f, 5.0-.02*f-k), (.75,-.05,.1+k), 47, (1.3,.6,.3), .9, -.10)
    return pose
def parts(G):
    e = _empty((0,0,.3), G[0]); _reel(e, 1.5, 1.2); box((1.3,2.2,.5), RED, (0,0,.5), .12, G[1], seg=10); lathe([(.3,0),(.3,.02),(0,.02)], WHT, (0,.1,.75), G[1], 64); box((1.2,.35,.12), RED, (0,-.85,.78), .04, G[1])
    box((1.5,.9,1.1), STEEL, (0,0,.5), .06, G[2]); lathe([(0,0),(.5,0),(.5,1.1),(0,1.1)], STEEL, (0,-.42,-.05), G[2], 96); box((.03,.05,.9), INK, (0,-.92,.5), .001, G[2])
    lathe([(0,0),(.95,0),(.95,.14),(.7,.2),(.7,1.1),(.95,1.16),(.95,1.3),(0,1.3)], BRS, (0,0,-.1), G[3], 128); lathe([(0,0),(.2,0),(.2,.3),(0,.32)], CHR, (0,0,1.2), G[3], 64)
    lathe([(0,2.0),(.10,1.9),(.16,1.75),(.11,1.6),(.2,1.55),(.2,.7),(.24,.7),(.24,.6),(.55,.6),(.55,-.6),(.35,-.9),(0,-.9)], BRS, (0,0,.2), G[4], 96)
    lathe([(1.1,0),(1.1,.2),(.95,.3),(.9,1.0),(.82,1.1),(0,1.1)], BLK, (0,0,0), G[5], 160, .03, (.3,1.0)); box((.06,.6,.04), WHT, (0,.5,1.11), .01, G[5])
    lathe([(.45,0),(1.2,0),(1.2,.07),(.55,.07),(.55,.9),(1.2,.9),(1.2,.97),(.45,.97),(.45,0)], CRM, (0,0,0), G[6], 128); lathe([(.55,.1),(1.0,.1),(1.0,.87),(.55,.87)], OXI, (0,0,0), G[6], 128)
    cv = bpy.data.curves.new("sp","CURVE"); cv.dimensions = "3D"; sp = cv.splines.new("POLY"); n = 400; sp.points.add(n-1)
    for i in range(n): t = i/n*2*math.pi*9; q = .5+.35*abs(i/n-.5)*2; sp.points[i].co = (q*math.cos(t), q*math.sin(t), i/n*2.2-.4, 1)
    cv.bevel_depth = .06; cv.bevel_resolution = 6; cv.materials.append(BRS); so = bpy.data.objects.new("sp", cv); C.objects.link(so); so.parent = G[7]
def props():
    e = _empty((-5.4,-1.75,.02)); e.scale = (.52,.52,.52); _reel(e, 2.0, 1.5, .5)
    p = _empty((4.75,1.55,.16), rot=(0,math.pi/2,.5)); p.scale = (.5,.5,.5); lathe([(0,2.0),(.10,1.9),(.16,1.75),(.11,1.6),(.2,1.55),(.2,.7),(.24,.7),(.24,.6),(.34,.6),(.34,-.9),(.2,-1.1),(0,-1.1)], BRS, (0,0,0), p, 96)
