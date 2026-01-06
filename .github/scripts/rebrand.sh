#!/bin/bash
# Main rebrand orchestrator script
# This script calls individual rebrand scripts to customize the app

set -e

CONFIG="$1"
if [ -z "$CONFIG" ]; then
  echo "Error: No configuration provided"
  echo "Usage: $0 '<json-config>'"
  exit 1
fi

# Validate JSON
if ! echo "$CONFIG" | jq . > /dev/null 2>&1; then
  echo "Error: Invalid JSON configuration"
  exit 1
fi

# Extract base app
BASE_APP=$(echo "$CONFIG" | jq -r '.baseApp')
if [ -z "$BASE_APP" ] || [ "$BASE_APP" == "null" ]; then
  echo "Error: baseApp not specified in configuration"
  exit 1
fi

SUBMODULE_PATH="./submodules/$BASE_APP"
if [ ! -d "$SUBMODULE_PATH" ]; then
  echo "Error: Submodule not found at $SUBMODULE_PATH"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "========================================"
echo "MifosLaunchpad Rebrand"
echo "========================================"
echo "Base App: $BASE_APP"
echo "Submodule Path: $SUBMODULE_PATH"
echo "========================================"

# Run individual rebrand scripts
echo ""
echo "[1/5] Rebranding Gradle configuration..."
"$SCRIPT_DIR/rebrand-gradle.sh" "$CONFIG" "$SUBMODULE_PATH"

echo ""
echo "[2/5] Rebranding Android resources..."
"$SCRIPT_DIR/rebrand-android.sh" "$CONFIG" "$SUBMODULE_PATH"

echo ""
echo "[3/5] Rebranding network configuration..."
"$SCRIPT_DIR/rebrand-network.sh" "$CONFIG" "$SUBMODULE_PATH"

echo ""
echo "[4/5] Rebranding iOS configuration..."
"$SCRIPT_DIR/rebrand-ios.sh" "$CONFIG" "$SUBMODULE_PATH"

echo ""
echo "[5/5] Rebranding Web configuration..."
"$SCRIPT_DIR/rebrand-web.sh" "$CONFIG" "$SUBMODULE_PATH"

echo ""
echo "========================================"
echo "Rebrand Complete!"
echo "========================================"
