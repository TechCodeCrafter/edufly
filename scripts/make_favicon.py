from PIL import Image
import numpy as np

SRC = "/home/user/workspace/uploaded_attachments/0e4243e57b87459f821fcc1935de8989/Screenshot-2026-06-25-at-10.36.45-PM.jpg"
OUT_DIR = "/home/user/workspace/tekops/public"

img = Image.open(SRC).convert("RGBA")
arr = np.array(img).astype(np.int16)
r, g, b, a = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]

# White-ish background -> transparent.
# Treat pixels that are near-white (all channels high, low saturation) as background.
mx = np.maximum(np.maximum(r, g), b)
mn = np.minimum(np.minimum(r, g), b)
sat = mx - mn
is_white = (mn >= 235) & (sat <= 18)

alpha = a.copy()
alpha[is_white] = 0

# Soft edge: for near-white but not pure (anti-aliased fringe), scale alpha down.
fringe = (~is_white) & (mn >= 215) & (sat <= 30)
alpha[fringe] = (alpha[fringe] * 0.5).astype(np.int16)

arr[..., 3] = alpha
out = arr.astype(np.uint8)
res = Image.fromarray(out, "RGBA")

# Remove the leftover 'F' sliver from the original wordmark on the far right.
# The icon ends ~x=592; the stray letter begins ~x=596. Hard-cut at 594.
RIGHT_CUT = 594
alpha[:, RIGHT_CUT:] = 0
arr[..., 3] = alpha
out = arr.astype(np.uint8)
res = Image.fromarray(out, "RGBA")
print("trimmed trailing letter at column", RIGHT_CUT)

# Auto-crop to non-transparent bbox
mask = Image.fromarray((alpha > 8).astype(np.uint8) * 255)
bbox = mask.getbbox()
print("bbox:", bbox)
res = res.crop(bbox)
print("cropped size:", res.size)

# Pad to square, centered, with a little margin
w, h = res.size
side = int(max(w, h) * 1.10)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.paste(res, ((side - w) // 2, (side - h) // 2), res)

# Master transparent PNG (high res for nav use)
master = canvas.resize((512, 512), Image.LANCZOS)
master.save(f"{OUT_DIR}/edufly-mark.png")
print("saved edufly-mark.png", master.size)

# Favicon sizes
for s in (16, 32, 48, 180, 192, 512):
    canvas.resize((s, s), Image.LANCZOS).save(f"{OUT_DIR}/favicon-{s}.png")
    print("saved", f"favicon-{s}.png")

# Multi-size .ico
ico = canvas.resize((256, 256), Image.LANCZOS)
ico.save(f"{OUT_DIR}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("saved favicon.ico")
