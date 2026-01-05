# /component Command

> Create React components

## Purpose

The `/component` command creates individual React components that can be used across wizard steps. It follows established patterns and integrates with the design system.

## Usage

```
/component [component-name]
/component color-picker
/component device-mockup
```

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| component-name | string | Yes | Name of the component to create |

## Component Categories

| Category | Directory | Example |
|----------|-----------|---------|
| UI | `src/components/ui/` | button, card, input |
| Wizard | `src/components/wizard/` | step-indicator |
| Preview | `src/components/preview/` | device-mockup |
| Shared | `src/components/shared/` | color-picker |

## Workflow

### Step 1: Check Existing Components

```
1. Read core-layer/COMPONENTS.md
2. Check if component already exists
3. If exists, suggest modifications instead
```

### Step 2: Determine Component Type

Based on usage:
- **ui/** - shadcn/ui style primitives
- **wizard/** - Wizard-specific components
- **preview/** - Preview/mockup components
- **shared/** - Reusable utilities

### Step 3: Create Component File

Create the component file:

```typescript
'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface [ComponentName]Props {
  className?: string;
  // Additional props
}

const [ComponentName] = forwardRef<HTMLDivElement, [ComponentName]Props>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-classes', className)}
        {...props}
      >
        {/* Component content */}
      </div>
    );
  }
);
[ComponentName].displayName = '[ComponentName]';

export { [ComponentName] };
```

### Step 4: Update Component Registry

Update `core-layer/COMPONENTS.md`:

```markdown
| [ComponentName] | [category] | [description] |
```

## Output

The command produces:
- Component file in appropriate directory
- Export from index file (if exists)
- Update to COMPONENTS.md

## Component Templates

### UI Component (shadcn style)

```typescript
'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const componentVariants = cva(
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

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component, componentVariants };
```

### Preview Component

```typescript
'use client';

import { cn } from '@/lib/utils';

interface PreviewComponentProps {
  className?: string;
  // Preview-specific props
}

export function PreviewComponent({ className, ...props }: PreviewComponentProps) {
  return (
    <div className={cn('preview-base-styles', className)} {...props}>
      {/* Preview content */}
    </div>
  );
}
```

### Shared Utility Component

```typescript
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface SharedComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function SharedComponent({
  value,
  onChange,
  className,
}: SharedComponentProps) {
  const [internalValue, setInternalValue] = useState(value || '');

  const handleChange = useCallback((newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  return (
    <div className={cn('shared-base-styles', className)}>
      {/* Component implementation */}
    </div>
  );
}
```

## Examples

### Create Color Picker

```
/component color-picker
```

Creates `src/components/shared/color-picker.tsx`:
- Color picker with hex input
- Preset color swatches
- Color preview

### Create Device Mockup

```
/component device-mockup
```

Creates `src/components/preview/device-mockup.tsx`:
- Phone frame with screen
- Customizable screen content
- Light/dark device options

### Create File Upload

```
/component file-upload
```

Creates `src/components/shared/file-upload.tsx`:
- Drag and drop zone
- File type validation
- Preview capability

## Model Recommendation

**Sonnet** - For efficient component creation

## Related Commands

- `/implement [step]` - Uses components in steps
- `/verify [step]` - Checks component usage
