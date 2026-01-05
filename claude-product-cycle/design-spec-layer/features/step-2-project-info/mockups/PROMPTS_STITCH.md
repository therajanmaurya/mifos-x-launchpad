# Step 2: Project Info - Google Stitch Prompts

> Optimized prompts for Google Stitch AI design tool

---

## Style Preferences

- **Design System**: Material Design 3
- **Industry**: Fintech / Mobile Banking
- **Aesthetic**: Clean, professional, form-focused
- **Platform**: Mobile-first

---

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #2563eb | Focus, buttons |
| Background | #ffffff | Page background |
| Surface | #ffffff | Cards |
| On Surface | #0f172a | Text |
| Outline | #e2e8f0 | Input borders |
| Error | #ef4444 | Validation errors |
| Muted | #64748b | Helper text |

---

## Main Screen Prompt

Create a mobile form screen for a project wizard.

**Screen name**: Project Information
**App type**: Mobile banking project generator

The screen should have:

1. A header with back button, "MifosForge" title, and "2/10" step indicator
2. A progress indicator showing step 2 of 10 is active
3. A title "Project Information" with subtitle "Configure your project details"
4. Multiple form sections in white cards:
   - Organization section with name, website, and email fields
   - Project section with name, display name, and description
   - Package section with package name and auto-generated app ID
   - Version section with version name and code
   - SDK section with three dropdown selects
5. Previous and Next buttons at the bottom

**Style**:
- Clean Material Design 3 form
- White cards with subtle borders
- Input fields with labels above
- Blue focus states
- Professional appearance

**Include these elements**:
- Required field indicators (*)
- One field shown with validation error (red border, error message)
- Lock icon on auto-generated field
- Dropdown indicators on select fields

---

## Form Card Prompt

Create a form section card for grouping inputs.

**Component type**: Card with form fields
**Purpose**: Group related form inputs

The card should contain:
- A section title at the top
- Multiple form fields vertically stacked
- Consistent spacing between fields
- Rounded corners and subtle border

**Style**:
- White background
- Light gray border (#e2e8f0)
- 12px rounded corners
- 20px internal padding
- Section title in 16px semibold

---

## Text Input Prompt

Create a form input field for text entry.

**Component type**: Text input with label
**Purpose**: Collect user text input

The input should show:
- Label above the input (14px)
- Required indicator (*) when applicable
- Input box with border
- Placeholder text inside
- Helper or error text below

**States needed**:
1. Default - gray border, placeholder visible
2. Focused - blue border, focus ring
3. Filled - user text, gray border
4. Error - red border, error message below
5. Disabled - gray background, lock icon

**Style**:
- 16px input text
- 44px input height
- 8px border radius
- Clean, minimal design

---

## Select Dropdown Prompt

Create a dropdown select for SDK version.

**Component type**: Dropdown select
**Purpose**: Select SDK version

The select should show:
- Label above (e.g., "Min Android SDK")
- Current selection with dropdown arrow
- When open: list of options with checkmark on selected

**Options example**:
- 24 - Android 7.0 (Nougat)
- 26 - Android 8.0 (Oreo)
- 28 - Android 9.0 (Pie)
- 30 - Android 11
- 33 - Android 13
- 34 - Android 14

**Style**:
- Same styling as text inputs
- Dropdown arrow on right
- Options list with hover state

---

## Validation Error Prompt

Create a form field with validation error.

**Component type**: Input with error state
**Purpose**: Show invalid input feedback

Show:
- Label: "Package Name *"
- Input with red border
- Invalid value: "invalid package"
- Error message below: "Package name must be in format com.example.app"
- Error icon next to message

**Style**:
- Red border (#ef4444)
- Red error text (12px)
- Warning/error icon

---

## Desktop Preview Panel Prompt

Create a preview panel for the desktop form.

**Component type**: Information sidebar
**Purpose**: Show project summary

The panel should display:
- "Project Summary" heading
- Key-value pairs:
  - Name: AcmePay
  - Package: com.acme.pay
  - Version: 1.0.0 (1)
- Divider line
- "Generated Files" section
  - List of file icons with names
  - build.gradle.kts
  - AndroidManifest.xml
  - Info.plist
  - settings.gradle.kts
- Platform badges (Android, iOS)

**Style**:
- Light gray background (#f8fafc)
- Clean typography
- File icons
- Badge style for platforms

---

## Typography Specifications

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 28px | Bold | #0f172a |
| Page Subtitle | 16px | Regular | #64748b |
| Section Title | 16px | Semibold | #0f172a |
| Label | 14px | Medium | #0f172a |
| Input Text | 16px | Regular | #0f172a |
| Placeholder | 16px | Regular | #94a3b8 |
| Helper Text | 12px | Regular | #64748b |
| Error Text | 12px | Regular | #ef4444 |

---

## Spacing Specifications

| Element | Value |
|---------|-------|
| Page padding | 24px |
| Card padding | 20px |
| Card gap | 16px |
| Field gap | 16px |
| Label to input | 8px |
| Input to helper | 4px |
| Input height | 44px |
| Button height | 44px |

---

## Mobile Form Layout

```
Page
├── Header (44px)
├── Progress (32px)
├── Content (scrollable)
│   ├── Title + Subtitle
│   ├── Organization Card
│   │   ├── Org Name* (full width)
│   │   ├── Website (full width)
│   │   └── Email (full width)
│   ├── Project Card
│   │   ├── Project Name* (full width)
│   │   ├── Display Name* (full width)
│   │   └── Description (full width, 3 lines)
│   ├── Package Card
│   │   ├── Package Name* (full width)
│   │   └── App ID (locked, full width)
│   ├── Version Card
│   │   ├── Version (half) | Code (half)
│   └── SDK Card
│       ├── Min Android (third)
│       ├── Target (third)
│       └── Min iOS (third)
└── Footer (60px)
    ├── Previous (half)
    └── Next (half)
```

---

## Export Notes

When generating in Google Stitch:
1. Generate mobile screen with all form cards
2. Generate individual states separately
3. Generate error state variations
4. Generate desktop split view
5. Export components for reuse

---

## Related Files

- [PROMPTS.md](./PROMPTS.md) - General AI prompts
- [PROMPTS_FIGMA.md](./PROMPTS_FIGMA.md) - Figma-specific prompts
- [SPEC.md](../SPEC.md) - Full specifications
