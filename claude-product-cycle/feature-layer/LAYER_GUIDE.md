# Feature Layer Guide

> Guide for implementing wizard step features

---

## Overview

The feature layer contains implementation guides for building UI features and connecting components to state.

---

## Feature Structure

Each wizard step follows this structure:

```
src/components/wizard/steps/step-N-[name].tsx
├── Component definition
├── State hooks
├── Event handlers
├── Validation logic
└── Render logic
```

---

## Implementation Pattern

```typescript
'use client';

import { useWizardStore } from '@/store/wizard-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function StepNName() {
  // 1. Get state from store
  const { stepN, updateStepN } = useWizardStore();

  // 2. Handle changes
  const handleChange = (field: string, value: any) => {
    updateStepN({ [field]: value });
  };

  // 3. Validate step
  const validate = () => {
    // Return true if valid
  };

  // 4. Render
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step N: Name</h2>
        <p className="text-muted-foreground">Description</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Form fields */}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Instructions

See the `instructions/` folder for detailed guides:

- [REACT_COMPONENT.md](./instructions/REACT_COMPONENT.md)
- [ZUSTAND_STORE.md](./instructions/ZUSTAND_STORE.md)
- [FORM_VALIDATION.md](./instructions/FORM_VALIDATION.md)
- [PREVIEW_COMPONENT.md](./instructions/PREVIEW_COMPONENT.md)
- [STEP_NAVIGATION.md](./instructions/STEP_NAVIGATION.md)
