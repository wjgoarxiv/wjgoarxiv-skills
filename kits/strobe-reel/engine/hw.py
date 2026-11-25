import bpy, bmesh, json, math, random, sys
from mathutils import Vector, Matrix
a = sys.argv[sys.argv.index("--")+1:]; SHOT, OUT, PCT, SPP, FRAMES, FONT, CFG = a[0], a[1], int(a[2]), int(a[3]), a[4], a[5], json.load(open(a[6]))
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
NF = {"print":36,"index":8}.get(SHOT,24)
def ez(t): return 1-2**(-10*max(0,min(1,t)))
if SHOT == "key":
    box((14,18,.3), ALU, (0,0,-.15), .04); box((2.5,2.5,.06), BLK, (0,0,0), .06); key = bpy.data.objects.new("k", None); C.objects.link(key)
    box((2.2,2.2,.7), WHT, (0,0,.42), .16, key, taper=.86, seg=10); text(W1, .86, INK, (0,.02,.775), par=key, mw=1.5); text("01", .15, INK, (-.68,.66,.775), par=key); ring = lathe([(.1,.772),(.1,.778),(0,.778)], RED, (.66,.66,0), key)
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
elif SHOT == "dial":
    box((40,40,.3), CONC, (0,0,-.15), .04); lathe([(2.35,.0),(2.35,.05),(2.15,.07),(1.65,.07),(1.65,0)], BLK); knob = bpy.data.objects.new("k", None); C.objects.link(knob)
    lathe([(1.5,0),(1.5,.28),(1.36,.36),(1.36,1.02),(1.28,1.12),(.98,1.12),(.93,1.08),(0,1.06)], ALU, (0,0,0), knob, 256, .035, (.35,1.04)); box((.07,.62,.03), RED, (0,1.0,1.12), .01, knob); lathe([(.12,1.06),(.12,1.10),(0,1.11)], CHR, (0,0,0), knob)
    for i in range(61):
        t = math.radians(150-5*i); r = 2.0; big = i % 10 == 0; box((.035 if big else .016, .24 if big else .13, .006), WHT, (r*math.cos(t), r*math.sin(t), .075), .001, rot=(0,0,t-math.pi/2))
    for s, d in ((W1,146),(W2,90),(W3,34)):
        t = math.radians(d); text(s, .95 if d == 90 else .5, INK, (3.15*math.cos(t), 3.0*math.sin(t)+(.25 if d == 90 else 0), .008), mw=3.2 if d == 90 else 1.5)
    for x, y, s in ((-1.9,-2.8,"CIRCLE"),(0,-2.8,"SQUARE"),(1.9,-2.8,"TRIANGLE")):
        lathe([(.34,0),(.34,.1),(.28,.16),(0,.16)], {"CIRCLE":RED,"SQUARE":BLK,"TRIANGLE":BLU}[s], (x,y,0)); text(s, .15, INK, (x,y-.58,.006))
    for x in (-3.4,3.4):
        for y in (-4,4.3): screw(x,y)
    light((-5,4,5), (.82,.9,1), 1000, 1.6, sy=7); light((5,3,2.2), (1,.97,.92), 520, .7, sy=6); light((0,-6,3), (.4,.5,1), 200, 4)
    def pose(f):
        u = f-11; an = 56*(1-ez((f-3)/7)) if f < 11 else 0
        if f < 3: an = 56
        if u >= 0: an = -3*math.exp(-u*.9)*math.cos(u*2.2)
        knob.rotation_euler.z = math.radians(an); look((-1.2+.03*f,-4.4+.02*f,6.4), (-1.55,.75,.3), 56, (0,1.5,.95), .7, -.07)
