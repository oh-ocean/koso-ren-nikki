#!/bin/bash
# Builds landing/press-kit.zip from existing assets + press-src text files.
# Run from the repo root: bash press-src/build-presskit.sh

set -e

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STAGE="$(mktemp -d)"

mkdir -p "$STAGE/screenshots" "$STAGE/logo"

cp "$REPO_ROOT/landing/images/about/01-conditions.jpg" "$STAGE/screenshots/"
cp "$REPO_ROOT/landing/images/about/02-focus-setup.jpg" "$STAGE/screenshots/"
cp "$REPO_ROOT/landing/images/about/03-reflection.jpg" "$STAGE/screenshots/"
cp "$REPO_ROOT/landing/images/about/04-focus-distribution.jpg" "$STAGE/screenshots/"
cp "$REPO_ROOT/landing/images/about/05-focus-history.jpg" "$STAGE/screenshots/"
cp "$REPO_ROOT/landing/images/about/06-trend.jpg" "$STAGE/screenshots/"

cp "$REPO_ROOT/public/icon-512.png" "$STAGE/logo/"
cp "$REPO_ROOT/public/icon-192.png" "$STAGE/logo/"

cp "$REPO_ROOT/press-src/factsheet.txt" "$STAGE/"
cp "$REPO_ROOT/press-src/description.txt" "$STAGE/"

OUT="$REPO_ROOT/landing/press-kit.zip"
rm -f "$OUT"
(cd "$STAGE" && zip -r -q "$OUT" .)
rm -rf "$STAGE"

echo "Built $OUT"
unzip -l "$OUT"
