# Step 3: Branding & Theme - API Reference

> Interfaces, types, and data contracts for Branding & Theme

---

## Type Definitions

### Color Types

```typescript
/**
 * Hex color string (e.g., "#2563eb")
 */
type HexColor = `#${string}`;

/**
 * Color role in theme
 */
type ColorRole =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'background'
  | 'surface'
  | 'error'
  | 'success'
  | 'warning'
  | 'onPrimary'
  | 'onSecondary'
  | 'onBackground'
  | 'onSurface';

/**
 * Theme color palette
 */
interface ColorPalette {
  primary: HexColor;
  secondary: HexColor;
  accent: HexColor;
  background: HexColor;
  surface: HexColor;
  error: HexColor;
  success: HexColor;
  warning: HexColor;
  onPrimary: HexColor;
  onSecondary: HexColor;
  onBackground: HexColor;
  onSurface: HexColor;
}
```

### Theme Preset

```typescript
/**
 * Pre-configured theme preset
 */
interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ColorPalette;
  darkColors?: ColorPalette;
}

/**
 * Available theme presets
 */
const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Professional blue theme',
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#06b6d4',
      background: '#ffffff',
      surface: '#f8fafc',
      error: '#ef4444',
      success: '#22c55e',
      warning: '#f59e0b',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onBackground: '#0f172a',
      onSurface: '#0f172a',
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Nature-inspired green theme',
    colors: {
      primary: '#059669',
      secondary: '#6b7280',
      accent: '#14b8a6',
      background: '#ffffff',
      surface: '#f0fdf4',
      error: '#dc2626',
      success: '#16a34a',
      warning: '#d97706',
      onPrimary: '#ffffff',
      onSecondary: '#ffffff',
      onBackground: '#052e16',
      onSurface: '#052e16',
    },
  },
  // ... more presets
];
```

### State Interface

```typescript
/**
 * State for Step 3: Branding & Theme
 */
interface Step3State {
  /** Light mode colors */
  colors: ColorPalette;

  /** Dark mode enabled */
  darkModeEnabled: boolean;

  /** Dark mode colors */
  darkColors: ColorPalette;

  /** Selected preset ID (null if custom) */
  selectedPreset: string | null;

  /** Current preview mode */
  previewMode: 'light' | 'dark';
}

/**
 * Initial state for Step 3
 */
const step3InitialState: Step3State = {
  colors: THEME_PRESETS[0].colors,
  darkModeEnabled: false,
  darkColors: generateDarkPalette(THEME_PRESETS[0].colors),
  selectedPreset: 'ocean-blue',
  previewMode: 'light',
};
```

### Actions Interface

```typescript
/**
 * Actions for Step 3
 */
interface Step3Actions {
  /**
   * Update a single color
   * @param role - Color role to update
   * @param value - New hex color value
   * @param mode - Light or dark mode
   */
  updateColor: (role: ColorRole, value: HexColor, mode?: 'light' | 'dark') => void;

  /**
   * Apply a theme preset
   * @param presetId - Preset ID to apply
   */
  applyPreset: (presetId: string) => void;

  /**
   * Toggle dark mode support
   * @param enabled - Whether dark mode is enabled
   */
  toggleDarkMode: (enabled: boolean) => void;

  /**
   * Auto-generate dark mode colors from light colors
   */
  generateDarkColors: () => void;

  /**
   * Set preview mode
   * @param mode - Light or dark
   */
  setPreviewMode: (mode: 'light' | 'dark') => void;

  /**
   * Reset colors to default
   */
  resetColors: () => void;
}
```

---

## Validation Schema

```typescript
import { z } from 'zod';

/**
 * Hex color validation
 */
const hexColorSchema = z.string().regex(
  /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  'Invalid hex color format (use #RGB or #RRGGBB)'
);

/**
 * Color palette validation
 */
const colorPaletteSchema = z.object({
  primary: hexColorSchema,
  secondary: hexColorSchema,
  accent: hexColorSchema,
  background: hexColorSchema,
  surface: hexColorSchema,
  error: hexColorSchema,
  success: hexColorSchema,
  warning: hexColorSchema,
  onPrimary: hexColorSchema,
  onSecondary: hexColorSchema,
  onBackground: hexColorSchema,
  onSurface: hexColorSchema,
});

