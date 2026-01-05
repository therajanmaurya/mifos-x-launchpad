# Step 10: Review & Generate - Specification

> Review configuration and generate project

**Feature ID**: `step-10-review-generate`
**Priority**: P0 (Critical Path)
**Status**: 📋 Planned

---

## Overview

Step 10 displays a complete summary of all configuration, allows final review, and generates the downloadable project ZIP file.

---

## Functional Requirements

### FR-1: Configuration Summary

Display all settings from steps 1-9:

| Section | Content |
|---------|---------|
| Base App | Selected app, features |
| Project Info | Name, package, version |
| Branding | Colors preview |
| Icons | Icon preview |
| Server | Environments |
| Platforms | Enabled platforms |
| Features | Security, analytics |
| CI/CD | Pipeline, deployment |
| Code Quality | Testing, linting |

### FR-2: Configuration Actions

| Action | Description |
|--------|-------------|
| Edit | Jump to specific step |
| Export JSON | Download config file |
| Import JSON | Load previous config |
| Share | Generate shareable link |

### FR-3: Project Generation

| Step | Description |
|------|-------------|
| 1 | Validate all settings |
| 2 | Generate files from templates |
| 3 | Process icons with Canvas |
| 4 | Create ZIP archive |
| 5 | Provide download |

### FR-4: Progress Display

| State | UI |
|-------|-----|
| Idle | "Generate Project" button |
| Generating | Progress bar with status |
| Complete | Download button |
| Error | Error message, retry |

### FR-5: Generated Files Preview

Show tree of files to be generated:
- composeApp/
- androidApp/
- iosApp/
- .github/workflows/
- gradle files
- README.md

---

## State Management

```typescript
interface Step10State {
  isGenerating: boolean;
  generationProgress: number;
  generationStatus: string;
  downloadUrl: string | null;
  configJson: string;
  shareUrl: string | null;
  error: string | null;
}

interface Step10Actions {
  generateProject: () => Promise<void>;
  exportConfig: () => void;
  importConfig: (json: string) => void;
  shareConfig: () => Promise<string>;
  downloadProject: () => void;
}
```

---

## Generation Process

```typescript
async function generateProject(config: WizardState): Promise<Blob> {
  const zip = new JSZip();

  // 1. Generate build files
  zip.file('build.gradle.kts', generateRootGradle(config));
  zip.file('settings.gradle.kts', generateSettings(config));

  // 2. Generate theme files
  const themeFiles = generateTheme(config.step3);
  Object.entries(themeFiles).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // 3. Generate icons
  const icons = await generateIcons(config.step4);
  Object.entries(icons).forEach(([path, dataUrl]) => {
    zip.file(path, dataUrlToBlob(dataUrl));
  });

  // 4. Generate CI/CD
  const ciFiles = generateCICD(config.step8);
  Object.entries(ciFiles).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // 5. Create ZIP
  return zip.generateAsync({ type: 'blob' });
}
```

---

## Related Files

- [MOCKUP.md](./MOCKUP.md)
- [API.md](./API.md)
