# Implementation Patterns

> Code patterns and best practices for MifosLaunchpad

## React Component Patterns

### Step Component Pattern

```typescript
'use client';

import { useWizardStore } from '@/store/wizard-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export function StepNName() {
  // Get state and actions from store
  const { stepN, updateStepN } = useWizardStore();

  // Handle field changes
  const handleChange = (field: string, value: any) => {
    updateStepN({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <h2 className="text-2xl font-bold">Step N: Name</h2>
        <p className="text-muted-foreground">Step description</p>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
          <CardDescription>Section description</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Form fields */}
        </CardContent>
      </Card>
    </div>
  );
}
```

### Form Field Pattern

```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
}

function FormField({ label, value, onChange, error, placeholder, required }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? 'border-destructive' : ''}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
```

---

## Zustand Store Pattern

### Store Structure

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardStore extends WizardState, WizardActions {}

const initialState: WizardState = {
  currentStep: 1,
  step1: { /* initial values */ },
  step2: { /* initial values */ },
  // ...
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Navigation
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 10) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      // Step updates
      updateStep1: (data) => set((state) => ({
        step1: { ...state.step1, ...data }
      })),

      // Reset
      resetWizard: () => set(initialState),
    }),
    {
      name: 'mifoslaunchpad-wizard',
      partialize: (state) => ({
        // Only persist these fields
        step1: state.step1,
        step2: state.step2,
        // ...
      }),
    }
  )
);
```

### Selector Pattern

```typescript
// Create focused selectors for performance
const useStep1 = () => useWizardStore((state) => state.step1);
const useCurrentStep = () => useWizardStore((state) => state.currentStep);

// Use in components
function MyComponent() {
  const step1 = useStep1(); // Only re-renders when step1 changes
}
```

---

## Validation Pattern

### Zod Schema

```typescript
import { z } from 'zod';

const step2Schema = z.object({
  organizationName: z.string().min(1, 'Organization name is required'),
  projectName: z.string().min(1, 'Project name is required'),
  packageName: z.string()
    .min(1, 'Package name is required')
    .regex(
      /^[a-z][a-z0-9_]*(\.[a-z0-9_]+)+$/,
      'Package name must be valid (e.g., com.example.app)'
    ),
  versionName: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z'),
  versionCode: z.number().int().positive(),
});

type Step2Data = z.infer<typeof step2Schema>;
```

### Validation Hook

```typescript
import { useState, useCallback } from 'react';
import { ZodSchema } from 'zod';

function useValidation<T>(schema: ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback((data: unknown) => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  }, [schema]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return { errors, validate, clearError };
}
```

---

## Generator Pattern

### File Generator

```typescript
interface GeneratorConfig {
  packageName: string;
  appName: string;
  // ...
}

function generateFile(template: string, config: GeneratorConfig): string {
  let result = template;

  Object.entries(config).forEach(([key, value]) => {
    const placeholder = `{{${key.toUpperCase()}}}`;
    result = result.replaceAll(placeholder, String(value));
  });

  return result;
}
```

### Multi-File Generator

```typescript
interface GeneratedFiles {
  [path: string]: string;
}

function generateProject(config: GeneratorConfig): GeneratedFiles {
  return {
    'build.gradle.kts': generateGradle(config),
    'src/main/kotlin/Theme.kt': generateTheme(config),
    'src/main/res/values/strings.xml': generateStrings(config),
    // ...
  };
}
```

### ZIP Generator

```typescript
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

async function generateZip(files: GeneratedFiles, projectName: string) {
  const zip = new JSZip();

  // Add each file to ZIP
  Object.entries(files).forEach(([path, content]) => {
    zip.file(path, content);
  });

  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  saveAs(blob, `${projectName}.zip`);
}
```

---

## Preview Pattern

### Split View Layout

```typescript
function WizardWithPreview() {
  return (
    <div className="flex gap-6">
      {/* Config Panel - Left */}
      <div className="flex-1 min-w-0">
        <StepContent />
      </div>

      {/* Preview Panel - Right */}
      <div className="w-[400px] shrink-0">
        <PreviewPanel />
      </div>
    </div>
  );
}
```

### Live Preview

```typescript
function ThemePreview() {
  const { colors, appName } = useWizardStore((state) => state.step3);

  // Preview updates automatically when store changes
  return (
    <div
      style={{ backgroundColor: colors.background }}
      className="rounded-lg overflow-hidden"
    >
      <header style={{ backgroundColor: colors.primary }}>
        <span style={{ color: colors.onPrimary }}>{appName}</span>
      </header>
      {/* Preview content */}
    </div>
  );
}
```

---

## Error Handling Pattern

### Form Errors

```typescript
function FormWithErrors() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const result = schema.safeParse(formData);

    if (!result.success) {
      // Show errors
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        newErrors[err.path[0] as string] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    // Proceed with valid data
  };

  return (
    <form>
      <Input error={errors.fieldName} />
    </form>
  );
}
```

### Async Error Handling

```typescript
function useAsyncAction<T>(action: () => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await action();
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
}
```

---

## Best Practices

1. **Component Composition**: Build complex UIs from small, reusable components
2. **State Colocation**: Keep state close to where it's used
3. **Memoization**: Use `useMemo` and `useCallback` for expensive operations
4. **Error Boundaries**: Wrap sections with error boundaries
5. **Loading States**: Always show loading indicators for async operations
6. **Accessibility**: Include proper ARIA attributes and keyboard navigation
7. **Type Safety**: Use TypeScript strictly, avoid `any`
