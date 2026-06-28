import os
from PIL import Image

def slice_image(img_path, output_dir, prefix):
    img = Image.open(img_path)
    width, height = img.size
    
    # 1. Main image: from top (y=0) to about 70% of the height
    # Let's crop the main image. Usually it spans the entire width, or has small borders.
    # In Vexere screenshots, the main image is bounded.
    # Let's crop main image from y=10 to y=430 (approx 420px height) and width from 80 to 710.
    # Let's crop it precisely:
    main_box = (80, 10, 715, 430)
    main_img = img.crop(main_box)
    main_img.save(os.path.join(output_dir, f"{prefix}_1.png"))
    
    # 2. Crop 5 thumbnails. They are located at the bottom.
    # Let's look at the y range: y=470 to y=610 (about 140px height).
    # The x ranges for 5 thumbnails (approx 120px wide each, with small gaps):
    # Total width is 780.
    # Gap is about 15px.
    # Let's slice the 5 thumbnails:
    # 1st thumbnail: x=40 to x=180
    # 2nd thumbnail: x=190 to x=330
    # 3rd thumbnail: x=340 to x=480
    # 4th thumbnail: x=490 to x=630
    # 5th thumbnail: x=640 to x=780 (adjust slightly)
    
    y_start = 475
    y_end = 615
    
    thumb_width = 138
    gap = 14
    start_x = 42
    
    for i in range(5):
        x1 = start_x + i * (thumb_width + gap)
        x2 = x1 + thumb_width
        # Ensure we don't go out of bounds
        x2 = min(x2, width)
        thumb = img.crop((x1, y_start, x2, y_end))
        # Let's upscale slightly or save directly
        thumb.save(os.path.join(output_dir, f"{prefix}_{i+2}.png"))

os.makedirs("c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet", exist_ok=True)

# Slice the three composite files
slice_image(
    "C:/Users/nhune/.gemini/antigravity-ide/brain/197d595a-4cce-49ac-9821-8b5eddcb9177/media__1782633587875.png",
    "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet",
    "cabin_22"
)
slice_image(
    "C:/Users/nhune/.gemini/antigravity-ide/brain/197d595a-4cce-49ac-9821-8b5eddcb9177/media__1782633660685.png",
    "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet",
    "sleeper_34"
)
slice_image(
    "C:/Users/nhune/.gemini/antigravity-ide/brain/197d595a-4cce-49ac-9821-8b5eddcb9177/media__1782633758800.png",
    "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet",
    "limo_9"
)

# Swap exterior and interior so the exterior is ALWAYS first (_1.png)
import shutil
def swap_files(f1, f2):
    p1 = "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet/" + f1
    p2 = "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet/" + f2
    temp = "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet/temp_swap.png"
    if os.path.exists(p1) and os.path.exists(p2):
        shutil.copy2(p1, temp)
        shutil.copy2(p2, p1)
        shutil.copy2(temp, p2)
        os.remove(temp)

swap_files("cabin_22_1.png", "cabin_22_2.png")
swap_files("sleeper_34_1.png", "sleeper_34_2.png")

print("SLICING AND SWAPPING COMPLETE")
