"""
Convierte icon.svg → icon.ico (256x256, 128x128, 64x64, 48x48, 32x32, 16x16)
Requiere: pip install cairosvg pillow
Ejecutar desde la carpeta electron/assets/
"""
import io, cairosvg
from PIL import Image

SVG = "icon.svg"
ICO = "icon.ico"

sizes = [256, 128, 64, 48, 32, 16]
frames = []

for s in sizes:
    png_bytes = cairosvg.svg2png(url=SVG, output_width=s, output_height=s)
    img = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
    frames.append(img)

frames[0].save(ICO, format="ICO", sizes=[(s, s) for s in sizes], append_images=frames[1:])
print(f"Generado {ICO} con tamaños: {sizes}")
