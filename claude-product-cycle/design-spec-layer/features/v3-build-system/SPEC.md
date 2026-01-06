# V3 Build System Specification

**Version**: 3.0.0
**Date**: 2025-01-06
**Status**: In Development

---

## Overview

The V3 build system uses GitHub Actions to build customized mobile banking apps from source submodules. Builds are triggered by creating GitHub Issues with JSON configuration in the body.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Build Trigger Flow                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  User submits config    GitHub Issue created    Workflow triggered      │
│        │                       │                       │                │
│        ▼                       ▼                       ▼                │
│  ┌──────────┐          ┌──────────────┐        ┌──────────────┐        │
│  │  Web UI  │ ──────▶  │ GitHub API   │ ──────▶│ Actions      │        │
│  │ Step 10  │          │ Create Issue │        │ Workflow     │        │
│  └──────────┘          └──────────────┘        └──────────────┘        │
│                                                       │                 │
└───────────────────────────────────────────────────────┼─────────────────┘
                                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      GitHub Actions Workflow                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. Parse Config    2. Checkout       3. Rebrand       4. Generate     │
│     from Issue         Submodule         Source           Icons        │
│        │                  │                │                │          │
│        ▼                  ▼                ▼                ▼          │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐    ┌──────────┐     │
│  │  JSON    │      │ git      │      │ bash     │    │ magick   │     │
│  │  Parse   │      │ submodule│      │ scripts  │    │ convert  │     │
│  └──────────┘      └──────────┘      └──────────┘    └──────────┘     │
│                                                                         │
│  5. Build          6. Create        7. Send         8. Update          │
│     Platforms         Release          Email           Issue           │
│        │                │                │               │              │
│        ▼                ▼                ▼               ▼              │
│  ┌──────────┐      ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │ Gradle   │      │ gh       │    │ SMTP     │    │ gh api   │       │
│  │ Xcode    │      │ release  │    │ Action   │    │ comment  │       │
│  └──────────┘      └──────────┘    └──────────┘    └──────────┘       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Issue-Based Build Trigger

### Issue Format

```markdown
---
title: Build Request - {project-name} - {timestamp}
labels: build-request
---

```json
{
  "id": "uuid-here",
  "version": "3.0",
  "createdAt": "2025-01-06T12:00:00Z",
  "auth": {
    "type": "anonymous",
    "email": "user@example.com"
  },
  "organization": {
    "name": "Acme Financial",
    "email": "user@example.com",
    "website": "https://acmefinancial.com",
    "phone": "+1-555-123-4567"
  },
  "baseApp": "mobile-wallet",
  "project": {
    "name": "acme-wallet",
    "displayName": "Acme Wallet",
    "packageName": "com.acmefinancial.wallet",
    "description": "Mobile banking for Acme customers",
    "version": "1.0.0"
  },
  "branding": {
    "primaryColor": "#1E40AF",
    "secondaryColor": "#3B82F6",
    "accentColor": "#F59E0B",
    "darkMode": true
  },
  "icon": {
    "source": "base64-encoded-image-data",
    "shape": "rounded",
    "backgroundColor": "#FFFFFF",
    "padding": 10
  },
  "platforms": {
    "android": true,
    "ios": false,
    "desktop": {
      "enabled": false,
      "windows": false,
      "macos": false,
      "linux": false
    },
    "web": false
  }
}
```
```

### Issue Labels

| Label | Purpose |
|-------|---------|
| `build-request` | Triggers the build workflow |
| `building` | Added when build starts |
| `build-complete` | Added when build succeeds |
| `build-failed` | Added when build fails |

---

## Workflow Definition

### Main Workflow File

