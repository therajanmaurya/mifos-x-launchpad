#!/bin/bash
# Rebrand Web configuration (index.html, manifest.json)
# Modifies title, meta tags, and PWA manifest

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

if [ -z "$CONFIG" ] || [ -z "$SUBMODULE_PATH" ]; then
  echo "Error: Missing arguments"
  echo "Usage: $0 '<json-config>' '<submodule-path>'"
  exit 1
fi

# Extract values from config
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
DESCRIPTION=$(echo "$CONFIG" | jq -r '.project.description // "Mobile Banking Application"')
ORG_NAME=$(echo "$CONFIG" | jq -r '.organization.name')
PRIMARY_COLOR=$(echo "$CONFIG" | jq -r '.branding.primaryColor')
PACKAGE_NAME=$(echo "$CONFIG" | jq -r '.project.packageName')

echo "  Display Name: $DISPLAY_NAME"
echo "  Description: $DESCRIPTION"
echo "  Theme Color: $PRIMARY_COLOR"

# Find and update index.html files in web directories
INDEX_FILES=$(find "$SUBMODULE_PATH" -path "*web*" -name "index.html" -type f 2>/dev/null || true)
INDEX_FILES="$INDEX_FILES $(find "$SUBMODULE_PATH" -path "*webApp*" -name "index.html" -type f 2>/dev/null || true)"

# Process each index.html
for file in $INDEX_FILES; do
  if [ -n "$file" ] && [ -f "$file" ]; then
    echo "  Processing: $file"

    # Create backup
    cp "$file" "${file}.bak"

    # Update title
    sed -i "s|<title>[^<]*</title>|<title>$DISPLAY_NAME</title>|g" "$file"
    echo "    - Updated title"

    # Update meta description
    if grep -q '<meta name="description"' "$file"; then
      sed -i "s|<meta name=\"description\" content=\"[^\"]*\"|<meta name=\"description\" content=\"$DESCRIPTION\"|g" "$file"
      echo "    - Updated meta description"
    fi

    # Update theme-color
    if grep -q '<meta name="theme-color"' "$file"; then
      sed -i "s|<meta name=\"theme-color\" content=\"[^\"]*\"|<meta name=\"theme-color\" content=\"$PRIMARY_COLOR\"|g" "$file"
      echo "    - Updated theme-color"
    fi

    # Update apple-mobile-web-app-title
    if grep -q '<meta name="apple-mobile-web-app-title"' "$file"; then
      sed -i "s|<meta name=\"apple-mobile-web-app-title\" content=\"[^\"]*\"|<meta name=\"apple-mobile-web-app-title\" content=\"$DISPLAY_NAME\"|g" "$file"
      echo "    - Updated apple-mobile-web-app-title"
    fi

    # Update og:title
    if grep -q '<meta property="og:title"' "$file"; then
      sed -i "s|<meta property=\"og:title\" content=\"[^\"]*\"|<meta property=\"og:title\" content=\"$DISPLAY_NAME\"|g" "$file"
      echo "    - Updated og:title"
    fi

    # Update og:description
    if grep -q '<meta property="og:description"' "$file"; then
      sed -i "s|<meta property=\"og:description\" content=\"[^\"]*\"|<meta property=\"og:description\" content=\"$DESCRIPTION\"|g" "$file"
      echo "    - Updated og:description"
    fi

    # Update twitter:title
    if grep -q '<meta name="twitter:title"' "$file"; then
      sed -i "s|<meta name=\"twitter:title\" content=\"[^\"]*\"|<meta name=\"twitter:title\" content=\"$DISPLAY_NAME\"|g" "$file"
      echo "    - Updated twitter:title"
    fi

    # Update twitter:description
    if grep -q '<meta name="twitter:description"' "$file"; then
      sed -i "s|<meta name=\"twitter:description\" content=\"[^\"]*\"|<meta name=\"twitter:description\" content=\"$DESCRIPTION\"|g" "$file"
      echo "    - Updated twitter:description"
    fi

    # Update application-name
    if grep -q '<meta name="application-name"' "$file"; then
      sed -i "s|<meta name=\"application-name\" content=\"[^\"]*\"|<meta name=\"application-name\" content=\"$DISPLAY_NAME\"|g" "$file"
      echo "    - Updated application-name"
    fi

    # Update author
    if grep -q '<meta name="author"' "$file"; then
      sed -i "s|<meta name=\"author\" content=\"[^\"]*\"|<meta name=\"author\" content=\"$ORG_NAME\"|g" "$file"
      echo "    - Updated author"
    fi
  fi
done

# Find and update manifest.json / manifest.webmanifest files
MANIFEST_FILES=$(find "$SUBMODULE_PATH" -name "manifest.json" -o -name "manifest.webmanifest" 2>/dev/null || true)

for file in $MANIFEST_FILES; do
  if [ -n "$file" ] && [ -f "$file" ]; then
    echo "  Processing: $file"

    # Create backup
    cp "$file" "${file}.bak"

    # Use jq to update JSON values
    if command -v jq &> /dev/null; then
      # Create temp file with updates
      jq --arg name "$DISPLAY_NAME" \
         --arg short_name "$DISPLAY_NAME" \
         --arg description "$DESCRIPTION" \
         --arg theme_color "$PRIMARY_COLOR" \
         --arg background_color "$PRIMARY_COLOR" \
         '.name = $name | .short_name = $short_name | .description = $description | .theme_color = $theme_color | .background_color = $background_color' \
         "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
      echo "    - Updated manifest via jq"
    else
      # Fallback to sed for basic updates
      sed -i "s|\"name\":\s*\"[^\"]*\"|\"name\": \"$DISPLAY_NAME\"|g" "$file"
      sed -i "s|\"short_name\":\s*\"[^\"]*\"|\"short_name\": \"$DISPLAY_NAME\"|g" "$file"
      sed -i "s|\"description\":\s*\"[^\"]*\"|\"description\": \"$DESCRIPTION\"|g" "$file"
      sed -i "s|\"theme_color\":\s*\"[^\"]*\"|\"theme_color\": \"$PRIMARY_COLOR\"|g" "$file"
      sed -i "s|\"background_color\":\s*\"[^\"]*\"|\"background_color\": \"$PRIMARY_COLOR\"|g" "$file"
      echo "    - Updated manifest via sed"
    fi
  fi
done

if [ -z "$INDEX_FILES" ] && [ -z "$MANIFEST_FILES" ]; then
  echo "  Warning: No web configuration files found - skipping web rebrand"
fi

echo "  Web configuration updated successfully"
