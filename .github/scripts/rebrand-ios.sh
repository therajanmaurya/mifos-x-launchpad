#!/bin/bash
# Rebrand iOS configuration (Config.xcconfig, Info.plist)
# Modifies bundle ID, display name, and version

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

if [ -z "$CONFIG" ] || [ -z "$SUBMODULE_PATH" ]; then
  echo "Error: Missing arguments"
  echo "Usage: $0 '<json-config>' '<submodule-path>'"
  exit 1
fi

# Extract values from config
BUNDLE_ID=$(echo "$CONFIG" | jq -r '.project.packageName')
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
VERSION=$(echo "$CONFIG" | jq -r '.project.version')
BUILD_NUMBER=$(date +%Y%m%d%H)

echo "  Bundle ID: $BUNDLE_ID"
echo "  Display Name: $DISPLAY_NAME"
echo "  Version: $VERSION ($BUILD_NUMBER)"

# Find and update Config.xcconfig files
CONFIG_FILES=$(find "$SUBMODULE_PATH" -name "*.xcconfig" -type f 2>/dev/null || true)

if [ -n "$CONFIG_FILES" ]; then
  echo "$CONFIG_FILES" | while read -r file; do
    if [ -n "$file" ] && [ -f "$file" ]; then
      echo "  Processing: $file"

      # Create backup
      cp "$file" "${file}.bak"

      # Update PRODUCT_BUNDLE_IDENTIFIER
      if grep -q 'PRODUCT_BUNDLE_IDENTIFIER' "$file"; then
        sed -i "s|PRODUCT_BUNDLE_IDENTIFIER\s*=\s*.*|PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID|g" "$file"
        echo "    - Updated PRODUCT_BUNDLE_IDENTIFIER"
      fi

      # Update PRODUCT_NAME
      if grep -q 'PRODUCT_NAME' "$file"; then
        sed -i "s|PRODUCT_NAME\s*=\s*.*|PRODUCT_NAME = $DISPLAY_NAME|g" "$file"
        echo "    - Updated PRODUCT_NAME"
      fi

      # Update MARKETING_VERSION
      if grep -q 'MARKETING_VERSION' "$file"; then
        sed -i "s|MARKETING_VERSION\s*=\s*.*|MARKETING_VERSION = $VERSION|g" "$file"
        echo "    - Updated MARKETING_VERSION"
      fi

      # Update CURRENT_PROJECT_VERSION
      if grep -q 'CURRENT_PROJECT_VERSION' "$file"; then
        sed -i "s|CURRENT_PROJECT_VERSION\s*=\s*.*|CURRENT_PROJECT_VERSION = $BUILD_NUMBER|g" "$file"
        echo "    - Updated CURRENT_PROJECT_VERSION"
      fi

      # Update APP_DISPLAY_NAME if exists
      if grep -q 'APP_DISPLAY_NAME' "$file"; then
        sed -i "s|APP_DISPLAY_NAME\s*=\s*.*|APP_DISPLAY_NAME = $DISPLAY_NAME|g" "$file"
        echo "    - Updated APP_DISPLAY_NAME"
      fi
    fi
  done
else
  echo "  Warning: No .xcconfig files found"
fi

# Find and update Info.plist files
PLIST_FILES=$(find "$SUBMODULE_PATH" -name "Info.plist" -type f 2>/dev/null | grep -i ios || true)

if [ -n "$PLIST_FILES" ]; then
  echo "$PLIST_FILES" | while read -r file; do
    if [ -n "$file" ] && [ -f "$file" ]; then
      echo "  Processing: $file"

      # Create backup
      cp "$file" "${file}.bak"

      # Use PlistBuddy if available (macOS), otherwise use sed
      if command -v /usr/libexec/PlistBuddy &> /dev/null; then
        # Update CFBundleDisplayName
        /usr/libexec/PlistBuddy -c "Set :CFBundleDisplayName $DISPLAY_NAME" "$file" 2>/dev/null || true

        # Update CFBundleName
        /usr/libexec/PlistBuddy -c "Set :CFBundleName $DISPLAY_NAME" "$file" 2>/dev/null || true

        # Update CFBundleShortVersionString
        /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $VERSION" "$file" 2>/dev/null || true

        # Update CFBundleVersion
        /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $BUILD_NUMBER" "$file" 2>/dev/null || true

        echo "    - Updated plist values via PlistBuddy"
      else
        # Fallback to sed for Linux runners
        sed -i "/<key>CFBundleDisplayName<\/key>/{n;s|<string>[^<]*</string>|<string>$DISPLAY_NAME</string>|;}" "$file" 2>/dev/null || true
        sed -i "/<key>CFBundleName<\/key>/{n;s|<string>[^<]*</string>|<string>$DISPLAY_NAME</string>|;}" "$file" 2>/dev/null || true
        sed -i "/<key>CFBundleShortVersionString<\/key>/{n;s|<string>[^<]*</string>|<string>$VERSION</string>|;}" "$file" 2>/dev/null || true
        sed -i "/<key>CFBundleVersion<\/key>/{n;s|<string>[^<]*</string>|<string>$BUILD_NUMBER</string>|;}" "$file" 2>/dev/null || true

        echo "    - Updated plist values via sed"
      fi
    fi
  done
else
  echo "  Warning: No iOS Info.plist files found"
fi

echo "  iOS configuration updated successfully"
