# React Component Patterns

> Patterns for building wizard step components

---

## Basic Step Component

```typescript
'use client';

import { useWizardStore } from '@/store/wizard-store';

interface StepProps {
  onComplete?: () => void;
}

export function StepComponent({ onComplete }: StepProps) {
  const { data, updateData } = useWizardStore();

  const handleChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Step content */}
    </div>
  );
}
```

---

## With Validation

```typescript
import { useState } from 'react';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'Required'),
});

export function ValidatedStep() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  return (/* ... */);
}
```

---

## With Preview

```typescript
export function StepWithPreview() {
  return (
    <div className="flex gap-6">
      {/* Form - Left side */}
      <div className="flex-1">
        {/* Form fields */}
      </div>

      {/* Preview - Right side (desktop only) */}
      <div className="hidden lg:block w-[400px]">
        <PreviewPanel />
      </div>
    </div>
  );
}
```
