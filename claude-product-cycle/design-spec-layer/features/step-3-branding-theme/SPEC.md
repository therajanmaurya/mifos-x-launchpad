# Step 3: Branding & Theme - Specification

> Configure colors, typography, and theme settings

**Feature ID**: `step-3-branding-theme`
**Priority**: P0 (Critical Path)
**Status**: 📋 Planned

---

## Overview

Step 3 allows users to customize the visual appearance of their generated app including primary colors, dark mode support, and theme presets. Changes are previewed live on a device mockup.

---

## User Story

**As a** brand manager customizing a mobile banking app
**I want to** configure colors and theme settings
**So that** the generated app matches our brand identity

---

## Functional Requirements

### FR-1: Color Configuration

Configure brand colors with live preview:

| Color | Default | Usage |
|-------|---------|-------|
| Primary | #2563eb | Main actions, headers |
| Secondary | #64748b | Supporting elements |
| Accent | #06b6d4 | Highlights, links |
| Background | #ffffff | Page backgrounds |
| Surface | #f8fafc | Cards, panels |
| Error | #ef4444 | Error states |
| Success | #22c55e | Success states |
| Warning | #f59e0b | Warning states |

### FR-2: Color Picker

Each color field shall have:
- Color swatch preview
- Hex input (with validation)
- Color picker popup (hue/saturation picker)
- Preset color palette
- Copy/paste hex support

### FR-3: Dark Mode Configuration

Enable and configure dark mode:
- Toggle: Enable dark mode
- Auto-generate dark colors from light colors
- Manual override for each dark color
- Preview toggle between light/dark modes

### FR-4: Theme Presets

Provide pre-configured theme presets:

| Preset | Primary | Description |
|--------|---------|-------------|
| Ocean Blue | #2563eb | Default professional |
| Forest Green | #059669 | Nature, sustainability |
| Royal Purple | #7c3aed | Premium, luxury |
| Sunset Orange | #ea580c | Warm, energetic |
| Rose Pink | #e11d48 | Modern, bold |
| Slate Gray | #475569 | Minimal, neutral |

### FR-5: On-Color Generation

Auto-generate contrasting text colors:
- `onPrimary`: White or black based on contrast ratio
- `onSecondary`: Auto-calculated
- `onBackground`: Auto-calculated
- Minimum contrast ratio: 4.5:1 (WCAG AA)

### FR-6: Live Preview

Show live preview of theme:
- Device mockup (phone)
- Sample app screen with:
  - Header with primary color
  - Cards on surface color
  - Buttons in primary/secondary
  - Text in appropriate colors
- Toggle between light/dark mode preview

---

## Non-Functional Requirements

