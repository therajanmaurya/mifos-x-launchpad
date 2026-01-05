# AI Tool Configuration

> Configuration for AI design tools used in mockup generation

## Supported Tools

| Tool | Purpose | Best For |
|------|---------|----------|
| Google Stitch | AI mockup generation | Quick iterations |
| Figma AI | Design within Figma | Detailed designs |
| Uizard | AI-powered design | Rapid prototyping |
| Visily | AI design tool | Figma integration |

---

## Design System Configuration

### Colors

```json
{
  "primary": "#2563eb",
  "primaryLight": "#3b82f6",
  "primaryDark": "#1d4ed8",
  "secondary": "#64748b",
  "accent": "#06b6d4",
  "background": "#ffffff",
  "backgroundDark": "#0f172a",
  "surface": "#f8fafc",
  "surfaceDark": "#1e293b",
  "error": "#ef4444",
  "success": "#22c55e",
  "warning": "#f59e0b",
  "text": "#0f172a",
  "textDark": "#f8fafc",
  "textMuted": "#64748b"
}
```

### Typography

```json
{
  "fontFamily": "Inter, SF Pro Display, system-ui",
  "displayLarge": { "size": 57, "weight": 400, "lineHeight": 64 },
  "displayMedium": { "size": 45, "weight": 400, "lineHeight": 52 },
  "displaySmall": { "size": 36, "weight": 400, "lineHeight": 44 },
  "headlineLarge": { "size": 32, "weight": 400, "lineHeight": 40 },
  "headlineMedium": { "size": 28, "weight": 400, "lineHeight": 36 },
  "headlineSmall": { "size": 24, "weight": 400, "lineHeight": 32 },
  "titleLarge": { "size": 22, "weight": 500, "lineHeight": 28 },
  "titleMedium": { "size": 16, "weight": 500, "lineHeight": 24 },
  "titleSmall": { "size": 14, "weight": 500, "lineHeight": 20 },
  "bodyLarge": { "size": 16, "weight": 400, "lineHeight": 24 },
  "bodyMedium": { "size": 14, "weight": 400, "lineHeight": 20 },
  "bodySmall": { "size": 12, "weight": 400, "lineHeight": 16 },
  "labelLarge": { "size": 14, "weight": 500, "lineHeight": 20 },
  "labelMedium": { "size": 12, "weight": 500, "lineHeight": 16 },
  "labelSmall": { "size": 11, "weight": 500, "lineHeight": 16 }
}
```

### Spacing

```json
{
  "xs": 4,
  "sm": 8,
  "md": 16,
  "lg": 24,
  "xl": 32,
  "2xl": 48,
  "3xl": 64
}
```

### Border Radius

```json
{
  "none": 0,
  "sm": 4,
  "md": 8,
  "lg": 12,
  "xl": 16,
  "2xl": 24,
  "full": 9999
}
```

### Shadows

```json
{
  "sm": "0 1px 2px rgba(0,0,0,0.05)",
  "md": "0 4px 6px rgba(0,0,0,0.1)",
  "lg": "0 10px 15px rgba(0,0,0,0.1)",
  "xl": "0 20px 25px rgba(0,0,0,0.15)"
}
```

---

## Device Frames

### Mobile

| Device | Width | Height | Scale |
|--------|-------|--------|-------|
| iPhone 14 Pro | 393 | 852 | 3x |
| iPhone SE | 375 | 667 | 2x |
| Pixel 7 | 412 | 915 | 2.625x |
| Galaxy S23 | 360 | 780 | 3x |

### Tablet

| Device | Width | Height | Scale |
|--------|-------|--------|-------|
| iPad Pro 11" | 834 | 1194 | 2x |
| iPad Mini | 744 | 1133 | 2x |

### Desktop

| Screen | Width | Height |
|--------|-------|--------|
| Desktop | 1440 | 900 |
| Laptop | 1280 | 800 |

---

## Prompt Templates

### Base Prompt

```
Create a [component] for a mobile banking app wizard.

Platform: [Android/iOS/Web]
Style: Material Design 3, modern fintech
Colors:
- Primary: #2563eb (blue)
- Background: #ffffff
- Text: #0f172a

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

The design should be clean, professional, and trustworthy.
```

### Screen Prompt

```
Design a [screen name] screen for MifosForge wizard.

Device: iPhone 14 Pro (393 x 852)
Style: Material Design 3

Layout (top to bottom):
1. Header with title and navigation
2. [Main content description]
3. Bottom navigation buttons

Include:
- [Element 1]
- [Element 2]
- [Element 3]

Color scheme:
- Primary: #2563eb
- Background: #ffffff
- Cards: #f8fafc with subtle shadow
```

### Component Prompt

```
Create a [component name] component:

Purpose: [Description]
Size: [Width] x [Height]
States: [Default, Hover, Active, Disabled]

Specifications:
- Background: [color]
- Border radius: [value]
- Padding: [value]
- Shadow: [value]

Include:
- [Element 1]
- [Element 2]
```

---

## Tool-Specific Settings

### Google Stitch

```
Preferred style: Modern, minimal
Color palette: Blue/white
Platform: Mobile app
Industry: Fintech/Banking
```

### Figma AI

```
Design kit: Material 3 Design Kit
Auto Layout: Enabled
Grid: 8px
Constraints: Scale
```

### Uizard

```
Template: Mobile App
Theme: Custom (import colors)
Components: Material Design
```

---

## Export Settings

### For Development

```
Format: PNG/SVG
Scale: 2x
Background: Transparent (components) / White (screens)
```

### For Documentation

```
Format: PNG
Scale: 1x
Background: Included
Frame: Device mockup
```

---

## Best Practices

1. **Consistency**: Use same colors and typography across all mockups
2. **Accessibility**: Ensure contrast ratios meet WCAG 2.1 AA
3. **Responsive**: Design for multiple screen sizes
4. **States**: Include all interactive states
5. **Real Content**: Use realistic placeholder content