```yaml
# .github/workflows/build-custom-app.yml
name: Build Custom App

on:
  issues:
    types: [opened, labeled]

jobs:
  validate:
    if: contains(github.event.issue.labels.*.name, 'build-request')
    runs-on: ubuntu-latest
    outputs:
      config: ${{ steps.parse.outputs.config }}
      valid: ${{ steps.validate.outputs.valid }}
    steps:
      - name: Parse build configuration
        id: parse
        uses: actions/github-script@v7
        with:
          script: |
            const body = context.payload.issue.body;
            const jsonMatch = body.match(/```json\n([\s\S]*?)\n```/);
            if (!jsonMatch) {
              core.setFailed('No JSON configuration found in issue body');
              return;
            }
            const config = JSON.parse(jsonMatch[1]);
            core.setOutput('config', JSON.stringify(config));

      - name: Validate configuration
        id: validate
        run: |
          # Validate required fields
          echo "valid=true" >> $GITHUB_OUTPUT

  build-android:
    needs: validate
    if: needs.validate.outputs.valid == 'true' && fromJson(needs.validate.outputs.config).platforms.android
    runs-on: ubuntu-latest
    steps:
      - name: Checkout with submodules
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Decode icon
        run: |
          echo '${{ fromJson(needs.validate.outputs.config).icon.source }}' | base64 -d > icon.png

      - name: Run rebrand scripts
        run: |
          CONFIG='${{ needs.validate.outputs.config }}'
          .github/scripts/rebrand.sh "$CONFIG"

      - name: Generate Android icons
        run: |
          .github/scripts/generate-icons.sh icon.png android

      - name: Build Android APK
        working-directory: ./submodules/${{ fromJson(needs.validate.outputs.config).baseApp }}
        run: ./gradlew assembleRelease

      - name: Upload Android artifact
        uses: actions/upload-artifact@v4
        with:
          name: android-apk
          path: ./submodules/**/build/outputs/apk/release/*.apk

  build-ios:
    needs: validate
    if: needs.validate.outputs.valid == 'true' && fromJson(needs.validate.outputs.config).platforms.ios
    runs-on: macos-latest
    steps:
      # iOS build steps...

  build-desktop:
    needs: validate
    if: needs.validate.outputs.valid == 'true' && fromJson(needs.validate.outputs.config).platforms.desktop.enabled
    runs-on: ubuntu-latest
    steps:
      # Desktop build steps...

  build-web:
    needs: validate
    if: needs.validate.outputs.valid == 'true' && fromJson(needs.validate.outputs.config).platforms.web
    runs-on: ubuntu-latest
    steps:
      # Web build steps...

  release:
    needs: [validate, build-android, build-ios, build-desktop, build-web]
    if: always() && needs.validate.outputs.valid == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Download all artifacts
        uses: actions/download-artifact@v4

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          tag_name: build-${{ fromJson(needs.validate.outputs.config).id }}
          name: ${{ fromJson(needs.validate.outputs.config).project.displayName }} v${{ fromJson(needs.validate.outputs.config).project.version }}
          body: |
            Custom build for ${{ fromJson(needs.validate.outputs.config).organization.name }}

            **Project**: ${{ fromJson(needs.validate.outputs.config).project.displayName }}
            **Version**: ${{ fromJson(needs.validate.outputs.config).project.version }}
            **Package**: ${{ fromJson(needs.validate.outputs.config).project.packageName }}
          files: |
            android-apk/*.apk
            ios-ipa/*.ipa
            desktop-*/*
            web-build/*

      - name: Send Email Notification
        uses: dawidd6/action-send-mail@v3
        with:
          server_address: ${{ secrets.SMTP_SERVER }}
          server_port: ${{ secrets.SMTP_PORT }}
          username: ${{ secrets.SMTP_USERNAME }}
          password: ${{ secrets.SMTP_PASSWORD }}
          subject: Your MifosLaunchpad build is ready!
          to: ${{ fromJson(needs.validate.outputs.config).auth.email }}
          from: MifosLaunchpad <noreply@mifos.org>
          body: |
            Your custom app build is ready!

            Project: ${{ fromJson(needs.validate.outputs.config).project.displayName }}
            Download: https://github.com/${{ github.repository }}/releases/tag/build-${{ fromJson(needs.validate.outputs.config).id }}

      - name: Comment on Issue
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.issue.number,
              body: `## Build Complete!

            Your custom app has been built successfully.

            **Download**: [Release Page](https://github.com/${context.repo.owner}/${context.repo.repo}/releases/tag/build-${{ fromJson(needs.validate.outputs.config).id }})

            ### Artifacts
            ${needs['build-android'].result === 'success' ? '- Android APK' : ''}
            ${needs['build-ios'].result === 'success' ? '- iOS IPA' : ''}
            ${needs['build-desktop'].result === 'success' ? '- Desktop Apps' : ''}
            ${needs['build-web'].result === 'success' ? '- Web Build' : ''}
            `
            });

      - name: Update Issue Labels
        uses: actions/github-script@v7
        with:
          script: |
            await github.rest.issues.removeLabel({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.issue.number,
              name: 'building'
            });
            await github.rest.issues.addLabels({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.issue.number,
              labels: ['build-complete']
            });
            await github.rest.issues.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.payload.issue.number,
              state: 'closed'
            });
```

---

## Rebrand Scripts

### Main Orchestrator

```bash
#!/bin/bash
# .github/scripts/rebrand.sh

set -e

CONFIG="$1"
BASE_APP=$(echo "$CONFIG" | jq -r '.baseApp')
SUBMODULE_PATH="./submodules/$BASE_APP"

echo "Rebranding $BASE_APP..."

# Run platform-specific rebrand scripts
.github/scripts/rebrand-gradle.sh "$CONFIG" "$SUBMODULE_PATH"
.github/scripts/rebrand-android.sh "$CONFIG" "$SUBMODULE_PATH"
.github/scripts/rebrand-network.sh "$CONFIG" "$SUBMODULE_PATH"
.github/scripts/rebrand-ios.sh "$CONFIG" "$SUBMODULE_PATH"
.github/scripts/rebrand-web.sh "$CONFIG" "$SUBMODULE_PATH"

echo "Rebrand complete!"
```

### Gradle Rebrand

```bash
#!/bin/bash
# .github/scripts/rebrand-gradle.sh

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

# Extract values
APP_ID=$(echo "$CONFIG" | jq -r '.project.packageName')
APP_NAME=$(echo "$CONFIG" | jq -r '.project.name')
VERSION_NAME=$(echo "$CONFIG" | jq -r '.project.version')
VERSION_CODE=$(date +%Y%m%d%H)

LIBS_FILE="$SUBMODULE_PATH/gradle/libs.versions.toml"

echo "Updating libs.versions.toml..."

# Update applicationId
sed -i "s/applicationId = \".*\"/applicationId = \"$APP_ID\"/" "$LIBS_FILE"

# Update appName
sed -i "s/appName = \".*\"/appName = \"$APP_NAME\"/" "$LIBS_FILE"

# Update version
sed -i "s/versionName = \".*\"/versionName = \"$VERSION_NAME\"/" "$LIBS_FILE"
sed -i "s/versionCode = \".*\"/versionCode = \"$VERSION_CODE\"/" "$LIBS_FILE"

echo "libs.versions.toml updated"
```

### Android Rebrand

```bash
#!/bin/bash
# .github/scripts/rebrand-android.sh

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

# Extract values
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
ORG_NAME=$(echo "$CONFIG" | jq -r '.organization.name')

# Find and update strings.xml files
find "$SUBMODULE_PATH" -name "strings.xml" -type f | while read file; do
  echo "Updating $file..."

  # Update app_name
  sed -i "s/<string name=\"app_name\">.*<\/string>/<string name=\"app_name\">$DISPLAY_NAME<\/string>/" "$file"

  # Update organization name if exists
  sed -i "s/<string name=\"org_name\">.*<\/string>/<string name=\"org_name\">$ORG_NAME<\/string>/" "$file"
done

echo "Android strings updated"
```

### Network/URL Rebrand

```bash
#!/bin/bash
# .github/scripts/rebrand-network.sh

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

# NOTE: Server config is passed at build time, not saved
# For now, we use default development server
# Users configure runtime URLs in their own builds

# Extract server config if provided (runtime only)
SERVER_PROTOCOL=$(echo "$CONFIG" | jq -r '.serverConfig.selfHosted.protocol // "https"')
SERVER_HOST=$(echo "$CONFIG" | jq -r '.serverConfig.selfHosted.host // "demo.mifos.io"')
SERVER_PORT=$(echo "$CONFIG" | jq -r '.serverConfig.selfHosted.port // 443')
API_PATH=$(echo "$CONFIG" | jq -r '.serverConfig.selfHosted.apiPath // "/fineract-provider/api/v1"')

BASE_URL="${SERVER_PROTOCOL}://${SERVER_HOST}"
if [ "$SERVER_PORT" != "443" ] && [ "$SERVER_PORT" != "80" ]; then
  BASE_URL="${BASE_URL}:${SERVER_PORT}"
fi
BASE_URL="${BASE_URL}${API_PATH}"

# Find BaseURL.kt files
find "$SUBMODULE_PATH" -name "BaseURL.kt" -type f | while read file; do
  echo "Updating $file..."
  # Update base URL constant
  sed -i "s|const val PROTOCOL_HTTPS = \".*\"|const val PROTOCOL_HTTPS = \"$SERVER_PROTOCOL\"|" "$file"
  sed -i "s|const val API_ENDPOINT = \".*\"|const val API_ENDPOINT = \"$SERVER_HOST\"|" "$file"
  sed -i "s|const val API_PATH = \".*\"|const val API_PATH = \"$API_PATH\"|" "$file"
done

echo "Network config updated"
```

### iOS Rebrand

```bash
#!/bin/bash
# .github/scripts/rebrand-ios.sh

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

# Extract values
BUNDLE_ID=$(echo "$CONFIG" | jq -r '.project.packageName')
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
VERSION=$(echo "$CONFIG" | jq -r '.project.version')

# Update Config.xcconfig
CONFIG_FILE=$(find "$SUBMODULE_PATH" -name "Config.xcconfig" -type f | head -1)
if [ -n "$CONFIG_FILE" ]; then
  echo "Updating $CONFIG_FILE..."
  sed -i "s/PRODUCT_BUNDLE_IDENTIFIER = .*/PRODUCT_BUNDLE_IDENTIFIER = $BUNDLE_ID/" "$CONFIG_FILE"
  sed -i "s/PRODUCT_NAME = .*/PRODUCT_NAME = $DISPLAY_NAME/" "$CONFIG_FILE"
  sed -i "s/MARKETING_VERSION = .*/MARKETING_VERSION = $VERSION/" "$CONFIG_FILE"
fi

echo "iOS config updated"
```

### Web Rebrand

```bash
#!/bin/bash
# .github/scripts/rebrand-web.sh

set -e

CONFIG="$1"
SUBMODULE_PATH="$2"

# Extract values
DISPLAY_NAME=$(echo "$CONFIG" | jq -r '.project.displayName')
DESCRIPTION=$(echo "$CONFIG" | jq -r '.project.description // "Mobile Banking Application"')
PRIMARY_COLOR=$(echo "$CONFIG" | jq -r '.branding.primaryColor')

# Update index.html
INDEX_FILE=$(find "$SUBMODULE_PATH" -path "*/webApp/index.html" -type f | head -1)
if [ -n "$INDEX_FILE" ]; then
  echo "Updating $INDEX_FILE..."
  sed -i "s/<title>.*<\/title>/<title>$DISPLAY_NAME<\/title>/" "$INDEX_FILE"
  sed -i "s/<meta name=\"description\" content=\".*\">/<meta name=\"description\" content=\"$DESCRIPTION\">/" "$INDEX_FILE"
  sed -i "s/<meta name=\"theme-color\" content=\".*\">/<meta name=\"theme-color\" content=\"$PRIMARY_COLOR\">/" "$INDEX_FILE"
fi

echo "Web config updated"
```

---

## Icon Generation Script

```bash
#!/bin/bash
# .github/scripts/generate-icons.sh

set -e

INPUT_ICON="$1"
PLATFORM="$2"  # android, ios, desktop, web, or all

# Ensure ImageMagick is installed
if ! command -v magick &> /dev/null; then
  echo "Installing ImageMagick..."
  sudo apt-get update && sudo apt-get install -y imagemagick
fi

generate_android_icons() {
  local src="$1"
  local dest_base="$2"

  echo "Generating Android icons..."

  # Mipmap densities
  declare -A sizes=(
    ["mdpi"]=48
    ["hdpi"]=72
    ["xhdpi"]=96
    ["xxhdpi"]=144
    ["xxxhdpi"]=192
  )

  for density in "${!sizes[@]}"; do
    size=${sizes[$density]}
    dest_dir="$dest_base/mipmap-$density"
    mkdir -p "$dest_dir"

    magick "$src" -resize ${size}x${size} "$dest_dir/ic_launcher.png"
    magick "$src" -resize ${size}x${size} "$dest_dir/ic_launcher_round.png"
  done

  # Foreground for adaptive icons
  magick "$src" -resize 432x432 "$dest_base/mipmap-xxxhdpi/ic_launcher_foreground.png"
}

generate_ios_icons() {
  local src="$1"
  local dest_base="$2"

  echo "Generating iOS icons..."

  # iOS icon sizes
  local sizes=(20 29 40 58 60 76 80 87 120 152 167 180 1024)

  dest_dir="$dest_base/Assets.xcassets/AppIcon.appiconset"
  mkdir -p "$dest_dir"

  for size in "${sizes[@]}"; do
    magick "$src" -resize ${size}x${size} "$dest_dir/icon_${size}x${size}.png"
  done

  # Generate Contents.json
  # ... (icon set metadata)
}

generate_desktop_icons() {
  local src="$1"
  local dest_base="$2"

  echo "Generating Desktop icons..."

  # Windows ICO
  magick "$src" -define icon:auto-resize=256,128,96,64,48,32,16 "$dest_base/app.ico"

  # macOS ICNS sizes
  for size in 16 32 128 256 512 1024; do
    magick "$src" -resize ${size}x${size} "$dest_base/icon_${size}x${size}.png"
  done

  # Linux PNG
  for size in 16 24 32 48 64 128 256 512; do
    mkdir -p "$dest_base/linux/${size}x${size}"
    magick "$src" -resize ${size}x${size} "$dest_base/linux/${size}x${size}/app.png"
  done
}

generate_web_icons() {
  local src="$1"
  local dest_base="$2"

  echo "Generating Web icons..."

  # Favicon
  magick "$src" -define icon:auto-resize=32,16 "$dest_base/favicon.ico"

  # Apple touch icon
  magick "$src" -resize 180x180 "$dest_base/apple-touch-icon.png"

  # Android Chrome icons
  magick "$src" -resize 192x192 "$dest_base/android-chrome-192x192.png"
  magick "$src" -resize 512x512 "$dest_base/android-chrome-512x512.png"

  # OG Image (with padding)
  magick "$src" -resize 630x630 -gravity center -background white -extent 1200x630 "$dest_base/og-image.png"
}

# Main execution
case "$PLATFORM" in
  android)
    generate_android_icons "$INPUT_ICON" "./output/android"
    ;;
  ios)
    generate_ios_icons "$INPUT_ICON" "./output/ios"
    ;;
  desktop)
    generate_desktop_icons "$INPUT_ICON" "./output/desktop"
    ;;
  web)
    generate_web_icons "$INPUT_ICON" "./output/web"
    ;;
  all)
    generate_android_icons "$INPUT_ICON" "./output/android"
    generate_ios_icons "$INPUT_ICON" "./output/ios"
    generate_desktop_icons "$INPUT_ICON" "./output/desktop"
    generate_web_icons "$INPUT_ICON" "./output/web"
    ;;
  *)
    echo "Usage: $0 <input-icon> <platform>"
    echo "Platforms: android, ios, desktop, web, all"
    exit 1
    ;;
esac

echo "Icon generation complete!"
```

---

## Rate Limiting Implementation

Rate limiting is enforced by checking existing issues:

```javascript
// In workflow or pre-build check
async function checkRateLimit(octokit, email, authType) {
  const limits = {
    anonymous: 3,
    github: 10,
    supabase: 20
  };

  const maxBuilds = limits[authType] || 3;

  // Get issues created today by this email
  const today = new Date().toISOString().split('T')[0];

  const { data: issues } = await octokit.rest.issues.listForRepo({
    owner: 'openMF',
    repo: 'mifos-x-launchpad',
    labels: 'build-request',
    since: `${today}T00:00:00Z`,
    state: 'all'
  });

  const userBuilds = issues.filter(issue => {
    try {
      const config = JSON.parse(issue.body.match(/```json\n([\s\S]*?)\n```/)[1]);
      return config.auth.email === email;
    } catch {
      return false;
    }
  });

  return {
    allowed: userBuilds.length < maxBuilds,
    remaining: Math.max(0, maxBuilds - userBuilds.length),
    total: maxBuilds
  };
}
```

---

## Error Handling

### Build Failure Notification

When a build fails:
1. Comment on issue with error details
2. Add `build-failed` label
3. Send failure email with troubleshooting steps
4. Keep issue open for debugging

### Common Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| Invalid JSON | Malformed config | Show validation errors |
| Rate limit exceeded | Too many builds | Show remaining time |
| Build timeout | Long build time | Retry or notify |
| Asset not found | Missing icon | Require icon upload |

---

## Secrets Required

| Secret | Purpose |
|--------|---------|
| `SMTP_SERVER` | Email server address |
| `SMTP_PORT` | Email server port |
| `SMTP_USERNAME` | Email account username |
| `SMTP_PASSWORD` | Email account password |
| `SIGNING_KEY` | Android signing key |
| `SIGNING_ALIAS` | Android key alias |
| `SIGNING_PASSWORD` | Android key password |
| `APPLE_CERTIFICATE` | iOS signing certificate |
| `APPLE_CERTIFICATE_PASSWORD` | Certificate password |

---

## Testing

### Local Testing

```bash
# Test rebrand scripts locally
export CONFIG='{"project":{"name":"test-app"}}'
.github/scripts/rebrand-gradle.sh "$CONFIG" "./test-submodule"

# Test icon generation
.github/scripts/generate-icons.sh ./test-icon.png all
```

### Workflow Testing

1. Create test issue with `build-request` label
2. Monitor workflow execution
3. Verify artifacts in release
4. Check email delivery
