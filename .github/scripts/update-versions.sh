#!/bin/bash
set -euo pipefail

VERSION="${VERSION:-}"

if [ -z "$VERSION" ]; then
  echo "VERSION environment variable is not set."
  exit 1
fi

echo "Updating React Native package version to $VERSION..."

# Update only package.json
if [ -f package.json ]; then
  jq --arg v "$VERSION" '.version = $v' package.json > package.json.tmp && mv package.json.tmp package.json
fi

echo "React Native package version update complete."