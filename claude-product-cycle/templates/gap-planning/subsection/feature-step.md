# Feature Step Planning

> Planning template for wizard step feature implementation

---

## Step Overview

| Attribute | Value |
|-----------|-------|
| Step Number | {{STEP_NUMBER}} |
| Step Name | {{STEP_NAME}} |
| Priority | {{PRIORITY}} |
| Complexity | {{COMPLEXITY}} |
| Estimated Effort | {{EFFORT}} |

---

## Implementation Checklist

### UI Component

| Task | Effort | Status | Dependencies |
|------|--------|--------|--------------|
| Create component file | 1h | {{STATUS}} | - |
| Implement layout | 2h | {{STATUS}} | Design spec |
| Add form fields | 3h | {{STATUS}} | shadcn/ui |
| Add preview panel | 2h | {{STATUS}} | Preview components |
| Error states | 1h | {{STATUS}} | - |
| Loading states | 1h | {{STATUS}} | - |
| Help tooltips | 1h | {{STATUS}} | - |
| Responsive design | 2h | {{STATUS}} | - |

### State Management

| Task | Effort | Status | Dependencies |
|------|--------|--------|--------------|
| Define state interface | 1h | {{STATUS}} | - |
| Create Zustand slice | 1h | {{STATUS}} | - |
| Implement update actions | 1h | {{STATUS}} | - |
| Add reset action | 0.5h | {{STATUS}} | - |
| Create selectors | 0.5h | {{STATUS}} | - |
| Add persistence | 0.5h | {{STATUS}} | - |

### Validation

| Task | Effort | Status | Dependencies |
|------|--------|--------|--------------|
| Define Zod schema | 1h | {{STATUS}} | - |
| Custom validators | 2h | {{STATUS}} | - |
| Error messages | 1h | {{STATUS}} | - |
| Form integration | 1h | {{STATUS}} | react-hook-form |

### Navigation

| Task | Effort | Status | Dependencies |
|------|--------|--------|--------------|
| Can proceed logic | 1h | {{STATUS}} | Validation |
| Auto-save on leave | 0.5h | {{STATUS}} | Store |
| Skip conditions | 0.5h | {{STATUS}} | - |

### Testing

| Task | Effort | Status | Dependencies |
|------|--------|--------|--------------|
| Unit tests | 3h | {{STATUS}} | Vitest |
| Integration tests | 2h | {{STATUS}} | Playwright |
| Accessibility tests | 1h | {{STATUS}} | axe-core |

---

## State Interface

```typescript
interface Step{{STEP_NUMBER}}State {
  // Define fields
  {{FIELD_1}}: {{TYPE_1}};
  {{FIELD_2}}: {{TYPE_2}};
  {{FIELD_3}}: {{TYPE_3}};
}

interface Step{{STEP_NUMBER}}Actions {
  updateStep{{STEP_NUMBER}}: (data: Partial<Step{{STEP_NUMBER}}State>) => void;
  resetStep{{STEP_NUMBER}}: () => void;
}
```

---

## Validation Schema

```typescript
export const step{{STEP_NUMBER}}Schema = z.object({
  {{FIELD_1}}: z.{{VALIDATOR_1}}({
    {{VALIDATOR_OPTIONS}}
  }),
  {{FIELD_2}}: z.{{VALIDATOR_2}}({
    {{VALIDATOR_OPTIONS}}
  }),
  {{FIELD_3}}: z.{{VALIDATOR_3}}({
    {{VALIDATOR_OPTIONS}}
  }),
});

// Custom validators
{{CUSTOM_VALIDATORS}}
```

---

## Component Structure

```typescript
// src/components/wizard/steps/step-{{STEP_NUMBER}}-{{STEP_SLUG}}.tsx

'use client';

import { useWizardStore } from '@/store/wizard-store';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step{{STEP_NUMBER}}Schema } from '@/lib/validation';

export function Step{{STEP_NUMBER}}{{STEP_COMPONENT}}() {
  const { step{{STEP_NUMBER}}, updateStep{{STEP_NUMBER}} } = useWizardStore();

  const form = useForm({
    resolver: zodResolver(step{{STEP_NUMBER}}Schema),
    defaultValues: step{{STEP_NUMBER}},
  });

  // Implementation
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Form Section */}
      <div className="space-y-6">
        {{FORM_FIELDS}}
      </div>

      {/* Preview Section */}
      <div className="hidden lg:block">
        {{PREVIEW_COMPONENT}}
      </div>
    </div>
  );
}
```

---

## Form Fields Specification

| Field | Type | Component | Validation | Required |
|-------|------|-----------|------------|----------|
| {{FIELD_1}} | {{TYPE}} | {{COMPONENT}} | {{VALIDATION}} | {{REQUIRED}} |
| {{FIELD_2}} | {{TYPE}} | {{COMPONENT}} | {{VALIDATION}} | {{REQUIRED}} |
| {{FIELD_3}} | {{TYPE}} | {{COMPONENT}} | {{VALIDATION}} | {{REQUIRED}} |

---

## Preview Integration

| Preview | Component | Updates On | Debounce |
|---------|-----------|------------|----------|
| {{PREVIEW_1}} | {{COMPONENT}} | {{TRIGGER}} | {{DEBOUNCE}} |
| {{PREVIEW_2}} | {{COMPONENT}} | {{TRIGGER}} | {{DEBOUNCE}} |

---

## Dependencies

### Upstream (Reads From)

| Step | Field | Usage |
|------|-------|-------|
| {{STEP}} | {{FIELD}} | {{USAGE}} |

### Downstream (Used By)

| Step | Field | Usage |
|------|-------|-------|
| {{STEP}} | {{FIELD}} | {{USAGE}} |

---

## Edge Cases

| Scenario | Expected Behavior | Handling |
|----------|-------------------|----------|
| {{SCENARIO_1}} | {{EXPECTED}} | {{HANDLING}} |
| {{SCENARIO_2}} | {{EXPECTED}} | {{HANDLING}} |
| {{SCENARIO_3}} | {{EXPECTED}} | {{HANDLING}} |

---

## Error Handling

| Error | Message | Recovery |
|-------|---------|----------|
| {{ERROR_1}} | {{MESSAGE}} | {{RECOVERY}} |
| {{ERROR_2}} | {{MESSAGE}} | {{RECOVERY}} |

---

## Accessibility Requirements

- [ ] All form fields have labels
- [ ] Error messages are announced
- [ ] Focus management on errors
- [ ] Keyboard navigation works
- [ ] Screen reader tested

---

## Timeline

| Phase | Tasks | Duration |
|-------|-------|----------|
| Setup | Component + state | 1 day |
| UI | Form + preview | 2 days |
| Validation | Schema + errors | 1 day |
| Testing | Unit + integration | 1 day |
| Polish | A11y + responsive | 1 day |

---

*Last Updated: {{TIMESTAMP}}*
