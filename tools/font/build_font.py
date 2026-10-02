# Traces the glyph rows of specimen.webp into HGNexus-Brush.ttf. Needs: fonttools potracer numpy opencv-python-headless
import sys
import numpy as np
import cv2
import potrace
from fontTools.fontBuilder import FontBuilder
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.recordingPen import RecordingPen
from fontTools.pens.areaPen import AreaPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

SRC = "specimen.webp"
OUT = "HGNexus-Brush.ttf"
UP = 8
UPM = 1000
LSB = 14
CAP_TARGET = 700

gray = cv2.imread(SRC, cv2.IMREAD_GRAYSCALE)
ink = (gray > 140).astype(np.uint8)


def region(y0, y1, x0, x1, minarea=6):
    sub = ink[y0:y1, x0:x1]
    n, lab, stats, _ = cv2.connectedComponentsWithStats(sub, connectivity=8)
    comps = []
    for i in range(1, n):
        x, y, w, h, a = stats[i]
        if a >= minarea:
            comps.append(dict(id=i, x=int(x) + x0, y=int(y) + y0, w=int(w), h=int(h)))
    comps.sort(key=lambda c: c["x"])
    return comps, (lab, x0, y0)


def is_small(c):
    return c["w"] <= 12 and c["h"] <= 12


def letter_groups(comps):
    big = [c for c in comps if not is_small(c)]
    small = [c for c in comps if is_small(c)]
    groups = [[c] for c in big]
    stem = big[8]  # the dotted "i"
    for s in small:
        if s["x"] + s["w"] >= stem["x"] - 3 and s["x"] <= stem["x"] + stem["w"] + 3:
            groups[8].append(s)
    assert len(groups) == 26, len(groups)
    return groups


def baseline_of(groups):
    return float(np.median([g[0]["y"] + g[0]["h"] for g in groups]))


# ---- potrace polarity probe -------------------------------------------------
probe = np.zeros((100, 100), bool)
probe[30:70, 30:70] = True
pl = potrace.Bitmap(probe).trace()
INVERT = len(pl) != 1
print("potrace polarity inverted:", INVERT)


def trace_group(group, reg, baseline):
    """Return a RecordingPen holding cubic contours in raw font units (y up)."""
    lab, ox, oy = reg
    mask = np.zeros(gray.shape, np.uint8)
    for c in group:
        sub = (lab == c["id"]).astype(np.uint8)
        mask[oy:oy + sub.shape[0], ox:ox + sub.shape[1]] |= sub
    mask = cv2.dilate(mask, np.ones((3, 3), np.uint8), iterations=1)
    xs0 = min(c["x"] for c in group) - 4
    ys0 = min(c["y"] for c in group) - 4
    xs1 = max(c["x"] + c["w"] for c in group) + 4
    ys1 = max(c["y"] + c["h"] for c in group) + 4
    g = (gray * mask)[ys0:ys1, xs0:xs1]
    up = cv2.resize(g, None, fx=UP, fy=UP, interpolation=cv2.INTER_CUBIC)
    up = cv2.GaussianBlur(up, (0, 0), sigmaX=UP * 0.4)
    bw = up > 128
    if INVERT:
        bw = ~bw
    plist = potrace.Bitmap(bw).trace(turdsize=150, alphamax=1.0, opticurve=True, opttolerance=0.5)

    def tx(p):
        return ((xs0 + p.x / UP) * SCALE, (baseline - (ys0 + p.y / UP)) * SCALE)

    rec = RecordingPen()
    for curve in plist:
        rec.moveTo(tx(curve.start_point))
        for seg in curve.segments:
            if seg.is_corner:
                rec.lineTo(tx(seg.c))
                rec.lineTo(tx(seg.end_point))
            else:
                rec.curveTo(tx(seg.c1), tx(seg.c2), tx(seg.end_point))
        rec.closePath()
    return rec


# ---- locate every glyph -----------------------------------------------------
up_comps, up_reg = region(321, 391, 0, 1095)
lo_comps, lo_reg = region(436, 502, 0, 1095)
nm_comps, nm_reg = region(553, 620, 0, 450)
sy_comps, sy_reg = region(553, 620, 480, 1095)

up_groups = letter_groups(up_comps)
lo_groups = letter_groups(lo_comps)
assert len(nm_comps) == 10, len(nm_comps)
assert len(sy_comps) == 35, len(sy_comps)
nm_groups = [[c] for c in nm_comps]

