#!/usr/bin/env python3
"""Extract complete exercise visuals from the scanned course book."""

from __future__ import annotations

import argparse
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from pypdf import PdfReader


SOURCE_PDF = Path(
    "/Users/krainik/Downloads/авиационный английский/"
    "Macmillan Check your aviation english/Check your aviation english.pdf"
)

UNIT_BOOK_PAGES = [
    8, 10, 12, 14, 16, 20, 22, 24, 26, 28,
    32, 34, 36, 38, 40, 44, 46, 48, 50, 52,
    56, 58, 60, 62, 64, 68, 70, 72, 74, 76,
]
TEST_BOOK_PAGES = [18, 30, 42, 54, 66, 78, 80, 82]

# Normalized crop boxes. The default keeps the full visual band, including the
# unit heading, so unusual panoramic layouts and multi-picture exercises are
# not clipped. Portrait visuals use tighter horizontal bounds.
UNIT_BOTTOMS = [
    .35, .44, .33, .30, .48, .39, .43, .35, .36, .36,
    .35, .34, .33, .36, .34, .35, .33, .34, .36, .34,
    .36, .60, .67, .61, .35, .34, .33, .35, .36, .36,
]
UNIT_BOX_OVERRIDES = {
    2: (.02, .10, .555, .44),
    4: (.02, .10, .56, .29),
    22: (.02, .115, .57, .60),
    23: (.56, .105, .99, .67),
    24: (.105, .115, .535, .61),
}


def pixel_box(image: Image.Image, normalized: tuple[float, float, float, float]) -> tuple[int, int, int, int]:
    left, top, right, bottom = normalized
    return (
        round(image.width * left),
        round(image.height * top),
        round(image.width * right),
        round(image.height * bottom),
    )


def save_visual(image: Image.Image, box: tuple[float, float, float, float], output: Path) -> None:
    visual = image.crop(pixel_box(image, box)).convert("RGB")
    if visual.width > 1400:
        height = round(visual.height * 1400 / visual.width)
        visual = visual.resize((1400, height), Image.Resampling.LANCZOS)
    visual.save(output, "WEBP", quality=86, method=6)


def make_contact_sheet(files: list[Path], output: Path) -> None:
    font = ImageFont.load_default(size=18)
    cell_width, cell_height, columns = 360, 290, 4
    rows = (len(files) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * cell_width, rows * cell_height), "white")
    draw = ImageDraw.Draw(sheet)
    for index, file in enumerate(files):
        visual = Image.open(file).convert("RGB")
        size = visual.size
        visual.thumbnail((cell_width - 16, cell_height - 44), Image.Resampling.LANCZOS)
        x = (index % columns) * cell_width
        y = (index // columns) * cell_height
        draw.text((x + 8, y + 7), f"{file.stem} · {size[0]}x{size[1]}", fill="black", font=font)
        sheet.paste(visual, (x + (cell_width - visual.width) // 2, y + 36))
    sheet.save(output, quality=90, optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=Path("public/book"))
    parser.add_argument("--contact", type=Path)
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)

    reader = PdfReader(SOURCE_PDF)
    files: list[Path] = []
    for unit, (book_page, bottom) in enumerate(zip(UNIT_BOOK_PAGES, UNIT_BOTTOMS), start=1):
        page_image = reader.pages[book_page - 6].images[0].image
        box = UNIT_BOX_OVERRIDES.get(unit, (.025, .035, .985, bottom))
        output = args.output / f"unit-{unit:02d}.webp"
        save_visual(page_image, box, output)
        files.append(output)

    for test, book_page in enumerate(TEST_BOOK_PAGES, start=1):
        page_image = reader.pages[book_page - 6].images[0].image
        output = args.output / f"test-{test:02d}.webp"
        save_visual(page_image, (.025, .035, .985, .40), output)
        files.append(output)

    if args.contact:
        args.contact.parent.mkdir(parents=True, exist_ok=True)
        make_contact_sheet(files, args.contact)

    print(f"Extracted {len(files)} complete visuals to {args.output.resolve()}")


if __name__ == "__main__":
    main()
