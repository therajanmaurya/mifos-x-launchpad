# Step 2: Project Info - AI Mockup Prompts

> General AI prompts for generating Step 2 mockups

---

## Screen Overview

**Name**: Project Information
**Purpose**: Configure organization and project metadata
**Platform**: Mobile (Android/iOS) & Desktop Web
**Style**: Material Design 3
**Step**: 2 of 10

---

## Main Screen Prompt

Create a mobile app screen for a project wizard application:

**Screen**: Project Information (Step 2 of 10)
**Device**: iPhone 14 Pro (393 x 852)

**Layout** (top to bottom):
1. **Header** (44px): Back button, "MifosLaunchpad", "Step 2 of 10"
2. **Progress Bar**: 10 steps, second one active
3. **Title Section**:
   - "Project Information" (28px bold)
   - "Configure your project details" (16px muted)
4. **Form Cards** (scrollable):
   - Organization card: name, website, email fields
   - Project card: name, display name, description
   - Package card: package name, application ID (locked)
   - Version card: version name, version code
   - SDK card: min Android, target Android, min iOS dropdowns
5. **Footer** (60px): Previous and Next buttons

**Style**:
- Material Design 3
- Primary color: #2563eb
- White background
- Cards with 12px border radius
- Form fields with labels above
- Error states with red border and message

---

## Component Prompts

### Form Card Component

Create a form card for grouping related fields:

**Purpose**: Container for related form inputs
**Dimensions**: Full width, auto height

**Structure**:
- Section title (16px semibold)
- Form fields vertically stacked
- 20px internal padding
- 16px gap between fields

**Style**:
- Background: #ffffff
- Border: 1px #e2e8f0
- Border radius: 12px
- Shadow: subtle

---

### Text Input Component

Create a form text input field:

**Purpose**: Single-line text input with label
**States**: Default, Focused, Error, Disabled

**Structure**:
- Label above input (14px medium)
- Required indicator (*) in red if required
- Input field with border
- Helper/error text below

**Default State**:
- Border: 1px #e2e8f0
- Background: white
- Text: #0f172a

**Focused State**:
- Border: 2px #2563eb
- Blue focus ring

**Error State**:
- Border: 1px #ef4444
- Error message in red below

**Disabled State**:
- Background: #f1f5f9
- Text: #64748b
- Lock icon in label

---

### Textarea Component

Create a multi-line text input:

**Purpose**: Long text input (description)
**Height**: 80px (3 lines visible)

**Style**:
- Same as text input
- Resize handle on bottom-right
- Character counter if max length

---

### Select Dropdown Component

Create a dropdown select input:

**Purpose**: Select from predefined options
**States**: Default, Open, Selected

**Structure**:
- Label above
- Input with dropdown arrow
- Dropdown list when open

**Dropdown List**:
- Options with value and description
- Selected item has checkmark
- Hover highlight

---

## Desktop Prompt

Create a desktop form screen for a project wizard:

**Screen**: Project Information (Step 2 of 10)
**Size**: 1440 x 900

**Layout**:
1. Header with navigation
2. Progress bar
3. Split view:
   - Left (60%): Form with 2-column layout
   - Right (40%): Preview panel
4. Footer with navigation buttons

**Form Layout**:
- Organization section: 2 columns
- Project section: 2 columns for name/display, full width for description
- Package section: 2 columns
- Version section: 2 columns
- SDK section: 3 columns

**Preview Panel**:
- Project summary card
- Generated files list
- Target platforms

---

## State Variations

### Empty Form State

Create a project info form with all fields empty:
- Default placeholders visible
- No validation errors
- Next button enabled

### Partially Filled State

Create a form with some fields filled:
- Organization name: "Acme Financial"
- Project name: "AcmePay"
- Other fields empty or with defaults
- Auto-generated fields showing

### Validation Error State

Create a form with validation errors:
- Invalid package name: "invalid package" (spaces not allowed)
- Error border on field
- Error message: "Package name must be in format com.example.app"
- Scroll to first error

### All Fields Completed

Create a fully completed form:
- All required fields filled
- Valid package name: com.acme.pay
- Version: 1.0.0, code: 1
- SDK values selected
- Ready to proceed

---

## Field Specifications

| Field | Type | Placeholder | Validation |
|-------|------|-------------|------------|
| Org Name | text | "Your Company Name" | Required, 2-50 |
| Website | url | "https://example.com" | Optional, URL |
| Email | email | "support@example.com" | Optional, email |
| Project Name | text | "MyApp" | Required, alphanumeric |
| Display Name | text | "My App" | Required, 2-50 |
| Description | textarea | "A brief description..." | Optional, max 500 |
| Package Name | text | "com.example.app" | Required, reverse domain |
| Version Name | text | "1.0.0" | Required, semver |
| Version Code | number | "1" | Required, positive |
| Min Android | select | 24 | Required |
| Target Android | select | 34 | Required |
| Min iOS | select | 15.0 | Required |

---

## Animation Specifications

**Field Focus**:
```
Duration: 150ms
Easing: ease-in-out
Properties: border-color, box-shadow
```

**Error Shake**:
```
Duration: 300ms
Keyframes: translateX(-5px, 5px, -5px, 5px, 0)
```

**Auto-fill**:
```
Duration: 200ms
Properties: opacity, background-color
Background flash: light blue briefly
```

---

## Accessibility Notes

- All inputs have associated labels
- Required fields marked with aria-required
- Error messages linked with aria-describedby
- Tab order: fields in logical order → Previous → Next
- Dropdown keyboard navigation: Arrow keys, Enter, Escape

---

## Related Files

- [PROMPTS_FIGMA.md](./PROMPTS_FIGMA.md) - Figma-specific prompts
- [PROMPTS_STITCH.md](./PROMPTS_STITCH.md) - Google Stitch prompts
- [SPEC.md](../SPEC.md) - Full specifications
