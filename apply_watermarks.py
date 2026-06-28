import os
from PIL import Image, ImageDraw

def mask_watermark(img_path, is_main):
    img = Image.open(img_path).convert("RGBA")
    width, height = img.size
    
    # Load VIAGO logo if possible
    logo_path = "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/logo_removebg.png"
    logo = None
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        
    draw = ImageDraw.Draw(img)
    
    if is_main:
        # Vexere logo is located at the bottom-left corner of the main image.
        # Let's draw a nice semi-transparent navy blue banner box over it.
        # Box coordinates: x=25, y=height-75 to x=240, y=height-25
        box_x1, box_y1 = 25, height - 75
        box_x2, box_y2 = 240, height - 25
        
        # Draw soft rounded navy background rectangle
        draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=10, fill=(18, 48, 99, 255))
        
        # Overlay VIAGO logo inside this box
        if logo:
            # Resize logo to fit inside the box
            logo_w = box_x2 - box_x1 - 20
            logo_h = int(logo.size[1] * (logo_w / logo.size[0]))
            logo_resized = logo.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
            
            # Center logo vertically in box
            paste_y = box_y1 + (box_y2 - box_y1 - logo_h) // 2
            img.paste(logo_resized, (box_x1 + 10, paste_y), logo_resized)
    else:
        # Thumbnail watermark is a tiny "vexere" text at the bottom left
        # Draw a small orange-navy pill to cover it.
        # Box coordinates: x=5, y=height-22 to x=65, y=height-4
        box_x1, box_y1 = 5, height - 22
        box_x2, box_y2 = 65, height - 4
        
        draw.rounded_rectangle([box_x1, box_y1, box_x2, box_y2], radius=4, fill=(249, 109, 0, 255))
        
        # Draw a very tiny "VIAGO" text or just cover it elegantly
        if logo:
            logo_resized = logo.resize((50, 12), Image.Resampling.LANCZOS)
            img.paste(logo_resized, (box_x1 + 5, box_y1 + 3), logo_resized)
            
    img.convert("RGB").save(img_path)

# Apply masks
dir_path = "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet"
for file in os.listdir(dir_path):
    if file.endswith(".png"):
        img_path = os.path.join(dir_path, file)
        is_main = file.endswith("_1.png")
        mask_watermark(img_path, is_main)

print("WATERMARK MASKING COMPLETE")
