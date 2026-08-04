#!/usr/bin/env bash
#
# Build the site and publish it to the gh-pages branch that GitHub Pages serves.
#
#   npm run deploy
#
# The production build needs two public values. They are not secrets — the Pages
# URL is visible on the live site — so they are defaulted here rather than kept
# in a file someone has to remember to create. Override either inline if the
# deployment target changes:
#
#   NEXT_PUBLIC_SITE_URL=https://example.com npm run deploy
#
# The App Store URL and price are not env vars: they are constants in
# src/lib/site.ts, because a missing env var once shipped a live site whose buy
# button rendered as "checkout unavailable".
#
# Publishing happens in a throwaway git worktree, so your working tree and
# whatever branch you have checked out are never touched.

set -euo pipefail

cd "$(dirname "$0")/.."

: "${NEXT_PUBLIC_BASE_PATH:=/focus-terminal-site}"
: "${NEXT_PUBLIC_SITE_URL:=https://codeboss-dev.github.io/focus-terminal-site/}"
export NEXT_PUBLIC_BASE_PATH NEXT_PUBLIC_SITE_URL

BRANCH="gh-pages"
WORKTREE="$(mktemp -d)/gh-pages"
SHA="$(git rev-parse --short HEAD)"

cleanup() {
  git worktree remove "$WORKTREE" --force >/dev/null 2>&1 || true
}
trap cleanup EXIT

if [ -n "$(git status --porcelain)" ]; then
  echo "warning: working tree is dirty — deploying committed state ($SHA), not your edits" >&2
fi

echo "==> building ($SHA)"
npm run build

# The build wipes out/ and does not emit this file, but GitHub Pages runs Jekyll
# unless it is present, and Jekyll strips every directory beginning with an
# underscore — which is all of _next/. Without it the site publishes as HTML
# with no CSS and no JavaScript. The postbuild hook creates it; this is a second
# check because the failure is silent and total.
if [ ! -f out/.nojekyll ]; then
  echo "error: out/.nojekyll is missing — refusing to publish a build that Jekyll would strip" >&2
  exit 1
fi

echo "==> publishing out/ to $BRANCH"
git fetch -q origin "$BRANCH"
git worktree add -q "$WORKTREE" -B "$BRANCH" "origin/$BRANCH"

# Emptying the branch and copying wholesale, rather than syncing over the top.
#
# This previously used `rsync -a --delete`, which skips any file whose size and
# mtime both match the destination and never compares content. Next embeds a
# 16-character build hash in the asset filenames it references, so a rebuild
# changes index.html's bytes without changing its length. rsync saw the same
# size, decided it was unchanged, and left the old index.html in place while
# correctly replacing the CSS beside it — publishing a page that asked for a
# stylesheet the same deploy had just deleted.
find "$WORKTREE" -mindepth 1 -maxdepth 1 ! -name '.git' -exec rm -rf {} +
cp -R out/. "$WORKTREE/"

# Whatever the copy did, refuse to publish a tree whose HTML references an asset
# that is not present. This is the check that actually matters: it catches a
# mismatch no matter which part of the pipeline caused it.
echo "==> verifying asset references"
missing=0
while IFS= read -r ref; do
  rel="${ref#"$NEXT_PUBLIC_BASE_PATH"/}"
  if [ ! -f "$WORKTREE/$rel" ]; then
    echo "  missing: $rel" >&2
    missing=1
  fi
done < <(grep -ohE "$NEXT_PUBLIC_BASE_PATH/_next/[^\"']+\.(css|js)" "$WORKTREE"/*.html | sort -u)

if [ "$missing" -ne 0 ]; then
  echo "error: published HTML references files that do not exist — refusing to deploy" >&2
  exit 1
fi
echo "  all referenced assets present"

git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  echo "==> no changes to publish; site already matches $SHA"
  exit 0
fi

git -C "$WORKTREE" commit -q -m "Deploy Focus Terminal site $SHA"
git -C "$WORKTREE" push -q origin "$BRANCH"

echo "==> deployed $SHA to $BRANCH"

# Confirm against the real URL rather than trusting the push. A deploy that
# publishes HTML pointing at a 404 still looks successful from here.
echo "==> verifying $NEXT_PUBLIC_SITE_URL"
for attempt in $(seq 1 24); do
  html="$(curl -fsSL "$NEXT_PUBLIC_SITE_URL" 2>/dev/null || true)"
  css="$(printf '%s' "$html" | grep -oE "$NEXT_PUBLIC_BASE_PATH/_next/[^\"']+\.css" | head -1 || true)"
  if [ -n "$css" ]; then
    origin="${NEXT_PUBLIC_SITE_URL%"$NEXT_PUBLIC_BASE_PATH"/}"
    code="$(curl -s -o /dev/null -w '%{http_code}' "${origin%/}$css")"
    if [ "$code" = "200" ]; then
      echo "    live and serving CSS ($code)"
      exit 0
    fi
  fi
  sleep 10
done

echo "warning: site did not serve its stylesheet within 4 minutes — check manually" >&2
exit 1
