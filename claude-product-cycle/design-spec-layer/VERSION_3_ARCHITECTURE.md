# MifosLaunchpad V3.0 Architecture

**Version**: 3.0.0
**Date**: 2025-01-06
**Status**: In Development

---

## Overview

V3.0 introduces a submodule-based architecture that eliminates the need for users to fork repositories. Instead, MifosLaunchpad hosts the source applications as git submodules and builds customized versions on-demand using GitHub Actions.

## Key Changes from V2

| Feature | V2 (Fork-based) | V3 (Submodule-based) |
|---------|-----------------|----------------------|
| Repository | User forks template | Builds from submodules |
| Build Location | User's GitHub account | mifos-x-launchpad repo |
| Authentication | Required (GitHub PAT) | Optional (Anonymous available) |
| Server Config | Saved to configuration | Runtime only (never saved) |
| Organization | Optional fields | Mandatory (in onboarding) |
| Icon Generation | Client-side preview | Server-side (all platforms) |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MifosLaunchpad Web App                          │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │    Login     │  │  Onboarding  │  │    Wizard    │                  │
│  │  (Optional)  │→ │  (Org Info)  │→ │  (10 Steps)  │                  │
│  └──────────────┘  └──────────────┘  └──────────────┘                  │
│         │                 │                 │                           │
│         ▼                 ▼                 ▼                           │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │                     Build Configuration                         │    │
│  │  - Organization (from onboarding)                               │    │
│  │  - Project details (step 2)                                     │    │
│  │  - Branding (step 3)                                            │    │
│  │  - Icons (step 4)                                               │    │
│  │  - Platforms (step 6)                                           │    │
│  │  - Server config (runtime only - NOT saved)                     │    │
│  └────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    GitHub Repository (mifos-x-launchpad)                │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────┐                                                     │
│  │ GitHub Issue   │ ← Build triggered via Issue creation                │
│  │ (Build Config) │                                                     │
│  └────────────────┘                                                     │
│          │                                                              │
│          ▼                                                              │
│  ┌────────────────────────────────────────────────────────────────┐    │
│  │              GitHub Actions Workflow                            │    │
│  │  1. Parse build configuration from issue                        │    │
│  │  2. Checkout submodule (mobile-wallet or mifos-mobile)         │    │
│  │  3. Run rebrand scripts                                         │    │
│  │  4. Generate icons for all platforms                            │    │
│  │  5. Build for selected platforms                                │    │
│  │  6. Create release with artifacts                               │    │
│  │  7. Send email notification                                     │    │
│  │  8. Comment on issue with results                               │    │
│  └────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐                            │
│  │    submodules/   │  │    .github/      │                            │
│  │  mobile-wallet/  │  │   workflows/     │                            │
│  │  mifos-mobile/   │  │   scripts/       │                            │
│  └──────────────────┘  └──────────────────┘                            │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow

### Login Options

1. **Anonymous** (Default)
   - No sign-in required
   - User provides email for build notifications
   - Rate-limited (configurable builds per day)

2. **GitHub**
   - OAuth authentication
   - Links builds to GitHub account
   - Higher rate limits
   - Can trigger builds directly

3. **Supabase** (Coming Soon)
   - Email/password authentication
   - Persistent user accounts
   - Build history
   - Team features

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Login Page                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│     ┌─────────────────────────────────────────────────────┐     │
│     │        Welcome to MifosLaunchpad                     │     │
│     │        Create white-labeled mobile banking apps      │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                  │
│     ┌──────────────────┐  ┌──────────────────┐                  │
│     │  Continue as     │  │  Sign in with    │                  │
│     │  Anonymous       │  │  GitHub          │                  │
│     │  (Rate Limited)  │  │  (Higher Limits) │                  │
│     └────────┬─────────┘  └────────┬─────────┘                  │
│              │                      │                            │
│              └──────────┬───────────┘                           │
│                         ▼                                        │
│              ┌─────────────────────┐                            │
│              │    Onboarding       │                            │
│              │  (Organization)     │                            │
│              └─────────────────────┘                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Onboarding Flow (Organization Details)

