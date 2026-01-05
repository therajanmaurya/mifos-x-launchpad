# AI Prompt Templates

> Templates for generating mockup prompts

## Base Template

```markdown
# [STEP_NAME] - AI Mockup Prompts

## Screen Overview

**Name**: [Screen Name]
**Purpose**: [What this screen does]
**Platform**: Mobile (Android/iOS)
**Style**: Material Design 3

---

## Main Screen Prompt

Create a mobile app screen for MifosForge wizard:

**Screen**: [Step Name]
**Device**: iPhone 14 Pro (393 x 852)

**Layout** (top to bottom):
1. Header: Back button, "[Step Title]", Step indicator
2. Title: "[Main Title]" with subtitle
3. Main Content:
   - [Content section 1]
   - [Content section 2]
   - [Content section 3]
4. Footer: Back and Next buttons

**Style**:
- Material Design 3
- Primary color: #2563eb (blue)
- Background: #ffffff
- Cards: White with subtle shadow
- Border radius: 12px

**Mood**: Professional, trustworthy, modern fintech

---

## Component Prompts

### [Component 1 Name]

Create a [component type] component:

**Purpose**: [Description]
**Dimensions**: [Width] x [Height]
**States**: Default, Hover, Selected, Disabled

**Content**:
- [Element 1]
- [Element 2]
- [Element 3]

**Style**:
- Background: [color]
- Border: [style]
- Padding: [value]

---

### [Component 2 Name]

[Repeat component template]

---

## Interactions

1. [Interaction 1]
2. [Interaction 2]
3. [Interaction 3]

---

## Responsive Notes

- Mobile: Single column layout
- Tablet: Side panel for preview
- Desktop: Split view with live preview

```

---

## Figma-Specific Template

```markdown
# [STEP_NAME] - Figma Prompts

## Frame Setup

- **Device**: iPhone 14 Pro
- **Size**: 393 x 852
- **Design Kit**: Material 3 Design Kit

## Auto Layout Settings

- **Direction**: Vertical
- **Padding**: 24px horizontal, 16px vertical
- **Gap**: 16px between sections

## AI Prompt

Design a wizard step screen for MifosForge:

Step: [Step Name] (Step N of 10)

Using Material 3 Design Kit components:
- Top App Bar (with back navigation)
- Content Cards
- Form inputs (if applicable)
- Primary Button for Next
- Secondary Button for Back

Content:
1. [Section 1 description]
2. [Section 2 description]
3. [Section 3 description]

Colors:
- Primary: #2563eb
- Surface: #f8fafc
- On Primary: #ffffff

Include:
- Step progress indicator
- Form validation states
- Loading state variant

```

---

## Google Stitch Template

```markdown
# [STEP_NAME] - Google Stitch Prompts

## Style Preferences

- **Design System**: Material Design 3
- **Industry**: Fintech / Banking
- **Aesthetic**: Modern, clean, professional

## Color Scheme

- Primary: #2563eb
- Background: #ffffff
- Text: #0f172a
- Accent: #06b6d4

## Screen Prompt

Create a mobile app screen for a project wizard.

Screen name: [Step Name]
App type: Mobile banking / fintech

The screen should have:
1. A header with navigation and step indicator
2. A title "[Step Title]" with a subtitle explaining what to do
3. [Main content description - 2-3 sentences]
4. Navigation buttons at the bottom

Style:
- Clean and modern Material Design 3
- Use cards for content sections
- Blue primary color (#2563eb)
- White background
- Professional banking app feel

Include these elements:
- [Specific element 1]
- [Specific element 2]
- [Specific element 3]

```

---

## Variables

Replace these in templates:

| Variable | Description | Example |
|----------|-------------|---------|
| `[STEP_NAME]` | Step identifier | `step-1-app-selection` |
| `[Step Title]` | Human-readable title | `Select Base Application` |
| `[Step N]` | Step number | `Step 1` |
| `[Content section]` | Main content area | `App selection cards` |
| `[Component type]` | Component category | `card`, `button`, `input` |

---

## Usage

1. Copy appropriate template
2. Replace variables with actual values
3. Add step-specific content
4. Remove unused sections
5. Save to appropriate mockups/ directory
