"""
Final pass: extend orange hue range slightly to catch remaining orange trim.
"""
from PIL import Image
import numpy as np
import shutil, os

FLEET_DIR = "public/asset/images/customer"
ARTIFACT_DIR = "C:/Users/nhune/.gemini/antigravity-ide/brain/197d595a-4cce-49ac-9821-8b5eddcb9177"

originals = {
    "saigon_transit.png": "saigon_transit_1782632600636.png",
    "mientong_terminal.png": "mientong_terminal_1782632615698.png",
    "night_bus_highway.png": "night_bus_highway_1782633017760.png",
    "driver_workshop.png": "driver_workshop_1782633003321.png",
    "terminal_waiting.png": "terminal_waiting_1782632954069.png",
    "viago_promo_deal.png": "viago_promo_deal_1782632585205.png",
}

for dst_name, src_name in originals.items():
    src = os.path.join(ARTIFACT_DIR, src_name)
    dst = os.path.join(FLEET_DIR, dst_name)
    if os.path.exists(src):
        shutil.copy2(src, dst)

VIAGO_BLUE = np.array([58, 172, 222], dtype=np.float32)

def recolor_bus(path_in, path_out):
    img = Image.open(path_in).convert("RGB")
    data = np.array(img, dtype=np.uint8)
    R = data[:,:,0].astype(np.float32)
    G = data[:,:,1].astype(np.float32)
    B = data[:,:,2].astype(np.float32)

    maxc = np.maximum(np.maximum(R, G), B)
    minc = np.minimum(np.minimum(R, G), B)
    delta = maxc - minc

    # Hue (degrees 0-360)
    hue = np.zeros_like(R)
    eps = 1e-6
    mask_r = (maxc == R) & (delta > eps)
    mask_g = (maxc == G) & (delta > eps)
    mask_b = (maxc == B) & (delta > eps)
    hue[mask_r] = (60 * ((G[mask_r] - B[mask_r]) / (delta[mask_r] + eps))) % 360
    hue[mask_g] = 60 * ((B[mask_g] - R[mask_g]) / (delta[mask_g] + eps)) + 120
    hue[mask_b] = 60 * ((R[mask_b] - G[mask_b]) / (delta[mask_b] + eps)) + 240

    sat = np.where(maxc > eps, delta / (maxc + eps), 0)
    lit = (maxc + minc) / 2.0 / 255.0

    # Orange/amber/yellow-orange bus mask: hue 5-58, saturated, not too dark or bright
    orange_mask = (
        (hue >= 5) & (hue <= 58) &
        (sat > 0.40) &
        (lit > 0.08) & (lit < 0.92) &
        (R > 100) & (R > B + 30)     # definitely reddish, not bluish
    )

    out = data.copy()
    if orange_mask.any():
        ref_lit = 0.50
        lum_factor = np.clip(lit / (ref_lit + 1e-6), 0.35, 1.8)
        out[orange_mask, 0] = np.clip(VIAGO_BLUE[0] * lum_factor[orange_mask], 0, 255).astype(np.uint8)
        out[orange_mask, 1] = np.clip(VIAGO_BLUE[1] * lum_factor[orange_mask], 0, 255).astype(np.uint8)
        out[orange_mask, 2] = np.clip(VIAGO_BLUE[2] * lum_factor[orange_mask], 0, 255).astype(np.uint8)

    Image.fromarray(out, "RGB").save(path_out, "PNG")
    print(f"  Done: {path_out}")

for fname in originals.keys():
    path = os.path.join(FLEET_DIR, fname)
    if os.path.exists(path):
        print(f"Processing {fname}...")
        recolor_bus(path, path)

print("\nFINAL PASS COMPLETE")