All users (anonymous or authenticated) must provide organization details before proceeding to the wizard.

### Required Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Organization Name | string | Yes | Legal organization name |
| Email | string | Yes | For build notifications |
| Website | string | No | Organization website |
| Phone | string | No | Contact phone number |

### Storage

- **Anonymous**: Stored in localStorage, included in build config
- **GitHub**: Associated with GitHub account
- **Supabase**: Stored in user profile

---

## Build Configuration Schema

```typescript
interface BuildConfigV3 {
  // Metadata
  id: string;                    // UUID
  version: '3.0';
  createdAt: string;             // ISO timestamp

  // Authentication
  auth: {
    type: 'anonymous' | 'github' | 'supabase';
    userId?: string;             // GitHub username or Supabase ID
    email: string;               // Required for notifications
  };

  // Organization (from onboarding)
  organization: {
    name: string;                // Required
    email: string;               // Required (same as auth.email)
    website?: string;
    phone?: string;
  };

  // Base Application
  baseApp: 'mobile-wallet' | 'mifos-mobile';

  // Project Configuration (Step 2)
  project: {
    name: string;                // e.g., "my-bank-app"
    displayName: string;         // e.g., "My Bank"
    packageName: string;         // e.g., "com.mybank.app"
    description?: string;
    version: string;             // e.g., "1.0.0"
  };

  // Branding (Step 3)
  branding: {
    primaryColor: string;        // Hex color
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
    colorScheme?: {
      light: ThemeColors;
      dark: ThemeColors;
    };
  };

  // Icon (Step 4)
  icon: {
    source: string;              // Base64 encoded image
    shape: 'circle' | 'rounded' | 'squircle' | 'square';
    backgroundColor: string;
    padding: number;             // 0-20%
  };

  // Platforms (Step 6)
  platforms: {
    android: boolean;
    ios: boolean;
    desktop: {
      enabled: boolean;
      windows: boolean;
      macos: boolean;
      linux: boolean;
    };
    web: boolean;
  };

  // Features (Step 7) - Optional customizations
  features?: {
    analytics?: boolean;
    pushNotifications?: boolean;
    biometricAuth?: boolean;
  };

  // NOTE: Server config is NOT included - it's runtime only
}

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  border: string;
}
```

---

## Rebrand Scripts

### Script Architecture

```
.github/scripts/
├── rebrand.sh                 # Main orchestrator
├── rebrand-gradle.sh          # libs.versions.toml modifications
├── rebrand-android.sh         # Android-specific (strings.xml, etc.)
├── rebrand-network.sh         # BaseURL.kt, network config
├── rebrand-ios.sh             # iOS Info.plist, Config.xcconfig
├── rebrand-web.sh             # Web index.html, manifest
└── generate-icons.sh          # ImageMagick icon generation
```

### Files Modified by Rebrand

| File | Script | Changes |
|------|--------|---------|
| `gradle/libs.versions.toml` | rebrand-gradle.sh | applicationId, appName, versionCode, versionName |
| `android/strings.xml` | rebrand-android.sh | app_name, org_name |
| `shared/.../BaseURL.kt` | rebrand-network.sh | Server URLs (from runtime config) |
| `iosApp/Config.xcconfig` | rebrand-ios.sh | Bundle ID, display name |
| `webApp/index.html` | rebrand-web.sh | Title, meta tags |

### Icon Generation

