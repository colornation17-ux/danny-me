"""Render DV favicon assets with Chubby And Groovy."""
from __future__ import annotations

import base64
import io
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FONT = ROOT / "public" / "fonts" / "chubby-and-groovy" / "Chubby And Groovy.ttf"
OUT = ROOT / "public"


def make(size: int, radius_ratio: float = 0.18) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    r = max(2, int(size * radius_ratio))
    d.rounded_rectangle((0, 0, size - 1, size - 1), radius=r, fill=(11, 18, 32, 255))
    fs = int(size * 0.58)
    font = ImageFont.truetype(str(FONT), fs)
    bbox = d.textbbox((0, 0), "DV", font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    x = (size - tw) / 2 - bbox[0]
    y = (size - th) / 2 - bbox[1] + size * 0.02
    d.text((x, y), "DV", font=font, fill=(255, 77, 26, 255))
    return img


def main() -> None:
    make(32).save(OUT / "favicon-32.png")
    make(180).save(OUT / "apple-touch-icon.png")
    make(512).save(OUT / "favicon-512.png")

    buf = io.BytesIO()
    make(128).save(buf, format="PNG")
    b64 = base64.b64encode(buf.getvalue()).decode("ascii")
    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" '
        'width="128" height="128">\n'
        f'  <image href="data:image/png;base64,{b64}" width="128" height="128"/>\n'
        "</svg>\n"
    )
    (OUT / "favicon.svg").write_text(svg, encoding="utf-8")
    print("wrote favicon assets")


if __name__ == "__main__":
    main()
