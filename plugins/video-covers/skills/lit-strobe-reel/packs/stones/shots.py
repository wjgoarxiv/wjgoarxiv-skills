BRD = grit(mat("brd", (.46,.46,.46), .5), 9, .10, .003, (.36,.56), (1,14,1)); SLATE = grit(mat("slate", (.010,.010,.010), .34), 260, .06, .001, (.28,.42)); SHELL = grit(mat("shell", (.82,.82,.82), .22, Coat_Weight=.4), 30, .03, .001, (.16,.26), (1,20,1)); DARK = grit(mat("dark", (.03,.03,.03), .45), 24, .10, .003, (.35,.5), (1,1,10)); FLOOR = grit(mat("flr", (.10,.10,.10), .7), 20, .3, .01, (.6,.85)); LINE = mat("line", (.012,.012,.012), .6)
def _empty(loc=(0,0,0), par=None, rot=(0,0,0)):
    e = bpy.data.objects.new("e", None); C.objects.link(e); e.location, e.rotation_euler, e.parent = loc, rot, par; return e
def _prof(r=.47, h=.19):
    n = 10; p = [(r*math.sin(i/n*math.pi/2), h*math.cos(i/n*math.pi/2)**1.25) for i in range(n+1)]; return p+[(a_, -b) for a_, b in reversed(p[:-1])]
_ME = {}
def _stone(black, loc, par=None, rot=(0,0,0)):
    k = "B" if black else "W"
    if k not in _ME: o = lathe(_prof(), SLATE if black else SHELL, (0,0,0), None, 64); _ME[k] = o.data; bpy.data.objects.remove(o)
    o = bpy.data.objects.new("s", _ME[k]); C.objects.link(o); o.location, o.rotation_euler, o.parent = loc, rot, par; return o
def _grid(th=1.2):
    box((19.6,19.6,th), BRD, (0,0,-th/2), .10)
    for i in range(19):
        box((.028,18.02,.006), LINE, (i-9,0,.001), .001); box((18.02,.028,.006), LINE, (0,i-9,.001), .001)
    for i in (-6,0,6):
        for j in (-6,0,6): lathe([(.10,0),(.10,.006),(0,.006)], LINE, (i,j,0), None, 48)
def _grey(*l):
    for loc, p, size, sy, tgt in l: light(loc, (1,1,1), p, size, tgt, sy)
def stone():
    _grid(); C0 = (6,6)
    for c, i, j in (("W",4,6),("B",5,4),("W",7,4),("B",3,3),("W",8,7),("B",2,7),("W",6,3),("B",7,8),("W",3,8),("B",1,5),("W",4,1),("B",8,1),("W",0,3)): _stone(c == "B", (i,j,.19))
    st = _stone(True, (*C0,.19)); ring = lathe([(.10,0),(.10,.012),(.0,.012)], RED, (0,0,0), None, 64)
    _grey(((1,11,4),900,1.4,7,(6,6,0)), ((11,3,2.0),420,.8,6,(6,6,0)), ((2,-2,4),160,5,None,(6,6,0)))
    def pose(f):
        u = f-11; z = .19+(3.4*(1-((f-3)/8)**2) if f >= 3 else 3.4) if u < 0 else .19; st.location = (*C0, z)
        if u >= 0: a_ = .30*math.exp(-u*.22)*math.cos(u*1.15); st.rotation_euler = (a_, -.6*a_, 0); st.location.z = .19+abs(a_)*.16
        else: st.rotation_euler = (.5,.25,0)
        ring.location = (*C0,.005) if u < 0 else (*C0,.375); ring.hide_render = 0 <= u < 6
        k = .05*math.exp(-u*.5) if u >= 0 else 0; look((3.7+.03*f, 2.4+.03*f, 3.6-.03*f+k), (5.9,5.7,.1-k), 50, (6,6,.3), .6, .16)
    return pose
def board():
    _grid()
    for c, i, j in CFG["shot"]["stones"]: _stone(c == "B", (i-9, 9-j, .19), rot=(0,0,random.uniform(0,6)))
    mk_ = lathe([(.12,0),(.12,.01),(0,.01)], RED, (0,0,.385), None, 64)
    _grey(((-4,14,6),2400,2,14,(0,0,0)), ((13,0,3.4),1500,1,12,(0,0,0)), ((-3,-12,6),900,8,None,(0,-2,0)))
    def pose(f):
        u = f/23; mk_.location = (0,4,.385)
        look((-6.0+7.0*u, -7.6+1.4*u, 2.4+1.6*u), (-.6+.9*u, -1.2+.9*u, .0), 42, (-.4+.4*u, -4.2+5.6*u, .2), .55, -.10+.16*u)
    return pose
