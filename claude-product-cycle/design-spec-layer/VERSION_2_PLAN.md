# MifosLaunchpad v2.0 - Implementation Plan

**Created**: 2026-01-05
**Status**: Planning

---

## Overview

Transform MifosLaunchpad from a configuration wizard to a **full project generator** that:
1. Clones the selected base app (mifos-mobile, mobile-wallet, android-client)
2. Customizes all branding and configuration
3. Builds and outputs **platform executables** (APK, IPA, DMG, EXE, DEB)

---

## Key Changes from v1.0

| Area | v1.0 (Current) | v2.0 (Planned) |
|------|----------------|----------------|
| Output | Mock ZIP | **Platform executables (APK, IPA, DMG, EXE)** |
| SDK Config | Manual entry | **Read-only from selected project** |
| Version Info | Manual entry | **Automatic (1.0.0 + build number)** |
| Project Source | None | **Clone based on Step 1 selection** |
| Build Process | None | **GitHub Actions / Local build** |

---

## Phase 1: Dynamic Project Source

### 1.1 App Selection → Repository Mapping

Based on Step 1 selection, clone the corresponding repository:

| App Selection | Repository | Branch |
|---------------|------------|--------|
| `mobile-wallet` | `openMF/mobile-wallet` | `dev` |
| `mifos-mobile` | `openMF/mifos-mobile` | `dev` |
| `android-client` | `openMF/android-client` | `dev` |
| `blank` | `openMF/kmp-project-template` | `main` |

```typescript
const APP_REPOSITORIES: Record<AppType, RepoConfig> = {
  'mobile-wallet': {
    owner: 'openMF',
    repo: 'mobile-wallet',
    branch: 'dev',
  },
  'mifos-mobile': {
    owner: 'openMF',
    repo: 'mifos-mobile',
    branch: 'dev',
  },
  'android-client': {
    owner: 'openMF',
    repo: 'android-client',
    branch: 'dev',
  },
  'blank': {
    owner: 'openMF',
    repo: 'kmp-project-template',
    branch: 'main',
  },
};
```

### 1.2 SDK Auto-Detection (Read-Only)

After app selection, fetch `gradle/libs.versions.toml` and display as read-only:

**Values to Extract:**
```toml
# From selected project's libs.versions.toml
kotlin = "2.1.20"
compose-plugin = "1.8.2"
androidGradlePlugin = "8.10.0"
packageName = "Mifos Mobile"
packageNamespace = "org.mifos.mobile"
packageVersion = "1.0.0"
```

**Step 2 UI Changes:**
- Remove editable SDK fields
- Show SDK info as read-only badges:
  - `Kotlin 2.1.20` | `Compose 1.8.2` | `AGP 8.10.0`
  - `Min Android: 24` | `Target: 34` | `Min iOS: 15.0`

### 1.3 Automatic Version Management

**Remove manual version input. Use automatic versioning:**

```typescript
const versionConfig = {
  versionName: '1.0.0',  // Fixed or from user input in Step 2
  versionCode: Date.now(), // Auto-generated build number
};
```

---

## Phase 2: File Customization

### 2.1 Files to Modify

| File | What to Change |
|------|----------------|
| `gradle/libs.versions.toml` | `packageName`, `packageNamespace`, `androidPackageNamespace` |
| `cmp-android/src/main/res/values/strings.xml` | `app_name`, `feature_about_app_name`, all "Mifos Mobile" strings |
| `cmp-ios/Configuration/Config.xcconfig` | `TEAM_ID`, `BUNDLE_ID`, `APP_NAME` |
| `cmp-desktop/build.gradle.kts` | Uses `libs.versions.packageName` (auto via toml) |
| `cmp-web/**/*` | Replace all "Mifos-Mobile" / "Mifos Mobile" strings with project name |
| `.github/workflows/*.yml` | Update workflow inputs |
| `README.md` | Project name, description |

### 2.2 gradle/libs.versions.toml Replacements

```toml
# BEFORE
packageName = "Mifos Mobile"
packageNamespace = "org.mifos.mobile"
androidPackageNamespace = "org.mifos.mobile"

# AFTER (from Step 2)
packageName = "{{DISPLAY_NAME}}"           # "My Bank App"
packageNamespace = "{{PACKAGE_NAME}}"      # "com.mybank.app"
androidPackageNamespace = "{{PACKAGE_NAME}}"
```

