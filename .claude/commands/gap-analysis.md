# Gap Analysis Command

Analyze implementation gaps across all layers.

**Layer (optional)**: $ARGUMENTS

## Instructions

### If no layer specified:
Generate full dashboard for all layers.

### If layer specified (design, component, feature, template):
Focus on that specific layer.

## Workflow

1. **Read Status Files**
   - Read `claude-product-cycle/design-spec-layer/STATUS.md`
   - Read `claude-product-cycle/component-layer/LAYER_STATUS.md`
   - Read `claude-product-cycle/core-layer/COMPONENTS.md`
   - Read individual feature STATUS.md files

2. **Analyze Design Layer**
   - Check each step's SPEC.md, MOCKUP.md, API.md exists
   - Rate completeness for each

3. **Analyze Component Layer**
   - Check `src/components/wizard/steps/` for step components
   - Check `src/components/shared/` for shared components
   - Check `src/components/preview/` for preview components

4. **Analyze Feature Layer**
   - Check `src/store/wizard-store.ts` for state slices
   - Check `src/types/wizard.ts` for type definitions
   - Check validation schemas

5. **Analyze Template Layer**
   - Check `src/lib/generators/` for generator functions
   - Count implemented vs planned templates

6. **Generate Gap Analysis Dashboard**

```markdown
# MifosLaunchpad - Gap Analysis

**Generated**: [Date]

---

## Overall Status

| Layer | Complete | In Progress | Missing | Score |
|-------|:--------:|:-----------:|:-------:|:-----:|
| Design | X | Y | Z | XX% |
| Component | X | Y | Z | XX% |
| Feature | X | Y | Z | XX% |
| Template | X | Y | Z | XX% |

---

## Design Layer Gaps

| Step | SPEC | MOCKUP | API | STATUS | Score |
|------|:----:|:------:|:---:|:------:|:-----:|
| step-1-app-selection | ? | ? | ? | ? | ?% |
| step-2-project-info | ? | ? | ? | ? | ?% |
| ... | | | | | |

### Missing Specs
- [List of missing specifications]

---

## Component Layer Gaps

| Component | Status | Location | Notes |
|-----------|:------:|----------|-------|
| [Component] | ? | path | |

### Missing Components
- [List of missing components]

---

## Feature Layer Gaps

| Step | Store Slice | Types | Validation | Component | Score |
|------|:-----------:|:-----:|:----------:|:---------:|:-----:|
| step-1 | ? | ? | ? | ? | ?% |

### Missing Features
- [List of missing features]

---

## Template Layer Gaps

| Template | Status | Generator | Notes |
|----------|:------:|-----------|-------|
| [Template] | ? | path | |

### Missing Templates
- [List of missing templates]

---

## Priority Actions

### P0 - Critical
1. [Action 1]
2. [Action 2]

### P1 - High
1. [Action 1]
2. [Action 2]

### P2 - Medium
1. [Action 1]
2. [Action 2]

---

## Quick Commands

| Gap | Fix Command |
|-----|-------------|
| Missing spec | `/design [step]` |
| Missing component | `/component [name]` |
| Missing implementation | `/implement [step]` |
| Verify after fix | `/verify [step]` |
```

## Status Legend
- Done: Fully complete
- Partial: Started but incomplete
- Missing: Not started
- N/A: Not applicable

## Score Calculation
```
Score = (Complete Items / Total Items) * 100
```

## Model Recommendation
Use **Sonnet** for analysis tasks.
