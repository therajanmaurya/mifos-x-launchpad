# Step 1: App Selection - API Reference

> Interfaces, types, and data contracts for App Selection

---

## Type Definitions

### Core Types

```typescript
/**
 * Available base application types
 */
type AppType = 'mobile-wallet' | 'mifos-mobile' | 'android-client' | 'blank';

/**
 * Application maintenance status
 */
type AppStatus = 'active' | 'maintained' | 'community' | 'deprecated';

/**
 * Supported target platforms
 */
type Platform = 'android' | 'ios' | 'desktop' | 'web';
```

### App Option Interface

```typescript
/**
 * Represents a selectable application option
 */
interface AppOption {
  /** Unique identifier */
  id: AppType;

  /** Display name */
  name: string;

  /** Short description (1-2 sentences) */
  description: string;

  /** Path to app icon */
  icon: string;

  /** List of key features */
  features: string[];

  /** Technology stack used */
  techStack: string[];

  /** Supported platforms */
  platforms: Platform[];

  /** GitHub repository URL */
  githubUrl: string;

  /** Maintenance status */
  status: AppStatus;

  /** Optional: Additional metadata */
  metadata?: {
    /** Last update date */
    lastUpdated?: string;
    /** Number of GitHub stars */
    stars?: number;
    /** License type */
    license?: string;
  };
}
```

---

## State Interface

### Step 1 State

```typescript
/**
 * State for Step 1: App Selection
 */
interface Step1State {
  /** Currently selected application (null if none) */
  selectedApp: AppType | null;

  /** Features included with selected app */
  appFeatures: string[];
}

/**
 * Initial state for Step 1
 */
const step1InitialState: Step1State = {
  selectedApp: null,
  appFeatures: []
};
```

### Step 1 Actions

```typescript
/**
 * Actions for Step 1
 */
interface Step1Actions {
  /**
   * Select a base application
   * @param app - The app type to select
   */
  selectApp: (app: AppType) => void;

  /**
   * Clear current selection
   */
  clearSelection: () => void;

  /**
   * Update selected app features
   * @param features - Array of feature strings
   */
  setAppFeatures: (features: string[]) => void;
}
```

---

## Store Slice

```typescript
import { StateCreator } from 'zustand';

/**
 * Step 1 store slice
 */
type Step1Slice = Step1State & Step1Actions;

/**
 * Create Step 1 slice for Zustand store
 */
const createStep1Slice: StateCreator<
  WizardStore,
  [],
  [],
  Step1Slice
> = (set, get) => ({
  // Initial state
  selectedApp: null,
  appFeatures: [],

  // Actions
  selectApp: (app: AppType) => {
    const appOption = APP_OPTIONS.find(opt => opt.id === app);
    set({
      selectedApp: app,
      appFeatures: appOption?.features || []
    });
  },

  clearSelection: () => {
    set({
      selectedApp: null,
      appFeatures: []
    });
  },

  setAppFeatures: (features: string[]) => {
    set({ appFeatures: features });
  }
});
```

---

## Validation Schema

```typescript
import { z } from 'zod';

/**
 * Zod schema for Step 1 validation
 */
const step1Schema = z.object({
  selectedApp: z.enum(['mobile-wallet', 'mifos-mobile', 'android-client', 'blank'], {
    required_error: 'Please select a base application',
    invalid_type_error: 'Invalid application type'
  }),
  appFeatures: z.array(z.string()).optional()
});

/**
 * Type inferred from schema
 */
type Step1FormData = z.infer<typeof step1Schema>;

/**
 * Validate Step 1 data
 * @param data - Form data to validate
 * @returns Validation result
 */
function validateStep1(data: unknown): {
  success: boolean;
  data?: Step1FormData;
  errors?: Record<string, string>;
} {
  const result = step1Schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((err) => {
    if (err.path[0]) {
      errors[err.path[0] as string] = err.message;
    }
  });

  return { success: false, errors };
}
```

---

## Component Props

### AppCard Props

```typescript
interface AppCardProps {
  /** App option data */
  app: AppOption;

  /** Whether this card is currently selected */
  isSelected: boolean;

  /** Callback when card is clicked */
  onSelect: (appId: AppType) => void;

  /** Optional: Show expanded features */
  showExpanded?: boolean;

  /** Optional: Custom class names */
  className?: string;
}
```

### AppSelectionStep Props

```typescript
interface AppSelectionStepProps {
  /** Callback when step is complete */
  onComplete?: () => void;

  /** Callback when going back */
  onBack?: () => void;

  /** Optional: Pre-selected app (for editing) */
  initialSelection?: AppType;
}
```

### FeatureList Props

```typescript
interface FeatureListProps {
  /** List of features to display */
  features: string[];

  /** Maximum number of features to show */
  maxItems?: number;

  /** Show checkmarks or bullets */
  variant?: 'checkmark' | 'bullet';

  /** Optional: Custom class names */
  className?: string;
}
```

---

## Utility Functions

