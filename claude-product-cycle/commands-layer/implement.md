# /implement Command

> Implement wizard steps and features

## Purpose

The `/implement` command creates the React components, state management, and related code for wizard steps based on their design specifications.

## Usage

```
/implement [step-name]
/implement step-1-app-selection
/implement step-3-branding-theme
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| step-name | string | Yes | The wizard step to implement |

## Prerequisites

Before running `/implement`:
1. Design spec must exist (`SPEC.md`, `MOCKUP.md`, `API.md`)
2. Run `/design [step]` first if specs don't exist

## Workflow

### Step 1: Read Design Specifications

```
1. Read design-spec-layer/features/[step-name]/SPEC.md
2. Read design-spec-layer/features/[step-name]/MOCKUP.md
3. Read design-spec-layer/features/[step-name]/API.md
4. Read feature-layer/instructions/REACT_COMPONENT.md
5. Read feature-layer/instructions/ZUSTAND_STORE.md
```

### Step 2: Create/Update Types

Add types to `src/types/wizard.ts`:

```typescript
// Step [N] types
export interface Step[N]State {
  // From API.md
}

export interface Step[N]Actions {
  // From API.md
}
```

### Step 3: Create/Update Store Slice

Add to `src/store/wizard-store.ts`:

```typescript
// Step [N] slice
step[N]: Step[N]State;

// Step [N] actions
setStep[N]Field: (field: keyof Step[N]State, value: any) => void;
resetStep[N]: () => void;
```

### Step 4: Create Step Component

Create `src/components/wizard/steps/step-[n]-[name].tsx`:

```typescript
'use client';

import { useWizardStore } from '@/store/wizard-store';

export function Step[N][Name]() {
  const { step[N], setStep[N]Field } = useWizardStore();

  return (
    <div className="space-y-6">
      {/* Implementation based on MOCKUP.md */}
    </div>
  );
}
```

### Step 5: Implement Validation

Add validation to the component:

```typescript
import { z } from 'zod';

const step[N]Schema = z.object({
  // Validation rules from SPEC.md
});

function validateStep[N](data: Step[N]State) {
  return step[N]Schema.safeParse(data);
}
```

### Step 6: Update Status

Update `design-spec-layer/features/[step-name]/STATUS.md`:

```markdown
| React Component | ✅ Done | step-[n]-[name].tsx |
| Store Slice | ✅ Done | wizard-store.ts |
| Validation | ✅ Done | Zod schema |
```

## Output

The command produces:
- `src/components/wizard/steps/step-[n]-[name].tsx` - React component
- Updates to `src/store/wizard-store.ts` - State slice
- Updates to `src/types/wizard.ts` - TypeScript types
- Updates to `STATUS.md` - Implementation status

## Implementation Patterns

### Component Structure

```typescript
'use client';

import { useState } from 'react';
import { useWizardStore } from '@/store/wizard-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Step[N][Name]() {
  const { step[N], setStep[N]Field } = useWizardStore();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: any) => {
    setStep[N]Field(field, value);
    // Clear error on change
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step [N]: [Name]</h2>
        <p className="text-muted-foreground">Description from SPEC.md</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form fields */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### State Management

```typescript
// In wizard-store.ts
interface WizardState {
  step[N]: Step[N]State;
}

interface WizardActions {
  setStep[N]Field: <K extends keyof Step[N]State>(
    field: K,
    value: Step[N]State[K]
  ) => void;
  resetStep[N]: () => void;
}

const initialStep[N]: Step[N]State = {
  // Default values
};
```

## Examples

### Implement Step 1

```
/implement step-1-app-selection
```

Creates:
- `step-1-app-selection.tsx` with app card grid
- Store slice for selected app state
- Types for app selection

### Implement Step 3

```
/implement step-3-branding-theme
```

Creates:
- `step-3-branding-theme.tsx` with color pickers
- Store slice for color/theme state
- Types for branding configuration

## Model Recommendation

**Sonnet** - For efficient, pattern-following implementation

## Related Commands

- `/design [step]` - Must run first
- `/component [name]` - Create individual components
- `/verify [step]` - Validate after implementation