### 2.3 Android strings.xml Replacements

```xml
<!-- BEFORE -->
<string name="app_name" translatable="false">Mifos Mobile</string>
<string name="feature_about_app_name" translatable="false">Mifos Mobile</string>
<string name="help_line_number" translatable="false">8000000000</string>
<string name="contact_email" translatable="false">support@mifos.org</string>

<!-- AFTER (from Step 2 & Step 7) -->
<string name="app_name" translatable="false">{{DISPLAY_NAME}}</string>
<string name="feature_about_app_name" translatable="false">{{DISPLAY_NAME}}</string>
<string name="help_line_number" translatable="false">{{SUPPORT_PHONE}}</string>
<string name="contact_email" translatable="false">{{SUPPORT_EMAIL}}</string>
```

### 2.4 iOS Config.xcconfig Replacements

```xcconfig
# BEFORE
TEAM_ID=L432S2FZP5
BUNDLE_ID=org.mifos.mobile
APP_NAME=Mifos Mobile

# AFTER (from Step 2 & Step 8)
TEAM_ID={{TEAM_ID}}
BUNDLE_ID={{PACKAGE_NAME}}
APP_NAME={{DISPLAY_NAME}}
```

### 2.5 cmp-web String Replacements

**Search and replace all occurrences of:**
- `"Mifos-Mobile"` → `"{{PROJECT_NAME}}"`
- `"Mifos Mobile"` → `"{{DISPLAY_NAME}}"`
- `"mifos-mobile"` → `"{{PROJECT_NAME_LOWERCASE}}"`

**Files to scan:**
- `cmp-web/src/**/*.kt`
- `cmp-web/src/**/*.html`
- `cmp-web/webpack.config.d/*.js`

### 2.6 Desktop build.gradle.kts

**No direct changes needed** - it reads from `libs.versions.toml`:
```kotlin
val appName: String = libs.versions.packageName.get()
val packageNameSpace: String = libs.versions.packageNamespace.get()
```

---

## Phase 3: Step 8 CI/CD Enhancements

### 3.1 New iOS Configuration Fields

Add to Step 8 for iOS builds:

| Field | Required | Description | Example |
|-------|----------|-------------|---------|
| Team ID | Yes (iOS) | Apple Developer Team ID | `L432S2FZP5` |
| Bundle ID | Auto | From package name | `com.mybank.app` |
| Provisioning Git URL | Yes (iOS) | iOS certs repo | `git@github.com:org/certs.git` |
| Provisioning Branch | Yes (iOS) | Branch name | `mybank-app` |
| Match Type | Yes (iOS) | adhoc / appstore | `adhoc` |

### 3.2 Firebase Configuration

| Field | Required | Description |
|-------|----------|-------------|
| Android App ID | Yes (Firebase) | `1:123456:android:abc123` |
| iOS App ID | Yes (Firebase) | `1:123456:ios:def456` |
| Tester Groups | Optional | `mybank-testers` |

### 3.3 Updated Step8State Interface

```typescript
export interface Step8State {
  ciPlatform: CIPlatform;

  // Existing
  firebase: FirebaseDistributionConfig;
  playStore: PlayStoreConfig;
  appStore: AppStoreConfig;
  releaseAutomation: ReleaseAutomationConfig;

  // NEW: iOS Signing
  iosConfig: {
    teamId: string;
    provisioningGitUrl: string;
    provisioningBranch: string;
    matchType: 'adhoc' | 'appstore' | 'development';
    provisioningProfileName: string;
  };

  // NEW: macOS Signing (if desktop enabled)
  macosConfig: {
    teamId: string;
    notarizationAppleId: string;
  };
}
```

---

## Phase 4: Workflow Generation

### 4.1 Generate multi-platform-build-and-publish.yml

Based on Step 6 platform selection and Step 8 CI/CD config:

