#!/bin/bash
# Rebrand Gradle configuration (libs.versions.toml)
# Modifies application ID, app name, and version

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

if [ -z "$CONFIG" ] || [ -z "$SUBMODULE_PATH" ]; then
  echo "Error: Missing arguments"
  echo "Usage: $0 '<json-config>' '<submodule-path>'"
  exit 1
fi

# Extract values from config
APP_ID=$(echo "$CONFIG" | jq -r '.project.packageName')
APP_NAME=$(echo "$CONFIG" | jq -r '.project.name')
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
VERSION_NAME=$(echo "$CONFIG" | jq -r '.project.version')
VERSION_CODE=$(date +%Y%m%d%H)

echo "  Application ID: $APP_ID"
echo "  App Name: $APP_NAME"
echo "  Display Name: $DISPLAY_NAME"
echo "  Version: $VERSION_NAME ($VERSION_CODE)"

# Find libs.versions.toml
LIBS_FILE="$SUBMODULE_PATH/gradle/libs.versions.toml"

if [ ! -f "$LIBS_FILE" ]; then
  echo "  Warning: libs.versions.toml not found at $LIBS_FILE"
  echo "  Searching for alternative location..."
  LIBS_FILE=$(find "$SUBMODULE_PATH" -name "libs.versions.toml" -type f | head -1)
  if [ -z "$LIBS_FILE" ]; then
    echo "  Warning: Could not find libs.versions.toml - skipping Gradle rebrand"
    exit 0
  fi
  echo "  Found: $LIBS_FILE"
fi

echo "  Updating $LIBS_FILE..."

# Create backup
cp "$LIBS_FILE" "${LIBS_FILE}.bak"

# Update applicationId (may be in different formats)
if grep -q 'applicationId\s*=' "$LIBS_FILE"; then
  sed -i "s|applicationId\s*=\s*\"[^\"]*\"|applicationId = \"$APP_ID\"|g" "$LIBS_FILE"
  echo "    - Updated applicationId"
fi

# Update packageName
if grep -q 'packageName\s*=' "$LIBS_FILE"; then
  sed -i "s|packageName\s*=\s*\"[^\"]*\"|packageName = \"$DISPLAY_NAME\"|g" "$LIBS_FILE"
  echo "    - Updated packageName"
fi

# Update packageNamespace (Android namespace)
if grep -q 'packageNamespace\s*=' "$LIBS_FILE"; then
  sed -i "s|packageNamespace\s*=\s*\"[^\"]*\"|packageNamespace = \"$APP_ID\"|g" "$LIBS_FILE"
  echo "    - Updated packageNamespace"
fi

# Update appName (some projects use this)
if grep -q 'appName\s*=' "$LIBS_FILE"; then
  sed -i "s|appName\s*=\s*\"[^\"]*\"|appName = \"$APP_NAME\"|g" "$LIBS_FILE"
  echo "    - Updated appName"
fi

# Update versionName
if grep -q 'packageVersion\s*=' "$LIBS_FILE"; then
  sed -i "s|packageVersion\s*=\s*\"[^\"]*\"|packageVersion = \"$VERSION_NAME\"|g" "$LIBS_FILE"
  echo "    - Updated packageVersion"
elif grep -q 'versionName\s*=' "$LIBS_FILE"; then
  sed -i "s|versionName\s*=\s*\"[^\"]*\"|versionName = \"$VERSION_NAME\"|g" "$LIBS_FILE"
  echo "    - Updated versionName"
fi

# Update versionCode
if grep -q 'versionCode\s*=' "$LIBS_FILE"; then
  sed -i "s|versionCode\s*=\s*\"[^\"]*\"|versionCode = \"$VERSION_CODE\"|g" "$LIBS_FILE"
  echo "    - Updated versionCode"
fi

echo "  Gradle configuration updated successfully"
