#!/bin/sh
set -eu

source_dir="/Users/krainik/.codex/generated_images/019ff74e-6b54-71e0-927c-7967179c1b68"
output_dir="public/vocabulary"
mkdir -p "$output_dir"

copy_sheet() {
  unit="$1"
  source="$2"
  cp "$source_dir/$source" "$output_dir/unit-$unit.png"
}

copy_sheet 01 exec-04d66926-06f5-48f9-bc23-f7093dc2b0fc.png
copy_sheet 02 exec-23736cdd-375c-45c1-a719-e3ef9d48f47a.png
copy_sheet 03 exec-06afbb4c-9dd2-44cd-b0ad-9cf3b2048bf0.png
copy_sheet 04 exec-db786d41-ec97-454b-a170-5d78b24a8e8e.png
copy_sheet 05 exec-2f60e965-9601-485c-a6ea-f2f43b4aedc4.png
copy_sheet 06 exec-de29da7b-b1e0-45c7-83e9-05d6fa5b8165.png
copy_sheet 07 exec-ac9a1cea-13eb-489d-9345-545f46b4e7c6.png
copy_sheet 08 exec-fd7589ae-ce13-4e80-b11f-c8314b8d9fe8.png
copy_sheet 09 exec-bf4b5f9f-d8e7-4c79-9754-79c8e388d493.png
copy_sheet 10 exec-77e6f054-0567-40e5-aa27-c0b752f6a65b.png
copy_sheet 11 exec-2dbc6bcb-febf-4df8-ab6e-d78c9e363b21.png
copy_sheet 12 exec-6d3ed2c4-fbf2-4c2b-8292-30da9dc94d5d.png
copy_sheet 13 exec-3b590e1b-04a1-452c-a579-22c63ed2dbee.png
copy_sheet 14 exec-4f9a5ac7-ab4c-4a25-8efa-1fcb039b3e5a.png
copy_sheet 15 exec-7fb6eee6-a2ec-4d43-86a0-d7eb59fcd830.png
copy_sheet 16 exec-5c2ceb54-813d-4cf3-89e6-76ae883d4580.png
copy_sheet 17 exec-7156bf96-9c1b-4b24-a6e5-bcc77f1d19f1.png
copy_sheet 18 exec-4dee0b51-94e2-4618-9d9d-3fab299353f1.png
copy_sheet 19 exec-ae3231b8-8563-49d9-945d-f171e5d3285d.png
copy_sheet 20 exec-ac137d03-fa23-4c05-bf0a-f2ad80ac653f.png
copy_sheet 21 exec-06fc7684-d039-4d65-9833-cece011c2cdc.png
copy_sheet 22 exec-f5df6d78-2d94-4f40-9d23-58868965c31b.png
copy_sheet 23 exec-81ae8754-b887-4cf2-91c1-af2218e5506c.png
copy_sheet 24 exec-24c0325c-6f4c-45ce-80f1-8bef0145fbe6.png
copy_sheet 25 exec-0ccf4edf-b341-4280-a047-ef953775200a.png
copy_sheet 26 exec-2d5a7726-d497-4d39-b258-3dc171c89760.png
copy_sheet 27 exec-66adf5a4-c100-41ef-bf73-06811931c6d9.png
copy_sheet 28 exec-1fe3b26e-e1af-460f-913b-39540da9d319.png
copy_sheet 29 exec-635444ed-62eb-4082-b232-499371cfee7d.png
copy_sheet 30 exec-1d52fc2b-efa4-4e88-8b32-f781cc5db1ee.png

for source in "$output_dir"/*.png; do
  target="${source%.png}.webp"
  cwebp -quiet -q 76 -resize 1200 0 "$source" -o "$target"
  rm "$source"
done

echo "Prepared 30 vocabulary sprite sheets."
