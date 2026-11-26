NAVY = grit(mat("navy", (.012,.018,.035), .42), 420, .04, .001, (.34,.48)); RUB = grit(mat("rub", (.022,.026,.034), .62), 260, .10, .002, (.55,.72)); CYM = grit(mat("cym", (.74,.55,.25), .26, Metallic=1.0), 8, .03, .001, (.23,.30), (1,1,60)); PAP = grit(mat("pap2", (.030,.034,.044), .75), 60, .25, .004, (.65,.85)); WOD = grit(mat("wod", (.58,.40,.22), .45), 16, .12, .002, (.38,.52), (1,1,.06)); DST = mat("dst", (.75,.82,.9), .6)
def _empty(loc=(0,0,0), par=None, rot=(0,0,0)):
    e = bpy.data.objects.new("e", None); C.objects.link(e); e.location, e.rotation_euler, e.parent = loc, rot, par; return e
def _stick(par, L=4.6):
    lathe([(0,0),(.10,.02),(.12,.12),(.12,L*.62),(.06,L*.93),(.055,L*.95),(.085,L*.97),(.09,L*.985),(.05,L),(0,L+.01)], WOD, (0,0,0), par, 64)
def pad():
    box((30,20,.4), NAVY, (0,0,-.25), .05); box((9.6,9.6,.3), BLK, (0,0,-.05), .25); P = CFG["shot"]["steps"]; who = {0:(0,0),1:(1,1),2:(2,2)}; pads = []
    for j in range(4):
        for i in range(4):
            m = RUB.copy(); box((2.0,2.0,.42), m, ((i-1.5)*2.28,(1.5-j)*2.28,.16), .22, seg=10); g = light(((i-1.5)*2.28,(1.5-j)*2.28,1.3), PAL["accent"], 0, 1.4, ((i-1.5)*2.28,(1.5-j)*2.28,0)); pads.append((m,g))
            lathe([(.05,0),(.05,.006),(0,.006)], WHT, ((i-1.5)*2.28-.82,(1.5-j)*2.28+.82,.37), None, 24)
    col = [PAL["flood"], (1,1,1), PAL["accent"]]
    for k, w in enumerate((W1,W2,W3)): text(w, .86, WHT, (5.35,3.4-k*1.15,-.04), al="LEFT", mw=3.4)
    for k in range(4): lathe([(.62,0),(.62,.1),(.52,.16),(.5,.7),(.44,.76),(0,.76)], ALU, (6.2+(k%2)*1.9,-1.6-(k//2)*1.9,-.05), None, 96, .02, (.16,.7)); box((.06,.3,.03), RED, (6.2+(k%2)*1.9,-1.3-(k//2)*1.9,.72), .01)
    light((-6,6,9), (.75,.85,1), 900, 4); light((7,-6,6), (.5,.65,1), 400, 3, sy=6)
    def pose(f):
        for m, g in pads: m.node_tree.nodes["Principled BSDF"].inputs["Emission Strength"].default_value = 0; g.data.energy = 0
        s, r = divmod(f, 3)
        for j in range(3):
            for back in range(2):
                q = s-back
                if q < 0 or not P[j][q]: continue
                k = math.exp(-(back*3+r)*.75)
                idx = {0:[12,13,8],1:[6,7,2],2:[4+(q%4)*0,0,1]}[j] if j < 2 else [(q*5) % 4+4*((q//2) % 2)]
                for t in idx:
                    m, g = pads[t]; b = m.node_tree.nodes["Principled BSDF"]; b.inputs["Emission Color"].default_value = (*col[j],1); b.inputs["Emission Strength"].default_value = 2.4*k; g.data.color = col[j]; g.data.energy = 130*k
        hit = any(P[j][s] for j in range(3)) and r == 0
        look((1.5+.015*f, -2.4+.02*f, 14.6-.06*f-(.18 if hit else 0)), (1.5, .15, 0), 46, (1.5,-.2,.2), 4, .05-.003*f)
    return pose
def cone():
    box((40,40,.4), NAVY, (0,0,-2.6), .05); lathe([(4.6,-2.4),(4.6,.0),(4.5,.12),(3.95,.14),(3.9,.02),(3.9,-2.4)], STEEL, (0,0,0), None, 160)
    for i in range(8): t = 2*math.pi*i/8+.2; screw(4.25*math.cos(t), 4.25*math.sin(t), .12)
    sur = lathe([(3.92,.06),(3.8,.28),(3.6,.36),(3.4,.28),(3.28,.06)], RUB, (0,0,0), None, 160); mv = _empty()
    pr = [(3.32,.02)]
    for i in range(1,40): q = i/40; pr.append((3.3-2.15*q, .02-1.25*q**.8+(.012 if i % 4 == 0 else 0)))
    lathe(pr, PAP, (0,0,0), mv, 160); lathe([(1.2,-1.22),(1.12,-1.06),(.9,-.95),(.5,-.90),(0,-.89)], mat("cap2",(.02,.022,.03),.25,Coat_Weight=.6), (0,0,0), mv, 128); text(W2, .62, WHT, (0,0,-.87), par=mv, mw=1.6)
    lathe([(.16,0),(.16,.015),(0,.015)], RED, (2.55,-.55,-.40), mv, 48)
    rg = random.Random(7); D = []
    for i in range(420):
        r, t = 3.1*math.sqrt(rg.random()), rg.uniform(0,6.283); z0 = -1.15*((3.3-r)/2.15)**.8 if r > 1.25 else -9; s = rg.uniform(.012,.05); o = box((s,s,s), DST, (0,0,0), .001, seg=1); o.modifiers.clear(); D.append((o, r*math.cos(t), r*math.sin(t), z0+.02, rg.uniform(.10,.62), rg.uniform(-.05,.05), rg.uniform(-.05,.05)))
    light((-5,4,4), (.85,.92,1), 1200, 1.2, sy=7); light((6,-2,2.6), PAL["accent"], 420, 1, sy=6); light((0,-7,3), (.4,.5,1), 220, 4); light((0,6,1.6), (1,1,1), 420, .6, sy=8)
    def pose(f):
        u = f-11; z = (-.10*(f/11)**2 if u < 0 else .34*math.exp(-u*.30)*math.cos(u*1.35)); mv.location.z = z; sur.scale = (1,1,1+z*.9)
        for o, x, y, z0, v, dx, dy in D:
            if u < 0: o.location = (x, y, z0+z)
            else: k = u+.5; o.location = (x+dx*k+x*.012*k, y+dy*k+y*.012*k, max(z0+z*.3 if u > 6 else z0, z0+.25+v*k*1.15-.033*k*k))
        k = .07*math.exp(-u*.5) if u >= 0 else 0; look((2.2-.03*f+k, -6.6+.05*f, 4.6-.04*f-k), (.15,-.15,.15+k), 46, (0,-.6,-.1), 1.0, .08)
    return pose
def cymbal():
    box((60,60,.4), NAVY, (0,0,-5.2), .05)
    prof = [(.16,.62),(.5,.60),(.85,.40),(1.05,.30)]+[(1.05+3.4*i/40, .30-.30*(i/40)**1.4+(.012 if i % 3 == 0 else 0)) for i in range(1,41)]
    top, bot = _empty(), _empty(); lathe(prof+[(4.45,-.02)], CYM, (0,0,0), top, 200); b = lathe([(r,-z) for r,z in prof]+[(4.45,.02)], CYM, (0,0,0), bot, 200)
    lathe([(.09,-6),(.09,3.6),(.0,3.62)], CHR, (0,0,0), None, 64); cl = _empty(par=top); lathe([(.0,.62),(.34,.62),(.36,.78),(.22,.86),(.22,1.3),(0,1.3)], BLK, (0,0,0), cl, 96); box((.5,.12,.12), CHR, (.36,0,1.08), .02, cl); lathe([(.3,.60),(.3,.68),(0,.68)], RED, (0,0,0), top, 64); lathe([(.2,-6),(.2,-.75),(.5,-.7),(.5,-.6),(0,-.6)], STEEL, (0,0,0), None, 64)
    text(W3, 1.05, INK, (0,-2.75,.225), (.0925,0,0), top, mw=2.6)
    light((-6,3,4.5), (1,.95,.86), 1400, 1.0, sy=8); light((6,-1,1.2), PAL["accent"], 700, .8, sy=7); light((0,-8,2.5), (.5,.65,1), 260, 4); light((1,7,3), (1,.9,.7), 500, 1, sy=6)
    def pose(f):
        u = f-11; gap = 1.05-.25*math.sin(f*.5) if f < 6 else 1.05*(1-((f-6)/5)**2) if u < 0 else .08+.10*math.exp(-u*.3)*abs(math.cos(u*1.8)); a_ = .05*math.sin(f*.9) if u < 0 else .06*math.exp(-u*.25)*math.cos(u*2.1)
        top.location.z = .18+max(0,gap); bot.location.z = -.18; top.rotation_euler = (a_, .6*a_, .16-.008*f); bot.rotation_euler = (-.3*a_, 0, 0)
        k = .06*math.exp(-u*.5) if u >= 0 else 0; look((2.6-.04*f+k, -7.4+.05*f, 3.0-.03*f-k), (.1,-.2,.25+k), 44, (.2,-2.6,.5), .9, .10)
    return pose
def parts(G):
    box((2.0,2.0,.5), RUB, (0,0,.3), .22, G[0], seg=10); lathe([(.22,0),(.22,.02),(0,.02)], WHT, (-.6,.6,.55), G[0], 64)
    lathe([(1.5,.5),(1.4,.62),(1.25,.55),(.5,-.1),(.45,.1),(0,.22)], PAP, (0,0,.3), G[1], 128); lathe([(1.5,.5),(1.62,.5),(1.62,.35),(.9,-.5),(.5,-.6),(.5,-.95),(0,-.95)], STEEL, (0,0,.3), G[1], 128)
    prof = [(.1,.40),(.28,.38),(.45,.22)]+[(.45+1.15*i/24, .22-.22*(i/24)**1.4) for i in range(1,25)]
    lathe(prof, CYM, (0,0,.65), G[2], 160); lathe([(r,-z) for r,z in prof], CYM, (0,0,.45), G[2], 160); lathe([(.06,-.9),(.06,1.6),(0,1.6)], CHR, (0,0,.3), G[2], 48)
    e = _empty((-1.5,.2,.2), G[3], (0,1.15,.2)); _stick(e, 3.6)
    lathe([(0,.0),(.62,.0),(.7,.25),(.7,.75),(.55,.95),(0,.95)], WHT, (0,0,.9), G[4], 96); box((.14,.14,1.9), CHR, (0,0,-.1), .03, G[4])
    box((.7,2.4,.14), BLK, (0,0,.1), .04, G[5]); box((.08,2.1,.04), INK, (0,0,.18), .005, G[5]); box((.6,.5,.45), WHT, (0,.3,.36), .06, G[5]); box((.6,.04,.02), RED, (0,.3,.59), .002, G[5])
    lathe([(0,2.0),(.10,1.9),(.16,1.75),(.11,1.6),(.2,1.55),(.2,.7),(.24,.7),(.24,.6),(.5,.6),(.5,-.6),(.35,-.9),(0,-.9)], STEEL, (0,0,.2), G[6], 96)
    lathe([(.3,0),(1.0,0),(1.0,.5),(.9,.62),(.4,.62),(.3,.5),(.3,0)], STEEL, (0,0,.1), G[7], 128)
def props():
    e = _empty((-5.0,-2.3,.13), None, (math.pi/2,0,-.9)); e.scale = (1.0,1.0,.8); _stick(e, 3.2); e = _empty((-5.4,-1.7,.13), None, (math.pi/2,0,-.55)); e.scale = (1.0,1.0,.8); _stick(e, 3.2)
    h = _empty((4.8,1.5,.05)); h.scale = (.5,.5,.5); prof = [(.1,.40),(.28,.38),(.45,.22)]+[(.45+1.15*i/24, .22-.22*(i/24)**1.4) for i in range(1,25)]; lathe(prof, CYM, (0,0,0), h, 160)
