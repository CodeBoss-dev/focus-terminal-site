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
# Do not eyeball these against a scaled preview. A previous stats crop of 1010
# was measured off a 2000px-wide preview of a 2560px source and silently cut a
# third of the cabin-class list off the live site. Measure the source itself:
# find the last row containing ink, and the blank bands you can safely cut in.
#
#   last ink row — 01:1579  03:1467  07:1599(clipped)  08:1168
#   passport blank bands  — 1030-1134, 1152-1203, 1417-1447
#
# Reasons for each crop:
#   03  the app centres a small ticket in a large empty pane. Correct in the
#       app, reads as a hole in the page. Cropped at 1.6 so it comes out
#       1600x1000 and sits at the same size as 01 in the Before band; the
#       window covers all content (rows 218-1467, cols 383-2173) with margin,
#       and now includes the BOARD button the earlier crop cut off.
#   07  the capture cuts the second row of achievements in half at the window
#       edge. 1430 lands inside the blank band at 1417-1447, so the image ends
#       cleanly after the first row instead of on a sliced one.
#   08  content ends at 1168 and the rest is empty paper. Cropped to the same
#       height as 07 so the two sit at identical size in the After band, which
#       costs a little whitespace at the bottom and is worth it.
#
# Anything cropped must have its aspect ratio passed to <Shot ratio> so the
# layout reserves the right space. The uncropped default is 1600x1000, and the
# script prints what it actually wrote — use those numbers.
SHOTS=(
  "01-departures:"
  "03-boarding-pass:190 150 2180 1362"
  "04-flight-deck:"
  "05-cabin-view:"
  "07-passport:0 0 2560 1430"
  "08-stats:0 0 2560 1430"
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
