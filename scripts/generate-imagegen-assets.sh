#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
JSONL_FILE="${IMAGEGEN_JSONL_FILE:-$ROOT_DIR/tmp/imagegen/astro-gauntlet-assets.jsonl}"
RAW_OUTPUT_DIR="${IMAGEGEN_RAW_OUTPUT_DIR:-$ROOT_DIR/output/imagegen/astro-gauntlet}"
SPRITES_DIR="${IMAGEGEN_SPRITES_DIR:-$ROOT_DIR/assets/sprites}"
GEN_SCRIPT="${IMAGEGEN_GEN_SCRIPT:-/Users/abelsanchez/.codex/skills/imagegen/scripts/image_gen.py}"
GEN_SIZE="${IMAGEGEN_GEN_SIZE:-1024x1024}"
QUALITY="${IMAGEGEN_QUALITY:-high}"
BACKGROUND="${IMAGEGEN_BACKGROUND:-transparent}"
OUTPUT_FORMAT="${IMAGEGEN_OUTPUT_FORMAT:-png}"
CONCURRENCY="${IMAGEGEN_CONCURRENCY:-6}"
TARGET_SIZE="${IMAGEGEN_TARGET_SIZE:-64}"

if [[ -z "${OPENAI_API_KEY-}" ]]; then
  echo "OPENAI_API_KEY is not set. Export OPENAI_API_KEY and rerun." >&2
  exit 2
fi

if [[ ! -f "$GEN_SCRIPT" ]]; then
  echo "Imagegen script not found: $GEN_SCRIPT" >&2
  exit 3
fi

if [[ ! -f "$JSONL_FILE" ]]; then
  echo "Image batch prompt file not found: $JSONL_FILE" >&2
  exit 4
fi

mkdir -p "$RAW_OUTPUT_DIR" "$SPRITES_DIR"

python3 "$GEN_SCRIPT" \
  generate-batch \
  --input "$JSONL_FILE" \
  --out-dir "$RAW_OUTPUT_DIR" \
  --size "$GEN_SIZE" \
  --quality "$QUALITY" \
  --background "$BACKGROUND" \
  --output-format "$OUTPUT_FORMAT" \
  --concurrency "$CONCURRENCY"

python3 - "$RAW_OUTPUT_DIR" "$SPRITES_DIR" "$TARGET_SIZE" <<'PY'
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except Exception as exc:  # pragma: no cover
    print(f"Pillow not available: {exc}", file=sys.stderr)
    print("Install pillow or export images manually:", file=sys.stderr)
    raise

src_dir = Path(sys.argv[1])
tgt_dir = Path(sys.argv[2])
size = int(sys.argv[3])

generated = 0
for source in sorted(src_dir.glob("*.png")):
    with Image.open(source) as img:
        resized = img.convert("RGBA").resize((size, size), Image.NEAREST)
    target = tgt_dir / source.name
    resized.save(target, "PNG")
    generated += 1

print(f"[ok] synced {generated} generated sprites to {tgt_dir}")
PY
