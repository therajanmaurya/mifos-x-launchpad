# Design System Components

> Component registry for MifosForge UI

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│  UI Primitives: src/components/ui/                          │
│  → shadcn/ui base components (Button, Card, Input)         │
├─────────────────────────────────────────────────────────────┤
│  Wizard Components: src/components/wizard/                  │
│  → Wizard-specific (StepIndicator, StepNavigation)         │
├─────────────────────────────────────────────────────────────┤
│  Preview Components: src/components/preview/                │
│  → Preview panels (DeviceMockup, ThemePreview)             │
├─────────────────────────────────────────────────────────────┤
│  Shared Components: src/components/shared/                  │
│  → Utilities (ColorPicker, FileUpload)                     │
└─────────────────────────────────────────────────────────────┘
```

---

## UI Primitives (shadcn/ui)

| Component | File | Description |
|-----------|------|-------------|
| Button | ui/button.tsx | Primary action button |
| Card | ui/card.tsx | Content container |
| Input | ui/input.tsx | Text input field |
| Label | ui/label.tsx | Form label |
| Select | ui/select.tsx | Dropdown selector |
| Checkbox | ui/checkbox.tsx | Boolean toggle |
| Switch | ui/switch.tsx | Toggle switch |
| Slider | ui/slider.tsx | Range slider |
| Tabs | ui/tabs.tsx | Tab navigation |
| Progress | ui/progress.tsx | Progress bar |
| Dialog | ui/dialog.tsx | Modal dialog |
| Popover | ui/popover.tsx | Popup content |
| Tooltip | ui/tooltip.tsx | Hover tooltip |
| Accordion | ui/accordion.tsx | Expandable sections |
| Separator | ui/separator.tsx | Visual divider |
| Toast | ui/toast.tsx | Notifications |

---

## Wizard Components

| Component | File | Description |
|-----------|------|-------------|
| WizardLayout | wizard/wizard-layout.tsx | Main wizard container |
| StepIndicator | wizard/step-indicator.tsx | Step progress display |
| StepNavigation | wizard/step-navigation.tsx | Back/Next buttons |
| StepContainer | wizard/step-container.tsx | Step content wrapper |

### WizardLayout

```typescript
interface WizardLayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
}
```

### StepIndicator

```typescript
interface StepIndicatorProps {
  steps: StepInfo[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

interface StepInfo {
  number: number;
  title: string;
  description?: string;
  isCompleted: boolean;
}
```

### StepNavigation

```typescript
interface StepNavigationProps {
  onBack?: () => void;
  onNext?: () => void;
  backLabel?: string;
  nextLabel?: string;
  backDisabled?: boolean;
  nextDisabled?: boolean;
  isLastStep?: boolean;
}
```

---

## Preview Components

| Component | File | Description |
|-----------|------|-------------|
| DeviceMockup | preview/device-mockup.tsx | Phone/tablet frame |
| ThemePreview | preview/theme-preview.tsx | Live theme preview |
| IconPreview | preview/icon-preview.tsx | Icon size display |
| ConfigSummary | preview/config-summary.tsx | Configuration summary |

### DeviceMockup

```typescript
interface DeviceMockupProps {
  device: 'iphone' | 'android' | 'tablet';
  theme: 'light' | 'dark';
  children: React.ReactNode;
}
```

### ThemePreview

```typescript
interface ThemePreviewProps {
  colors: ColorPalette;
  appName: string;
  iconUrl?: string;
}
```

### IconPreview

```typescript
interface IconPreviewProps {
  iconUrl: string;
  backgroundColor: string;
  shape: IconShape;
  showSizes?: boolean;
}
```

---

## Shared Components

| Component | File | Description |
|-----------|------|-------------|
| ColorPicker | shared/color-picker.tsx | Color selection |
| FileUpload | shared/file-upload.tsx | Drag-drop upload |
| ConnectionTester | shared/connection-tester.tsx | API test |
| JsonImportExport | shared/json-import-export.tsx | Config I/O |

### ColorPicker

```typescript
interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showInput?: boolean;
}
```

### FileUpload

```typescript
interface FileUploadProps {
  accept: string[];
  maxSize?: number;
  onFileSelect: (file: File) => void;
  onError?: (error: string) => void;
  preview?: boolean;
}
```

### ConnectionTester

```typescript
interface ConnectionTesterProps {
  url: string;
  onResult: (result: ConnectionResult) => void;
}

interface ConnectionResult {
  success: boolean;
  latency?: number;
  error?: string;
}
```

---

## Component Decision Tree

```
Creating a new component?
│
├── Is it a UI primitive (button, input, card)?
│   └── Check shadcn/ui first → src/components/ui/
│
├── Is it wizard-specific (steps, navigation)?
│   └── src/components/wizard/
│
├── Is it for previewing/displaying results?
│   └── src/components/preview/
│
├── Is it a reusable utility (color picker, upload)?
│   └── src/components/shared/
│
└── Is it step-specific?
    └── src/components/wizard/steps/
```

---

## Naming Conventions

| Location | Pattern | Example |
|----------|---------|---------|
| ui/ | lowercase | button.tsx |
| wizard/ | kebab-case | step-indicator.tsx |
| preview/ | kebab-case | device-mockup.tsx |
| shared/ | kebab-case | color-picker.tsx |
| steps/ | step-N-name | step-1-app-selection.tsx |

---

## Creating New Components

### 1. Check Existing

Before creating, check:
- This file for existing components
- shadcn/ui documentation
- Existing components in codebase

### 2. Choose Location

Based on component type (see decision tree above).

### 3. Follow Pattern

```typescript
'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  className?: string;
  // Props
}

const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('base-classes', className)}
        {...props}
      />
    );
  }
);
Component.displayName = 'Component';

export { Component };
```

### 4. Update This File

Add new component to appropriate section.

---

## Status

| Category | Count | Status |
|----------|-------|--------|
| UI Primitives | 16 | Planned |
| Wizard | 4 | Planned |
| Preview | 4 | Planned |
| Shared | 4 | Planned |
| Steps | 10 | Planned |
| **Total** | **38** | |
