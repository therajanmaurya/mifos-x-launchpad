# Template Layer Guide

> Guide for project generation templates

---

## Overview

The template layer contains templates for generating project files and documentation for different app types.

---

## Directory Structure

```
template-layer/
├── templates/           # App-specific templates
│   ├── mobile-wallet/
│   ├── mifos-mobile/
│   ├── android-client/
│   └── base-template/
└── generators/          # Generation guides
    ├── android/
    ├── ios/
    ├── cicd/
    └── icons/
```

---

## App Templates

Each app type has templates for:

| File | Purpose |
|------|---------|
| build.gradle.kts | Gradle build configuration |
| Theme.kt | Compose theme |
| Color.kt | Color constants |
| ServerConfig.kt | API endpoints |
| strings.xml | String resources |

---

## Template Syntax

```kotlin
// {{PACKAGE_NAME}}/Color.kt
package {{PACKAGE_NAME}}.theme

import androidx.compose.ui.graphics.Color

val Primary = Color(0xFF{{PRIMARY_COLOR}})
val Secondary = Color(0xFF{{SECONDARY_COLOR}})
val Background = Color(0xFF{{BACKGROUND_COLOR}})
```

---

## Placeholder Reference

| Placeholder | Source | Example |
|-------------|--------|---------|
| `{{PACKAGE_NAME}}` | step2.packageName | com.example.app |
| `{{APP_NAME}}` | step2.displayName | My App |
| `{{VERSION_NAME}}` | step2.versionName | 1.0.0 |
| `{{VERSION_CODE}}` | step2.versionCode | 1 |
| `{{PRIMARY_COLOR}}` | step3.colors.primary | 2563eb |
| `{{MIN_SDK}}` | step2.minAndroidSdk | 24 |

---

## Related Files

- [LAYER_STATUS.md](./LAYER_STATUS.md)
- [generators/android/gradle.md](./generators/android/gradle.md)
