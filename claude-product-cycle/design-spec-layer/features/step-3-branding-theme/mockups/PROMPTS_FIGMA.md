# Step 3: Branding & Theme - Figma Prompts

> Figma-specific prompts for mockup generation

---

## Frame Setup

- **Device**: iPhone 14 Pro (393 x 852)
- **Design Kit**: Material 3
- **Grid**: 8px baseline

---

## AI Prompt - Full Screen

Design a theme customization screen for MifosForge:

**Step**: Branding & Theme (Step 3 of 10)

Using Material 3 components:

1. **Top App Bar**: Back, title, step indicator
2. **Theme Presets**: 2x3 grid of color cards
3. **Color Section**: 6 color pickers in 2-column layout
4. **Dark Mode**: Toggle switch with generate button
5. **Preview**: Device mockup with mode toggle
6. **Footer**: Previous/Next buttons

**Colors**: Primary #2563eb, Surface #f8fafc

---

## Component Prompts

### Color Picker
- Swatch + hex input + dropdown
- Popover with saturation picker
- Preset colors row

### Preset Card
- Primary color fill
- Name label
- Selected: blue border + checkmark

### Device Preview
- iPhone frame
- Header, card, button elements
- Light/Dark toggle

---

## Layer Naming

```
Step 3 - Branding Theme
├── Header
├── Progress
├── Content
│   ├── Presets Grid
│   ├── Colors Section
│   ├── Dark Mode Section
│   └── Preview Section
└── Footer
```

---

## Related Files

- [PROMPTS.md](./PROMPTS.md)
- [FIGMA_LINKS.md](./FIGMA_LINKS.md)
