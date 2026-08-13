#!/usr/bin/env python3
"""Verify that every course visual exists, is decodable, and keeps its source scene."""

from __future__ import annotations

import re
import sys
import importlib.util
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BOOK_DIR = ROOT / "public" / "book"
CSS = ROOT / "app" / "globals.css"
SPEC = importlib.util.spec_from_file_location("extractor", ROOT / "scripts" / "extract-book-images.py")
if SPEC is None or SPEC.loader is None:
    raise RuntimeError("Could not load extract-book-images.py")
extractor = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(extractor)


def image_signature(image: Image.Image) -> np.ndarray:
    gray = image.convert("L").resize((32, 32), Image.Resampling.LANCZOS)
    values = np.asarray(gray, dtype=np.float32)
    values = (values - values.mean()) / max(float(values.std()), 1.0)
    return values


def normalized_error(first: Image.Image, second: Image.Image) -> float:
    return float(np.mean(np.abs(image_signature(first) - image_signature(second))))


def main() -> int:
    expected = [f"unit-{index:02d}.webp" for index in range(1, 31)]
    expected += [f"test-{index:02d}.webp" for index in range(1, 9)]
    actual = sorted(path.name for path in BOOK_DIR.glob("*.webp"))
    if actual != sorted(expected):
        print("FAIL: public/book does not contain exactly 30 unit and 8 test visuals")
        print("Missing:", sorted(set(expected) - set(actual)))
        print("Unexpected:", sorted(set(actual) - set(expected)))
        return 1

    reader = extractor.PdfReader(extractor.SOURCE_PDF)
    rows: list[tuple[str, str, str, float]] = []
    failures: list[str] = []

    for unit, (book_page, bottom) in enumerate(zip(extractor.UNIT_BOOK_PAGES, extractor.UNIT_BOTTOMS), start=1):
        name = f"unit-{unit:02d}.webp"
        source = reader.pages[book_page - 6].images[0].image
        box = extractor.UNIT_BOX_OVERRIDES.get(unit, (.025, .035, .985, bottom))
        expected_crop = source.crop(extractor.pixel_box(source, box)).convert("RGB")
        asset = Image.open(BOOK_DIR / name).convert("RGB")
        error = normalized_error(asset, expected_crop)
        rows.append((name, f"book {book_page}", f"{asset.width}x{asset.height}", error))
        if asset.width < 900 or asset.height < 500 or error > .12:
            failures.append(f"{name}: size={asset.size}, source error={error:.3f}")

    for test, book_page in enumerate(extractor.TEST_BOOK_PAGES, start=1):
        name = f"test-{test:02d}.webp"
        source = reader.pages[book_page - 6].images[0].image
        box = (.025, .035, .985, .40)
        expected_crop = source.crop(extractor.pixel_box(source, box)).convert("RGB")
        asset = Image.open(BOOK_DIR / name).convert("RGB")
        error = normalized_error(asset, expected_crop)
        rows.append((name, f"book {book_page}", f"{asset.width}x{asset.height}", error))
        if asset.width < 900 or asset.height < 500 or error > .12:
            failures.append(f"{name}: size={asset.size}, source error={error:.3f}")

    css = CSS.read_text()
    required_rules = [
        r"\.book-visual img\{[^}]*height:auto[^}]*object-fit:contain",
        r"\.picture-question-layout>img\{[^}]*height:auto[^}]*object-fit:contain",
        r"@media\(max-width:650px\)\{[\s\S]*?\.book-visual img[^}]*height:auto",
    ]
    if not all(re.search(rule, css) for rule in required_rules):
        failures.append("CSS does not guarantee intrinsic height and contain mode in all exercise image views")
    forbidden_rules = [
        r"\.book-visual img\{[^}]*object-fit:cover",
        r"\.picture-question-layout>img\{[^}]*object-fit:cover",
        r"\.book-visual img\{[^}]*height:\s*\d+px",
        r"\.picture-question-layout>img\{[^}]*height:\s*\d+px",
    ]
    if any(re.search(rule, css) for rule in forbidden_rules):
        failures.append("CSS still contains a cropping rule for exercise visuals")

    print("asset | PDF page | size | source error")
    for name, page, size, error in rows:
        print(f"{name} | {page} | {size} | {error:.3f}")
    if failures:
        print("\nFAIL")
        for failure in failures:
            print("-", failure)
        return 1
    print("\nPASS: 38/38 visuals match their PDF crops and render without CSS cropping.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
