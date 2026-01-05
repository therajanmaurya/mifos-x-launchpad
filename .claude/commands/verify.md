# Verify Command

Validate implementation against design specifications.

**Step**: $ARGUMENTS

## Instructions

### If "all" or no argument:
Verify all implemented steps.

### If step name provided:

1. **Load Specifications**
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/SPEC.md`
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/API.md`
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/STATUS.md`

2. **Check Implementation Files**
   - Check `src/components/wizard/steps/step-[n]-[name].tsx` exists
   - Check `src/store/wizard-store.ts` has step slice
   - Check `src/types/wizard.ts` has types

3. **Verify Requirements**

For each requirement in SPEC.md:
- Check if implemented in component
- Check if state managed properly
- Check if validation exists

4. **Verify UI Components**

For each component in MOCKUP.md:
- Check if component exists
- Check if styled correctly
- Check if interactive

5. **Verify Types**

For each interface in API.md:
- Check if type exists in wizard.ts
- Check if store uses correct types
- Check if component uses correct types

6. **Generate Report**

```markdown
# Verification Report: [Step Name]

## Summary
- Total Requirements: X
- Implemented: Y
- Missing: Z
- Partial: W

## Requirements Check

| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-1 | Description | Done/Missing/Partial | |

## Component Check

| Component | Status | Notes |
|-----------|--------|-------|
| Step Component | ? | |
| Store Slice | ? | |
| Types | ? | |

## UI Check

| Element | Status | Notes |
|---------|--------|-------|
| Header | ? | |
| Form | ? | |
| Validation | ? | |

## Actions Needed

1. [ ] Action 1
2. [ ] Action 2
```

## Verification Checklist

### Component Verification
- [ ] Component file exists
- [ ] Component exports correctly
- [ ] Component uses store
- [ ] Component handles state changes
- [ ] Component displays errors

### Store Verification
- [ ] Store slice exists
- [ ] Initial state defined
- [ ] Actions implemented
- [ ] Types match API.md

### Types Verification
- [ ] All interfaces from API.md exist
- [ ] Types are used consistently
- [ ] No `any` types

### Validation Verification
- [ ] Zod schema exists
- [ ] All required fields validated
- [ ] Error messages defined

### UI Verification
- [ ] Layout matches MOCKUP.md
- [ ] All components present
- [ ] Responsive design works

## Status Indicators
- Done: Fully implemented and working
- Missing: Not implemented
- Partial: Partially implemented

## Model Recommendation
Use **Sonnet** for verification tasks.
