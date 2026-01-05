# /verify Command

> Validate implementation against specifications

## Purpose

The `/verify` command checks that a wizard step implementation matches its design specification. It identifies gaps, missing features, and inconsistencies.

## Usage

```
/verify [step-name]
/verify step-1-app-selection
/verify all
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| step-name | string | Yes | Step to verify, or "all" for full check |

## Workflow

### Step 1: Load Specifications

```
1. Read design-spec-layer/features/[step-name]/SPEC.md
2. Read design-spec-layer/features/[step-name]/API.md
3. Read design-spec-layer/features/[step-name]/STATUS.md
```

### Step 2: Check Implementation Files

```
1. Check src/components/wizard/steps/step-[n]-[name].tsx exists
2. Check src/store/wizard-store.ts has step slice
3. Check src/types/wizard.ts has types
```

### Step 3: Verify Requirements

For each requirement in SPEC.md:
- Check if implemented in component
- Check if state managed properly
- Check if validation exists

### Step 4: Verify UI Components

For each component in MOCKUP.md:
- Check if component exists
- Check if styled correctly
- Check if interactive

### Step 5: Verify Types

For each interface in API.md:
- Check if type exists in wizard.ts
- Check if store uses correct types
- Check if component uses correct types

### Step 6: Generate Report

Output gap report showing:
- ✅ Implemented items
- ❌ Missing items
- ⚠️ Partial implementations

## Output

### Gap Report Format

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
| FR-1 | Description | ✅ Done | |
| FR-2 | Description | ❌ Missing | Not found in component |
| FR-3 | Description | ⚠️ Partial | Missing validation |

## Component Check

| Component | Status | Notes |
|-----------|--------|-------|
| Step Component | ✅ Exists | |
| Store Slice | ✅ Exists | |
| Types | ⚠️ Partial | Missing X interface |

## UI Check

| Element | Status | Notes |
|---------|--------|-------|
| Header | ✅ | |
| Form | ✅ | |
| Validation | ❌ | No error display |

## Actions Needed

1. [ ] Add missing validation
2. [ ] Complete X interface
3. [ ] Add error handling
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
- [ ] Validation triggered correctly

### UI Verification

- [ ] Layout matches MOCKUP.md
- [ ] All components present
- [ ] Responsive design works
- [ ] Accessibility attributes

## Examples

### Verify Single Step

```
/verify step-1-app-selection
```

Outputs report for step 1 only.

### Verify All Steps

```
/verify all
```

Outputs comprehensive report for all steps.

## Report Templates

### Passed Verification

```markdown
# ✅ Verification Passed: Step 1 - App Selection

All requirements implemented correctly.

## Summary
- Requirements: 10/10 ✅
- Components: 3/3 ✅
- Types: 5/5 ✅
- Validation: 2/2 ✅
```

### Failed Verification

```markdown
# ❌ Verification Failed: Step 3 - Branding & Theme

Missing implementations found.

## Summary
- Requirements: 8/12 (4 missing)
- Components: 2/3 (1 missing)
- Types: 4/6 (2 missing)
- Validation: 1/3 (2 missing)

## Critical Issues
1. Dark mode colors not implemented
2. Color picker component missing
3. Theme preview not connected to store

## Actions Required
1. Implement dark mode state
2. Create color-picker component
3. Connect preview to live state
```

## Model Recommendation

**Sonnet** - For thorough verification

## Related Commands

- `/design [step]` - Create specs to verify against
- `/implement [step]` - Fix issues found
- `/gap-analysis` - Higher-level gap analysis
