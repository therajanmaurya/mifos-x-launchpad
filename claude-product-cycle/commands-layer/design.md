# /design Command

> Create or update feature specifications

## Purpose

The `/design` command creates comprehensive design specifications for wizard steps. It generates SPEC.md, MOCKUP.md, and API.md files that define what to build.

## Usage

```
/design [step-name]
/design step-1-app-selection
/design step-3-branding-theme
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| step-name | string | Yes | The wizard step to design |

### Valid Step Names

- `step-1-app-selection`
- `step-2-project-info`
- `step-3-branding-theme`
- `step-4-app-icons`
- `step-5-server-config`
- `step-6-platform-selection`
- `step-7-features-security`
- `step-8-cicd-deployment`
- `step-9-code-quality`
- `step-10-review-generate`

## Workflow

### Step 1: Read Existing Context

```
1. Read claude-product-cycle/PRODUCT_MAP.md
2. Read design-spec-layer/_shared/PATTERNS.md
3. Read design-spec-layer/_shared/COMPONENTS.md
4. Check if existing spec exists for the step
```

### Step 2: Create SPEC.md

Create `design-spec-layer/features/[step-name]/SPEC.md` with:

```markdown
# [Step Name] - Specification

## Overview
Brief description of the step

## User Stories
- As a user, I want to...

## Requirements
### Functional Requirements
- FR-1: ...
- FR-2: ...

### Non-Functional Requirements
- NFR-1: ...

## UI Components
List of UI components needed

## State
TypeScript interface for step state

## Validation Rules
Form validation requirements

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
```

### Step 3: Create MOCKUP.md

Create `design-spec-layer/features/[step-name]/MOCKUP.md` with:

```markdown
# [Step Name] - Mockups

## Screen Layout

┌─────────────────────────────────────┐
│  ASCII art mockup                   │
└─────────────────────────────────────┘

## Component Details
Description of each component

## Responsive Behavior
Mobile, tablet, desktop layouts

## Interactions
User interaction flows
```

### Step 4: Create API.md

Create `design-spec-layer/features/[step-name]/API.md` with:

```markdown
# [Step Name] - API

## TypeScript Interfaces

\`\`\`typescript
interface StepState {
  // State definition
}
\`\`\`

## Actions

\`\`\`typescript
interface StepActions {
  // Action definitions
}
\`\`\`

## Props

\`\`\`typescript
interface StepProps {
  // Component props
}
\`\`\`
```

### Step 5: Create STATUS.md

Create `design-spec-layer/features/[step-name]/STATUS.md` with:

```markdown
# [Step Name] - Status

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| SPEC.md | ✅ Done | |
| MOCKUP.md | ✅ Done | |
| API.md | ✅ Done | |
| React Component | 📋 Planned | |
| Store Slice | 📋 Planned | |
| Validation | 📋 Planned | |

## Changelog

| Date | Change |
|------|--------|
| [date] | Initial specification created |
```

## Output

The command produces:
- `design-spec-layer/features/[step-name]/SPEC.md`
- `design-spec-layer/features/[step-name]/MOCKUP.md`
- `design-spec-layer/features/[step-name]/API.md`
- `design-spec-layer/features/[step-name]/STATUS.md`

## Examples

### Design Step 1

```
/design step-1-app-selection
```

Creates specifications for the app selection step:
- Requirements for selecting base Mifos app
- Mockups showing app cards
- TypeScript interfaces for selection state

### Design Step 3

```
/design step-3-branding-theme
```

Creates specifications for branding:
- Color picker requirements
- Theme preview mockups
- Color state interfaces

## Model Recommendation

**Opus** - For comprehensive, detailed design specifications

## Related Commands

- `/mockup [step]` - Generate AI prompts for visual design
- `/implement [step]` - Implement after design is complete
- `/verify [step]` - Validate implementation against spec