/**
 * Step 3 validation
 */
const step3Schema = z.object({
  colors: colorPaletteSchema,
  darkModeEnabled: z.boolean(),
  darkColors: colorPaletteSchema.optional(),
  selectedPreset: z.string().nullable(),
});
```

---

## Color Utility Functions

```typescript
/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error('Invalid hex color');
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to hex
 */
function rgbToHex(r: number, g: number, b: number): HexColor {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Calculate relative luminance for contrast calculation
 */
function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG requirements
 */
function checkContrast(foreground: string, background: string): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  return {
    ratio: Math.round(ratio * 10) / 10,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7.0,
  };
}

/**
 * Generate appropriate text color for background
 */
function getOnColor(background: string): HexColor {
  const luminance = getLuminance(background);
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

/**
 * Generate dark mode palette from light palette
 */
function generateDarkPalette(light: ColorPalette): ColorPalette {
  return {
    primary: light.primary, // Often kept same
    secondary: adjustLightness(light.secondary, 20),
    accent: light.accent,
    background: '#0f172a', // Dark slate
    surface: '#1e293b', // Lighter dark
    error: adjustLightness(light.error, 10),
    success: adjustLightness(light.success, 10),
    warning: adjustLightness(light.warning, 10),
    onPrimary: getOnColor(light.primary),
    onSecondary: '#ffffff',
    onBackground: '#f8fafc',
    onSurface: '#e2e8f0',
  };
}

/**
 * Adjust color lightness
 */
function adjustLightness(hex: string, amount: number): HexColor {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (c: number) => Math.min(255, Math.max(0, c + amount));
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}
```

---

## Component Props

### ColorPicker Props

```typescript
interface ColorPickerProps {
  /** Current color value */
  value: HexColor;

  /** Change handler */
  onChange: (color: HexColor) => void;

  /** Label text */
  label: string;

  /** Preset colors to show */
  presets?: HexColor[];

  /** Whether picker is disabled */
  disabled?: boolean;

  /** Error message */
  error?: string;
}
```

### ThemePresetCard Props

```typescript
interface ThemePresetCardProps {
  /** Preset data */
  preset: ThemePreset;

  /** Whether this preset is selected */
  isSelected: boolean;

  /** Selection handler */
  onSelect: (presetId: string) => void;
}
```

### DevicePreview Props

```typescript
interface DevicePreviewProps {
  /** Color palette to preview */
  colors: ColorPalette;

  /** App name to display */
  appName?: string;

  /** Preview mode */
  mode: 'light' | 'dark';

  /** Mode toggle handler */
  onModeChange: (mode: 'light' | 'dark') => void;
}
```

---

## Hooks

```typescript
/**
 * Hook for Step 3 theme management
 */
function useTheme() {
  const colors = useWizardStore((s) => s.colors);
  const darkColors = useWizardStore((s) => s.darkColors);
  const darkModeEnabled = useWizardStore((s) => s.darkModeEnabled);
  const selectedPreset = useWizardStore((s) => s.selectedPreset);
  const previewMode = useWizardStore((s) => s.previewMode);

  const updateColor = useWizardStore((s) => s.updateColor);
  const applyPreset = useWizardStore((s) => s.applyPreset);
  const toggleDarkMode = useWizardStore((s) => s.toggleDarkMode);
  const generateDarkColors = useWizardStore((s) => s.generateDarkColors);
  const setPreviewMode = useWizardStore((s) => s.setPreviewMode);

  const activeColors = previewMode === 'dark' ? darkColors : colors;

  return {
    colors,
    darkColors,
    activeColors,
    darkModeEnabled,
    selectedPreset,
    previewMode,
    updateColor,
    applyPreset,
    toggleDarkMode,
    generateDarkColors,
    setPreviewMode,
  };
}

/**
 * Hook for contrast checking
 */
function useContrastCheck(foreground: string, background: string) {
  return useMemo(() => checkContrast(foreground, background), [foreground, background]);
}
```

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Detailed specifications
- [MOCKUP.md](./MOCKUP.md) - Visual mockups
- [PATTERNS.md](../_shared/PATTERNS.md) - Implementation patterns
