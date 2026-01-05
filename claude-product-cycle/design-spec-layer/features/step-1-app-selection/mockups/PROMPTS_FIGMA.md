# Step 1: App Selection - Figma Prompts

> Figma AI and plugin-specific prompts for generating mockups

---

## Frame Setup

- **Device**: iPhone 14 Pro
- **Size**: 393 x 852
- **Design Kit**: Material 3 Design Kit
- **Grid**: 8px baseline grid

---

## Auto Layout Settings

### Main Frame
- **Direction**: Vertical
- **Padding**: 0px (edge to edge)
- **Gap**: 0px between sections
- **Alignment**: Fill container

### Content Area
- **Direction**: Vertical
- **Padding**: 24px horizontal, 16px vertical
- **Gap**: 16px between cards
- **Alignment**: Top left

### App Card
- **Direction**: Vertical
- **Padding**: 20px
- **Gap**: 12px
- **Border radius**: 12px

---

## AI Prompt - Full Screen

Design a wizard step screen for MifosForge mobile app:

**Step**: Select Base Application (Step 1 of 10)

Using Material 3 Design Kit components:

1. **Top App Bar**:
   - Leading: Back arrow icon
   - Title: "MifosForge"
   - Trailing: "1/10" step indicator
   - Height: 44px
   - Background: Surface

2. **Progress Indicator**:
   - 10 circles connected by lines
   - First circle filled with primary color
   - Others outlined gray
   - Full width with 24px padding

3. **Header Section**:
   - Headline Medium: "Select Base Application"
   - Body Medium: "Choose which Mifos app to customize"
   - Color: On Surface / On Surface Variant

4. **App Cards** (4 cards, vertical scroll):
   - Surface container with rounded corners
   - Leading: 48x48 icon
   - Headline Small: App name
   - Body Small: Description (2 lines)
   - List: 3 bullet points
   - Trailing: GitHub link

5. **Bottom Navigation**:
   - Fixed at bottom
   - Primary filled button: "Next Step"
   - 24px padding, 16px from bottom

**Colors**:
- Primary: #2563eb
- Surface: #ffffff
- On Primary: #ffffff
- On Surface: #0f172a
- Outline: #e2e8f0

**Include**:
- One card shown as selected (blue border, blue-50 background)
- Checkmark icon on selected card
- Proper elevation/shadow on cards

---

## AI Prompt - App Card Component

Design a Material 3 card component for app selection:

**Component Name**: App Selection Card
**Variants**: Default, Hover, Selected, Disabled

**Structure**:
```
Card (Surface Container)
├── Row
│   ├── Icon Container (48x48)
│   │   └── App Icon
│   └── Text Container
│       ├── App Name (Headline Small)
│       └── Description (Body Small)
├── Feature List
│   ├── • Feature 1
│   ├── • Feature 2
│   └── • Feature 3
└── Link Row
    └── "View on GitHub →"
```

**Default State**:
- Fill: Surface (#ffffff)
- Stroke: Outline (#e2e8f0)
- Corner radius: 12px
- Elevation: Level 1

**Selected State**:
- Fill: Primary Container (#eff6ff)
- Stroke: Primary (#2563eb), 2px
- Checkmark badge in top-right
- Elevation: Level 2

**Hover State**:
- Elevation: Level 2
- Stroke: Primary Light (#3b82f6)

---

## AI Prompt - Progress Indicator

Design a horizontal step progress indicator:

**Component Name**: Wizard Progress
**Steps**: 10
**Current Step**: 1

**Structure**:
```
Horizontal Container
├── Step 1 (Current)
│   └── Circle (filled, primary)
├── Connector Line
├── Step 2 (Future)
│   └── Circle (outlined, gray)
├── Connector Line
...
└── Step 10 (Future)
    └── Circle (outlined, gray)
```

**Specifications**:
- Circle size: 12px diameter
- Line length: Flexible (fill)
- Line height: 2px
- Active: Primary (#2563eb)
- Inactive: Outline (#e2e8f0)

---

## AI Prompt - Desktop Layout

Design a desktop wizard screen with split view:

**Frame**: Desktop (1440 x 900)

**Layout**:
```
┌────────────────────────────────────────┐
│ Header Bar (56px)                       │
├────────────────────────────────────────┤
│ Progress Bar (48px)                     │
├─────────────────────┬──────────────────┤
│                     │                  │
│  Card Grid (60%)    │  Preview (40%)   │
│                     │                  │
│  ┌─────┐  ┌─────┐  │  ┌────────────┐  │
│  │Card1│  │Card2│  │  │   Device   │  │
│  └─────┘  └─────┘  │  │   Mockup   │  │
│  ┌─────┐  ┌─────┐  │  └────────────┘  │
│  │Card3│  │Card4│  │                  │
│  └─────┘  └─────┘  │  Feature List    │
│                     │                  │
├─────────────────────┴──────────────────┤
│ Footer (64px)                           │
└────────────────────────────────────────┘
```

**Specifications**:
- Grid gap: 24px
- Preview background: Surface Variant (#f8fafc)
- Footer: Outlined button (Previous), Filled button (Next)

---

## Component Library References

Use these Material 3 components from the design kit:

| Element | M3 Component | Variant |
|---------|--------------|---------|
| Header | Top App Bar | Center-aligned |
| Cards | Card | Filled |
| Buttons | Button | Filled, Outlined |
| Icons | Icon | 24px |
| Text | Typography | Headline, Body, Label |
| Progress | Progress Indicator | Custom |

---

## Layer Naming Convention

```
Step 1 - App Selection
├── Header
│   ├── Back Icon
│   ├── Title
│   └── Step Label
├── Progress
│   └── Step Indicators
├── Content
│   ├── Title Section
│   │   ├── Headline
│   │   └── Subtitle
│   └── Card List
│       ├── App Card - Mobile Wallet
│       ├── App Card - Mifos Mobile
│       ├── App Card - Android Client
│       └── App Card - Blank Template
└── Footer
    └── Next Button
```

---

## Export Settings

| Export | Format | Scale | Use |
|--------|--------|-------|-----|
| Screen PNG | PNG | 2x | Documentation |
| Screen PDF | PDF | 1x | Presentation |
| Components | SVG | 1x | Development |
| Icons | SVG | 1x | Development |

---

## Prototype Settings

**Interactions**:
1. Card click → Toggle selection
2. Next button → Navigate to Step 2
3. Back button → Navigate to Home

**Transitions**:
- Card selection: Smart animate, 200ms
- Page navigation: Slide left, 300ms
- Overlay dismiss: Fade, 200ms

---

## Related Files

- [PROMPTS.md](./PROMPTS.md) - General prompts
- [PROMPTS_STITCH.md](./PROMPTS_STITCH.md) - Google Stitch prompts
- [FIGMA_LINKS.md](./FIGMA_LINKS.md) - Figma file links
