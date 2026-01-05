# Component Command

Create React components for the MifosLaunchpad wizard.

**Component Name**: $ARGUMENTS

## Instructions

### If no component name provided:
Ask what component to create and suggest common patterns.

### If component name provided:

1. **Check Existing Components**
   - Read `claude-product-cycle/core-layer/COMPONENTS.md`
   - Check if component already exists in `src/components/`
   - If exists, suggest modifications instead

2. **Determine Component Category**

| Category | Directory | Use Case |
|----------|-----------|----------|
| ui | `src/components/ui/` | shadcn/ui style primitives |
| wizard | `src/components/wizard/` | Wizard-specific components |
| preview | `src/components/preview/` | Preview/mockup components |
| shared | `src/components/shared/` | Reusable utilities |

3. **Create Component File**

For UI components (shadcn style):

```typescript
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const [componentName]Variants = cva(
  'base-styles',
  {
    variants: {
      variant: {
        default: 'default-styles',
        secondary: 'secondary-styles',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3',
        lg: 'h-12 px-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface [ComponentName]Props
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof [componentName]Variants> {}

const [ComponentName] = React.forwardRef<HTMLDivElement, [ComponentName]Props>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn([componentName]Variants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
[ComponentName].displayName = '[ComponentName]';

export { [ComponentName], [componentName]Variants };
```

For shared/utility components:

```typescript
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface [ComponentName]Props {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function [ComponentName]({
  value,
  onChange,
  className,
}: [ComponentName]Props) {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  return (
    <div className={cn('base-styles', className)}>
      {/* Component implementation */}
    </div>
  );
}
```

4. **Update Component Registry**

Update `claude-product-cycle/core-layer/COMPONENTS.md`:

```markdown
| [ComponentName] | [category] | [description] | [status] |
```

## Examples

- `/component color-picker` - Creates color picker with hex input
- `/component device-mockup` - Creates phone frame preview
- `/component file-upload` - Creates drag-and-drop file upload
- `/component app-card` - Creates app selection card

## Model Recommendation
Use **Sonnet** for efficient component creation.
