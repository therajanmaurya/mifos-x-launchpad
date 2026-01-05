# Mockup Command

Generate AI prompts for visual design mockups.

**Step**: $ARGUMENTS

## Instructions

### If no step name provided:
Show available steps for mockup generation.

### If step name provided:

1. **Read Design Specifications**
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/SPEC.md`
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/MOCKUP.md`
   - Read `claude-product-cycle/design-spec-layer/_shared/COMPONENTS.md`

2. **Create mockups/ Directory**
   - Create `claude-product-cycle/design-spec-layer/features/[step-name]/mockups/` if not exists

3. **Generate PROMPTS.md**

Create `mockups/PROMPTS.md`:

```markdown
# [Step Name] - AI Mockup Prompts

## Main Screen Prompt

Create a web app screen for [step description]:

**Layout:**
- [Layout description from MOCKUP.md]

**Components:**
- [Component 1]: [Description]
- [Component 2]: [Description]

**Style:**
- Modern, clean design
- Tailwind CSS styling
- Primary color: Blue (#2563eb)
- Background: White/Gray

## Component Prompts

### [Component 1] Prompt
[Detailed prompt for component]

### [Component 2] Prompt
[Detailed prompt for component]
```

4. **Generate PROMPTS_FIGMA.md**

Create `mockups/PROMPTS_FIGMA.md`:

```markdown
# [Step Name] - Figma Prompts

## Figma AI Prompt

Design a [step description] screen using:

**Frame:** Desktop (1440 x 900)

**Components:**
- [Figma component references]

**Auto Layout:**
- Vertical stack, 16px gap
- 24px horizontal padding

**Typography:**
- Inter font family
- Headings: 24px bold
- Body: 14px regular
```

5. **Generate PROMPTS_STITCH.md**

Create `mockups/PROMPTS_STITCH.md`:

```markdown
# [Step Name] - Google Stitch Prompts

## Stitch Prompt

Web app wizard step for [step description].

Style: Modern fintech, clean UI
Color scheme: Blue primary (#2563eb), white background

Include:
1. [Element 1]
2. [Element 2]
3. [Element 3]

The design should feel professional and easy to use.
```

6. **Create FIGMA_LINKS.md**

Create `mockups/FIGMA_LINKS.md`:

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

## Prompt Templates

### Mobile Screen Prompt
```
Create a mobile-responsive web screen for a wizard.

Screen: [Step Name]
Purpose: [Purpose description]

Layout (top to bottom):
- Header: "[Title]" with progress indicator
- Description: "[Subtitle text]"
- Main Content: [Content description]
- Bottom: Navigation buttons (Back, Next)

Style:
- Clean, modern Tailwind CSS
- Primary color: Blue (#2563eb)
- Cards with subtle shadows
- Rounded corners (rounded-lg)
```

### Component Prompt
```
Create a [component type] component:

Purpose: [What it does]
State: [Different states]
Interaction: [How user interacts]

Specifications:
- Width: [width]
- Padding: [padding]
- Border radius: [radius]
```

## Model Recommendation
Use **Sonnet** for prompt generation.
