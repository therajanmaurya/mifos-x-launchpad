# Generator Utilities

> Template and file generation utilities

---

## Project Generator

The main generator creates a complete project ZIP:

```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function generateProject(config: WizardState): Promise<void> {
  const zip = new JSZip();

  // Add generated files
  await addGradleFiles(zip, config);
  await addThemeFiles(zip, config);
  await addIconFiles(zip, config);
  await addCICDFiles(zip, config);
  await addReadme(zip, config);

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${config.step2.projectName}.zip`);
}
```

---

## File Generators

### Gradle Generator

```typescript
function generateBuildGradle(config: WizardState): string {
  return `
plugins {
    alias(libs.plugins.kotlinMultiplatform)
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.jetbrainsCompose)
}

android {
    namespace = "${config.step2.packageName}"
    compileSdk = ${config.step2.targetAndroidSdk}

    defaultConfig {
        applicationId = "${config.step2.applicationId}"
        minSdk = ${config.step2.minAndroidSdk}
        targetSdk = ${config.step2.targetAndroidSdk}
        versionCode = ${config.step2.versionCode}
        versionName = "${config.step2.versionName}"
    }
}
`.trim();
}
```

### Theme Generator

```typescript
function generateThemeKt(config: WizardState): string {
  const { colors } = config.step3;
  return `
package ${config.step2.packageName}.theme

import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.ui.graphics.Color

val LightColorScheme = lightColorScheme(
    primary = Color(0xFF${colors.primary.slice(1)}),
    secondary = Color(0xFF${colors.secondary.slice(1)}),
    background = Color(0xFF${colors.background.slice(1)}),
    surface = Color(0xFF${colors.surface.slice(1)}),
    error = Color(0xFF${colors.error.slice(1)}),
)
`.trim();
}
```

### Icon Generator

```typescript
async function generateIcons(
  sourceImage: HTMLImageElement,
  config: Step4State
): Promise<Record<string, Blob>> {
  const icons: Record<string, Blob> = {};

  for (const [density, size] of Object.entries(ANDROID_SIZES)) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Apply background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Apply shape mask
    applyShape(ctx, size, config.iconShape);

    // Draw image
    ctx.drawImage(sourceImage, 0, 0, size, size);

    // Convert to blob
    const blob = await canvasToBlob(canvas);
    icons[`mipmap-${density}/ic_launcher.png`] = blob;
  }

  return icons;
}
```

---

## CI/CD Generators

### GitHub Actions

```typescript
function generateGitHubWorkflow(config: WizardState): string {
  return `
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Build
        run: ./gradlew build
`.trim();
}
```

---

## Template System

Templates use placeholder replacement:

```typescript
function processTemplate(template: string, vars: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(vars)) {
    result = result.replaceAll(`{{${key}}}`, value);
  }
  return result;
}
```
