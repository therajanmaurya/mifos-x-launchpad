# /template Command

> Create generation templates

## Purpose

The `/template` command creates templates used by the project generator to produce KMP project files. Templates include Kotlin files, Gradle scripts, CI/CD workflows, and more.

## Usage

```
/template [template-type]
/template android-manifest
/template github-actions
/template theme-kt
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| template-type | string | Yes | Type of template to create |

## Template Categories

| Category | Directory | Examples |
|----------|-----------|----------|
| Android | `generators/android/` | manifest, icons, gradle |
| iOS | `generators/ios/` | plist, icons |
| CI/CD | `generators/cicd/` | github-actions, gitlab-ci |
| Kotlin | `templates/[app]/` | Theme.kt, Color.kt |
| Icons | `generators/icons/` | processor |

## Workflow

### Step 1: Determine Template Type

Based on the parameter:
- **android-*** - Android-specific templates
- **ios-*** - iOS-specific templates
- **cicd-*** - CI/CD workflows
- ***-kt** - Kotlin source templates

### Step 2: Create Template Documentation

Create `template-layer/generators/[category]/[type].md`:

```markdown
# [Template Name] Generator

## Purpose
What this template generates

## Variables
| Variable | Type | Description |
|----------|------|-------------|
| `{{VAR_NAME}}` | string | Description |

## Template
\`\`\`[language]
Template content with {{VARIABLES}}
\`\`\`

## Generator Function
\`\`\`typescript
export function generate[Name](config: Config): string {
  // Generator implementation
}
\`\`\`
```

### Step 3: Create Generator Function

Add to `src/lib/generators/[type]-generator.ts`:

```typescript
export interface [Type]GeneratorConfig {
  // Configuration interface
}

export function generate[Type](config: [Type]GeneratorConfig): string {
  return `
    // Template with interpolated values
  `.trim();
}
```

### Step 4: Update Template Registry

Update `template-layer/LAYER_STATUS.md`:

```markdown
| [Template] | ✅ Done | [description] |
```

## Output

The command produces:
- Template documentation in `template-layer/generators/`
- Generator function in `src/lib/generators/`
- Update to LAYER_STATUS.md

## Template Examples

### Android Manifest Template

```
/template android-manifest
```

Creates:
- `generators/android/manifest.md` - Documentation
- `src/lib/generators/manifest-generator.ts` - Generator

Template:
```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="{{PACKAGE_NAME}}">

    <application
        android:name="{{APPLICATION_CLASS}}"
        android:label="{{APP_NAME}}"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.{{APP_NAME}}">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.{{APP_NAME}}">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>
</manifest>
```

### GitHub Actions Template

```
/template github-actions
```

Creates:
- `generators/cicd/github-actions.md` - Documentation
- `src/lib/generators/cicd-generator.ts` - Generator

Template:
```yaml
name: {{WORKFLOW_NAME}}

on:
  push:
    branches: [{{BRANCH_NAME}}]
  pull_request:
    branches: [{{BRANCH_NAME}}]

jobs:
  build:
    runs-on: {{RUNNER}}

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Build with Gradle
        run: ./gradlew build
```

### Theme.kt Template

```
/template theme-kt
```

Creates Kotlin theme file template:

```kotlin
package {{PACKAGE_NAME}}.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable

private val LightColorScheme = lightColorScheme(
    primary = {{PRIMARY_COLOR}},
    secondary = {{SECONDARY_COLOR}},
    tertiary = {{ACCENT_COLOR}},
    background = {{BACKGROUND_COLOR}},
    surface = {{SURFACE_COLOR}},
    error = {{ERROR_COLOR}},
)

private val DarkColorScheme = darkColorScheme(
    primary = {{DARK_PRIMARY_COLOR}},
    secondary = {{DARK_SECONDARY_COLOR}},
    // ...
)

@Composable
fun {{APP_NAME}}Theme(
    darkTheme: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
```

## Generator Function Pattern

```typescript
// src/lib/generators/[type]-generator.ts

export interface [Type]Config {
  packageName: string;
  appName: string;
  // Additional config
}

export function generate[Type](config: [Type]Config): string {
  const { packageName, appName } = config;

  return `
// Generated content with ${packageName} and ${appName}
`.trim();
}

// For multiple files
export function generate[Type]Files(config: [Type]Config): Record<string, string> {
  return {
    'path/to/file1.kt': generateFile1(config),
    'path/to/file2.kt': generateFile2(config),
  };
}
```

## Model Recommendation

**Sonnet** - For template creation

## Related Commands

- `/implement [step]` - Uses templates in generators
- `/verify [step]` - Checks template completeness
