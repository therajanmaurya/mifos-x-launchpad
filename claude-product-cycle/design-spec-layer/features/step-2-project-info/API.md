# Step 2: Project Info - API Reference

> Interfaces, types, and data contracts for Project Info

---

## Type Definitions

### State Interface

```typescript
/**
 * State for Step 2: Project Information
 */
interface Step2State {
  // Organization Information
  organizationName: string;
  organizationWebsite: string;
  supportEmail: string;

  // Project Information
  projectName: string;
  displayName: string;
  description: string;

  // Package Configuration
  packageName: string;
  applicationId: string;  // Auto-generated from packageName

  // Version Information
  versionName: string;
  versionCode: number;

  // SDK Configuration
  minAndroidSdk: number;
  targetAndroidSdk: number;
  minIosVersion: string;
}

/**
 * Initial state for Step 2
 */
const step2InitialState: Step2State = {
  organizationName: '',
  organizationWebsite: '',
  supportEmail: '',

  projectName: '',
  displayName: '',
  description: '',

  packageName: '',
  applicationId: '',

  versionName: '1.0.0',
  versionCode: 1,

  minAndroidSdk: 24,
  targetAndroidSdk: 34,
  minIosVersion: '15.0',
};
```

### Actions Interface

```typescript
/**
 * Actions for Step 2
 */
interface Step2Actions {
  /**
   * Update Step 2 state with partial data
   * @param data - Partial state to merge
   */
  updateStep2: (data: Partial<Step2State>) => void;

  /**
   * Reset Step 2 to initial state
   */
  resetStep2: () => void;

  /**
   * Generate application ID from package name
   */
  generateApplicationId: () => void;

  /**
   * Validate Step 2 data
   * @returns Validation result
   */
  validateStep2: () => { valid: boolean; errors: Record<string, string> };
}
```

---

## Validation Schema

```typescript
import { z } from 'zod';

/**
 * Zod schema for Step 2 validation
 */
const step2Schema = z.object({
  // Organization (required)
  organizationName: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name must be at most 50 characters'),

  // Organization (optional)
  organizationWebsite: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  supportEmail: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),

  // Project (required)
  projectName: z.string()
    .min(2, 'Project name must be at least 2 characters')
    .max(30, 'Project name must be at most 30 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Project name must start with a letter and contain only alphanumeric characters'),

  displayName: z.string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters'),

  description: z.string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),

  // Package (required)
  packageName: z.string()
    .min(1, 'Package name is required')
    .regex(
      /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/,
      'Package name must be in reverse domain format (e.g., com.example.app)'
    ),

  applicationId: z.string().optional(),

  // Version (required)
  versionName: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z (e.g., 1.0.0)'),

  versionCode: z.number()
    .int('Version code must be an integer')
    .positive('Version code must be positive')
    .max(2147483647, 'Version code exceeds maximum value'),

  // SDK (required)
  minAndroidSdk: z.number()
    .min(21, 'Minimum SDK must be at least 21')
    .max(34, 'Minimum SDK must be at most 34'),

  targetAndroidSdk: z.number()
    .min(24, 'Target SDK must be at least 24')
    .max(34, 'Target SDK must be at most 34'),

  minIosVersion: z.string()
    .regex(/^\d+\.\d+$/, 'iOS version must be in format X.Y'),
});

type Step2FormData = z.infer<typeof step2Schema>;
```

---

## Store Slice

```typescript
import { StateCreator } from 'zustand';

/**
 * Step 2 store slice
 */
type Step2Slice = Step2State & Step2Actions;

/**
 * Create Step 2 slice for Zustand store
 */
const createStep2Slice: StateCreator<
  WizardStore,
  [],
  [],
  Step2Slice
> = (set, get) => ({
  // Initial state
  ...step2InitialState,

  // Actions
  updateStep2: (data: Partial<Step2State>) => {
    set((state) => ({
      ...state,
      ...data,
      // Auto-generate applicationId when packageName changes
      applicationId: data.packageName ?? state.packageName,
    }));
  },

  resetStep2: () => {
    set(step2InitialState);
  },

  generateApplicationId: () => {
    const { packageName } = get();
    set({ applicationId: packageName });
  },

  validateStep2: () => {
    const state = get();
    const result = step2Schema.safeParse(state);

    if (result.success) {
      return { valid: true, errors: {} };
    }

    const errors: Record<string, string> = {};
    result.error.errors.forEach((err) => {
      if (err.path[0]) {
        errors[err.path[0] as string] = err.message;
      }
    });

    return { valid: false, errors };
  },
});
```

---

## Component Props

### ProjectInfoStep Props

```typescript
interface ProjectInfoStepProps {
  /** Callback when step is complete */
  onComplete?: () => void;

  /** Callback when going back */
  onBack?: () => void;
}
```

### FormField Props

