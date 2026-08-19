#!/usr/bin/env python3
"""
Aetheris brand asset generator.

Renders the Aetheris mark (hexagonal node + letterform A), wordmark logo,
app icon, OpenGraph image and a multi-size Windows ICO from vector design
primitives. Outputs are anti-aliased (4x supersampling) PNG files plus a
single .ico containing 16/24/32/48/64/128/256 px entries.

Requirements: Pillow (pip install pillow)

Usage:
    python assets/generate_assets.py [output-dir]
"""

from __future__ import annotations

import math
import os
import sys
from dataclasses import dataclass
from typing import Iterable, Sequence, Tuple

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# --------------------------------------------------------------------------- #
# Palette (matches assets/*.svg)
# --------------------------------------------------------------------------- #

EMERALD = (16, 185, 129)
EMERALD_LIGHT = (52, 217, 153)
EMERALD_DARK = (5, 150, 105)
FG = (250, 250, 250)
MUTED = (161, 161, 170)
FAINT = (113, 113, 122)
BG = (9, 9, 11)
SURFACE = (24, 24, 27)
EDGE = (39, 39, 42)

SS = 4  # supersampling factor


# --------------------------------------------------------------------------- #
# Helpers
# --------------------------------------------------------------------------- #

def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def lerp_color(c1: Tuple[int, int, int], c2: Tuple[int, int, int], t: float) -> Tuple[int, int, int]:
    return (
        round(lerp(c1[0], c2[0], t)),
        round(lerp(c1[1], c2[1], t)),
        round(lerp(c1[2], c2[2], t)),
    )


def diagonal_gradient(size: Tuple[int, int], c1: Tuple[int, int, int], c2: Tuple[int, int, int]) -> Image.Image:
    """Diagonal linear gradient rendered on a small canvas, resized smoothly."""
    w, h = size
    small_w, small_h = 64, 64
    grad = Image.new("RGB", (small_w, small_h))
    px = grad.load()
    span = small_w + small_h
    for y in range(small_h):
        for x in range(small_w):
            px[x, y] = lerp_color(c1, c2, (x + y) / span)
    return grad.resize((w, h), Image.LANCZOS)