elif SHOT == "cols":
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
elif SHOT == "print":
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
    k = bpy.data.objects.new("k", None); C.objects.link(k); k.location = (-4.5,-1.9,0); k.scale = (.5,.5,.5); k.rotation_euler = (0,0,.3); box((2.2,2.2,.7), WHT, (0,0,.35), .16, k, taper=.86, seg=10); text(W1, .86, INK, (0,.02,.705), par=k, mw=1.5)
    kn = bpy.data.objects.new("k", None); C.objects.link(kn); kn.location = (4.75,1.6,0); kn.scale = (.55,.55,.55); lathe([(1.5,0),(1.5,.28),(1.36,.36),(1.36,1.02),(1.28,1.12),(.98,1.12),(.93,1.08),(0,1.06)], ALU, (0,0,0), kn, 256, .035, (.35,1.04)); box((.07,.62,.03), RED, (0,1.0,1.12), .01, kn)
    for x, y in ((4.5,-1.4),(4.8,-1.75),(-4.6,1.2)): screw(x,y)
    light((-7,3,3.0), (1,.98,.95), 900, 1.2, sy=6); light((6,6,6), (.75,.86,1), 420, 4); light((0,-8,4), (.5,.6,1), 160, 5)
    def pose(f):
        u = f/35; e = u*u*(3-2*u); fc = min(1,max(0,(f-4)/10)); fc = fc*fc*(3-2*fc)
        look((-3.4+3.2*e, -6.2+.6*e, 3.6+4.2*e), (-1.5+1.6*e, -.5+.55*e, 0), 52-3*e, (-4.5+4.3*fc, -1.9+1.7*fc, .35*(1-fc)+.1), .7+.5*fc, .05*(1-e))
elif SHOT == "index":
    G = [bpy.data.objects.new("g%d" % i, None) for i in range(8)]
    for g in G: C.objects.link(g)
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
    light((-4,-3,6), (1,1,1), 600, 3); light((5,-2,4), (1,1,1), 350, 2, sy=5); light((0,6,5), (.9,.95,1), 500, 3)
    def vis(o, v):
        o.hide_render = not v
        for c in o.children: vis(c, v)
    def pose(f):
        for i, g in enumerate(G): vis(g, i == f); g.rotation_euler = (0,0,-.5)
        S.render.film_transparent = True; S.render.image_settings.file_format = "PNG"; S.render.image_settings.color_mode = "RGBA"; S.render.resolution_x = S.render.resolution_y = 520
        look((0,-7.2,5.2), (0,0,.45), 58, (0,0,.5), 11)
else:
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
    text("03  "+W3, .34, INK, (-1.0,-.108,.95), (math.pi/2,0,0), bl); bl.rotation_euler.z = th
    light((-4,-2,6), (.85,.92,1), 900, 2, sy=8); light((5,4,3), (1,1,1), 600, .8, sy=7); light((-6,5,1.5), (.25,.35,1), 500, 2); light((2,-7,2.5), (.9,.95,1), 260, 3)
    def pose(f):
        u = f-11; z = 3.6 if f < 7 else 3.6*(1-((f-7)/4)**2) if f < 11 else 0
        if u >= 2: z = (u-2)**2*.16
        bl.location = (0,0,z-.03); sep = 0 if u < 0 else .55*ez(u/6); nx = Vector((math.sin(th), -math.cos(th), 0)); tx = Vector((math.cos(th), math.sin(th), 0))
        halves[0].location = nx*sep*.55 - tx*sep*.35; halves[1].location = -nx*sep*.55 + tx*sep*.35
        for h, k in zip(halves,(1,-1)): h.rotation_euler = (0,0,-k*.06*sep/.55) if u >= 0 else (0,0,0)
        k = .07*math.exp(-u*.5) if u >= 0 else 0; look((1.2+.03*f,-5.0+k,6.2-.03*f), (.35,.15,.1+k), 47, (0,-.2,.05), .9, .12)
w = bpy.data.worlds.new("w"); S.world = w; w.use_nodes = True; w.node_tree.nodes["Background"].inputs[0].default_value = (.12,.14,.17,1); w.node_tree.nodes["Background"].inputs[1].default_value = .35
S.render.engine = "CYCLES"; pr = bpy.context.preferences.addons["cycles"].preferences; pr.compute_device_type = "METAL"; pr.get_devices()
for d in pr.devices: d.use = d.type == "METAL"
S.cycles.device = "GPU"; S.cycles.samples = SPP; S.cycles.use_denoising = True; S.cycles.denoiser = "OPENIMAGEDENOISE"; S.cycles.sample_clamp_indirect = 8
S.render.resolution_x, S.render.resolution_y, S.render.resolution_percentage = 1280, 720, PCT; S.view_settings.view_transform = "AgX"; S.view_settings.look = "AgX - High Contrast"; S.render.image_settings.file_format = "JPEG"; S.render.image_settings.quality = 95
S.render.use_persistent_data = True
for f in ([int(q) for q in FRAMES.split(",")] if FRAMES != "all" else range(NF)):
    pose(f); S.render.filepath = f"{OUT}-{f:02d}." + ("png" if SHOT == "index" else "jpg"); bpy.ops.render.render(write_still=True)
