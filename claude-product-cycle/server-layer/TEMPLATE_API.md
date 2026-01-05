# Template Engine API

> Template processing and file generation

---

## Overview

The template engine processes template files and generates project output.

---

## Template Format

Templates use mustache-style placeholders:

```kotlin
// {{PACKAGE_NAME}}/Theme.kt
package {{PACKAGE_NAME}}.theme

val LightColorScheme = lightColorScheme(
    primary = Color(0xFF{{PRIMARY_COLOR}}),
    secondary = Color(0xFF{{SECONDARY_COLOR}}),
)
```

---

## Template Processing

```typescript
interface TemplateContext {
  PACKAGE_NAME: string;
  APP_NAME: string;
  VERSION_NAME: string;
  VERSION_CODE: number;
  PRIMARY_COLOR: string;
  SECONDARY_COLOR: string;
  // ...
}

function processTemplate(template: string, context: TemplateContext): string {
  let result = template;
  for (const [key, value] of Object.entries(context)) {
    const placeholder = `{{${key}}}`;
    result = result.replaceAll(placeholder, String(value));
  }
  return result;
}
```

---

## Template Categories

### Gradle Templates

| Template | Output |
|----------|--------|
| `build.gradle.kts.template` | Root build file |
| `settings.gradle.kts.template` | Settings file |
| `android/build.gradle.kts.template` | Android module |
| `libs.versions.toml.template` | Version catalog |

### Kotlin Templates

| Template | Output |
|----------|--------|
| `Theme.kt.template` | Theme colors |
| `Color.kt.template` | Color constants |
| `ServerConfig.kt.template` | API configuration |

### Resource Templates

| Template | Output |
|----------|--------|
| `strings.xml.template` | String resources |
| `AndroidManifest.xml.template` | Manifest |
| `Info.plist.template` | iOS plist |

### CI/CD Templates

| Template | Output |
|----------|--------|
| `build.yml.template` | GitHub Actions |
| `firebase.yml.template` | Firebase distribution |
| `Fastfile.template` | Fastlane |

---

## API Functions

```typescript
// Get template by path
async function getTemplate(path: string): Promise<string>;

// Process single template
function processTemplate(template: string, context: TemplateContext): string;

// Process all templates for project
async function processAllTemplates(
  appType: AppType,
  context: TemplateContext
): Promise<Map<string, string>>;

// Get required context keys for template
function getTemplateRequirements(template: string): string[];
```