```bash
# generate-icons.sh
# Input: Single high-res icon (1024x1024 recommended)
# Output: All platform-specific icon sizes

# Android (res/mipmap-*)
- mdpi: 48x48
- hdpi: 72x72
- xhdpi: 96x96
- xxhdpi: 144x144
- xxxhdpi: 192x192

# iOS (Assets.xcassets)
- 20pt: 20x20, 40x40, 60x60
- 29pt: 29x29, 58x58, 87x87
- 40pt: 40x40, 80x80, 120x120
- 60pt: 120x120, 180x180
- 76pt: 76x76, 152x152
- 83.5pt: 167x167
- 1024pt: 1024x1024

# Desktop
- Windows: .ico (16, 32, 48, 256)
- macOS: .icns (16, 32, 128, 256, 512, 1024)
- Linux: .png (multiple sizes)

# Web
- favicon.ico: 16x16, 32x32
- apple-touch-icon.png: 180x180
- android-chrome-*.png: 192x192, 512x512
- og-image.png: 1200x630
```

---

## GitHub Actions Workflow

### Workflow Trigger

Builds are triggered by creating a GitHub Issue with a specific label and JSON configuration in the body.

```yaml
# .github/workflows/build-custom-app.yml
name: Build Custom App

on:
  issues:
    types: [opened, labeled]

jobs:
  build:
    if: contains(github.event.issue.labels.*.name, 'build-request')
    runs-on: ubuntu-latest

    steps:
      - name: Parse build configuration
        id: config
        run: |
          # Extract JSON from issue body

      - name: Checkout with submodules
        uses: actions/checkout@v4
        with:
          submodules: recursive

      - name: Run rebrand scripts
        run: |
          .github/scripts/rebrand.sh

      - name: Generate icons
        run: |
          .github/scripts/generate-icons.sh

      - name: Build Android
        if: fromJson(steps.config.outputs.config).platforms.android
        run: ./gradlew assembleRelease

      - name: Build iOS
        if: fromJson(steps.config.outputs.config).platforms.ios
        run: # iOS build steps

      - name: Build Desktop
        if: fromJson(steps.config.outputs.config).platforms.desktop.enabled
        run: # Desktop build steps

      - name: Build Web
        if: fromJson(steps.config.outputs.config).platforms.web
        run: # Web build steps

      - name: Create Release
        run: |
          # Create release with all artifacts

      - name: Send Email Notification
        run: |
          # Send completion email

      - name: Comment on Issue
        run: |
          # Add comment with download links
```

---

## Rate Limiting

### Limits by Auth Type

| Auth Type | Daily Builds | Concurrent Builds | Notes |
|-----------|--------------|-------------------|-------|
| Anonymous | 3 | 1 | Based on email |
| GitHub | 10 | 2 | Based on username |
| Supabase | 20 | 3 | Based on user ID |

### Implementation

Rate limiting is enforced by:
1. Checking existing open issues with same identifier
2. Counting completed builds in last 24 hours
3. Rejecting new builds if limits exceeded

---

## Wizard Flow Updates

### Removed from Wizard
- Organization fields (moved to onboarding)
- Server configuration persistence (runtime only)

### Step 2 (Project Info) - Updated
- Only project-specific fields
- No organization section

### Step 5 (Server Config) - Updated
- Toggle: Localhost / Self-hosted
- Runtime only - config not saved
- Used during build but not persisted

### Step 10 (Review & Generate) - Updated
- No longer creates fork
- Creates GitHub Issue with build config
- Shows build progress via issue status

---

## Migration from V2

Users with V2 configurations will:
1. Be prompted to complete onboarding (org details)
2. Have server config cleared (runtime only now)
3. Continue using wizard with new flow

---

## Implementation Phases

### Phase 1: Foundation
- [x] Design specifications
- [ ] Add git submodules
- [ ] Create login page
- [ ] Create onboarding flow
- [ ] Update wizard store

### Phase 2: Build System
- [ ] Create rebrand scripts
- [ ] Create icon generation script
- [ ] Create GitHub Actions workflow
- [ ] Test end-to-end build

### Phase 3: Integration
- [ ] Update Step 10 for issue-based builds
- [ ] Implement build status tracking
- [ ] Add email notifications
- [ ] Rate limiting

### Phase 4: Polish
- [ ] Error handling
- [ ] Progress indicators
- [ ] Build history (authenticated users)
- [ ] Documentation
