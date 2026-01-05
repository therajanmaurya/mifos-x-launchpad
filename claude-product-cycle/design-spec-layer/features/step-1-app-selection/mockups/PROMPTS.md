# Step 1: App Selection - AI Mockup Prompts

> General AI prompts for generating Step 1 mockups

---

## Screen Overview

**Name**: App Selection
**Purpose**: Allow users to select the base Mifos application to customize
**Platform**: Mobile (Android/iOS) & Desktop Web
**Style**: Material Design 3
**Step**: 1 of 10

---

## Main Screen Prompt

Create a mobile app screen for a project wizard application:

**Screen**: Select Base Application (Step 1 of 10)
**Device**: iPhone 14 Pro (393 x 852)

**Layout** (top to bottom):
1. **Header** (44px): Back button on left, "MifosForge" centered, "Step 1 of 10" on right
2. **Progress Bar**: 10 dots/steps, first one filled
3. **Title Section**:
   - Main title: "Select Base Application" (28px bold)
   - Subtitle: "Choose which Mifos app to customize" (16px muted gray)
4. **App Cards** (scrollable, 4 cards):
   - Each card shows: Icon, App name, description, feature bullets, GitHub link
   - One card should be shown as "selected" with blue border and checkmark
5. **Footer** (60px): "Next Step" button on the right, primary blue

**Style**:
- Material Design 3
- Primary color: #2563eb (blue)
- Background: #ffffff
- Cards: White with subtle shadow, 12px border radius
- Selected card: 2px blue border, light blue background (#eff6ff)

**Mood**: Professional, trustworthy, modern fintech application

---

## Component Prompts

### App Card Component

Create a card component for selecting a mobile app:

**Purpose**: Display a selectable application option
**Dimensions**: Full width, approximately 160px height
**States**: Default, Hover, Selected

**Content**:
- Left side: 48x48 app icon in a rounded container
- Right side:
  - App name (18px semibold)
  - Description (14px gray, 2 lines max)
- Below: 3 feature bullet points (14px)
- Bottom: "View on GitHub" text link with arrow

**Default Style**:
- Background: #ffffff
- Border: 1px solid #e2e8f0
- Border radius: 12px
- Padding: 20px
- Shadow: subtle drop shadow

**Selected Style**:
- Background: #eff6ff (blue-50)
- Border: 2px solid #2563eb
- Checkmark icon in top-right corner

---

### Progress Indicator

Create a step progress indicator for a wizard:

**Purpose**: Show current step in a 10-step wizard
**Style**: 10 circles connected by lines

**Specifications**:
- Active step: Filled circle (#2563eb), white number
- Completed steps: Filled circle with checkmark
- Future steps: Empty circle with gray border
- Connecting lines: Gray for future, blue for completed

---

### Feature List Component

Create a feature list for an app card:

**Purpose**: Display 3-5 key features of an app
**Layout**: Vertical list with bullet points

**Style**:
- Bullet: Small circle or checkmark (#2563eb)
- Text: 14px, #334155 (slate-700)
- Line height: 24px
- Gap between items: 4px

---

## Desktop Prompt

Create a desktop web page for a project wizard:

**Screen**: Select Base Application (Step 1 of 10)
**Size**: 1440 x 900

**Layout**:
1. **Header bar** (56px): Logo, navigation, step indicator
2. **Progress bar**: Horizontal with step labels
3. **Main content area** (split view):
   - Left panel (60%): 2x2 grid of app cards
   - Right panel (40%): Preview panel showing selected app details
4. **Footer** (64px): Previous and Next buttons

**Left Panel - App Grid**:
- 4 cards in 2x2 layout
- Each card: Icon, name, short description, 3 features, GitHub link
- Selected card highlighted with blue border

**Right Panel - Preview**:
- Device mockup showing selected app
- Full feature list
- Platform badges (Android, iOS, etc.)
- Tech stack information

**Style**:
- Clean, spacious layout
- Consistent with mobile design
- Preview panel has light gray background (#f8fafc)

---

## State Variations

### No Selection State

Create an app selection screen with no card selected:
- All cards have default gray border
- "Next Step" button is disabled (grayed out)
- Subtle message: "Select an app to continue"

### Validation Error State

Create an error state for app selection:
- Red error banner below title: "Please select a base application"
- Next button shows error shake animation
- Error icon displayed

### Loading State

Create a loading state for app cards:
- 4 skeleton cards with pulsing animation
- Gray placeholder for icon, title, description
- No interaction possible

---

## Hover Interactions

**Card Hover**:
- Slight lift effect (translateY -2px)
- Enhanced shadow
- Border color slightly darker

**Button Hover**:
- Background color slightly darker (#1d4ed8)
- Subtle scale up (1.02)

**GitHub Link Hover**:
- Underline appears
- Arrow moves slightly right

---

## Accessibility Notes

- All cards are keyboard focusable
- Tab order: Cards (left to right, top to bottom) → Next button
- Focus ring: 2px solid #2563eb with 2px offset
- Screen reader announces: "[App Name], [Selected/Not selected], [Description]"
- Checkmark has aria-hidden="true" (visual only)

---

## Animation Specifications

**Card Selection**:
```
Duration: 200ms
Easing: ease-out
Properties: border-color, background-color, box-shadow
```

**Checkmark Appear**:
```
Duration: 200ms
Easing: ease-out
Animation: scale from 0 to 1, fade in
```

**Page Transition**:
```
Duration: 300ms
Easing: ease-in-out
Animation: Fade in, slight slide up
```

---

## Asset Requirements

| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| Mobile Wallet Icon | SVG/PNG | 48x48 | App logo |
| Mifos Mobile Icon | SVG/PNG | 48x48 | App logo |
| Android Client Icon | SVG/PNG | 48x48 | App logo |
| Blank Template Icon | SVG/PNG | 48x48 | Generic file icon |
| Checkmark Icon | SVG | 24x24 | Selection indicator |
| GitHub Icon | SVG | 16x16 | Link icon |
| Arrow Right Icon | SVG | 16x16 | Link indicator |

---

## Related Files

- [PROMPTS_FIGMA.md](./PROMPTS_FIGMA.md) - Figma-specific prompts
- [PROMPTS_STITCH.md](./PROMPTS_STITCH.md) - Google Stitch prompts
- [SPEC.md](../SPEC.md) - Full specifications
- [MOCKUP.md](../MOCKUP.md) - ASCII mockups
