# Step 1: App Selection - Specification

> Select the base Mifos application to customize

**Feature ID**: `step-1-app-selection`
**Priority**: P0 (Critical Path)
**Status**: 📋 Planned

---

## Overview

The first step of the MifosForge wizard allows users to select which base Mifos application they want to customize. This choice determines the default features, configurations, and templates used throughout the rest of the wizard.

---

## User Story

**As a** financial institution developer
**I want to** select a base Mifos application
**So that** I can start with pre-configured features and templates appropriate for my use case

---

## Functional Requirements

### FR-1: Display Application Options

The system shall display four application options:

| App | Description | Default Features |
|-----|-------------|------------------|
| **Mobile Wallet** | Digital wallet for P2P transfers, payments, savings | Biometric auth, QR payments, savings goals |
| **Mifos Mobile** | Full-featured mobile banking client | Account management, loans, transfers |
| **Android Client** | Field officer/staff application | Client management, loan origination |
| **Blank Template** | Minimal KMP starter | Basic structure only |

### FR-2: Application Card Display

Each application card shall display:
- App icon (from Mifos brand assets)
- App name
- Short description (1-2 sentences)
- Key features list (3-5 bullet points)
- GitHub repository link
- Selection state indicator

### FR-3: Single Selection

- Only one application can be selected at a time
- Clicking a new card deselects the previous selection
- Selection is visually indicated with border highlight and checkmark

### FR-4: Feature Display

When an app is selected, show expanded feature details:
- Complete feature list
- Technology stack used
- Supported platforms
- Community/maintenance status

### FR-5: Persistence

- Selection persists across page refreshes (localStorage via Zustand)
- Selection can be changed by returning to Step 1

---

## Non-Functional Requirements

### NFR-1: Performance
- Card images shall load lazily
- Page shall be interactive within 500ms

### NFR-2: Accessibility
- All cards keyboard navigable (Tab, Enter, Space)
- Screen reader announces selection state
- ARIA labels on interactive elements

### NFR-3: Responsiveness
- Mobile: Single column, full-width cards
- Tablet: 2-column grid
- Desktop: 2x2 grid with preview panel

---

## UI Components Required

| Component | Type | Location |
|-----------|------|----------|
| `AppCard` | Custom | `components/wizard/steps/` |
| `FeatureList` | Custom | `components/wizard/` |
| `Card` | shadcn/ui | Base card component |
| `Badge` | shadcn/ui | Feature badges |
| `Button` | shadcn/ui | GitHub link button |

---

## State Management

```typescript
interface Step1State {
  selectedApp: AppType | null;
  appFeatures: string[];
}

type AppType = 'mobile-wallet' | 'mifos-mobile' | 'android-client' | 'blank';

// Actions
interface Step1Actions {
  selectApp: (app: AppType) => void;
  clearSelection: () => void;
}
```

---

## Validation Rules

| Rule | Condition | Error Message |
|------|-----------|---------------|
| Required | `selectedApp !== null` | Please select a base application |

---

## Data Schema

```typescript
interface AppOption {
  id: AppType;
  name: string;
  description: string;
  icon: string;
  features: string[];
  techStack: string[];
  platforms: string[];
  githubUrl: string;
  status: 'active' | 'maintained' | 'community';
}

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
    platforms: ['Android', 'iOS'],
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
    platforms: ['Android', 'iOS'],
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
    platforms: ['Android', 'iOS', 'Desktop'],
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
    platforms: ['Android', 'iOS', 'Desktop', 'Web'],
    githubUrl: 'https://github.com/openMF/mifos-mobile-kmp-template',
    status: 'active'
  }
];
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| No selection on Next | Show validation error, prevent navigation |
| Network error loading icons | Show placeholder icon |
| GitHub link click | Open in new tab, don't navigate away |
| Rapid clicking between cards | Debounce selection, show latest |

---

## Test Cases

### Unit Tests
- [ ] Renders all four app options
- [ ] Selection updates store correctly
- [ ] Only one app can be selected
- [ ] Validation fails when no selection
- [ ] GitHub links have correct URLs

### Integration Tests
- [ ] Selection persists after refresh
- [ ] Navigation to Step 2 works with valid selection
- [ ] Can return and change selection

### E2E Tests
- [ ] Complete flow: select app → verify in review step
- [ ] Keyboard navigation through cards
- [ ] Screen reader announces selections

---

## Dependencies

- `@/store/wizard-store.ts` - Zustand store
- `@/components/ui/card` - shadcn Card
- `@/components/ui/badge` - shadcn Badge
- `@/lib/constants/apps.ts` - App options data

---

## Related Documentation

- [MOCKUP.md](./MOCKUP.md) - Visual mockups
- [API.md](./API.md) - Interface definitions
- [STATUS.md](./STATUS.md) - Implementation status
- [PATTERNS.md](../_shared/PATTERNS.md) - Implementation patterns
