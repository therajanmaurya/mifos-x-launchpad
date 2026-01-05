# /projectstatus Command

> Show project overview and current status

## Purpose

The `/projectstatus` command displays a comprehensive dashboard showing the current state of the MifosForge project across all layers.

## Usage

```
/projectstatus
/ps
```

## Parameters

None required.

## Workflow

### Step 1: Gather Status Data

```
1. Read design-spec-layer/STATUS.md
2. Read component-layer/LAYER_STATUS.md
3. Read feature-layer/LAYER_STATUS.md
4. Read template-layer/LAYER_STATUS.md
5. Read CURRENT_WORK.md
```

### Step 2: Generate Dashboard

Output a formatted dashboard showing:
- Overall progress
- Layer health
- Feature status
- Current focus
- Next actions

## Output

### Dashboard Format

```markdown
# MifosForge - Project Status

**Last Updated**: [Date]
**Current Focus**: [Feature/Task]

---

## Overall Progress

┌─────────────────────────────────────────────────────────────┐
│  LAYER HEALTH                                                │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Design Spec      ████████░░░░  65%                      │
│  2. Component        ████░░░░░░░░  35%                      │
│  3. Core             ██████░░░░░░  50%                      │
│  4. Feature          ████░░░░░░░░  30%                      │
│  5. Template         ██░░░░░░░░░░  15%                      │
│  6. Server           ████░░░░░░░░  40%                      │
│                                                              │
│  OVERALL             █████░░░░░░░  42%                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

---

## Wizard Steps Status

| Step | Name | Spec | Component | Store | Status |
|:----:|------|:----:|:---------:|:-----:|:------:|
| 1 | App Selection | ✅ | ✅ | ✅ | Done |
| 2 | Project Info | ✅ | 🔄 | ✅ | In Progress |
| 3 | Branding | ✅ | ❌ | ❌ | Planned |
| 4 | App Icons | 📋 | ❌ | ❌ | Not Started |
| 5 | Server Config | 📋 | ❌ | ❌ | Not Started |
| 6 | Platform | 📋 | ❌ | ❌ | Not Started |
| 7 | Features | 📋 | ❌ | ❌ | Not Started |
| 8 | CI/CD | 📋 | ❌ | ❌ | Not Started |
| 9 | Code Quality | 📋 | ❌ | ❌ | Not Started |
| 10 | Generate | 📋 | ❌ | ❌ | Not Started |

**Legend**: ✅ Done | 🔄 In Progress | 📋 Planned | ❌ Not Started

---

## Current Work

**Feature**: Step 2 - Project Info
**Phase**: Implementation
**Blocker**: None

### Recent Changes
- [Date] Created step-2 component
- [Date] Added store slice
- [Date] Implemented validation

### Next Actions
1. Complete form validation
2. Add preview panel
3. Move to Step 3

---

## Layer Details

### Design Spec Layer
- Total Specs: 10
- Complete: 6
- In Progress: 1
- Planned: 3

### Component Layer
- Total Components: 25
- Created: 10
- Remaining: 15

### Template Layer
- Total Templates: 20
- Created: 4
- Remaining: 16

---

## Quick Commands

| Action | Command |
|--------|---------|
| Design next step | `/design step-3` |
| Implement current | `/implement step-2` |
| Check gaps | `/gap-analysis` |
| Verify step | `/verify step-2` |

---

## Health Indicators

| Metric | Value | Status |
|--------|-------|--------|
| Specs Defined | 6/10 | 🟡 |
| Components Built | 10/25 | 🟡 |
| Templates Created | 4/20 | 🔴 |
| Tests Written | 0/20 | 🔴 |
| Documentation | 80% | 🟢 |

**Legend**: 🟢 Good | 🟡 Needs Attention | 🔴 Critical
```

## Status Calculation

### Progress Percentage

```
Layer Progress = (Completed Items / Total Items) × 100

Overall Progress = Average of all layer progress
```

### Health Indicator

```
🟢 Good: >= 70%
🟡 Needs Attention: 40-69%
🔴 Critical: < 40%
```

## Data Sources

| Data | Source File |
|------|-------------|
| Feature Status | design-spec-layer/STATUS.md |
| Component Count | core-layer/COMPONENTS.md |
| Template Count | template-layer/LAYER_STATUS.md |
| Current Work | CURRENT_WORK.md |

## Examples

### Basic Status

```
/projectstatus
```

Shows full dashboard.

### Quick Status (alias)

```
/ps
```

Same as `/projectstatus`.

## Model Recommendation

**Any** - Status display doesn't require complex reasoning

## Related Commands

- `/gap-analysis` - Detailed gap analysis
- `/verify all` - Full verification
- `/design [step]` - Work on next step
