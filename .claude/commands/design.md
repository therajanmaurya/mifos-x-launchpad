# Design Command

Create or update feature specifications for wizard steps.

**Step**: $ARGUMENTS

## Instructions

### If no step name provided:
Show available steps and ask which one to design:

```
Available Steps:
- step-1-app-selection
- step-2-project-info
- step-3-branding-theme
- step-4-app-icons
- step-5-server-config
- step-6-platform-selection
- step-7-features-security
- step-8-cicd-deployment
- step-9-code-quality
- step-10-review-generate

Which step do you want to design?
```

### If step name provided:

1. **Read Context**
   - Read `claude-product-cycle/PRODUCT_MAP.md`
   - Read `claude-product-cycle/design-spec-layer/_shared/PATTERNS.md`
   - Read `claude-product-cycle/design-spec-layer/_shared/COMPONENTS.md`
   - Check if existing spec exists at `claude-product-cycle/design-spec-layer/features/[step-name]/`

2. **Create/Update SPEC.md**

Create `claude-product-cycle/design-spec-layer/features/[step-name]/SPEC.md`:

```markdown
# [Step Name] - Specification

## Overview
[Brief description]

## User Stories
- As a user, I want to...

## Requirements
### Functional Requirements
- FR-1: ...

### Non-Functional Requirements
- NFR-1: ...

## UI Components
[List of components needed]

## State
[TypeScript interface for step state]

## Validation Rules
[Form validation requirements]

## Acceptance Criteria
- [ ] Criteria 1
- [ ] Criteria 2
```

3. **Create/Update MOCKUP.md**

Create `claude-product-cycle/design-spec-layer/features/[step-name]/MOCKUP.md`:

```markdown
# [Step Name] - Mockups

## Screen Layout
[ASCII mockup of the screen]

## Component Details
[Description of each component]

## Responsive Behavior
[Mobile, tablet, desktop layouts]

## Interactions
[User interaction flows]
```

4. **Create/Update API.md**

Create `claude-product-cycle/design-spec-layer/features/[step-name]/API.md`:

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

5. **Create/Update STATUS.md**

Create `claude-product-cycle/design-spec-layer/features/[step-name]/STATUS.md`:

```markdown
# [Step Name] - Status

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| SPEC.md | Done | |
| MOCKUP.md | Done | |
| API.md | Done | |
| React Component | Planned | |
| Store Slice | Planned | |
| Validation | Planned | |

## Changelog

| Date | Change |
|------|--------|
| [date] | Initial specification created |
```

6. **Update Main STATUS.md**
   - Update `claude-product-cycle/design-spec-layer/STATUS.md` with new step status

## Model Recommendation
Use **Opus** for comprehensive design specifications.
