"""Package editable source and prebuilt assets, excluding local tooling and hosting metadata."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import subprocess

root = Path(__file__).resolve().parent.parent
destination = root / "dist" / "source.zip"
# Respect local-only files when packaging from a checkout. Downloaded source
# also remains buildable without Git metadata.
if (root / ".git").exists():
    names = subprocess.check_output(
        ["git", "ls-files", "--cached", "-z"],
        cwd=root,
    ).decode().split("\0")
    files = [root / name for name in names if name]
else:
    files = root.rglob("*")
with ZipFile(destination, "w", ZIP_DEFLATED) as archive:
    for file in sorted(files):
        relative = file.relative_to(root)
        if not file.is_file() or file == destination:
            continue
        if any(part in {"node_modules", ".git", ".openai", ".sites-runtime", "__pycache__"} for part in relative.parts):
            continue
        if file.name == ".DS_Store" or file.name.startswith(".env") or file.suffix.lower() in {".pem", ".key", ".p12", ".pfx"} or file.name.endswith(".tar.gz") and "firmware" not in relative.parts:
            continue
        archive.write(file, "little-circuit-lab/" + str(relative))
print("Editable source ZIP packaged.")
