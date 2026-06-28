import os
import shutil

dir_path = "c:/Users/nhune/.gemini/antigravity-ide/scratch/PT-WEB-VIAGO/public/asset/images/customer/fleet"

def swap_files(f1, f2):
    p1 = os.path.join(dir_path, f1)
    p2 = os.path.join(dir_path, f2)
    temp = os.path.join(dir_path, "temp_swap.png")
    
    if os.path.exists(p1) and os.path.exists(p2):
        shutil.copy2(p1, temp)
        shutil.copy2(p2, p1)
        shutil.copy2(temp, p2)
        os.remove(temp)
        print(f"Swapped {f1} and {f2}")

# Swap 22-room cabin main (interior) with its first thumbnail (exterior)
swap_files("cabin_22_1.png", "cabin_22_2.png")

# Swap 34-room sleeper main (interior) with its first thumbnail (exterior)
swap_files("sleeper_34_1.png", "sleeper_34_2.png")
