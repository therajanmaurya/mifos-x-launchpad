# Mockup Design Planning

> Planning template for mockup creation and improvements

---

## Current State

### Step {{STEP_NUMBER}}: {{STEP_NAME}}

| Asset | Exists | Tool | Quality | Action Needed |
|-------|--------|------|---------|---------------|
| Desktop Mockup | {{EXISTS}} | {{TOOL}} | {{QUALITY}} | {{ACTION}} |
| Mobile Mockup | {{EXISTS}} | {{TOOL}} | {{QUALITY}} | {{ACTION}} |
| Dark Mode | {{EXISTS}} | {{TOOL}} | {{QUALITY}} | {{ACTION}} |
| Prototype | {{EXISTS}} | {{TOOL}} | {{QUALITY}} | {{ACTION}} |
| AI Prompts | {{EXISTS}} | {{TOOL}} | {{QUALITY}} | {{ACTION}} |

---

## Mockup Creation Plan

### Visual Mockups

| Mockup | Tool | Resolution | States | Effort | Priority |
|--------|------|------------|--------|--------|----------|
| Desktop - Light | Figma | 1440×900 | {{STATES}} | {{EFFORT}} | {{PRIORITY}} |
| Desktop - Dark | Figma | 1440×900 | {{STATES}} | {{EFFORT}} | {{PRIORITY}} |
| Tablet - Light | Figma | 768×1024 | {{STATES}} | {{EFFORT}} | {{PRIORITY}} |
| Mobile - Light | Figma | 375×812 | {{STATES}} | {{EFFORT}} | {{PRIORITY}} |
| Mobile - Dark | Figma | 375×812 | {{STATES}} | {{EFFORT}} | {{PRIORITY}} |

### State Variations

| State | Desktop | Mobile | Notes |
|-------|---------|--------|-------|
| Default | {{STATUS}} | {{STATUS}} | {{NOTES}} |
| Empty | {{STATUS}} | {{STATUS}} | {{NOTES}} |
| Loading | {{STATUS}} | {{STATUS}} | {{NOTES}} |
| Error | {{STATUS}} | {{STATUS}} | {{NOTES}} |
| Success | {{STATUS}} | {{STATUS}} | {{NOTES}} |
| Disabled | {{STATUS}} | {{STATUS}} | {{NOTES}} |

---

## AI Prompt Planning

### General Prompts (PROMPTS.md)

| Prompt Type | Purpose | Status | Quality |
|-------------|---------|--------|---------|
| Layout description | Main structure | {{STATUS}} | {{QUALITY}} |
| Component details | UI elements | {{STATUS}} | {{QUALITY}} |
| Interaction states | User feedback | {{STATUS}} | {{QUALITY}} |
| Responsive behavior | Adaptations | {{STATUS}} | {{QUALITY}} |

### Figma Prompts (PROMPTS_FIGMA.md)

| Prompt Type | Purpose | Status | Quality |
|-------------|---------|--------|---------|
| Auto Layout setup | Structure | {{STATUS}} | {{QUALITY}} |
| Component variants | States | {{STATUS}} | {{QUALITY}} |
| Design tokens | Styling | {{STATUS}} | {{QUALITY}} |

### Stitch Prompts (PROMPTS_STITCH.md)

| Prompt Type | Purpose | Status | Quality |
|-------------|---------|--------|---------|
| Screen generation | Full screens | {{STATUS}} | {{QUALITY}} |
| Component generation | UI elements | {{STATUS}} | {{QUALITY}} |
| Style application | Branding | {{STATUS}} | {{QUALITY}} |

---

## Design System Requirements

### Components Needed

| Component | Exists in DS | Customization | Status |
|-----------|--------------|---------------|--------|
| {{COMPONENT}} | {{EXISTS}} | {{CUSTOM}} | {{STATUS}} |

### Design Tokens

| Token Type | Defined | Applied | Status |
|------------|---------|---------|--------|
| Colors | {{DEFINED}} | {{APPLIED}} | {{STATUS}} |
| Typography | {{DEFINED}} | {{APPLIED}} | {{STATUS}} |
| Spacing | {{DEFINED}} | {{APPLIED}} | {{STATUS}} |
| Shadows | {{DEFINED}} | {{APPLIED}} | {{STATUS}} |
| Borders | {{DEFINED}} | {{APPLIED}} | {{STATUS}} |

---

## Figma Organization

### File Structure
```
MifosLaunchpad/
├── 🎨 Design System
│   ├── Colors
│   ├── Typography
│   └── Components
├── 📱 Step {{STEP_NUMBER}} - {{STEP_NAME}}
│   ├── Desktop
│   │   ├── Light
│   │   └── Dark
│   ├── Mobile
│   │   ├── Light
│   │   └── Dark
│   └── States
└── 🔗 Prototype
    └── Step Flow
```

### Naming Convention
- Pages: `Step N - Step Name`
- Frames: `Device / Theme / State`
- Components: `Category/Component/Variant`

---

## Timeline

| Task | Start | End | Owner |
|------|-------|-----|-------|
| Set up Figma structure | {{START}} | {{END}} | {{OWNER}} |
| Create desktop mockups | {{START}} | {{END}} | {{OWNER}} |
| Create mobile mockups | {{START}} | {{END}} | {{OWNER}} |
| Add state variations | {{START}} | {{END}} | {{OWNER}} |
| Write AI prompts | {{START}} | {{END}} | {{OWNER}} |
| Create prototype | {{START}} | {{END}} | {{OWNER}} |
| Design review | {{START}} | {{END}} | {{OWNER}} |

---

## Quality Checklist

- [ ] All states documented
- [ ] Responsive behavior defined
- [ ] Design tokens applied correctly
- [ ] Component consistency verified
- [ ] Accessibility considered
- [ ] AI prompts tested

---

*Last Updated: {{TIMESTAMP}}*
