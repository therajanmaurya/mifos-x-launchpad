# /mockup Command

> Generate AI prompts for visual design mockups

## Purpose

The `/mockup` command generates prompts that can be used with AI design tools (Google Stitch, Figma AI, Uizard) to create visual mockups for wizard steps.

## Usage

```
/mockup [step-name]
/mockup [step-name] prompts
/mockup [step-name] figma
/mockup [step-name] stitch
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| step-name | string | Yes | Step to generate mockups for |
| format | string | No | Output format: prompts, figma, stitch |

## Workflow

### Step 1: Read Design Specifications

```
1. Read design-spec-layer/features/[step-name]/SPEC.md
2. Read design-spec-layer/features/[step-name]/MOCKUP.md
3. Read design-spec-layer/_shared/COMPONENTS.md
```

### Step 2: Generate PROMPTS.md

Create `design-spec-layer/features/[step-name]/mockups/PROMPTS.md`:

```markdown
# [Step Name] - AI Mockup Prompts

## Main Screen Prompt

Create a mobile app screen for [step description]:

**Layout:**
- [Layout description]

**Components:**
- [Component 1]: [Description]
- [Component 2]: [Description]

**Style:**
- Material Design 3
- Clean, modern fintech aesthetic
- Primary color: Blue (#2563eb)

## Component Prompts

### [Component 1] Prompt
[Detailed prompt for component]

### [Component 2] Prompt
[Detailed prompt for component]
```

### Step 3: Generate PROMPTS_FIGMA.md

Create Figma-specific prompts:

```markdown
# [Step Name] - Figma Prompts

## Figma AI Prompt

Design a [step description] screen using:

**Frame:** iPhone 14 Pro (393 x 852)

**Components from Figma Community:**
- Material 3 Design Kit
- [Specific components]

**Auto Layout:**
- Vertical stack, 16px gap
- 24px horizontal padding

**Typography:**
- Display: SF Pro Display
- Body: SF Pro Text
```

### Step 4: Generate PROMPTS_STITCH.md

Create Google Stitch prompts:

```markdown
# [Step Name] - Google Stitch Prompts

## Stitch Prompt

Mobile banking app screen for [step description].

Style: Modern fintech, Material Design 3
Color scheme: Blue primary (#2563eb), white background

Include:
1. [Element 1]
2. [Element 2]
3. [Element 3]

The design should feel professional and trustworthy.
```

### Step 5: Update FIGMA_LINKS.md

Create placeholder for Figma links:

```markdown
# [Step Name] - Figma Links

## Design Files

| Screen | Figma Link | Last Updated |
|--------|------------|--------------|
| Main Screen | [To be added] | |
| Component A | [To be added] | |

## How to Update

1. Generate mockup using AI tools
2. Import to Figma
3. Update links above
```

## Output

The command produces:
- `mockups/PROMPTS.md` - General AI prompts
- `mockups/PROMPTS_FIGMA.md` - Figma-specific prompts
- `mockups/PROMPTS_STITCH.md` - Google Stitch prompts
- `mockups/FIGMA_LINKS.md` - Links placeholder

## Prompt Templates

### Mobile Screen Prompt

```
Create a mobile app screen for a banking app wizard.

Screen: [Step Name]
Purpose: [Purpose description]

Layout (top to bottom):
- Header: "[Title]" with back button
- Description: "[Subtitle text]"
- Main Content:
  - [Content description]
- Bottom: Navigation buttons (Back, Next)

Style:
- Clean, modern Material Design 3
- Primary color: Blue (#2563eb)
- Background: White
- Cards with subtle shadows
- 16px rounded corners

Mood: Professional, trustworthy, easy to use
```

### Component Prompt

```
Create a [component type] component:

Purpose: [What it does]
State: [Different states]
Interaction: [How user interacts]

Specifications:
- Width: [width]
- Height: [height]
- Padding: [padding]
- Border radius: [radius]

Include:
- [Element 1]
- [Element 2]
```

## Examples

### Generate Step 1 Mockups

```
/mockup step-1-app-selection
```

Creates prompts for app selection cards:
- 4 app cards in a grid
- Feature comparison
- Selection indicator

### Generate Step 3 Mockups

```
/mockup step-3-branding-theme
```

Creates prompts for branding UI:
- Color pickers
- Theme preview panel
- Preset buttons

### Generate Figma-Specific

```
/mockup step-3-branding-theme figma
```

Generates only Figma-optimized prompts.

## AI Tool Tips

### Google Stitch
- Be specific about layout
- Mention "Material Design 3"
- Describe colors precisely
- Keep prompts concise

### Figma AI
- Reference Figma components
- Specify Auto Layout
- Use proper typography names
- Include frame dimensions

### Uizard
- Describe user flow
- Mention interaction states
- Be specific about buttons
- Include placeholder text

## Model Recommendation

**Sonnet** - For prompt generation

## Related Commands

- `/design [step]` - Must run first for specs
- `/implement [step]` - Implement after mockups approved