def bowl():
    box((60,60,.4), FLOOR, (0,0,-.2), .02); box((11,11,1.0), BRD, (8.2,3.5,.5), .12)
    for i in range(10):
        box((.03,10.6,.006), LINE, (3.2+i,3.5,1.002), .001); box((10.6,.03,.006), LINE, (8.2,-1.2+i,1.002), .001)
    prof = [(0,.12),(1.3,.12),(1.9,.5),(2.2,1.1),(2.2,1.9),(2.02,2.25),(2.22,2.32),(2.42,2.15),(2.62,1.6),(2.6,.9),(2.2,.3),(1.5,0),(0,0)]
    B_ = lathe(prof, DARK, (0,0,0), None, 96); lid = lathe([(0,.5),(.2,.5),(.25,.38),(2.0,.3),(2.5,.1),(2.5,0),(0,0)], DARK, (-5.1,2.4,0), None, 96)
    # the fall is simulated once and replayed
    bpy.ops.rigidbody.world_add(); rw = S.rigidbody_world; rw.substeps_per_frame = 20; rw.solver_iterations = 20; S.gravity = (0,0,-55); S.frame_start = 1; S.frame_end = 140; rw.point_cache.frame_start = 1; rw.point_cache.frame_end = 140
    sim = []
    def rb(o, kind, shape):
        bpy.context.view_layer.objects.active = o
        for q in bpy.context.selected_objects: q.select_set(False)
        o.select_set(True); bpy.ops.rigidbody.object_add(type=kind); o.rigid_body.collision_shape = shape; o.rigid_body.friction = .45; o.rigid_body.restitution = .25; o.rigid_body.use_margin = True; o.rigid_body.collision_margin = .01
    rb(B_, "PASSIVE", "MESH"); fl = box((60,60,1), FLOOR, (0,0,-.5), .01); fl.hide_render = True; rb(fl, "PASSIVE", "BOX")
    for i in range(41):
        o = _stone(True, (random.uniform(-.9,.9), random.uniform(-.9,.9), 2.6+i*.62), None, (random.uniform(0,6),random.uniform(0,6),0)); o.data = o.data.copy(); rb(o, "ACTIVE", "CONVEX_HULL"); o.rigid_body.mass = .2; sim.append(o)
    path = []
    for fr in range(1, 100): S.frame_set(fr); dg = bpy.context.evaluated_depsgraph_get(); path.append([o.evaluated_get(dg).matrix_world.copy() for o in sim])
    bpy.ops.rigidbody.world_remove()
    for c, x, y in (("W",-3.4,-1.6),("W",-4.2,-.8),("W",4.1,-2.6),("W",-2.9,-2.9)): _stone(c == "B", (x,y,.19))
    dot = lathe([(.14,0),(.14,.02),(0,.02)], RED, (-3.4,-1.6,.375), None, 64)
    _grey(((-5,6,7),1300,1.8,8,(0,0,1)), ((7,-3,4),700,1,7,(0,0,1)), ((0,-8,4),200,6,None,(0,0,1)))
    def pose(f):
        for o, m in zip(sim, path[min(len(path)-1, 2+f*3)]): o.matrix_world = m
        look((-2.6+.04*f, -6.2+.03*f, 6.6-.05*f), (.1,.15,1.45), 40, (0,-.6,2.0), .9, -.10+.006*f)
    return pose
def parts(G):
    def disc_(par, m, s=2.2): o = _stone(m, (0,0,.45), par); o.scale = (s,s,s)
    disc_(G[0], True); disc_(G[1], False)
    prof = [(0,.12),(1.3,.12),(1.9,.5),(2.2,1.1),(2.2,1.9),(2.02,2.25),(2.22,2.32),(2.42,2.15),(2.62,1.6),(2.6,.9),(2.2,.3),(1.5,0),(0,0)]
    b = lathe(prof, DARK, (0,0,-.1), G[2], 128); b.scale = (.55,.55,.55); l = lathe([(0,.5),(.2,.5),(.25,.38),(2.0,.3),(2.5,.1),(2.5,0),(0,0)], DARK, (0,0,.2), G[3], 128); l.scale = (.55,.55,.9)
    box((2.2,2.2,.7), BRD, (0,0,.2), .06, G[4])
    for i in range(3): box((.03,1.9,.006), LINE, (-.6+i*.75,.17,.553), .001, G[4]); box((1.9,.03,.006), LINE, (.17,-.6+i*.75,.553), .001, G[4])
    box((2.4,.8,1.2), DARK, (0,0,.5), .10, G[5])
    for x in (-.6,.6): e = _empty((x,-.41,.55), G[5], (math.pi/2,0,0)); lathe([(0,.0),(.44,0),(.44,.04),(0,.04)], SHELL, (0,0,0), e, 64); box((.05,.34,.02), LINE, (0,.15,.05), .002, e); box((.28,.05,.02), LINE, (.11,0,.05), .002, e); lathe([(0,0),(.16,0),(.16,.14),(0,.14)], CHR, (x,0,1.1), G[5], 48)
    box((1.5,1.5,.5), SHELL, (0,0,.3), .12, G[6], seg=8); lathe([(.3,0),(.3,.02),(0,.02)], LINE, (0,0,.55), G[6], 64)
    for k, x in ((True,-.5),(False,.5)): o = _stone(k, (x,(.3 if k else -.3),.35+(0 if k else .18)), G[7], (0,0 if k else .28,0)); o.scale = (1.6,1.6,1.6)
def props():
    for c, x, y in ((1,-4.5,-1.9),(0,-4.05,-1.35),(1,-4.75,-1.2),(0,4.75,1.5),(1,4.55,.7),(0,5.1,2.2)): o = _stone(bool(c), (x,y,.19), None); o.scale = (.85,.85,.95)
    o = _stone(True, (-4.25,-1.65,.50), None, (.18,.1,0)); o.scale = (.85,.85,.95)
