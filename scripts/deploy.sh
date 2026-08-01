#!/usr/bin/env bash
#
# Build the site and publish it to the gh-pages branch that GitHub Pages serves.
#
#   npm run deploy
#
# The production build needs three public values. They are not secrets — the
# product URL and the Pages URL are both visible on the live site — so they are
# defaulted here rather than kept in a file someone has to remember to create.
# Override any of them inline if the deployment target changes:
#
#   NEXT_PUBLIC_SITE_URL=https://example.com npm run deploy
#
# Publishing happens in a throwaway git worktree, so your working tree and
# whatever branch you have checked out are never touched.

set -euo pipefail

cd "$(dirname "$0")/.."

: "${NEXT_PUBLIC_GUMROAD_PRODUCT_URL:=https://waaridev.gumroad.com/l/focusterminal}"
: "${NEXT_PUBLIC_BASE_PATH:=/focus-terminal-site}"
: "${NEXT_PUBLIC_SITE_URL:=https://codeboss-dev.github.io/focus-terminal-site/}"
export NEXT_PUBLIC_GUMROAD_PRODUCT_URL NEXT_PUBLIC_BASE_PATH NEXT_PUBLIC_SITE_URL

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
rsync -a --delete --exclude '.git' out/ "$WORKTREE/"

git -C "$WORKTREE" add -A
if git -C "$WORKTREE" diff --cached --quiet; then
  echo "==> no changes to publish; site already matches $SHA"
  exit 0
fi

git -C "$WORKTREE" commit -q -m "Deploy Focus Terminal site $SHA"
git -C "$WORKTREE" push -q origin "$BRANCH"

echo "==> deployed $SHA to $BRANCH"
echo "    $NEXT_PUBLIC_SITE_URL"
echo "    GitHub Pages usually takes 30-60s to serve the new build."