up_base = baseline_of(up_groups)
lo_base = baseline_of(lo_groups)
nm_base = baseline_of(nm_groups)
cap_px = float(np.median([g[0]["h"] for g in up_groups]))
SCALE = CAP_TARGET / cap_px
print(f"cap height {cap_px:.1f}px -> scale {SCALE:.2f} units/px | baselines {up_base:.0f}/{lo_base:.0f}/{nm_base:.0f}")

S = sy_comps
sym_map = {  # codepoint char -> component indices in the symbol row (sorted by x)
    "!": [0, 1], "@": [2], "#": [3], "$": [4], "%": [5, 6, 7], "^": [8], "&": [9],
    "*": [10], "(": [11], ")": [12], "-": [13], "_": [14], "=": [15, 16], "+": [17],
    "[": [18], "]": [19], "{": [20], "}": [21], ";": [22, 23], '"': [26, 27],
    "'": [28], ",": [29], ".": [30], "?": [32, 33], "/": [34],
}

glyphs = {}  # glyph name -> (recording, char)
NAMES = {
    "!": "exclam", "@": "at", "#": "numbersign", "$": "dollar", "%": "percent",
    "^": "asciicircum", "&": "ampersand", "*": "asterisk", "(": "parenleft",
    ")": "parenright", "-": "hyphen", "_": "underscore", "=": "equal", "+": "plus",
    "[": "bracketleft", "]": "bracketright", "{": "braceleft", "}": "braceright",
    ";": "semicolon", ":": "colon", '"': "quotedbl", "'": "quotesingle",
    ",": "comma", ".": "period", "?": "question", "/": "slash",
}
DIGITS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]

for i, grp in enumerate(up_groups):
    glyphs[chr(65 + i)] = (trace_group(grp, up_reg, up_base), chr(65 + i))
for i, grp in enumerate(lo_groups):
    glyphs[chr(97 + i)] = (trace_group(grp, lo_reg, lo_base), chr(97 + i))
for i, grp in enumerate(nm_groups):
    glyphs[DIGITS[i]] = (trace_group(grp, nm_reg, nm_base), str(i))
for ch, idxs in sym_map.items():
    glyphs[NAMES[ch]] = (trace_group([S[k] for k in idxs], sy_reg, nm_base), ch)

# colon: top dot of the semicolon + the period dot, centred on the same axis
top, bot = S[23], S[31]
shift_px = (top["x"] + top["w"] / 2) - (bot["x"] + bot["w"] / 2)
col_top = trace_group([top], sy_reg, nm_base)
col_bot = trace_group([bot], sy_reg, nm_base)
rec = RecordingPen()
rec.value = list(col_top.value)
t = Transform().translate(shift_px * SCALE, 0)
tp = TransformPen(rec, t)
col_bot.replay(tp)
glyphs["colon"] = (rec, ":")

# Peso sign (not in the specimen): the traced "P" with two horizontal bars through it.
p_rec = glyphs["P"][0]
_bp = BoundsPen(None); p_rec.replay(_bp)
pxmin, pymin, pxmax, pymax = _bp.bounds
_ap = AreaPen(None); p_rec.replay(_ap)
ccw = _ap.value > 0
ph = pymax - pymin
th = 0.09 * ph
peso = RecordingPen()
peso.value = list(p_rec.value)
for frac in (0.30, 0.52):
    y0 = pymin + frac * ph
    x0, x1 = pxmin - 30, pxmax + 5
    pts = [(x0, y0), (x1, y0), (x1, y0 + th), (x0, y0 + th)]
    if not ccw:
        pts = pts[::-1]
    peso.moveTo(pts[0])
    for pt in pts[1:]:
        peso.lineTo(pt)
    peso.closePath()
glyphs["uni20B1"] = (peso, "₱")

# Spacing. Italic glyphs lean, so bbox width over-states how much room they need, and
# the specimen's alphabet-order pitch bakes in that row's irregular gaps. Instead measure
# each glyph's width with the slant removed, then add one uniform tracking value.
def estimate_slant():
    ys, xs = np.nonzero(ink[321:391, :1095])
    ys = ys + 321
    best = (-1.0, 0.0)
    for k in np.arange(0.0, 0.61, 0.02):
        xp = xs - k * (up_base - ys)
        # fine bins, smoothed over ~2px: integer rounding must not be able to create a peak
        h, _ = np.histogram(xp, bins=np.arange(xp.min(), xp.max() + 0.25, 0.25))
        h = cv2.GaussianBlur(h.astype(np.float32).reshape(1, -1), (0, 0), sigmaX=8).ravel()
        score = float((h ** 2).sum() / (h.sum() ** 2))
        if score > best[0]:
            best = (score, float(k))
    return best[1]


