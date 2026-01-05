# Component Layer Guide

> Guide for creating and organizing React components

---

## Overview

The component layer contains reusable React components for the MifosLaunchpad wizard. Components are organized by function:

```
components/
├── wizard/      # Wizard-specific components
├── forms/       # Form input components
├── preview/     # Preview and display components
└── shared/      # Shared utility components
```

---

## Component Categories

### Wizard Components (`wizard/`)

Components for wizard navigation and layout:

| Component | Purpose |
|-----------|---------|
| WizardLayout | Main wizard wrapper |
| StepIndicator | Progress indicator |
| StepNavigation | Next/Previous buttons |
| StepContent | Step content wrapper |

### Form Components (`forms/`)

Reusable form inputs:

| Component | Purpose |
|-----------|---------|
| FormField | Input with label, error |
| ColorPicker | Color selection |
| FileUpload | File drag-drop |
| SelectField | Dropdown select |

### Preview Components (`preview/`)

Live preview displays:

| Component | Purpose |
|-----------|---------|
| DevicePreview | Phone mockup |
| ThemePreview | Theme colors preview |
| IconPreview | Icon sizes grid |
| ConfigSummary | Configuration review |

### Shared Components (`shared/`)

Utility components:

| Component | Purpose |
|-----------|---------|
| LoadingSpinner | Loading indicator |
| ErrorBoundary | Error handling |
| Modal | Dialog wrapper |

---

## Component Pattern

```typescript
'use client';

import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props
}

export function ComponentName({ ...props }: ComponentProps) {
  return (
    <div className={cn('base-classes', props.className)}>
      {/* Content */}
    </div>
  );
}
```

---

## Best Practices

1. Use TypeScript for all components
2. Accept className prop for customization
3. Use shadcn/ui as base components
4. Keep components small and focused
5. Export from index.ts

---

## Related Files

- [LAYER_STATUS.md](./LAYER_STATUS.md)
- [PATTERNS.md](../design-spec-layer/_shared/PATTERNS.md)