```yaml
name: Multi-Platform Build and Publish

on:
  workflow_dispatch:
    inputs:
      release_type:
        type: choice
        options:
          - internal
          - beta
        default: internal

permissions:
  contents: write
  id-token: write
  pages: write

jobs:
  multi_platform_build_and_publish:
    uses: openMF/mifos-x-actionhub/.github/workflows/multi-platform-build-and-publish.yaml@v1.0.7
    with:
      java-version: 21
      release_type: ${{ inputs.release_type }}
      target_branch: 'main'

      # Package names (fixed)
      android_package_name: 'cmp-android'
      ios_package_name: 'cmp-ios'
      desktop_package_name: 'cmp-desktop'
      web_package_name: 'cmp-web'

      # From Step 8
      tester_groups: '{{TESTER_GROUPS}}'
      app_identifier: '{{PACKAGE_NAME}}'
      git_url: '{{PROVISIONING_GIT_URL}}'
      git_branch: '{{PROVISIONING_BRANCH}}'
      match_type: '{{MATCH_TYPE}}'
      provisioning_profile_name: '{{PROVISIONING_PROFILE_NAME}}'
      firebase_app_id: '{{FIREBASE_IOS_APP_ID}}'

      # From Step 6 - Platform toggles
      distribute_ios_firebase: {{IOS_FIREBASE_ENABLED}}
      distribute_ios_testflight: {{IOS_TESTFLIGHT_ENABLED}}
      distribute_ios_appstore: {{IOS_APPSTORE_ENABLED}}
      distribute_macos_testflight: {{MACOS_TESTFLIGHT_ENABLED}}
      distribute_macos_appstore: {{MACOS_APPSTORE_ENABLED}}

    secrets:
      # User must configure these in their repo
      original_keystore_file: ${{ secrets.ORIGINAL_KEYSTORE_FILE }}
      # ... rest of secrets
```

### 4.2 Platform-Conditional Builds

Only include platforms selected in Step 6:

```typescript
function generateWorkflow(config: WizardState): string {
  const workflow = baseWorkflow();

  // Only include enabled platforms
  if (!config.step6.platforms.android.enabled) {
    workflow.removeJob('build_android');
  }
  if (!config.step6.platforms.ios.enabled) {
    workflow.removeJob('build_ios');
    workflow.removeInputs(['distribute_ios_*']);
  }
  if (!config.step6.platforms.desktop.enabled) {
    workflow.removeJob('build_desktop');
    workflow.removeInputs(['distribute_macos_*']);
  }
  if (!config.step6.platforms.web.enabled) {
    workflow.removeJob('build_web');
  }

  return workflow.toString();
}
```

---

## Phase 5: Build & Output Executables

### 5.1 Output Format

**ZIP containing platform executables:**

```
MyBankApp-v1.0.0-build123.zip
├── android/
│   ├── MyBankApp-release.apk
│   └── MyBankApp-release.aab
├── ios/
│   └── MyBankApp.ipa
├── desktop/
│   ├── windows/
│   │   ├── MyBankApp-1.0.0.exe
│   │   └── MyBankApp-1.0.0.msi
│   ├── macos/
│   │   ├── MyBankApp-1.0.0.dmg
│   │   └── MyBankApp-1.0.0.pkg
│   └── linux/
│       └── MyBankApp-1.0.0.deb
├── web/
│   └── MyBankApp-web.zip
└── README.md
```

### 5.2 Build Options

**Option A: Cloud Build (GitHub Actions)**
1. Generate customized project
2. Push to user's GitHub repo
3. Trigger workflow
4. Download artifacts when complete

**Option B: Local Build (Advanced)**
1. Generate customized project
2. Download as source ZIP
3. User builds locally with Gradle

### 5.3 Generation Flow

```typescript
async function generateExecutables(config: WizardState): Promise<void> {
  // 1. Clone selected app repository
  const repo = APP_REPOSITORIES[config.step1.selectedApp];
  const template = await cloneRepo(repo);

  // 2. Apply all customizations
  await customizeGradleVersions(template, config);
  await customizeAndroidStrings(template, config);
  await customizeIOSConfig(template, config);
  await customizeWebStrings(template, config);
  await generateWorkflow(template, config);

  // 3. Trigger build (GitHub Actions)
  if (config.buildMethod === 'cloud') {
    const repoUrl = await pushToGitHub(template, config);
    await triggerWorkflow(repoUrl);
    await waitForArtifacts(repoUrl);
    await downloadArtifacts(repoUrl);
  } else {
    // 4. Or download source for local build
    const zip = await createSourceZip(template);
    downloadFile(zip, `${config.step2.projectName}-source.zip`);
  }
}
```

---

## Implementation Checklist

### Sprint 1: Foundation
- [ ] Add repository mapping for each app type
- [ ] Implement repo cloning/fetching
- [ ] Parse libs.versions.toml for SDK info
- [ ] Make SDK fields read-only in Step 2
- [ ] Remove manual version fields, use auto versioning