def find_font(candidates: Sequence[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if path and os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except OSError:
                continue
    # Last resort: Pillow bundled font (no bold weight, small sizes only).
    return ImageFont.load_default(size=size)


def tracked(draw: ImageDraw.ImageDraw, xy: Tuple[float, float], text: str, font, fill, tracking: float) -> float:
    """Draw text with manual letter-spacing; returns the final cursor x."""
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=font, fill=fill)
        x += draw.textlength(ch, font=font) + tracking
    return x


def hexagon_points(cx: float, cy: float, radius: float) -> list[Tuple[float, float]]:
    """Pointy-top hexagon vertices centered at (cx, cy)."""
    points = []
    for i in range(6):
        angle = math.pi / 2 + i * math.pi / 3
        points.append((cx + radius * math.cos(angle), cy + radius * math.sin(angle)))
    return points


# --------------------------------------------------------------------------- #
# The Aetheris mark (hexagonal node + letterform A)
# --------------------------------------------------------------------------- #

def draw_mark(size: int, glow: bool = True) -> Image.Image:
    """
    Renders the Aetheris icon: gradient hexagon outline, translucent inner
    hexagon, letterform A and six node dots. Transparent background.
    """
    S = SS
    canvas = Image.new("RGBA", (size * S, size * S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    cx = cy = size * S / 2
    outer_r = size * S * 0.48
    inner_r = outer_r * 0.72
    dot_r = outer_r * 0.09

    grad = diagonal_gradient(canvas.size, EMERALD_LIGHT, EMERALD_DARK)

    def stroke_hex(radius: float, color, width: float, steps: int = 36) -> None:
        prev = hexagon_points(cx, cy, radius)
        for i in range(1, steps + 1):
            r = lerp(radius, radius + width, i / steps)
            pts = hexagon_points(cx, cy, r)
            draw.line([*prev, prev[0]], fill=color, width=max(1, round(S * width / steps)))
            prev = pts

    # Glow behind the hexagon ring.
    if glow:
        glow_layer = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
        gd = ImageDraw.Draw(glow_layer)
        gd.polygon(hexagon_points(cx, cy, outer_r * 1.12), fill=(16, 185, 129, 110))
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(size * S * 0.06))
        canvas.alpha_composite(glow_layer)

    # Gradient ring: slice the gradient into bands around the hexagon.
    band_count = 40
    for i in range(band_count):
        t = i / (band_count - 1)
        color = lerp_color(EMERALD_LIGHT, EMERALD_DARK, t) + (255,)
        r0 = outer_r * (1 - 0.015 * i / band_count) - outer_r * 0.012
        r1 = outer_r + outer_r * 0.012
        for band_i in range(6):
            a0 = hexagon_points(cx, cy, r0)[band_i]
            a1 = hexagon_points(cx, cy, r0)[(band_i + 1) % 6]
            b0 = hexagon_points(cx, cy, r1)[band_i]
            b1 = hexagon_points(cx, cy, r1)[(band_i + 1) % 6]
            draw.polygon([a0, a1, b1, b0], fill=color)

    # Inner hexagon (translucent gradient fill).
    inner_mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(inner_mask).polygon(hexagon_points(cx, cy, inner_r), fill=255)
    inner_fill = Image.composite(grad, Image.new("RGB", canvas.size, (0, 0, 0)), inner_mask)
    inner_fill.putalpha(Image.eval(inner_mask, lambda v: round(v * 0.16)))
    canvas.alpha_composite(inner_fill)

    # Letterform A (solid, with a subtle two-tone vertical gradient).
    top = cy - inner_r * 0.78
    bottom = cy + inner_r * 0.92
    half_w = inner_r * 0.55
    a_grad = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    ag = ImageDraw.Draw(a_grad)
    pts = [
        (cx, top),
        (cx + half_w * 0.72, bottom),
        (cx + half_w * 0.28, bottom),
        (cx + half_w * 0.16, bottom - inner_r * 0.30),
        (cx - half_w * 0.16, bottom - inner_r * 0.30),
        (cx - half_w * 0.28, bottom),
        (cx - half_w * 0.72, bottom),
    ]
    a_span = bottom - top
    for i in range(60):
        t0, t1 = i / 60, (i + 1) / 60
        y0, y1 = top + a_span * t0, top + a_span * t1
        color = lerp_color(EMERALD_LIGHT, EMERALD_DARK, (t0 + t1) / 2) + (255,)
        ag.polygon(
            [
                (cx, y0),
                (cx + half_w * 0.72 * t0 + half_w * 0.1, y0),
                (cx + half_w * 0.72 * t1 + half_w * 0.1, y1),
                (cx, y1),
            ],
            fill=color,
        )
        ag.polygon(
            [
                (cx, y0),
                (cx - half_w * 0.72 * t0 - half_w * 0.1, y0),
                (cx - half_w * 0.72 * t1 - half_w * 0.1, y1),
                (cx, y1),
            ],
            fill=color,
        )
    # Cut the crossbar so it reads as an A.
    cross_top = top + a_span * 0.42
    cross_bottom = top + a_span * 0.60
    ImageDraw.Draw(a_grad).polygon(
        [(cx - half_w * 0.16, cross_top), (cx + half_w * 0.16, cross_top), (cx + half_w * 0.42, cross_bottom), (cx - half_w * 0.42, cross_bottom)],
        fill=(0, 0, 0, 0),
    )
    canvas.alpha_composite(a_grad)

    # Node dots at the six vertices.
    for i, pt in enumerate(hexagon_points(cx, cy, outer_r)):
        r = dot_r * (1.15 if i % 3 == 0 else 0.9)
        alpha = 255 if i % 3 == 0 else 178
        ImageDraw.Draw(canvas).ellipse(
            [pt[0] - r, pt[1] - r, pt[0] + r, pt[1] + r],
            fill=(16, 185, 129, alpha),
        )

    return canvas.resize((size, size), Image.LANCZOS)


# --------------------------------------------------------------------------- #
# Wordmark logo (400x100) on a dark plate so it works on any background
# --------------------------------------------------------------------------- #

def draw_logo(width: int = 400, height: int = 100) -> Image.Image:
    S = SS
    canvas = Image.new("RGBA", (width * S, height * S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    pad = 14 * S
    radius = 22 * S
    draw.rounded_rectangle(
        [pad, pad, width * S - pad, height * S - pad],
        radius=radius,
        fill=(11, 11, 16, 245),
        outline=(39, 39, 42, 255),
        width=max(1, round(1.5 * S)),
    )

    # Mark on the left, 80x80 logical box.
    mark_size = 68 * S
    mark = draw_mark(round(mark_size)).resize((round(mark_size), round(mark_size)), Image.LANCZOS)
    canvas.alpha_composite(mark, (round(24 * S), round((height * S - mark_size) / 2)))

    # Wordmark + tagline with letter-spacing.
    bold = find_font(
        [
            "C:/Windows/Fonts/segoeuib.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        ],
        round(44 * S),
    )
    regular = find_font(
        [
            "C:/Windows/Fonts/segoeui.ttf",
            "C:/Windows/Fonts/arial.ttf",
            "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        ],
        round(11 * S),
    )

    text_x = round(112 * S)
    wordmark_y = round(18 * S)
    draw.text((text_x, wordmark_y), "Aetheris", font=bold, fill=FG + (255,))
    bbox = draw.textbbox((text_x, wordmark_y), "Aetheris", font=bold)
    tagline_x = text_x
    tagline_y = round(70 * S)
    tracked(draw, (tagline_x, tagline_y), "ENTERPRISE PLATFORM", regular, FAINT + (255,), round(2.6 * S))

    return canvas.resize((width, height), Image.LANCZOS)


# --------------------------------------------------------------------------- #
# App icon (1024x1024 rounded square)
# --------------------------------------------------------------------------- #

def draw_app_icon(size: int = 1024) -> Image.Image:
    S = SS
    canvas = Image.new("RGBA", (size * S, size * S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    radius = size * S * 0.22
    bg = diagonal_gradient(canvas.size, (14, 14, 18), (8, 8, 11))
    canvas.paste(bg, (0, 0))
    mask = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size * S, size * S], radius=radius, fill=255)
    canvas.putalpha(mask)

    # Subtle top sheen + edge.
    sheen = Image.new("RGBA", canvas.size, (0, 0, 0, 0))
    sd = ImageDraw.Draw(sheen)
    sd.rounded_rectangle([0, 0, size * S, size * S], radius=radius, outline=(255, 255, 255, 34), width=max(2, round(S * 3)))
    canvas.alpha_composite(sheen)

    # Centered mark at ~58% of the canvas.
    mark_size = round(size * S * 0.58)
    mark = draw_mark(mark_size)
    canvas.alpha_composite(mark, ((size * S - mark_size) // 2, (size * S - mark_size) // 2))

    return canvas.resize((size, size), Image.LANCZOS)


# --------------------------------------------------------------------------- #
# OpenGraph image (1200x630)
# --------------------------------------------------------------------------- #

def draw_og(width: int = 1200, height: int = 630) -> Image.Image:
    S = SS
    w, h = width * S, height * S
    canvas = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    draw = ImageDraw.Draw(canvas)

    # Background gradient + grid.
    canvas.paste(diagonal_gradient((w, h), BG, SURFACE), (0, 0))
    grid = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grid)
    step = 40 * S
    for x in range(0, w, step):
        gd.line([(x, 0), (x, h)], fill=(39, 39, 42, 70), width=max(1, round(0.5 * S)))
    for y in range(0, h, step):
        gd.line([(0, y), (w, y)], fill=(39, 39, 42, 70), width=max(1, round(0.5 * S)))
    canvas.alpha_composite(grid)

    # Accent line under the title block.
    accent = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ad = ImageDraw.Draw(accent)
    for i in range(240):
        t = i / 240
        alpha = round(255 * math.sin(math.pi * t))
        x0 = 100 * S + t * 1000 * S
        color = lerp_color(EMERALD_LIGHT, EMERALD_DARK, t) + (alpha,)
        ad.line([(x0, 282 * S), (x0 + 6 * S, 282 * S)], fill=color, width=max(2, round(2 * S)))
    canvas.alpha_composite(accent)

    # Large mark at top-left.
    mark_size = round(160 * S)
    mark = draw_mark(mark_size)
    canvas.alpha_composite(mark, (round(100 * S), round(150 * S)))

    # Title + subtitle.
    bold = find_font(
        ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"],
        round(68 * S),
    )
    semibold = find_font(
        ["C:/Windows/Fonts/segoeuib.ttf", "C:/Windows/Fonts/arialbd.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"],
        round(22 * S),
    )
    regular = find_font(
        ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"],
        round(27 * S),
    )
    small = find_font(
        ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"],
        round(14 * S),
    )
    tiny = find_font(
        ["C:/Windows/Fonts/segoeui.ttf", "C:/Windows/Fonts/arial.ttf", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"],
        round(16 * S),
    )

    draw.text((round(380 * S), round(186 * S)), "Aetheris", font=bold, fill=FG + (255,))
    tracked(
        draw,
        (round(380 * S), round(268 * S)),
        "ENTERPRISE PLATFORM",
        semibold,
        EMERALD + (255,),
        round(6 * S),
    )

    # Tagline.
    draw.text((round(100 * S), round(348 * S)), "Unified billing & virtualization management", font=regular, fill=MUTED + (255,))

    # Feature pills.
    pills = [
        ("Pterodactyl", 0),
        ("Proxmox VE", 1),
        ("VirtFusion", 2),
        ("WHMCS", 3),
        ("FOSSBilling", 4),
    ]
    pill_w, pill_h, gap = round(180 * S), round(40 * S), round(20 * S)
    for name, index in pills:
        x = round(100 * S) + index * (pill_w + gap)
        y = round(404 * S)
        draw.rounded_rectangle([x, y, x + pill_w, y + pill_h], radius=pill_h // 2, fill=(39, 39, 42, 255))
        text_bbox = draw.textbbox((0, 0), name, font=small)
        tw = text_bbox[2] - text_bbox[0]
        draw.text((x + (pill_w - tw) / 2, y + (pill_h - text_bbox[3] + text_bbox[1]) / 2 - 2 * S), name, font=small, fill=EMERALD + (255,))

    # URL footer.
    draw.text(
        (round(100 * S), round(580 * S)),
        "github.com/aetheris-project",
        font=tiny,
        fill=FAINT + (255,),
    )

    return canvas.resize((width, height), Image.LANCZOS)


# --------------------------------------------------------------------------- #
# Entry point
# --------------------------------------------------------------------------- #

def write_ico(mark_512: Image.Image, path: str) -> None:
    # Pillow resizes the source image to every requested size and writes them
    # all as icon entries in a single .ico container.
    mark_512.convert("RGBA").save(
        path,
        format="ICO",
        sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)],
    )


def main() -> None:
    out_dir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)))
    os.makedirs(out_dir, exist_ok=True)

    logo = draw_logo()
    icon = draw_mark(512)
    app_icon = draw_app_icon(1024)
    og = draw_og()

    logo.save(os.path.join(out_dir, "logo.png"), optimize=True)
    icon.save(os.path.join(out_dir, "icon.png"), optimize=True)
    app_icon.save(os.path.join(out_dir, "app-icon.png"), optimize=True)
    og.save(os.path.join(out_dir, "og-image.png"), optimize=True)
    write_ico(icon, os.path.join(out_dir, "icon.ico"))

    for name in ["logo.png", "icon.png", "app-icon.png", "og-image.png", "icon.ico"]:
        size = os.path.getsize(os.path.join(out_dir, name))
        print(f"wrote {name} ({size / 1024:.1f} KiB)")


if __name__ == "__main__":
    main()
