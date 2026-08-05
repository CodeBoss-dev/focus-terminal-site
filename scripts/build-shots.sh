#!/usr/bin/env bash
#
# Rebuild the app screenshots the site ships.
#
# Source is the App Store submission set: genuine captures of the shipping app
# window from AppStoreScreenshotUITests.testCaptureFullJourney, 2560x1600, no
# mockups and no personal data. They are 124KB-3.3MB PNGs, which is far too
# heavy for a marketing page, so this downsamples to 1600px wide WebP — 2x the
# widest slot any of them render into.
#
# Run it when the app's UI changes:
#   SRC=~/FocusTerminal/Submission/screenshots ./scripts/build-shots.sh
#
# `next.config.ts` sets images.unoptimized because the site is a static export,
# so nothing resizes these at build time. What this script writes is what
# visitors download.
set -euo pipefail

SRC="${SRC:-$HOME/FocusTerminal/Submission/screenshots}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/shots"

if ! command -v cwebp >/dev/null; then
  echo "cwebp not found. brew install webp" >&2
  exit 1
fi

if [ ! -d "$SRC" ]; then
  echo "Screenshot source not found: $SRC" >&2
  exit 1
fi

mkdir -p "$OUT"

# name:crop — the six the site uses. Crop is "x y w h" against the 2560x1600
# source and may be empty to ship the frame whole.
#
# Two need one, both for the same reason: the app fills a 1280x800 window, and
# on these two screens the content does not reach the bottom of it. That is
# correct in the app and reads as a hole in the page. Cropping to the content
# keeps them genuine captures while giving the slot something to fill.
#
# Anything cropped must have its aspect ratio passed to <Shot ratio> so the
# layout reserves the right space. The uncropped default is 1600x1000.
SHOTS=(
  "01-departures:"
  "03-boarding-pass:190 300 2180 900"
  "04-flight-deck:"
  "05-cabin-view:"
  "07-passport:"
  "08-stats:0 0 2560 1010"
)

for entry in "${SHOTS[@]}"; do
  name="${entry%%:*}"
  crop="${entry#*:}"
  src="$SRC/$name.png"
  [ -f "$src" ] || { echo "missing: $src" >&2; exit 1; }

  args=()
  [ -n "$crop" ] && args+=(-crop $crop)
  args+=(-resize 1600 0)

  cwebp -quiet -q 82 -m 6 "${args[@]}" "$src" -o "$OUT/$name.webp"

  printf '%-20s %8s → %-6s %s\n' "$name" \
    "$(du -h "$src" | cut -f1)" "$(du -h "$OUT/$name.webp" | cut -f1)" \
    "${crop:+cropped}"
done

echo "Wrote ${#SHOTS[@]} screenshots to public/shots/"
