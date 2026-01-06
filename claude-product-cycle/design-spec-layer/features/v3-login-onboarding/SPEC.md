# V3 Login & Onboarding Specification

**Version**: 3.0.0
**Date**: 2025-01-06
**Status**: In Development

---

## Overview

The login and onboarding flow ensures all users (anonymous or authenticated) provide mandatory organization details before proceeding to the wizard. This replaces the optional organization fields from Step 2.

---

## User Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Landing   │ ──▶ │    Login    │ ──▶ │  Onboarding │ ──▶ │   Wizard    │
│    Page     │     │   Options   │     │  (Org Info) │     │  (Step 1)   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                          │
           ┌──────────────┼──────────────┐
           ▼              ▼              ▼
      Anonymous       GitHub         Supabase
       (Email)        (OAuth)       (Coming Soon)
```

---

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, features, CTA |
| `/login` | Login | Auth options |
| `/onboarding` | Onboarding | Org details form |
| `/wizard` | Wizard | 10-step wizard |
| `/wizard/[step]` | Wizard Step | Specific wizard step |

---

## Login Page

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│                        MifosLaunchpad                          │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │                    [Logo]                                │ │
│  │                                                          │ │
│  │           Welcome to MifosLaunchpad                      │ │
│  │                                                          │ │
│  │    Create white-labeled mobile banking apps in minutes   │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │                                                    │  │ │
│  │  │            Continue as Anonymous                   │  │ │
│  │  │                                                    │  │ │
│  │  │    No sign-in required. Rate limited to 3 builds   │  │ │
│  │  │    per day.                                        │  │ │
│  │  │                                                    │  │ │
│  │  │    [ Continue as Guest ]                           │  │ │
│  │  │                                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ───────────────────── or ──────────────────────────    │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │                                                    │  │ │
│  │  │  [GitHub Icon] Sign in with GitHub                 │  │ │
│  │  │                                                    │  │ │
│  │  │  10 builds per day, build history, faster queues   │  │ │
│  │  │                                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │                                                    │  │ │
│  │  │  [Supabase Icon] Sign in with Email (Coming Soon)  │  │ │
│  │  │                                                    │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Login Options

#### 1. Anonymous (Default)
- No authentication required
- Rate limited: 3 builds per day
- Email required in onboarding for notifications
- Data stored in localStorage

#### 2. GitHub OAuth
- Standard OAuth flow
- Rate limited: 10 builds per day
- GitHub email used for notifications
- Links builds to GitHub account

#### 3. Supabase (Coming Soon)
- Disabled button with "Coming Soon" badge
- Will support email/password
- Persistent accounts

---

## Onboarding Page

### Purpose
Collect mandatory organization details from all users before accessing the wizard.

### Layout

```
┌────────────────────────────────────────────────────────────────┐
│                        MifosLaunchpad                          │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │           Tell us about your organization                │ │
│  │                                                          │ │
│  │    This information will be used in your generated app   │ │
│  │                                                          │ │
│  │  ┌────────────────────────────────────────────────────┐  │ │
│  │  │  Organization Name *                               │  │ │
│  │  │  ┌──────────────────────────────────────────────┐  │  │ │
│  │  │  │ Acme Financial Services                      │  │  │ │
│  │  │  └──────────────────────────────────────────────┘  │  │ │
│  │  │                                                    │  │ │
│  │  │  Email Address * (for build notifications)         │  │ │
│  │  │  ┌──────────────────────────────────────────────┐  │  │ │
│  │  │  │ developer@acmefinancial.com                  │  │  │ │
│  │  │  └──────────────────────────────────────────────┘  │  │ │
│  │  │                                                    │  │ │
│  │  │  Website (optional)                                │  │ │
│  │  │  ┌──────────────────────────────────────────────┐  │  │ │
│  │  │  │ https://acmefinancial.com                    │  │  │ │
│  │  │  └──────────────────────────────────────────────┘  │  │ │
│  │  │                                                    │  │ │
│  │  │  Phone (optional)                                  │  │ │
│  │  │  ┌──────────────────────────────────────────────┐  │  │ │
│  │  │  │ +1 (555) 123-4567                            │  │  │ │
│  │  │  └──────────────────────────────────────────────┘  │  │ │
│  │  │                                                    │  │ │
│  │  │  [x] I agree to the terms of service              │  │ │
│  │  │                                                    │  │ │
│  │  │                           [ Continue to Wizard ]   │  │ │
│  │  └────────────────────────────────────────────────────┘  │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

### Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Organization Name | string | Yes | 2-100 characters |
| Email | string | Yes | Valid email format |
| Website | string | No | Valid URL format |
| Phone | string | No | Valid phone format |
| Terms Agreement | boolean | Yes | Must be checked |

