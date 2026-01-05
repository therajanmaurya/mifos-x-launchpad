# Gap Planning Command

Generate improvement plans based on gap analysis.

**Step or Scope**: $ARGUMENTS

## Instructions

### If "all" or no argument:
Generate comprehensive plan for all gaps.

### If step name provided:
Generate detailed plan for that step.

## Workflow

1. **Run Gap Analysis**
   - Internally run gap analysis to identify all gaps
   - Read current STATUS files

2. **Prioritize Gaps**
   - P0: Critical - Blocks other work
   - P1: High - Important features
   - P2: Medium - Polish and improvements

3. **Generate Implementation Plan**

```markdown
# MifosLaunchpad - Implementation Plan

**Generated**: [Date]
**Scope**: [All / Step Name]

---

## Priority Summary

| Priority | Tasks | Description |
|----------|:-----:|-------------|
| P0 - Critical | X | Blocking issues |
| P1 - High | Y | Important features |
| P2 - Medium | Z | Polish items |

---

## P0 - Critical Tasks

### Task 1: [Task Name]
**Gap**: [What's missing]
**Impact**: [Why it matters]
**Files**:
- `path/to/file.ts`

**Steps**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Command**: `/[command] [args]`

---

### Task 2: [Task Name]
...

---

## P1 - High Priority Tasks

### Task 1: [Task Name]
...

---

## P2 - Medium Priority Tasks

### Task 1: [Task Name]
...

---

## Recommended Order

```
1. [First task - why first]
   Command: /[command]

2. [Second task - why second]
   Command: /[command]

3. [Third task - why third]
   Command: /[command]
```

---

## Quick Wins (< 30 min each)

| Task | Command | Impact |
|------|---------|--------|
| [Task] | `/[cmd]` | [Impact] |

---

## Dependencies

```
[Step 1] ──depends on──> [Prerequisite]
[Step 2] ──depends on──> [Step 1]
```

---

## Start Here

**Recommended First Action**:
```
/[command] [args]
```

**Reason**: [Why this should be first]
```

## Plan Templates

### For Missing Design Spec
```markdown
### Design: [Step Name]

**Gap**: Missing SPEC.md and related files
**Priority**: P0

**Steps**:
1. Run `/design [step-name]`
2. Review generated specs
3. Update if needed

**Files Created**:
- `design-spec-layer/features/[step]/SPEC.md`
- `design-spec-layer/features/[step]/MOCKUP.md`
- `design-spec-layer/features/[step]/API.md`
- `design-spec-layer/features/[step]/STATUS.md`
```

### For Missing Component
```markdown
### Component: [Component Name]

**Gap**: Missing shared component
**Priority**: P1

**Steps**:
1. Run `/component [name]`
2. Implement component logic
3. Add to component registry

**Files Created**:
- `src/components/[category]/[name].tsx`
```

### For Missing Implementation
```markdown
### Implement: [Step Name]

**Gap**: Design exists but no implementation
**Priority**: P1

**Prerequisites**:
- [x] SPEC.md exists
- [x] MOCKUP.md exists
- [x] API.md exists

**Steps**:
1. Run `/implement [step-name]`
2. Test in browser
3. Run `/verify [step-name]`

**Files Created**:
- `src/components/wizard/steps/step-[n]-[name].tsx`
- Updates to `src/store/wizard-store.ts`
- Updates to `src/types/wizard.ts`
```

## Model Recommendation
Use **Sonnet** for planning tasks.