```typescript
interface FormFieldProps {
  /** Field name (for form state) */
  name: string;

  /** Label text */
  label: string;

  /** Whether field is required */
  required?: boolean;

  /** Input type */
  type?: 'text' | 'email' | 'url' | 'number' | 'textarea';

  /** Placeholder text */
  placeholder?: string;

  /** Helper text below input */
  helperText?: string;

  /** Error message */
  error?: string;

  /** Current value */
  value: string | number;

  /** Change handler */
  onChange: (value: string | number) => void;

  /** Whether field is disabled */
  disabled?: boolean;

  /** Whether field is read-only (auto-generated) */
  readOnly?: boolean;
}
```

### SdkSelect Props

```typescript
interface SdkSelectProps {
  /** Label text */
  label: string;

  /** Platform type */
  platform: 'android' | 'ios';

  /** Select type */
  type: 'min' | 'target';

  /** Current value */
  value: number | string;

  /** Change handler */
  onChange: (value: number | string) => void;

  /** Error message */
  error?: string;
}
```

---

## Constants

```typescript
/**
 * Android SDK versions with names
 */
const ANDROID_SDK_VERSIONS = [
  { value: 21, name: 'Android 5.0 (Lollipop)' },
  { value: 22, name: 'Android 5.1 (Lollipop)' },
  { value: 23, name: 'Android 6.0 (Marshmallow)' },
  { value: 24, name: 'Android 7.0 (Nougat)' },
  { value: 25, name: 'Android 7.1 (Nougat)' },
  { value: 26, name: 'Android 8.0 (Oreo)' },
  { value: 27, name: 'Android 8.1 (Oreo)' },
  { value: 28, name: 'Android 9.0 (Pie)' },
  { value: 29, name: 'Android 10' },
  { value: 30, name: 'Android 11' },
  { value: 31, name: 'Android 12' },
  { value: 32, name: 'Android 12L' },
  { value: 33, name: 'Android 13' },
  { value: 34, name: 'Android 14' },
];

/**
 * iOS versions
 */
const IOS_VERSIONS = [
  { value: '13.0', name: 'iOS 13.0' },
  { value: '14.0', name: 'iOS 14.0' },
  { value: '15.0', name: 'iOS 15.0' },
  { value: '16.0', name: 'iOS 16.0' },
  { value: '17.0', name: 'iOS 17.0' },
];

/**
 * Default SDK values
 */
const DEFAULT_SDK_CONFIG = {
  minAndroidSdk: 24,
  targetAndroidSdk: 34,
  minIosVersion: '15.0',
};
```

---

## Utility Functions

```typescript
/**
 * Generate project slug from name
 * @param name - Project name
 * @returns Slug (lowercase with hyphens)
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Validate package name format
 * @param packageName - Package name to validate
 * @returns Whether valid
 */
function isValidPackageName(packageName: string): boolean {
  const pattern = /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/;
  return pattern.test(packageName);
}

/**
 * Generate suggested package name
 * @param orgName - Organization name
 * @param projectName - Project name
 * @returns Suggested package name
 */
function generatePackageName(orgName: string, projectName: string): string {
  const cleanOrg = orgName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const cleanProject = projectName.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `com.${cleanOrg}.${cleanProject}`;
}

/**
 * Increment version code
 * @param current - Current version code
 * @returns Next version code
 */
function incrementVersionCode(current: number): number {
  return Math.min(current + 1, 2147483647);
}

/**
 * Parse version string
 * @param version - Version string (X.Y.Z)
 * @returns Version parts
 */
function parseVersion(version: string): { major: number; minor: number; patch: number } {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
}
```

---

## Hooks

```typescript
/**
 * Hook for Step 2 form management
 */
function useStep2Form() {
  const state = useWizardStore((s) => ({
    organizationName: s.organizationName,
    organizationWebsite: s.organizationWebsite,
    supportEmail: s.supportEmail,
    projectName: s.projectName,
    displayName: s.displayName,
    description: s.description,
    packageName: s.packageName,
    applicationId: s.applicationId,
    versionName: s.versionName,
    versionCode: s.versionCode,
    minAndroidSdk: s.minAndroidSdk,
    targetAndroidSdk: s.targetAndroidSdk,
    minIosVersion: s.minIosVersion,
  }));

  const updateStep2 = useWizardStore((s) => s.updateStep2);
  const validateStep2 = useWizardStore((s) => s.validateStep2);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((field: keyof Step2State, value: any) => {
    updateStep2({ [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }, [updateStep2, errors]);

  const validate = useCallback(() => {
    const result = validateStep2();
    setErrors(result.errors);
    return result.valid;
  }, [validateStep2]);

  return {
    ...state,
    errors,
    handleChange,
    validate,
  };
}
```

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Detailed specifications
- [MOCKUP.md](./MOCKUP.md) - Visual mockups
- [PATTERNS.md](../_shared/PATTERNS.md) - Implementation patterns
