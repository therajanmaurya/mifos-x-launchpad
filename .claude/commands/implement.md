# Implement Command

Implement wizard steps based on design specifications.

**Step**: $ARGUMENTS

## Instructions

### If no step name provided:
Show available steps and their implementation status.

### If step name provided:

1. **Check Prerequisites**
   - Verify design spec exists at `claude-product-cycle/design-spec-layer/features/[step-name]/`
   - If not, suggest running `/design [step]` first

2. **Read Design Specifications**
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/SPEC.md`
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/MOCKUP.md`
   - Read `claude-product-cycle/design-spec-layer/features/[step-name]/API.md`
   - Read `claude-product-cycle/design-spec-layer/_shared/PATTERNS.md`

3. **Create/Update Types**

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

4. **Create/Update Store Slice**

Update `src/store/wizard-store.ts`:

```typescript
// Step [N] slice
step[N]: Step[N]State;

// Step [N] actions
setStep[N]Field: (field: keyof Step[N]State, value: any) => void;
resetStep[N]: () => void;
```

5. **Create Step Component**

Create `src/components/wizard/steps/step-[n]-[name].tsx`:

```typescript
'use client';

import { useWizardStore } from '@/store/wizard-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Step[N][Name]() {
  const { step[N], setStep[N]Field } = useWizardStore();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step [N]: [Name]</h2>
        <p className="text-muted-foreground">Description</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Implementation based on MOCKUP.md */}
        </CardContent>
      </Card>
    </div>
  );
}
```

6. **Implement Validation**

Add Zod schema based on SPEC.md validation rules:

```typescript
import { z } from 'zod';

const step[N]Schema = z.object({
  // Validation rules from SPEC.md
});
```

7. **Update Status Files**
   - Update `claude-product-cycle/design-spec-layer/features/[step-name]/STATUS.md`
   - Update `claude-product-cycle/design-spec-layer/STATUS.md`

8. **Build and Verify**
   - Run `npm run type-check` to verify types
   - Run `npm run lint` to check for issues

## Output

After implementation, show:

```
IMPLEMENTATION COMPLETE: [Step Name]

Created/Updated Files:
- src/components/wizard/steps/step-[n]-[name].tsx
- src/store/wizard-store.ts (slice added)
- src/types/wizard.ts (types added)

Next Steps:
- Run: /verify [step-name]
- Test the implementation in browser
```

## Model Recommendation
Use **Sonnet** for efficient implementation.
