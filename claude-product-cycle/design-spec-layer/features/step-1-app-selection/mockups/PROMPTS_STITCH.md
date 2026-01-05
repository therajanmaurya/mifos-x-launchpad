# Step 1: App Selection - Google Stitch Prompts

> Optimized prompts for Google Stitch AI design tool

---

## Style Preferences

- **Design System**: Material Design 3
- **Industry**: Fintech / Mobile Banking
- **Aesthetic**: Modern, clean, professional, trustworthy
- **Platform**: Mobile-first, responsive

---

## Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #2563eb | Actions, selected states, links |
| Primary Light | #3b82f6 | Hover states |
| Primary Container | #eff6ff | Selected backgrounds |
| Background | #ffffff | Page background |
| Surface | #f8fafc | Cards, panels |
| On Surface | #0f172a | Primary text |
| On Surface Variant | #475569 | Secondary text |
| Outline | #e2e8f0 | Borders, dividers |
| Error | #ef4444 | Error states |

---

## Main Screen Prompt

Create a mobile app screen for a project wizard.

**Screen name**: Select Base Application
**App type**: Mobile banking / fintech project generator

The screen should have:

1. A header with a back button, app title "MifosForge", and step indicator "1/10"
2. A progress indicator showing step 1 of 10 is active
3. A title "Select Base Application" with subtitle "Choose which Mifos app to customize"
4. Four selectable cards for different app options:
   - Mobile Wallet - digital wallet for P2P transfers
   - Mifos Mobile - full-featured banking client
   - Android Client - field officer application
   - Blank Template - minimal KMP starter
5. Each card shows an icon, name, description, and 3 key features
6. One card should appear selected with a blue border and checkmark
7. A "Next Step" button fixed at the bottom

**Style**:
- Clean and modern Material Design 3
- Use cards for the app options
- Blue primary color (#2563eb)
- White background
- Professional banking app feel
- Subtle shadows on cards

**Include these elements**:
- 48x48 app icons for each card
- Bullet points for features
- "View on GitHub" link on each card
- Selection state with checkmark

---

## Card Component Prompt

Create a selection card component for a fintech app.

**Component type**: Selectable card
**Purpose**: Let users choose between app options

The card should contain:
- A 48x48 icon on the left
- App name as the title
- A short 2-line description
- Three bullet points for features
- A link text "View on GitHub →"

**States needed**:
1. Default - white background, gray border
2. Hover - slightly elevated, darker border
3. Selected - light blue background, blue border, checkmark in corner

**Style**:
- Material Design 3 card
- 12px rounded corners
- 20px padding
- Subtle shadow
- Blue accent color (#2563eb)

---

## Preview Panel Prompt

Create a preview panel for desktop showing selected app details.

**Component type**: Information panel
**Purpose**: Show expanded details of selected app

The panel should display:
- A phone device mockup at the top
- The selected app name and icon
- Full feature list with checkmarks
- Platform badges (Android, iOS)
- Tech stack information
- Maintenance status badge

**Style**:
- Light gray background (#f8fafc)
- Clean typography
- Badges for platforms
- Material Design 3

---

## Progress Indicator Prompt

Create a horizontal step progress indicator.

**Component type**: Progress stepper
**Purpose**: Show wizard progress (10 steps)

The indicator should have:
- 10 circular steps connected by lines
- Step 1 is filled/active (blue)
- Steps 2-10 are outlined/inactive (gray)
- Compact design for mobile

**Style**:
- 12px diameter circles
- 2px connecting lines
- Primary blue for active (#2563eb)
- Gray for inactive (#e2e8f0)

---

## Empty State Prompt

Create an empty state for when no app is selected.

**Screen type**: Selection required state
**Purpose**: Prompt user to make a selection

Show:
- All four cards with default (unselected) styling
- Subtle hint text below cards: "Select an app to continue"
- Next button in disabled/grayed state
- No error message yet (friendly guidance)

**Style**:
- Professional, not alarming
- Disabled button: gray background, reduced opacity
- Hint text: smaller, muted color

---

## Error State Prompt

Create a validation error state for app selection.

**Screen type**: Form validation error
**Purpose**: Show that selection is required

Show:
- Error banner below the title section
- Icon: warning/error icon
- Text: "Please select a base application to continue"
- Cards remain in current state
- Next button still visible but indicates error

**Style**:
- Error banner: light red background (#fef2f2)
- Red border (#fecaca)
- Red text (#991b1b)
- Error icon (#ef4444)

---

## Mobile Variations

### Small Phone (iPhone SE)
- Smaller cards with condensed content
- Only show 2 features per card
- Full-width single column layout

### Standard Phone (iPhone 14)
- Full card design as specified
- Single column, scrollable
- Standard spacing

### Large Phone (iPhone 14 Pro Max)
- Same as standard
- Slightly larger touch targets
- More visible content above fold

---

## Interactive Specifications

**Card tap**:
- Visual feedback: ripple effect
- State change: immediate selection
- Previous selection: auto-deselect

**Next button tap**:
- If valid: navigate to step 2
- If invalid: show error state
- Loading: show spinner briefly

**GitHub link tap**:
- Open in browser/new tab
- Don't trigger card selection
- Brief highlight on tap

---

## Typography Specifications

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page Title | 28px | Bold (700) | #0f172a |
| Page Subtitle | 16px | Regular (400) | #475569 |
| Card Title | 18px | Semibold (600) | #0f172a |
| Card Description | 14px | Regular (400) | #475569 |
| Features | 14px | Regular (400) | #334155 |
| Link Text | 14px | Medium (500) | #2563eb |
| Button Text | 16px | Medium (500) | #ffffff |

---

## Spacing Specifications

| Element | Value |
|---------|-------|
| Page horizontal padding | 24px |
| Page vertical padding | 16px |
| Card padding | 20px |
| Gap between cards | 16px |
| Icon to text gap | 16px |
| Feature list gap | 8px |
| Title to subtitle gap | 8px |
| Footer height | 60px |
| Footer button padding | 24px horizontal |

---

## Export Notes

When generating in Google Stitch:
1. Generate mobile screen first
2. Export as PNG at 2x for development reference
3. Generate individual components separately
4. Use consistent naming for layers

---

## Related Files

- [PROMPTS.md](./PROMPTS.md) - General AI prompts
- [PROMPTS_FIGMA.md](./PROMPTS_FIGMA.md) - Figma-specific prompts
- [SPEC.md](../SPEC.md) - Full specifications
