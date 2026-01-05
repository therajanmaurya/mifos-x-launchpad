# Step 2: Project Info - Figma Prompts

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
- **Padding**: 0px
- **Gap**: 0px
- **Alignment**: Fill container

### Form Content
- **Direction**: Vertical
- **Padding**: 24px horizontal, 16px vertical
- **Gap**: 16px between cards
- **Scroll**: Vertical overflow

### Form Card
- **Direction**: Vertical
- **Padding**: 20px
- **Gap**: 16px between fields
- **Border radius**: 12px

### Form Field
- **Direction**: Vertical
- **Gap**: 8px (label to input)
- **Width**: Fill container

---

## AI Prompt - Full Screen

Design a wizard form screen for MifosLaunchpad mobile app:

**Step**: Project Information (Step 2 of 10)

Using Material 3 Design Kit components:

1. **Top App Bar**:
   - Leading: Back arrow
   - Title: "MifosLaunchpad"
   - Trailing: "2/10"

2. **Progress Indicator**:
   - 10 steps, second filled
   - Connected by lines

3. **Header Section**:
   - Headline Medium: "Project Information"
   - Body Medium: "Configure your project details"

4. **Form Cards** (scrollable):

   **Card 1 - Organization**:
   - Title: "Organization"
   - Fields: Name*, Website, Email

   **Card 2 - Project Details**:
   - Title: "Project Details"
   - Fields: Project Name*, Display Name*, Description

   **Card 3 - Package Configuration**:
   - Title: "Package Configuration"
   - Fields: Package Name*, Application ID (locked)

   **Card 4 - Version**:
   - Title: "Version"
   - Fields: Version Name*, Version Code*

   **Card 5 - SDK Configuration**:
   - Title: "SDK Configuration"
   - Fields: Min Android (dropdown), Target Android (dropdown), Min iOS (dropdown)

5. **Bottom Navigation**:
   - Outlined button: "Previous"
   - Filled button: "Next Step"

**Colors**:
- Primary: #2563eb
- Surface: #ffffff
- On Surface: #0f172a
- Outline: #e2e8f0

---

## AI Prompt - Form Field Component

Design a Material 3 form field component:

**Component Name**: Form Field
**Variants**: Text, Textarea, Select, Disabled

**Structure**:
```
Form Field Container
├── Label Row
│   ├── Label Text (14px medium)
│   └── Required Indicator (*) [optional]
├── Input Container
│   ├── Input (or Select, or Textarea)
│   └── Trailing Icon [optional]
└── Helper Row
    ├── Helper Text (12px) [or]
    └── Error Text (12px, red)
```

**States**:
- Default: Gray border (#e2e8f0)
- Focused: Blue border (#2563eb), focus ring
- Error: Red border (#ef4444), red error text
- Disabled: Gray background (#f1f5f9), lock icon

---

## AI Prompt - Form Card Component

Design a form section card:

**Component Name**: Form Section Card
**Purpose**: Group related form fields

**Structure**:
```
Card Container (Surface)
├── Section Title (16px semibold)
└── Fields Container
    ├── Field 1
    ├── Field 2
    └── Field N
```

**Specifications**:
- Background: Surface (#ffffff)
- Border: 1px Outline (#e2e8f0)
- Corner radius: 12px
- Padding: 20px
- Title bottom margin: 16px
- Field gap: 16px

---

## AI Prompt - Select Dropdown

Design a dropdown select component:

**Component Name**: SDK Version Select
**Purpose**: Select SDK version

**Closed State**:
```
┌─────────────────────────────────────┐
│ 24 - Android 7.0 (Nougat)         ▼ │
└─────────────────────────────────────┘
```

**Open State**:
```
┌─────────────────────────────────────┐
│ 24 - Android 7.0 (Nougat)         ▲ │
├─────────────────────────────────────┤
│ 21 - Android 5.0 (Lollipop)         │
│ 23 - Android 6.0 (Marshmallow)      │
│ 24 - Android 7.0 (Nougat)        ✓  │
│ 26 - Android 8.0 (Oreo)             │
│ 28 - Android 9.0 (Pie)              │
│ 30 - Android 11                      │
│ 33 - Android 13                      │
│ 34 - Android 14                      │
└─────────────────────────────────────┘
```

---

## AI Prompt - Desktop Layout

Design a desktop wizard form with split view:

**Frame**: Desktop (1440 x 900)

**Layout**:
```
┌────────────────────────────────────────┐
│ Header Bar                             │
├────────────────────────────────────────┤
│ Progress Bar                           │
├─────────────────────┬──────────────────┤
│                     │                  │
│  Form (60%)         │  Preview (40%)   │
│                     │                  │
│  2-column layout    │  Summary Card    │
│                     │  Generated Files │
│                     │                  │
├─────────────────────┴──────────────────┤
│ Footer                                 │
└────────────────────────────────────────┘
```

**Form 2-Column Layout**:
- Org name | Website
- Email (full width)
- Project name | Display name
- Description (full width)
- Package name | App ID
- Version | Version code
- Min SDK | Target SDK | Min iOS (3 columns)

---

## Component Library References

| Element | M3 Component | Variant |
|---------|--------------|---------|
| Header | Top App Bar | Center-aligned |
| Cards | Card | Filled |
| Text Input | TextField | Outlined |
| Select | Select | Outlined |
| Textarea | TextField | Outlined, multiline |
| Buttons | Button | Filled, Outlined |

---

## Layer Naming Convention

```
Step 2 - Project Info
├── Header
│   ├── Back Icon
│   ├── Title
│   └── Step Label
├── Progress
├── Content (Scrollable)
│   ├── Title Section
│   │   ├── Headline
│   │   └── Subtitle
│   ├── Card - Organization
│   │   ├── Section Title
│   │   ├── Field - Org Name
│   │   ├── Field - Website
│   │   └── Field - Email
│   ├── Card - Project Details
│   │   ├── Section Title
│   │   ├── Field - Project Name
│   │   ├── Field - Display Name
│   │   └── Field - Description
│   ├── Card - Package
│   │   ├── Section Title
│   │   ├── Field - Package Name
│   │   └── Field - App ID (Locked)
│   ├── Card - Version
│   │   ├── Section Title
│   │   ├── Field - Version Name
│   │   └── Field - Version Code
│   └── Card - SDK
│       ├── Section Title
│       ├── Select - Min Android
│       ├── Select - Target Android
│       └── Select - Min iOS
└── Footer
    ├── Previous Button
    └── Next Button
```

---

## Prototype Settings

**Interactions**:
1. Input focus → Show focus ring
2. Input blur (invalid) → Show error
3. Select click → Open dropdown
4. Previous button → Navigate to Step 1
5. Next button → Validate, then Step 3

**Transitions**:
- Focus: Dissolve, 150ms
- Error appear: Smart animate, 200ms
- Dropdown: Smart animate, 200ms
- Navigation: Slide, 300ms

---

## Related Files

- [PROMPTS.md](./PROMPTS.md) - General prompts
- [PROMPTS_STITCH.md](./PROMPTS_STITCH.md) - Google Stitch prompts
- [FIGMA_LINKS.md](./FIGMA_LINKS.md) - Figma file links