### NFR-1: Color Validation
- Validate hex format (#RGB or #RRGGBB)
- Check contrast ratios
- Warn on low contrast combinations

### NFR-2: Performance
- Color picker renders smoothly (60fps)
- Preview updates within 100ms of change

### NFR-3: Accessibility
- Color picker keyboard accessible
- Announce color changes to screen reader
- Provide contrast ratio feedback

---

## UI Components Required

| Component | Type | Location |
|-----------|------|----------|
| `BrandingThemeStep` | Custom | `steps/step-3-branding-theme.tsx` |
| `ColorPicker` | Custom | `shared/color-picker.tsx` |
| `ColorSwatch` | Custom | `shared/color-swatch.tsx` |
| `ThemePresetCard` | Custom | `wizard/theme-preset-card.tsx` |
| `DevicePreview` | Custom | `preview/device-preview.tsx` |
| `ThemePreview` | Custom | `preview/theme-preview.tsx` |
| `Switch` | shadcn/ui | Dark mode toggle |

---

## State Management

```typescript
interface Step3State {
  // Light mode colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    error: string;
    success: string;
    warning: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
  };

  // Dark mode
  darkModeEnabled: boolean;
  darkColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    error: string;
    onPrimary: string;
    onSecondary: string;
    onBackground: string;
    onSurface: string;
  };

  // Selected preset (null if custom)
  selectedPreset: string | null;

  // Preview mode
  previewMode: 'light' | 'dark';
}

interface Step3Actions {
  updateColor: (key: string, value: string, mode?: 'light' | 'dark') => void;
  applyPreset: (presetId: string) => void;
  toggleDarkMode: (enabled: boolean) => void;
  generateDarkColors: () => void;
  setPreviewMode: (mode: 'light' | 'dark') => void;
  resetColors: () => void;
}
```

---

## Validation Rules

```typescript
const colorSchema = z.string().regex(
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  'Invalid hex color format'
);

const step3Schema = z.object({
  colors: z.object({
    primary: colorSchema,
    secondary: colorSchema,
    accent: colorSchema,
    background: colorSchema,
    surface: colorSchema,
    error: colorSchema,
    success: colorSchema,
    warning: colorSchema,
    onPrimary: colorSchema,
    onSecondary: colorSchema,
    onBackground: colorSchema,
    onSurface: colorSchema,
  }),
  darkModeEnabled: z.boolean(),
  darkColors: z.object({...}).optional(),
});
```

---

## Color Contrast Validation

```typescript
interface ContrastCheck {
  foreground: string;
  background: string;
  ratio: number;
  passesAA: boolean;  // >= 4.5
  passesAAA: boolean; // >= 7.0
}

// Required combinations to check:
// - onPrimary vs primary
// - onSecondary vs secondary
// - onBackground vs background
// - onSurface vs surface
```

---

## Form Layout

### Mobile View

```
┌─────────────────────────────────────────┐
│  Theme & Branding                       │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Theme Presets                      ││
│  │  [Ocean] [Forest] [Purple]          ││
│  │  [Orange] [Rose] [Slate]            ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Brand Colors                       ││
│  │                                     ││
│  │  Primary         Secondary          ││
│  │  [■] #2563eb    [■] #64748b        ││
│  │                                     ││
│  │  Accent          Background         ││
│  │  [■] #06b6d4    [■] #ffffff        ││
│  │                                     ││
│  │  Surface         Error              ││
│  │  [■] #f8fafc    [■] #ef4444        ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Dark Mode                          ││
│  │  [Toggle] Enable dark mode          ││
│  │                                     ││
│  │  [Generate dark colors]             ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Preview        [Light] [Dark]      ││
│  │  ┌─────────────────────────────────┐││
│  │  │     📱 Device Preview           │││
│  │  │     ┌───────────────┐           │││
│  │  │     │    Header     │           │││
│  │  │     │   [Button]    │           │││
│  │  │     │   Card        │           │││
│  │  │     └───────────────┘           │││
│  │  └─────────────────────────────────┘││
│  └─────────────────────────────────────┘│
│                                         │
└─────────────────────────────────────────┘
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Invalid hex input | Show error, revert to previous |
| Low contrast colors | Show warning with ratio |
| Preset applied then modified | Clear preset selection |
| Dark mode colors identical | Show optimization warning |
| Copy color value | Copy hex to clipboard |

---

## Test Cases

### Unit Tests
- [ ] Color picker updates state
- [ ] Hex validation works correctly
- [ ] Contrast calculation accurate
- [ ] Preset application works
- [ ] Dark colors auto-generate correctly

### Integration Tests
- [ ] Preview updates on color change
- [ ] Toggle between light/dark preview
- [ ] Data available in review step

### E2E Tests
- [ ] Complete color customization flow
- [ ] Apply preset → modify → verify changes

---

## Dependencies

- `@/store/wizard-store.ts` - Zustand store
- `color` or `chroma-js` - Color manipulation
- `@/components/ui/switch` - shadcn Switch
- `@/components/ui/popover` - shadcn Popover

---

## Related Documentation

- [MOCKUP.md](./MOCKUP.md) - Visual mockups
- [API.md](./API.md) - Interface definitions
- [STATUS.md](./STATUS.md) - Implementation status