### Validation Schema

```typescript
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
```

---

## State Management

### Auth State (New)

```typescript
interface AuthState {
  // User type
  authType: 'anonymous' | 'github' | 'supabase' | null;
  isAuthenticated: boolean;

  // User info
  userId?: string;          // GitHub username or Supabase ID
  email?: string;           // From GitHub or entered
  avatarUrl?: string;       // GitHub avatar

  // GitHub specific
  githubToken?: string;
  githubScopes?: string[];

  // Rate limiting
  buildsToday: number;
  maxBuildsPerDay: number;
}
```

### Onboarding State (New)

```typescript
interface OnboardingState {
  completed: boolean;
  organization: {
    name: string;
    email: string;
    website: string;
    phone: string;
  };
  termsAccepted: boolean;
}
```

### Storage

| Auth Type | Auth Storage | Onboarding Storage |
|-----------|--------------|-------------------|
| Anonymous | localStorage | localStorage |
| GitHub | localStorage (token) | localStorage |
| Supabase | Supabase session | Supabase DB |

---

## Navigation Guards

### Rules

1. **No Auth + No Onboarding** → Redirect to `/login`
2. **Auth + No Onboarding** → Redirect to `/onboarding`
3. **Auth + Onboarding** → Allow `/wizard/*`

### Implementation

```typescript
// middleware or layout guard
function checkAccess(pathname: string): string | null {
  const auth = getAuthState();
  const onboarding = getOnboardingState();

  // Login page - always accessible
  if (pathname === '/login') {
    if (auth.isAuthenticated && onboarding.completed) {
      return '/wizard'; // Already authenticated
    }
    return null;
  }

  // Onboarding page
  if (pathname === '/onboarding') {
    if (!auth.isAuthenticated && auth.authType !== 'anonymous') {
      return '/login'; // Must choose auth method first
    }
    if (onboarding.completed) {
      return '/wizard'; // Already completed onboarding
    }
    return null;
  }

  // Wizard pages
  if (pathname.startsWith('/wizard')) {
    if (!auth.isAuthenticated && auth.authType !== 'anonymous') {
      return '/login';
    }
    if (!onboarding.completed) {
      return '/onboarding';
    }
    return null;
  }

  return null;
}
```

---

## API Changes

### No Backend Required (Phase 1)

For Phase 1, all authentication is client-side:
- Anonymous: Just set `authType = 'anonymous'`
- GitHub: Use existing PAT flow from V2
- Onboarding: Stored in localStorage

### Future Backend (Phase 2+)

When Supabase is added:
- Auth endpoints for email/password
- User profile storage
- Build history API
- Rate limiting enforcement

---

## Components

### New Components

| Component | Path | Description |
|-----------|------|-------------|
| `LoginPage` | `src/app/login/page.tsx` | Login options |
| `OnboardingPage` | `src/app/onboarding/page.tsx` | Org details form |
| `AuthCard` | `src/components/auth/auth-card.tsx` | Reusable auth option card |
| `OnboardingForm` | `src/components/auth/onboarding-form.tsx` | Org details form |

### Modified Components

| Component | Changes |
|-----------|---------|
| `WizardLayout` | Add auth guard |
| `Step2ProjectInfo` | Remove organization fields |
| `wizard-store.ts` | Add auth and onboarding slices |

---

## Acceptance Criteria

### Login Page
- [ ] Shows three auth options (Anonymous, GitHub, Supabase disabled)
- [ ] Anonymous option proceeds without authentication
- [ ] GitHub option initiates OAuth flow
- [ ] Supabase option shows "Coming Soon" badge
- [ ] Redirects authenticated users to wizard

### Onboarding Page
- [ ] Shows organization form
- [ ] Validates required fields
- [ ] Stores data in appropriate storage
- [ ] Redirects to wizard on completion
- [ ] Pre-fills email from GitHub if available

### Navigation
- [ ] Unauthenticated users redirected to login
- [ ] Users without onboarding redirected to onboarding
- [ ] Completed users can access wizard
- [ ] Direct URL access respects guards

---

## Test Cases

```typescript
describe('Login Page', () => {
  it('shows anonymous option by default');
  it('shows GitHub option');
  it('shows disabled Supabase option');
  it('sets authType to anonymous on guest continue');
  it('redirects to onboarding after auth choice');
});

describe('Onboarding Page', () => {
  it('requires organization name');
  it('requires valid email');
  it('validates website format');
  it('validates phone format');
  it('requires terms acceptance');
  it('stores data on submit');
  it('redirects to wizard on completion');
});

describe('Navigation Guards', () => {
  it('redirects unauthenticated to login');
  it('redirects without onboarding to onboarding');
  it('allows completed users to wizard');
});
```
