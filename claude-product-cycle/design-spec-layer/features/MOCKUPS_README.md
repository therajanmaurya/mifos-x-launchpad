# Mockups Overview

> Guide to creating and organizing visual mockups for MifosForge

## Structure

Each wizard step has a `mockups/` directory with:

```
features/step-N-[name]/mockups/
├── PROMPTS.md           # General AI prompts
├── PROMPTS_FIGMA.md     # Figma-specific prompts
├── PROMPTS_STITCH.md    # Google Stitch prompts
├── FIGMA_LINKS.md       # Links to Figma files
├── dummy/               # Placeholder mockups
└── prod/                # Final production mockups
```

---

## Mockup Workflow

### 1. Generate Prompts

Run the `/mockup` command:

```
/mockup step-1-app-selection
```

This creates prompt files for AI design tools.

### 2. Create Mockups

Use the generated prompts in:
- **Google Stitch** - For quick iterations
- **Figma AI** - For detailed designs
- **Uizard** - For rapid prototyping

### 3. Export & Store

1. Export mockups as PNG/SVG
2. Place in `dummy/` for drafts
3. Move to `prod/` when finalized

### 4. Update Links

Update `FIGMA_LINKS.md` with Figma file URLs.

---

## Prompt Files

### PROMPTS.md

General prompts that work with any AI tool:

```markdown
# Step N - AI Mockup Prompts

## Main Screen

Create a [description]...

## Components

### Component 1
[Detailed prompt]

### Component 2
[Detailed prompt]
```

### PROMPTS_FIGMA.md

Optimized for Figma's AI features:

```markdown
# Step N - Figma Prompts

## Frame Setup
- Device: iPhone 14 Pro (393 x 852)
- Design Kit: Material 3

## AI Prompt
[Figma-specific prompt with component references]
```

### PROMPTS_STITCH.md

Optimized for Google Stitch:

```markdown
# Step N - Google Stitch Prompts

## Style Guide
- Material Design 3
- Fintech aesthetic
- Blue primary (#2563eb)

## Prompt
[Stitch-optimized prompt]
```

---

## Design Guidelines

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #2563eb | Actions, headers |
| Secondary | #64748b | Supporting elements |
| Background | #ffffff | Page background |
| Surface | #f8fafc | Cards, panels |
| Error | #ef4444 | Error states |
| Success | #22c55e | Success states |

### Typography

| Style | Size | Weight | Usage |
|-------|------|--------|-------|
| Heading 1 | 32px | Bold | Page titles |
| Heading 2 | 24px | Semibold | Section titles |
| Body | 16px | Regular | Main content |
| Caption | 14px | Regular | Helper text |

### Spacing

| Name | Size | Usage |
|------|------|-------|
| xs | 4px | Tight spacing |
| sm | 8px | Component gaps |
| md | 16px | Section padding |
| lg | 24px | Major sections |
| xl | 32px | Page margins |

---

## Screen Templates

### Wizard Step Screen

```
┌─────────────────────────────────────────┐
│  ← Back        Step N of 10     Preview │  ← Header
├─────────────────────────────────────────┤
│                                         │
│  Step Title                             │  ← Title
│  Step description text                  │  ← Subtitle
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Section Card                       ││  ← Card
│  │                                     ││
│  │  [Form fields / Content]            ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│  ┌─────────────────────────────────────┐│
│  │  Another Section                    ││
│  │  ...                                ││
│  └─────────────────────────────────────┘│
│                                         │
├─────────────────────────────────────────┤
│  [Previous]                    [Next →] │  ← Navigation
└─────────────────────────────────────────┘
```

### Preview Panel

```
┌─────────────────────┐
│  Live Preview       │
├─────────────────────┤
│                     │
│  ┌───────────────┐  │
│  │  📱 Device    │  │
│  │  ┌─────────┐  │  │
│  │  │ App     │  │  │
│  │  │ Preview │  │  │
│  │  │         │  │  │
│  │  └─────────┘  │  │
│  └───────────────┘  │
│                     │
│  Settings summary   │
│                     │
└─────────────────────┘
```

---

## Component Mockups

### App Card (Step 1)

```
┌─────────────────────────────────────────┐
│  ┌─────────┐                            │
│  │  Icon   │  App Name                  │
│  │         │  Short description         │
│  └─────────┘                            │
│                                         │
│  • Feature 1                            │
│  • Feature 2                            │
│  • Feature 3                            │
│                                         │
│  [View on GitHub]                       │
└─────────────────────────────────────────┘
```

### Color Picker (Step 3)

```
┌─────────────────────────────────────────┐
│  Color Label                            │
│  ┌─────────┬───────────────────────────┐│
│  │ Preview │  #2563eb                  ││
│  └─────────┴───────────────────────────┘│
│                                         │
│  Presets:                               │
│  [●][●][●][●][●][●]                    │
└─────────────────────────────────────────┘
```

### File Upload (Step 4)

```
┌─────────────────────────────────────────┐
│                                         │
│         ┌─────────────────┐             │
│         │     📁         │             │
│         │                 │             │
│         │  Drag & drop    │             │
│         │  or click to    │             │
│         │  upload         │             │
│         │                 │             │
│         │  PNG, SVG       │             │
│         │  1024x1024      │             │
│         └─────────────────┘             │
│                                         │
└─────────────────────────────────────────┘
```

---

## Quality Checklist

Before finalizing mockups:

- [ ] Consistent colors
- [ ] Proper spacing
- [ ] Clear hierarchy
- [ ] Readable text
- [ ] Interactive states shown
- [ ] Mobile-responsive
- [ ] Accessible contrast
- [ ] Error states included
- [ ] Loading states included