K = estimate_slant()
print(f"slant k={K:.3f} ({np.degrees(np.arctan(K)):.1f} deg)")

EXT = {}  # glyph name -> (left edge, width) in specimen px, slant removed


def measure(groups, reg, baseline, names):
    lab, ox, oy = reg
    for g, n in zip(groups, names):
        lo = hi = None
        for c in g:
            ys, xs = np.nonzero(lab == c["id"])
            xp = (xs + ox) - K * (baseline - (ys + oy))
            lo = xp.min() if lo is None else min(lo, xp.min())
            hi = xp.max() + 1 if hi is None else max(hi, xp.max() + 1)
        EXT[n] = (float(lo), float(hi - lo))


UP_NAMES = [chr(65 + i) for i in range(26)]
LO_NAMES = [chr(97 + i) for i in range(26)]
measure(up_groups, up_reg, up_base, UP_NAMES)
measure(lo_groups, lo_reg, lo_base, LO_NAMES)
measure(nm_groups, nm_reg, nm_base, DIGITS)

# Calibrate tracking so the average advance matches the specimen's average letter pitch.
_lefts = [min(c["x"] for c in g) for g in up_groups]
TRACK_PX = max(float(np.mean(np.diff(_lefts)) - np.mean([EXT[n][1] for n in UP_NAMES[:-1]])), 4.0)
print(f"tracking {TRACK_PX:.1f}px = {TRACK_PX * SCALE:.0f} units")

# ---- assemble the font ------------------------------------------------------
glyf, metrics, cmap = {}, {}, {}
y_max, y_min = 0, 0

notdef = TTGlyphPen(None)
notdef.moveTo((60, 0)); notdef.lineTo((60, 700)); notdef.lineTo((460, 700)); notdef.lineTo((460, 0)); notdef.closePath()
notdef.moveTo((120, 60)); notdef.lineTo((400, 60)); notdef.lineTo((400, 640)); notdef.lineTo((120, 640)); notdef.closePath()
glyf[".notdef"] = notdef.glyph()
metrics[".notdef"] = (520, 60)

space = TTGlyphPen(None)
glyf["space"] = space.glyph()
metrics["space"] = (400, 0)
cmap[32] = "space"

for name, (rec, ch) in glyphs.items():
    bp = BoundsPen(None)
    rec.replay(bp)
    if bp.bounds is None:
        print("EMPTY glyph", name)
        continue
    xmin, ymin, xmax, ymax = bp.bounds
    ap = AreaPen(None)
    rec.replay(ap)
    reverse = ap.value > 0  # TrueType outer contours run clockwise (negative area)

    if name in EXT:
        left_p, width_p = EXT[name]
        dx = (TRACK_PX / 2 - left_p) * SCALE
        lsb = int(round(xmin + dx))
        adv = int(round((width_p + TRACK_PX) * SCALE))
    else:
        dx, lsb, adv = 30 - xmin, 30, int(round(xmax - xmin + 60))
    pen = TTGlyphPen(None)
    cu = Cu2QuPen(pen, max_err=1.5, reverse_direction=reverse)
    rec.replay(TransformPen(cu, Transform().translate(dx, 0)))
    glyf[name] = pen.glyph()
    metrics[name] = (adv, lsb)
    cmap[ord(ch)] = name
    y_max, y_min = max(y_max, ymax), min(y_min, ymin)

order = [".notdef", "space"] + [n for n in glyf if n not in (".notdef", "space")]
fb = FontBuilder(UPM, isTTF=True)
fb.setupGlyphOrder(order)
fb.setupCharacterMap(cmap)
fb.setupGlyf(glyf)
fb.setupHorizontalMetrics({n: metrics[n] for n in order})
asc, desc = 900, -300
fb.setupHorizontalHeader(ascent=asc, descent=desc)
fb.setupNameTable({
    "familyName": "HG Nexus Brush",
    "styleName": "Regular",
    "uniqueFontIdentifier": "HGNexusBrush-Regular-0.1",
    "fullName": "HG Nexus Brush Regular",
    "psName": "HGNexusBrush-Regular",
    "version": "Version 0.1",
})
fb.setupOS2(
    sTypoAscender=asc, sTypoDescender=desc, sTypoLineGap=0,
    usWinAscent=int(max(asc, y_max)) + 20, usWinDescent=int(max(-desc, -y_min)) + 20,
    sCapHeight=CAP_TARGET, sxHeight=500, achVendID="HGNX",
)
fb.setupPost()
fb.save(OUT)
print(f"saved {OUT}: {len(order)} glyphs, yMax {y_max:.0f}, yMin {y_min:.0f}")
