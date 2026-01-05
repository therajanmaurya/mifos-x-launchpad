# Commands Quick Reference

> Fast lookup for Claude Product Cycle commands

---

## Core Commands

### `/projectstatus`

**Purpose**: Show project overview and current status

**Usage**:
```
/projectstatus
```

**Output**: Dashboard showing all layers, features, and their status

---

### `/design [step]`

**Purpose**: Create or update feature specification

**Usage**:
```
/design step-1-app-selection
/design step-3-branding-theme
```

**Creates**:
- `SPEC.md` - Requirements and acceptance criteria
- `MOCKUP.md` - Visual mockups (ASCII)
- `API.md` - TypeScript interfaces
- `STATUS.md` - Implementation status

**Model**: Opus (for comprehensive design)

---

### `/implement [step]`

**Purpose**: Implement a wizard step

**Usage**:
```
/implement step-1-app-selection
/implement step-2-project-info
```

**Creates**:
- React component in `src/components/wizard/steps/`
- State slice in `src/store/wizard-store.ts`
- Types in `src/types/`

**Model**: Sonnet

---

### `/component [name]`

**Purpose**: Create a React component

**Usage**:
```
/component color-picker
/component device-mockup
```

**Creates**:
- Component file in appropriate directory
- Types if needed
- Updates to COMPONENTS.md

**Model**: Sonnet

---

### `/template [type]`

**Purpose**: Create a generation template

**Usage**:
```
/template android-manifest
/template github-actions
/template theme-kt
```

**Creates**:
- Template file in `template-layer/`
- Generator function in `src/lib/generators/`

**Model**: Sonnet

---

### `/verify [step]`

**Purpose**: Validate implementation against spec

**Usage**:
```
/verify step-1-app-selection
/verify all
```

**Output**: Gap report showing missing or incomplete items

**Model**: Sonnet

---

### `/mockup [step]`

**Purpose**: Generate AI prompts for visual mockups

**Usage**:
```
/mockup step-1-app-selection
/mockup step-3-branding-theme prompts
```

**Creates**:
- `PROMPTS.md` - General AI prompts
- `PROMPTS_FIGMA.md` - Figma-specific prompts
- `PROMPTS_STITCH.md` - Google Stitch prompts

**Model**: Sonnet

---

### `/gap-analysis [layer]`

**Purpose**: Show implementation gaps

**Usage**:
```
/gap-analysis                 # Full dashboard
/gap-analysis design          # Design layer only
/gap-analysis component       # Component layer only
/gap-analysis feature         # Feature layer only
```

**Output**: Gap analysis dashboard

---

### `/gap-planning [step]`

**Purpose**: Generate improvement plan

**Usage**:
```
/gap-planning step-1-app-selection
/gap-planning all
```

**Output**: Action plan with tasks and priorities

---

## Command Shortcuts

| Full Command | Short | Example |
|--------------|-------|---------|
| `/projectstatus` | `/ps` | `/ps` |
| `/design` | `/d` | `/d step-1` |
| `/implement` | `/impl` | `/impl step-1` |
| `/component` | `/comp` | `/comp color-picker` |
| `/template` | `/tpl` | `/tpl android` |
| `/verify` | `/v` | `/v step-1` |
| `/mockup` | `/mock` | `/mock step-1` |
| `/gap-analysis` | `/ga` | `/ga design` |
| `/gap-planning` | `/gp` | `/gp step-1` |

---

## Step Names

| Step | Full Name | Short |
|:----:|-----------|-------|
| 1 | `step-1-app-selection` | `step-1` |
| 2 | `step-2-project-info` | `step-2` |
| 3 | `step-3-branding-theme` | `step-3` |
| 4 | `step-4-app-icons` | `step-4` |
| 5 | `step-5-server-config` | `step-5` |
| 6 | `step-6-platform-selection` | `step-6` |
| 7 | `step-7-features-security` | `step-7` |
| 8 | `step-8-cicd-deployment` | `step-8` |
| 9 | `step-9-code-quality` | `step-9` |
| 10 | `step-10-review-generate` | `step-10` |

---

## Workflow Examples

### New Feature Development

```bash
# 1. Create specification
/design step-1-app-selection

# 2. Generate mockup prompts
/mockup step-1-app-selection

# 3. Implement the feature
/implement step-1-app-selection

# 4. Verify implementation
/verify step-1-app-selection
```

### Check Project Status

```bash
# Full status
/projectstatus

# Find gaps
/gap-analysis

# Plan improvements
/gap-planning step-1
```

### Create Component

```bash
# Create a new shared component
/component file-upload

# Create a preview component
/component theme-preview
```

---

## Model Selection

| Command | Recommended Model | Reason |
|---------|------------------|--------|
| `/design` | Opus | Comprehensive design |
| `/implement` | Sonnet | Fast implementation |
| `/component` | Sonnet | Component creation |
| `/template` | Sonnet | Template creation |
| `/verify` | Sonnet | Validation |
| `/mockup` | Sonnet | Prompt generation |
| `/projectstatus` | Any | Status display |
| `/gap-analysis` | Any | Analysis |

---

## Tips

1. **Read specs first**: Always `/design` before `/implement`
2. **Check components**: Use `/component` before creating manually
3. **Verify often**: Run `/verify` after each implementation
4. **Track progress**: Check `/projectstatus` regularly
5. **Find gaps**: Use `/gap-analysis` to identify missing pieces
