# Step 2: Project Info - Specification

> Configure organization and project metadata

**Feature ID**: `step-2-project-info`
**Priority**: P0 (Critical Path)
**Status**: 📋 Planned

---

## Overview

Step 2 collects essential project metadata including organization name, project name, package identifiers, and version information. This data is used to configure the generated project's build files, manifests, and branding.

---

## User Story

**As a** developer setting up a new mobile banking app
**I want to** configure project metadata
**So that** the generated project has correct identifiers and branding

---

## Functional Requirements

### FR-1: Organization Information

Collect organization details:

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Organization Name | Text | ✓ | 2-50 chars |
| Organization Website | URL | ○ | Valid URL format |
| Support Email | Email | ○ | Valid email format |

### FR-2: Project Information

Collect project details:

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Project Name | Text | ✓ | 2-30 chars, alphanumeric |
| Display Name | Text | ✓ | 2-50 chars |
| Description | Textarea | ○ | Max 500 chars |

### FR-3: Package Configuration

Configure package identifiers:

| Field | Type | Required | Validation |
|-------|------|:--------:|------------|
| Package Name | Text | ✓ | Reverse domain (e.g., com.example.app) |
| Application ID | Text | ✓ | Auto-generated from package name |

**Package Name Rules**:
- Starts with lowercase letter
- Contains only lowercase letters, numbers, underscores
- Has at least 2 segments (e.g., `com.example`)
- Each segment starts with letter

### FR-4: Version Configuration

Configure version information:

| Field | Type | Required | Default |
|-------|------|:--------:|---------|
| Version Name | Text | ✓ | 1.0.0 |
| Version Code | Number | ✓ | 1 |

**Version Name Format**: Semantic versioning (X.Y.Z)
**Version Code**: Positive integer, auto-incremented

### FR-5: SDK Configuration

Configure minimum SDK versions:

| Field | Type | Required | Default | Range |
|-------|------|:--------:|---------|-------|
| Min Android SDK | Select | ✓ | 24 | 21-34 |
| Target Android SDK | Select | ✓ | 34 | 24-34 |
| Min iOS Version | Select | ✓ | 15.0 | 13.0-17.0 |

### FR-6: Auto-Generation

The following fields should auto-generate:
- **Application ID**: From package name (same value)
- **Project Slug**: From project name (lowercase, hyphens)
- **Bundle ID**: From package name (for iOS)

---

## Non-Functional Requirements

### NFR-1: Real-time Validation
- Validate fields on blur
- Show errors inline below fields
- Prevent navigation with invalid data

### NFR-2: Data Persistence
- Auto-save to localStorage on change
- Restore on page refresh
- Clear on wizard reset

### NFR-3: Accessibility
- All fields have associated labels
- Error messages linked with aria-describedby
- Tab order follows visual order

---

## UI Components Required

| Component | Type | Location |
|-----------|------|----------|
| `ProjectInfoStep` | Custom | `steps/step-2-project-info.tsx` |
| `Input` | shadcn/ui | Text inputs |
| `Textarea` | shadcn/ui | Description field |
| `Select` | shadcn/ui | SDK version dropdowns |
| `Label` | shadcn/ui | Field labels |
| `FormField` | Custom | Wrapper with validation |

---

## State Management

```typescript
interface Step2State {
  // Organization
  organizationName: string;
  organizationWebsite: string;
  supportEmail: string;

  // Project
  projectName: string;
  displayName: string;
  description: string;

  // Package
  packageName: string;
  applicationId: string;

  // Version
  versionName: string;
  versionCode: number;

  // SDK
  minAndroidSdk: number;
  targetAndroidSdk: number;
  minIosVersion: string;
}

interface Step2Actions {
  updateStep2: (data: Partial<Step2State>) => void;
  resetStep2: () => void;
  generateApplicationId: () => void;
}
```

---

## Validation Rules

```typescript
const step2Schema = z.object({
  organizationName: z.string()
    .min(2, 'Organization name must be at least 2 characters')
    .max(50, 'Organization name must be at most 50 characters'),

  projectName: z.string()
    .min(2, 'Project name must be at least 2 characters')
    .max(30, 'Project name must be at most 30 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, 'Project name must start with letter'),

  packageName: z.string()
    .min(1, 'Package name is required')
    .regex(
      /^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/,
      'Package name must be valid (e.g., com.example.app)'
    ),

  versionName: z.string()
    .regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z'),

  versionCode: z.number()
    .int('Version code must be an integer')
    .positive('Version code must be positive'),

  minAndroidSdk: z.number()
    .min(21, 'Minimum SDK must be at least 21')
    .max(34, 'Minimum SDK must be at most 34'),
});
```

---

## Form Layout

### Desktop (2-column)

```
┌─────────────────────────────────────────────────────────────┐
│  Organization Information                                   │
├─────────────────────────────┬───────────────────────────────┤
│  Organization Name *        │  Website                      │
│  [____________________]     │  [____________________]       │
├─────────────────────────────┴───────────────────────────────┤
│  Support Email                                              │
│  [____________________]                                     │
├─────────────────────────────────────────────────────────────┤
│  Project Information                                        │
├─────────────────────────────┬───────────────────────────────┤
│  Project Name *             │  Display Name *               │
│  [____________________]     │  [____________________]       │
├─────────────────────────────┴───────────────────────────────┤
│  Description                                                │
│  [                                                    ]     │
│  [                                                    ]     │
├─────────────────────────────────────────────────────────────┤
│  Package Configuration                                      │
├─────────────────────────────┬───────────────────────────────┤
│  Package Name *             │  Application ID               │
│  [com.example.app____]      │  [com.example.app____] 🔒     │
├─────────────────────────────────────────────────────────────┤
│  Version Information                                        │
├─────────────────────────────┬───────────────────────────────┤
│  Version Name *             │  Version Code *               │
│  [1.0.0_____________]       │  [1__________________]        │
├─────────────────────────────────────────────────────────────┤
│  SDK Configuration                                          │
├─────────────────┬───────────────────┬───────────────────────┤
│  Min Android *  │  Target Android * │  Min iOS *            │
│  [24 ▼]         │  [34 ▼]           │  [15.0 ▼]             │
└─────────────────┴───────────────────┴───────────────────────┘
```

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Package name conflicts | Show warning, allow proceed |
| Invalid characters in project name | Block input, show error |
| Version code overflow | Cap at MAX_INT |
| Empty organization name | Show required error |
| URL without protocol | Auto-prepend https:// |

---

## Test Cases

### Unit Tests
- [ ] All required fields show validation errors when empty
- [ ] Package name validates correctly
- [ ] Version format validates correctly
- [ ] Application ID auto-generates
- [ ] SDK range limits enforced

### Integration Tests
- [ ] Data persists across page refreshes
- [ ] Navigation blocked with invalid data
- [ ] All data available in Step 10 review

### E2E Tests
- [ ] Complete form → verify in generated config
- [ ] Tab navigation through all fields
- [ ] Screen reader announces errors

---

## Dependencies

- `@/store/wizard-store.ts` - Zustand store
- `@/components/ui/input` - shadcn Input
- `@/components/ui/select` - shadcn Select
- `@/components/ui/textarea` - shadcn Textarea
- `zod` - Validation schema

---

## Related Documentation

- [MOCKUP.md](./MOCKUP.md) - Visual mockups
- [API.md](./API.md) - Interface definitions
- [STATUS.md](./STATUS.md) - Implementation status
