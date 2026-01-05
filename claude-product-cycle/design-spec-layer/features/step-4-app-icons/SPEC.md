# Step 4: App Icons - Specification

> Upload and process app icons for all platforms

**Feature ID**: `step-4-app-icons`
**Priority**: P0 (Critical Path)
**Status**: 📋 Planned

---

## Overview

Step 4 allows users to upload an app icon and automatically generates all required icon sizes for Android, iOS, and web platforms using the Canvas API.

---

## Functional Requirements

### FR-1: Icon Upload
- Drag-and-drop or click to upload
- Supported formats: PNG, SVG, JPG
- Minimum size: 1024x1024 pixels
- Maximum file size: 5MB

### FR-2: Icon Processing
Generate icons using Canvas API:

**Android (mipmap)**:
| Density | Size |
|---------|------|
| mdpi | 48x48 |
| hdpi | 72x72 |
| xhdpi | 96x96 |
| xxhdpi | 144x144 |
| xxxhdpi | 192x192 |

**iOS (Assets.xcassets)**:
| Size | Scale |
|------|-------|
| 20pt | 1x, 2x, 3x |
| 29pt | 1x, 2x, 3x |
| 40pt | 1x, 2x, 3x |
| 60pt | 2x, 3x |
| 76pt | 1x, 2x |
| 83.5pt | 2x |
| 1024pt | 1x |

**Web**:
- favicon.ico (16x16, 32x32)
- apple-touch-icon (180x180)
- PWA icons (192x192, 512x512)

### FR-3: Icon Shape Options
- Circle
- Rounded square
- Squircle (iOS style)
- Square

### FR-4: Background Color
- Set icon background color
- Transparent option for PNG

### FR-5: Preview
- Grid showing all generated sizes
- Platform tabs (Android, iOS, Web)
- Download individual sizes

---

## State Management

```typescript
interface Step4State {
  iconFile: File | null;
  iconDataUrl: string | null;
  backgroundColor: string;
  iconShape: 'circle' | 'rounded' | 'squircle' | 'square';
  generatedIcons: {
    android: Record<string, string>;
    ios: Record<string, string>;
    web: Record<string, string>;
  };
}
```

---

## UI Components

| Component | Purpose |
|-----------|---------|
| IconUploader | Drag-drop upload zone |
| IconPreview | Show uploaded icon |
| IconGrid | Display generated sizes |
| ShapeSelector | Icon shape options |
| BackgroundPicker | Background color |

---

## Related Files

- [MOCKUP.md](./MOCKUP.md)
- [API.md](./API.md)
- [STATUS.md](./STATUS.md)
