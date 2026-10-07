"""Package editable source and prebuilt assets, excluding local tooling and hosting metadata."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parent.parent
destination = root / "dist" / "source.zip"
with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
    for file in sorted(root.rglob("*")):
        relative = file.relative_to(root)
        if not file.is_file() or file == destination:
            continue
        if any(part in {"node_modules", ".git", ".openai", ".sites-runtime", "__pycache__"} for part in relative.parts):
            continue
        if file.name in {".DS_Store"} or file.name.endswith(".tar.gz") and "firmware" not in relative.parts:
            continue
        archive.write(file, "little-circuit-lab/" + str(relative))
print("Editable source ZIP packaged.")
