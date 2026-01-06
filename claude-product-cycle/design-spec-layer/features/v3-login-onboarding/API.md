# V3 Login & Onboarding API

**Version**: 3.0.0
**Date**: 2025-01-06

---

## State Types

### Auth Types

```typescript
// Authentication method type
type AuthType = 'anonymous' | 'github' | 'supabase';

// Auth state interface
interface AuthState {
  authType: AuthType | null;
  isAuthenticated: boolean;
  userId?: string;
  email?: string;
  avatarUrl?: string;

  // GitHub specific
  githubToken?: string;
  githubScopes?: string[];

  // Rate limiting
  buildsToday: number;
  maxBuildsPerDay: number;
  lastBuildDate?: string;
}

// Initial auth state
const authInitialState: AuthState = {
  authType: null,
  isAuthenticated: false,
  buildsToday: 0,
  maxBuildsPerDay: 3, // Anonymous default
};
```

### Onboarding Types

```typescript
// Organization info
interface OrganizationInfo {
  name: string;
  email: string;
  website: string;
  phone: string;
}

// Onboarding state
interface OnboardingState {
  completed: boolean;
  organization: OrganizationInfo;
  termsAccepted: boolean;
}

// Initial onboarding state
const onboardingInitialState: OnboardingState = {
  completed: false,
  organization: {
    name: '',
    email: '',
    website: '',
    phone: '',
  },
  termsAccepted: false,
};
```

---

## Store Actions

### Auth Actions

```typescript
interface AuthActions {
  // Set auth type (anonymous or github)
  setAuthType: (type: AuthType) => void;

  // Set GitHub authentication
  setGitHubAuth: (data: {
    token: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    scopes?: string[];
  }) => void;

  // Clear authentication
  clearAuth: () => void;

  // Increment build count
  incrementBuildCount: () => void;

  // Check if can build
  canBuild: () => boolean;
}
```

### Onboarding Actions

```typescript
interface OnboardingActions {
  // Update organization field
  setOrganizationField: <K extends keyof OrganizationInfo>(
    field: K,
    value: OrganizationInfo[K]
  ) => void;

  // Set entire organization
  setOrganization: (org: OrganizationInfo) => void;

  // Set terms accepted
  setTermsAccepted: (accepted: boolean) => void;

  // Complete onboarding
  completeOnboarding: () => void;

  // Reset onboarding
  resetOnboarding: () => void;
}
```

---

## Storage Keys

```typescript
const STORAGE_KEYS = {
  AUTH: 'mifos-launchpad-auth',
  ONBOARDING: 'mifos-launchpad-onboarding',
} as const;
```

---

## Utility Functions

### Storage Functions

```typescript
// Save auth state
function saveAuthState(state: AuthState): void {
  localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(state));
}

// Load auth state
function loadAuthState(): AuthState | null {
  const stored = localStorage.getItem(STORAGE_KEYS.AUTH);
  return stored ? JSON.parse(stored) : null;
}

// Clear auth state
function clearAuthState(): void {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
}

// Save onboarding state
function saveOnboardingState(state: OnboardingState): void {
  localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(state));
}

// Load onboarding state
function loadOnboardingState(): OnboardingState | null {
  const stored = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
  return stored ? JSON.parse(stored) : null;
}

// Clear onboarding state
function clearOnboardingState(): void {
  localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
}
```

### Rate Limiting Functions

```typescript
// Get rate limit for auth type
function getRateLimitForAuthType(type: AuthType): number {
  switch (type) {
    case 'anonymous': return 3;
    case 'github': return 10;
    case 'supabase': return 20;
    default: return 3;
  }
}

// Check if rate limited
function isRateLimited(state: AuthState): boolean {
  const today = new Date().toISOString().split('T')[0];

  // Reset count if new day
  if (state.lastBuildDate !== today) {
    return false;
  }

  return state.buildsToday >= state.maxBuildsPerDay;
}

// Get remaining builds
function getRemainingBuilds(state: AuthState): number {
  const today = new Date().toISOString().split('T')[0];

  if (state.lastBuildDate !== today) {
    return state.maxBuildsPerDay;
  }

  return Math.max(0, state.maxBuildsPerDay - state.buildsToday);
}
```

---

## Validation Schemas

### Onboarding Validation

```typescript
import { z } from 'zod';

const onboardingSchema = z.object({
  organizationName: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name must be less than 100 characters'),

  email: z.string()
    .email('Please enter a valid email address'),

  website: z.string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),

  phone: z.string()
    .regex(/^\+?[\d\s\-()]+$/, 'Please enter a valid phone number')
    .optional()
    .or(z.literal('')),

  termsAccepted: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms of service' })
  })
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;
```

---

## Component Props

### LoginPage Props

```typescript
interface LoginPageProps {
  // No props - uses global store
}
```

### OnboardingPage Props

```typescript
interface OnboardingPageProps {
  // No props - uses global store
}
```

### AuthCard Props

```typescript
interface AuthCardProps {
  type: AuthType;
  title: string;
  description: string;
  icon: React.ReactNode;
  disabled?: boolean;
  badge?: string;
  onClick: () => void;
}
```

### OnboardingForm Props

```typescript
interface OnboardingFormProps {
  initialValues?: Partial<OrganizationInfo>;
  onSubmit: (data: OnboardingFormData) => void;
  isLoading?: boolean;
}
```

---

## Navigation Helpers

```typescript
// Check if user needs authentication
function needsAuth(): boolean {
  const auth = loadAuthState();
  return !auth || !auth.authType;
}

// Check if user needs onboarding
function needsOnboarding(): boolean {
  const onboarding = loadOnboardingState();
  return !onboarding || !onboarding.completed;
}

// Get redirect path
function getRedirectPath(currentPath: string): string | null {
  if (currentPath === '/login') {
    if (!needsAuth() && !needsOnboarding()) {
      return '/wizard';
    }
    return null;
  }

  if (currentPath === '/onboarding') {
    if (needsAuth()) {
      return '/login';
    }
    if (!needsOnboarding()) {
      return '/wizard';
    }
    return null;
  }

  if (currentPath.startsWith('/wizard')) {
    if (needsAuth()) {
      return '/login';
    }
    if (needsOnboarding()) {
      return '/onboarding';
    }
    return null;
  }

  return null;
}
```

---

## Events

### Auth Events

```typescript
// Auth state changed
interface AuthChangedEvent {
  type: 'AUTH_CHANGED';
  payload: {
    previousState: AuthState | null;
    currentState: AuthState;
  };
}

// Build count changed
interface BuildCountChangedEvent {
  type: 'BUILD_COUNT_CHANGED';
  payload: {
    buildsToday: number;
    remaining: number;
  };
}
```

### Onboarding Events

```typescript
// Onboarding completed
interface OnboardingCompletedEvent {
  type: 'ONBOARDING_COMPLETED';
  payload: {
    organization: OrganizationInfo;
  };
}
```