```typescript
/**
 * Get app option by ID
 * @param id - App type ID
 * @returns App option or undefined
 */
function getAppById(id: AppType): AppOption | undefined {
  return APP_OPTIONS.find(app => app.id === id);
}

/**
 * Get default features for an app
 * @param id - App type ID
 * @returns Array of feature strings
 */
function getAppFeatures(id: AppType): string[] {
  const app = getAppById(id);
  return app?.features || [];
}

/**
 * Get supported platforms for an app
 * @param id - App type ID
 * @returns Array of platform strings
 */
function getAppPlatforms(id: AppType): Platform[] {
  const app = getAppById(id);
  return app?.platforms || [];
}

/**
 * Check if an app supports a specific platform
 * @param id - App type ID
 * @param platform - Platform to check
 * @returns boolean
 */
function appSupportsPlatform(id: AppType, platform: Platform): boolean {
  const platforms = getAppPlatforms(id);
  return platforms.includes(platform);
}
```

---

## Constants

```typescript
/**
 * All available app options
 */
const APP_OPTIONS: AppOption[] = [
  {
    id: 'mobile-wallet',
    name: 'Mobile Wallet',
    description: 'Digital wallet for peer-to-peer transfers, payments, and savings management',
    icon: '/icons/mobile-wallet.svg',
    features: [
      'Biometric authentication',
      'QR code payments',
      'P2P transfers',
      'Savings goals',
      'Transaction history',
      'Bill payments'
    ],
    techStack: ['Kotlin Multiplatform', 'Compose Multiplatform', 'Ktor'],
    platforms: ['android', 'ios'],
    githubUrl: 'https://github.com/openMF/mobile-wallet',
    status: 'active'
  },
  {
    id: 'mifos-mobile',
    name: 'Mifos Mobile',
    description: 'Full-featured mobile banking client for Mifos X/Fineract backend',
    icon: '/icons/mifos-mobile.svg',
    features: [
      'Account management',
      'Loan applications',
      'Fund transfers',
      'Beneficiary management',
      'Notifications',
      'Multi-language support'
    ],
    techStack: ['Kotlin Multiplatform', 'Compose Multiplatform', 'Ktor'],
    platforms: ['android', 'ios'],
    githubUrl: 'https://github.com/openMF/mifos-mobile',
    status: 'active'
  },
  {
    id: 'android-client',
    name: 'Android Client',
    description: 'Field officer application for client onboarding and loan management',
    icon: '/icons/android-client.svg',
    features: [
      'Client management',
      'Loan origination',
      'Collection sheets',
      'Offline sync',
      'Document upload',
      'GPS tracking'
    ],
    techStack: ['Kotlin Multiplatform', 'Compose Multiplatform', 'Ktor'],
    platforms: ['android', 'ios', 'desktop'],
    githubUrl: 'https://github.com/openMF/android-client',
    status: 'active'
  },
  {
    id: 'blank',
    name: 'Blank Template',
    description: 'Minimal Kotlin Multiplatform starter template with basic structure',
    icon: '/icons/blank-template.svg',
    features: [
      'KMP project structure',
      'Compose Multiplatform setup',
      'Basic navigation',
      'Theme system',
      'Build configuration'
    ],
    techStack: ['Kotlin Multiplatform', 'Compose Multiplatform'],
    platforms: ['android', 'ios', 'desktop', 'web'],
    githubUrl: 'https://github.com/openMF/mifos-mobile-kmp-template',
    status: 'active'
  }
];

/**
 * App status labels for display
 */
const APP_STATUS_LABELS: Record<AppStatus, string> = {
  active: 'Actively Maintained',
  maintained: 'Maintained',
  community: 'Community Supported',
  deprecated: 'Deprecated'
};

/**
 * Platform display names
 */
const PLATFORM_LABELS: Record<Platform, string> = {
  android: 'Android',
  ios: 'iOS',
  desktop: 'Desktop',
  web: 'Web'
};
```

---

## Hooks

```typescript
/**
 * Hook to get current app selection
 */
function useAppSelection() {
  const selectedApp = useWizardStore((state) => state.selectedApp);
  const appFeatures = useWizardStore((state) => state.appFeatures);
  const selectApp = useWizardStore((state) => state.selectApp);
  const clearSelection = useWizardStore((state) => state.clearSelection);

  const selectedAppData = selectedApp ? getAppById(selectedApp) : null;

  return {
    selectedApp,
    selectedAppData,
    appFeatures,
    selectApp,
    clearSelection,
    isSelected: selectedApp !== null
  };
}

/**
 * Hook to validate Step 1 completion
 */
function useStep1Validation() {
  const { selectedApp } = useAppSelection();

  const isValid = selectedApp !== null;
  const errors: string[] = [];

  if (!isValid) {
    errors.push('Please select a base application');
  }

  return { isValid, errors };
}
```

---

## Related Documentation

- [SPEC.md](./SPEC.md) - Detailed specifications
- [MOCKUP.md](./MOCKUP.md) - Visual mockups
- [PATTERNS.md](../_shared/PATTERNS.md) - Implementation patterns
- [API_REFERENCE.md](../_shared/API_REFERENCE.md) - Full API reference
