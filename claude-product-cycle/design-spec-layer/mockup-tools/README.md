# Mockup Tools

> Tools for generating design mockups from specifications

## Overview

The Mockup Tools layer provides utilities to generate visual design mockups from SPEC.md files. It supports two approaches:

1. **AI Prompts** - Generate prompts for Google Stitch, Figma AI, Uizard
2. **Figma Plugin** - Programmatically generate designs in Figma

---

## Quick Start

### Option A: Using AI Prompts

```bash
# Generate prompts for a feature
/mockup step-1-app-selection

# Use generated prompts from:
# features/step-1-app-selection/mockups/PROMPTS.md
# features/step-1-app-selection/mockups/PROMPTS_STITCH.md

# Paste into AI design tool
```

### Option B: Using Figma Plugin

```bash
# 1. Build the plugin
cd figma-plugin
npm install
npm run build

# 2. In Figma Desktop:
#    - Plugins → Development → Import plugin from manifest
#    - Select: mockup-tools/figma-plugin/manifest.json

# 3. Run the plugin
#    - Plugins → Development → MifosLaunchpad Mockup Generator
```

---

## Commands

| Command | Description |
|---------|-------------|
| `/mockup [step]` | Generate all prompt files |
| `/mockup [step] prompts` | Generate general AI prompts |
| `/mockup [step] figma` | Generate Figma-specific prompts |
| `/mockup [step] stitch` | Generate Google Stitch prompts |
| `/mockup sync` | Sync all mockups status |

---

## Design System

### Colors

```typescript
const colors = {
  primary: '#2563eb',      // Blue 600
  primaryLight: '#3b82f6', // Blue 500
  primaryDark: '#1d4ed8',  // Blue 700
  secondary: '#64748b',    // Slate 500
  accent: '#06b6d4',       // Cyan 500
  background: '#ffffff',
  surface: '#f8fafc',      // Slate 50
  error: '#ef4444',        // Red 500
  success: '#22c55e',      // Green 500
  warning: '#f59e0b',      // Amber 500
  text: '#0f172a',         // Slate 900
  textMuted: '#64748b',    // Slate 500
};
```

### Typography

```typescript
const typography = {
  displayLarge:   { size: 57, weight: 400, lineHeight: 64 },
  headlineMedium: { size: 28, weight: 400, lineHeight: 36 },
  titleLarge:     { size: 22, weight: 500, lineHeight: 28 },
  bodyLarge:      { size: 16, weight: 400, lineHeight: 24 },
  labelMedium:    { size: 12, weight: 500, lineHeight: 16 },
};
```

### Spacing

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};
```

---

## Workflow

```
┌─────────────────────────────────────────────────────────────┐
│  /design step-1                                             │
│       ↓                                                     │
│  SPEC.md with requirements                                  │
│       ↓                                                     │
│  /mockup step-1                                             │
│       ↓                                                     │
│  PROMPTS.md, PROMPTS_FIGMA.md, PROMPTS_STITCH.md          │
│       ↓                                                     │
│  Use AI tool (Stitch, Figma AI, Uizard)                   │
│       ↓                                                     │
│  Export mockup to Figma                                     │
│       ↓                                                     │
│  Update FIGMA_LINKS.md                                      │
│       ↓                                                     │
│  /implement step-1                                          │
│       ↓                                                     │
│  React component with matching design                       │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
mockup-tools/
├── README.md                 # This file
├── LAYER_STATUS.md           # Status tracking
├── templates/
│   └── ai-prompt.md          # Prompt templates
├── figma-plugin/
│   ├── manifest.json         # Figma plugin manifest
│   ├── package.json
│   └── src/
│       ├── plugin.ts         # Main entry point
│       ├── design-system/
│       │   └── tokens.ts     # Design tokens
│       ├── generators/
│       │   ├── components/   # Component generators
│       │   └── screens/      # Screen generators
│       └── utils/
└── scripts/
    └── generate-prompts.ts   # CLI prompt generator
```

---

## AI Tool Recommendations

### Google Stitch

**Best for:**
- Quick iterations
- Material Design
- Mobile screens

**Tips:**
- Be specific about layout
- Mention "Material Design 3"
- Include exact colors

### Figma AI

**Best for:**
- Detailed designs
- Using existing components
- Team collaboration

**Tips:**
- Reference Material 3 Design Kit
- Use Auto Layout specifications
- Include frame dimensions

### Uizard

**Best for:**
- Rapid prototyping
- User flows
- Quick concepts

**Tips:**
- Describe the overall flow
- Include interaction notes
- Keep prompts simple

---

## Component Generators

The Figma plugin includes generators for:

| Generator | Description |
|-----------|-------------|
| `createScreen(title)` | Mobile screen frame (393x852) |
| `createTopBar(title, icons)` | App bar with navigation |
| `createCard(title, content)` | Material card component |
| `createButton(label, variant)` | Button (primary/secondary/text) |
| `createListItem(icon, title, subtitle)` | List row |
| `createInputField(label, placeholder)` | Text input |
| `createBottomNav(items)` | Bottom navigation bar |
| `createColorPicker(label)` | Color picker component |

---

## Troubleshooting

### AI Tool Issues

**Low quality output:**
- Add more specific details
- Break into smaller sections
- Include exact dimensions

**Wrong style:**
- Explicitly mention "Material Design 3"
- Include color hex values
- Reference specific components

**Missing components:**
- Generate components separately
- Combine in Figma after

### Figma Plugin Issues

**Plugin not loading:**
- Use Figma Desktop (not web)
- Check manifest.json path
- Rebuild with `npm run build`

**TypeScript errors:**
- Run `npm install`
- Check TypeScript version

---

## Related Documentation

- [TOOL_CONFIG.md](../TOOL_CONFIG.md) - Design system configuration
- [MOCKUPS_README.md](../features/MOCKUPS_README.md) - Mockups overview
- [Material Design 3](https://m3.material.io/)
- [Figma Plugin API](https://www.figma.com/plugin-docs/)