### Sprint 2: File Generators
- [ ] Create gradle-generator.ts (libs.versions.toml)
- [ ] Create android-generator.ts (strings.xml)
- [ ] Create ios-generator.ts (Config.xcconfig)
- [ ] Create web-generator.ts (string replacements)
- [ ] Create workflow-generator.ts

### Sprint 3: Step 8 Enhancement
- [ ] Add iOS signing config fields
- [ ] Add provisioning config fields
- [ ] Add Firebase app IDs
- [ ] Update Step8State interface
- [ ] Create iOS config UI section

### Sprint 4: Build System
- [ ] Implement GitHub repo creation
- [ ] Implement workflow trigger
- [ ] Implement artifact download
- [ ] Create executable ZIP packaging
- [ ] Add build progress tracking

---

## UI/UX Changes Summary

### Step 1: App Selection
- No changes (already selects app type)

### Step 2: Project Info
```diff
- SDK Configuration
-   Min Android SDK: [dropdown]
-   Target Android SDK: [dropdown]
-   Min iOS Version: [dropdown]

+ SDK Configuration (Read-Only)
+   [Badge] Kotlin 2.1.20
+   [Badge] Compose 1.8.2
+   [Badge] Android 24-34
+   [Badge] iOS 15.0+

- Version Information
-   Version Name: [input]
-   Version Code: [input]

+ Version Information (Automatic)
+   Version: 1.0.0 (auto-incremented on each build)
```

### Step 8: CI/CD & Deployment
```diff
+ iOS Signing Configuration
+   Team ID: [input] *
+   Provisioning Git URL: [input] *
+   Provisioning Branch: [input] *
+   Match Type: [dropdown: adhoc/appstore] *
+
+ Firebase App IDs
+   Android App ID: [input]
+   iOS App ID: [input]
+   Tester Groups: [input]
```

### Step 10: Review & Generate
```diff
- Generate Project [button]
+ Build Options
+   [Radio] Cloud Build (GitHub Actions) - Recommended
+   [Radio] Download Source (Local Build)
+
+ [Button] Generate & Build
+
+ Build Progress
+   [Progress] Cloning repository...
+   [Progress] Applying customizations...
+   [Progress] Building Android APK...
+   [Progress] Building iOS IPA...
+   [Progress] Packaging executables...
+
+ Download
+   [Button] Download Executables (ZIP)
```

---

## Replacement Variables Reference

| Variable | Source | Example |
|----------|--------|---------|
| `{{PROJECT_NAME}}` | step2.projectName | `MyBank` |
| `{{DISPLAY_NAME}}` | step2.displayName | `My Bank App` |
| `{{PACKAGE_NAME}}` | step2.packageName | `com.mybank.app` |
| `{{ORGANIZATION_NAME}}` | step2.organizationName | `MyBank Inc` |
| `{{SUPPORT_EMAIL}}` | step2.supportEmail | `support@mybank.com` |
| `{{SUPPORT_PHONE}}` | step7.supportPhone | `1800123456` |
| `{{TEAM_ID}}` | step8.iosConfig.teamId | `L432S2FZP5` |
| `{{PROVISIONING_GIT_URL}}` | step8.iosConfig.provisioningGitUrl | `git@github.com:...` |
| `{{PROVISIONING_BRANCH}}` | step8.iosConfig.provisioningBranch | `mybank-app` |
| `{{MATCH_TYPE}}` | step8.iosConfig.matchType | `adhoc` |
| `{{FIREBASE_IOS_APP_ID}}` | step8.firebase.iosAppId | `1:123:ios:abc` |
| `{{FIREBASE_ANDROID_APP_ID}}` | step8.firebase.androidAppId | `1:123:android:def` |
| `{{TESTER_GROUPS}}` | step8.firebase.testerGroups | `mybank-testers` |

---

## Next Steps

1. **Approve this plan** - Review and confirm approach
2. **Start Sprint 1** - Foundation (repo mapping, SDK detection)
3. **Create feature branch** - `feature/v2-project-generator`

---

## Commands

| Action | Command |
|--------|---------|
| Start implementation | `/implement v2-foundation` |
| Update Step 2 UI | `/implement step-2-readonly-sdk` |
| Add iOS config | `/implement step-8-ios-config` |
| Create generators | `/implement file-generators` |
| Build system | `/implement build-system` |
