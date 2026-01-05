# Project Status Command

Show the current status of the MifosLaunchpad project.

## Instructions

1. **Read Status Files**
   - Read `claude-product-cycle/design-spec-layer/STATUS.md`
   - Read `claude-product-cycle/component-layer/LAYER_STATUS.md`
   - Read `claude-product-cycle/CURRENT_WORK.md`
   - Read `claude-product-cycle/PRODUCT_MAP.md`

2. **Analyze Codebase**
   - Check `src/components/wizard/steps/` for implemented steps
   - Check `src/store/wizard-store.ts` for state slices
   - Check `src/types/` for type definitions

3. **Generate Dashboard**

Output a formatted dashboard showing:

```
# MifosLaunchpad - Project Status

**Last Updated**: [Current Date]
**Current Focus**: [From CURRENT_WORK.md]

---

## Layer Health

| Layer | Progress | Status |
|-------|----------|--------|
| Design Spec | X% | [Icon] |
| Component | X% | [Icon] |
| Core | X% | [Icon] |
| Feature | X% | [Icon] |
| Template | X% | [Icon] |

---

## Wizard Steps Status

| Step | Name | Spec | Component | Store | Status |
|:----:|------|:----:|:---------:|:-----:|:------:|
| 1 | App Selection | ? | ? | ? | ? |
| 2 | Project Info | ? | ? | ? | ? |
| 3 | Branding | ? | ? | ? | ? |
| 4 | App Icons | ? | ? | ? | ? |
| 5 | Server Config | ? | ? | ? | ? |
| 6 | Platform | ? | ? | ? | ? |
| 7 | Features | ? | ? | ? | ? |
| 8 | CI/CD | ? | ? | ? | ? |
| 9 | Code Quality | ? | ? | ? | ? |
| 10 | Generate | ? | ? | ? | ? |

**Legend**: Done | In Progress | Planned | Not Started

---

## Quick Commands

| Action | Command |
|--------|---------|
| Design next step | `/design [step]` |
| Implement step | `/implement [step]` |
| Check gaps | `/gap-analysis` |
| Verify step | `/verify [step]` |
```

4. **Status Calculation**
   - Done: Both SPEC and implementation exist
   - In Progress: Partial implementation
   - Planned: SPEC exists, no implementation
   - Not Started: Nothing exists
