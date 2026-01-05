# MifosLaunchpad - v2 Foundation Implementation Plan

**Generated**: 2026-01-05
**Scope**: v2-foundation (Sprint 1)

---

## Priority Summary

| Priority | Tasks | Description |
|----------|:-----:|-------------|
| P0 - Critical | 5 | Core infrastructure for v2 |
| P1 - High | 3 | SDK detection & UI updates |
| P2 - Medium | 2 | Polish & validation |

**Total Tasks**: 10
**Estimated Effort**: Medium-High

---

## Current State Analysis

### What Exists (v1.0)
| Component | Status | Location |
|-----------|:------:|----------|
| AppType definition | ✅ | `src/types/wizard.ts:13` |
| APP_OPTIONS constant | ✅ | `src/types/wizard.ts:811` |
| Step1State | ✅ | `src/types/wizard.ts:52` |
| Step2State (with SDK fields) | ✅ | `src/types/wizard.ts:88` |
| Wizard store | ✅ | `src/store/wizard-store.ts` |

### What's Missing (v2.0)
| Component | Priority | Description |
|-----------|:--------:|-------------|
| Repository config | P0 | Map AppType → GitHub repo |
| Repo fetcher service | P0 | Clone/fetch repo contents |
| TOML parser | P0 | Parse libs.versions.toml |
| SDK state slice | P1 | Store detected SDK info |
| Read-only SDK UI | P1 | Display SDK as badges |
| Auto version logic | P1 | Remove manual version input |

---

## P0 - Critical Tasks

### Task 1: Repository Configuration Types

**Gap**: No mapping between app selection and source repository
**Impact**: Cannot fetch correct project based on user selection
**Priority**: P0

**Files to Create/Modify**:
- `src/types/wizard.ts` - Add RepoConfig interface
- `src/types/wizard.ts` - Add APP_REPOSITORIES constant

**Implementation**:

```typescript
// Add to src/types/wizard.ts

/**
 * Repository configuration for cloning
 */
export interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  libsVersionsPath: string;
}

/**
 * Map app types to their source repositories
 */
export const APP_REPOSITORIES: Record<AppType, RepoConfig> = {
  'mobile-wallet': {
    owner: 'openMF',
    repo: 'mobile-wallet',
    branch: 'dev',
    libsVersionsPath: 'gradle/libs.versions.toml',
  },
  'mifos-mobile': {
    owner: 'openMF',
    repo: 'mifos-mobile',
    branch: 'dev',
    libsVersionsPath: 'gradle/libs.versions.toml',
  },
  'android-client': {
    owner: 'openMF',
    repo: 'android-client',
    branch: 'dev',
    libsVersionsPath: 'gradle/libs.versions.toml',
  },
  'blank': {
    owner: 'openMF',
    repo: 'kmp-project-template',
    branch: 'main',
    libsVersionsPath: 'gradle/libs.versions.toml',
  },
};
```

**Steps**:
1. Add `RepoConfig` interface to `src/types/wizard.ts`
2. Add `APP_REPOSITORIES` constant
3. Export from types file

**Command**: `/implement repo-config-types`

---

### Task 2: SDK Info Types

**Gap**: No types for detected SDK information
**Impact**: Cannot store/display SDK info from selected project
**Priority**: P0

**Files to Modify**:
- `src/types/wizard.ts` - Add SDKInfo interface

**Implementation**:

```typescript
// Add to src/types/wizard.ts

/**
 * Detected SDK information from project
 */
export interface SDKInfo {
  kotlin: string;
  compose: string;
  androidGradlePlugin: string;
  minAndroidSdk: number;
  targetAndroidSdk: number;
  minIosVersion: string;
  packageName: string;
  packageNamespace: string;
  packageVersion: string;
}

/**
 * Repository fetch state
 */
export interface RepoFetchState {
  isLoading: boolean;
  error: string | null;
  sdkInfo: SDKInfo | null;
  lastFetched: number | null;
}
```

**Steps**:
1. Add `SDKInfo` interface
2. Add `RepoFetchState` interface
3. Update `Step1State` or create new state slice

**Command**: `/implement sdk-info-types`

---

### Task 3: GitHub API Service

**Gap**: No service to fetch repository contents
**Impact**: Cannot read libs.versions.toml from selected repo
**Priority**: P0

**Files to Create**:
- `src/lib/services/github-api.ts`

**Implementation**:

```typescript
// src/lib/services/github-api.ts

import { RepoConfig, SDKInfo } from '@/types/wizard';

const GITHUB_API = 'https://api.github.com';

/**
 * Fetch file contents from GitHub repository
 */
export async function fetchRepoFile(
  config: RepoConfig,
  path: string
): Promise<string> {
  const url = `${GITHUB_API}/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3.raw',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
  }

  return response.text();
}

/**
 * Fetch libs.versions.toml and parse SDK info
 */
export async function fetchSDKInfo(config: RepoConfig): Promise<SDKInfo> {
  const content = await fetchRepoFile(config, config.libsVersionsPath);
  return parseLibsVersionsToml(content);
}
```

**Steps**:
1. Create `src/lib/services/` directory
2. Create `github-api.ts` with fetch functions
3. Add error handling and retry logic
4. Add caching for repeated fetches

**Command**: `/implement github-api-service`

---

### Task 4: TOML Parser

**Gap**: No parser for libs.versions.toml format
**Impact**: Cannot extract SDK versions from TOML content
**Priority**: P0

**Files to Create**:
- `src/lib/utils/toml-parser.ts`

**Implementation**:

```typescript
// src/lib/utils/toml-parser.ts

import { SDKInfo } from '@/types/wizard';

/**
 * Parse libs.versions.toml content to extract SDK info
 */
export function parseLibsVersionsToml(content: string): SDKInfo {
  const lines = content.split('\n');
  const values: Record<string, string> = {};

  for (const line of lines) {
    const match = line.match(/^(\w+)\s*=\s*"([^"]+)"/);
    if (match) {
      values[match[1]] = match[2];
    }
  }

  return {
    kotlin: values['kotlin'] || 'unknown',
    compose: values['compose-plugin'] || values['jetbrainsCompose'] || 'unknown',
    androidGradlePlugin: values['androidGradlePlugin'] || 'unknown',
    minAndroidSdk: parseInt(values['minSdk'] || '24', 10),
    targetAndroidSdk: parseInt(values['targetSdk'] || values['compileSdk'] || '34', 10),
    minIosVersion: values['iosDeploymentTarget'] || '15.0',
    packageName: values['packageName'] || '',
    packageNamespace: values['packageNamespace'] || '',
    packageVersion: values['packageVersion'] || '1.0.0',
  };
}
```

**Steps**:
1. Create `src/lib/utils/toml-parser.ts`
2. Implement TOML line parsing
3. Map TOML keys to SDKInfo fields
4. Add fallback values for missing keys

**Command**: `/implement toml-parser`

---

### Task 5: Store Integration

**Gap**: No store slice for SDK/repo fetch state
**Impact**: Cannot persist and share SDK info across components
**Priority**: P0

**Files to Modify**:
- `src/store/wizard-store.ts` - Add repo fetch state and actions

**Implementation**:

```typescript
// Add to wizard-store.ts

// State
repoFetch: RepoFetchState;

// Initial state
repoFetch: {
  isLoading: false,
  error: null,
  sdkInfo: null,
  lastFetched: null,
},

// Actions
fetchSDKInfo: async (appType: AppType) => {
  const config = APP_REPOSITORIES[appType];
  if (!config) return;

  set({ repoFetch: { ...get().repoFetch, isLoading: true, error: null } });

  try {
    const sdkInfo = await fetchSDKInfo(config);
    set({
      repoFetch: {
        isLoading: false,
        error: null,
        sdkInfo,
        lastFetched: Date.now(),
      },
    });
  } catch (error) {
    set({
      repoFetch: {
        ...get().repoFetch,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch SDK info',
      },
    });
  }
},

clearSDKInfo: () => {
  set({
    repoFetch: {
      isLoading: false,
      error: null,
      sdkInfo: null,
      lastFetched: null,
    },
  });
},
```

**Steps**:
1. Add `RepoFetchState` to wizard state
2. Add `repoFetch` to initial state
3. Create `fetchSDKInfo` async action
4. Create `clearSDKInfo` action
5. Create `useSDKInfo` hook

**Command**: `/implement store-sdk-integration`

---

## P1 - High Priority Tasks

### Task 6: Update Step 1 - Trigger SDK Fetch

**Gap**: App selection doesn't trigger SDK fetch
**Impact**: SDK info not loaded when user selects app
**Priority**: P1

**Files to Modify**:
- `src/components/wizard/steps/step-1-app-selection.tsx`

**Implementation**:

```typescript
// In step-1-app-selection.tsx

const { selectApp, fetchSDKInfo, clearSDKInfo } = useWizardStore();

const handleAppSelect = useCallback((appType: AppType) => {
  selectApp(appType);
  fetchSDKInfo(appType); // Trigger SDK fetch
}, [selectApp, fetchSDKInfo]);

const handleClearSelection = useCallback(() => {
  clearSelection();
  clearSDKInfo(); // Clear SDK info
}, [clearSelection, clearSDKInfo]);
```

**Steps**:
1. Import `fetchSDKInfo` action from store
2. Call `fetchSDKInfo` when app is selected
3. Clear SDK info when selection is cleared
4. Show loading indicator during fetch

**Command**: `/implement step-1-sdk-fetch`

---

### Task 7: Update Step 2 - Read-Only SDK Display

**Gap**: SDK fields are editable, should be read-only
**Impact**: Users can change SDK values that should come from project
**Priority**: P1

**Files to Modify**:
- `src/components/wizard/steps/step-2-project-info.tsx`

**UI Changes**:

```diff
- SDK Configuration
-   <Select label="Min Android SDK" />
-   <Select label="Target Android SDK" />
-   <Select label="Min iOS Version" />

+ SDK Configuration (from selected project)
+   <div className="flex flex-wrap gap-2">
+     <Badge>Kotlin {sdkInfo.kotlin}</Badge>
+     <Badge>Compose {sdkInfo.compose}</Badge>
+     <Badge>AGP {sdkInfo.androidGradlePlugin}</Badge>
+   </div>
+   <div className="flex flex-wrap gap-2 mt-2">
+     <Badge variant="outline">Android {sdkInfo.minAndroidSdk}-{sdkInfo.targetAndroidSdk}</Badge>
+     <Badge variant="outline">iOS {sdkInfo.minIosVersion}+</Badge>
+   </div>
```

**Steps**:
1. Remove SDK input fields (minAndroidSdk, targetAndroidSdk, minIosVersion)
2. Add SDK badges section
3. Show loading state while fetching
4. Show error state if fetch failed
5. Keep SDK values in store for generation

**Command**: `/implement step-2-readonly-sdk`

---

### Task 8: Update Step 2 - Auto Version

**Gap**: Version fields are manual, should be automatic
**Impact**: Simpler UX, consistent versioning
**Priority**: P1

**Files to Modify**:
- `src/components/wizard/steps/step-2-project-info.tsx`
- `src/types/wizard.ts`

**UI Changes**:

```diff
- Version Information
-   <Input label="Version Name" value={versionName} onChange={...} />
-   <Input label="Version Code" type="number" value={versionCode} onChange={...} />

+ Version Information
+   <div className="p-4 bg-muted rounded-lg">
+     <p className="text-sm text-muted-foreground">Version: 1.0.0</p>
+     <p className="text-xs text-muted-foreground">Build number auto-generated on each build</p>
+   </div>
```

**Type Changes**:

```typescript
// Remove from Step2State:
// versionName: string;  // Keep but make derived
// versionCode: number;  // Remove - auto-generated

// Add computed version
const getVersionCode = () => Math.floor(Date.now() / 1000);
```

**Steps**:
1. Remove version input fields from UI
2. Show version as informational text
3. Keep `versionName` as '1.0.0' default
4. Generate `versionCode` at build time
5. Update step2InitialState

**Command**: `/implement step-2-auto-version`

---

## P2 - Medium Priority Tasks

### Task 9: Loading & Error States

**Gap**: No loading/error UI for SDK fetch
**Impact**: Poor UX when network slow or fails
**Priority**: P2

**Files to Modify**:
- `src/components/wizard/steps/step-1-app-selection.tsx`
- `src/components/wizard/steps/step-2-project-info.tsx`

**Implementation**:

```typescript
// Loading state
{repoFetch.isLoading && (
  <div className="flex items-center gap-2 text-muted-foreground">
    <Loader2 className="w-4 h-4 animate-spin" />
    <span>Loading SDK info...</span>
  </div>
)}

// Error state
{repoFetch.error && (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Failed to load SDK info: {repoFetch.error}
      <Button variant="link" onClick={() => fetchSDKInfo(selectedApp)}>
        Retry
      </Button>
    </AlertDescription>
  </Alert>
)}
```

**Steps**:
1. Add loading spinner to Step 1 after selection
2. Add error alert with retry button
3. Disable "Next" button while loading
4. Show cached SDK info if available

**Command**: `/implement loading-error-states`

---

### Task 10: SDK Info Caching

**Gap**: SDK info fetched on every app selection
**Impact**: Unnecessary API calls, slow UX
**Priority**: P2

**Files to Modify**:
- `src/store/wizard-store.ts`
- `src/lib/services/github-api.ts`

**Implementation**:

```typescript
// In store - cache by app type
sdkInfoCache: Record<AppType, { info: SDKInfo; timestamp: number }>;

// Check cache before fetch
fetchSDKInfo: async (appType: AppType) => {
  const cached = get().sdkInfoCache[appType];
  const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    set({ repoFetch: { ...get().repoFetch, sdkInfo: cached.info } });
    return;
  }

  // ... fetch from API
}
```

**Steps**:
1. Add `sdkInfoCache` to store state
2. Check cache before API call
3. Set TTL for cache entries (5 minutes)
4. Persist cache to localStorage

**Command**: `/implement sdk-caching`

---

## Dependencies Graph

```
┌─────────────────────────────────────────────────────────────┐
│                     v2-foundation                            │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
   ┌──────────┐        ┌──────────┐        ┌──────────┐
   │  Task 1  │        │  Task 2  │        │  Task 4  │
   │ RepoConfig│        │ SDKInfo  │        │ TOML     │
   │  Types   │        │  Types   │        │ Parser   │
   └────┬─────┘        └────┬─────┘        └────┬─────┘
        │                   │                   │
        └───────────┬───────┴───────────────────┘
                    ▼
             ┌──────────┐
             │  Task 3  │
             │ GitHub   │
             │ API Svc  │
             └────┬─────┘
                  │
                  ▼
             ┌──────────┐
             │  Task 5  │
             │ Store    │
             │ Integr.  │
             └────┬─────┘
                  │
      ┌───────────┼───────────┐
      ▼           ▼           ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│  Task 6  │ │  Task 7  │ │  Task 8  │
│ Step 1   │ │ Step 2   │ │ Auto     │
│ Trigger  │ │ Read-Only│ │ Version  │
└────┬─────┘ └────┬─────┘ └──────────┘
     │            │
     └─────┬──────┘
           ▼
     ┌──────────┐
     │  Task 9  │
     │ Loading/ │
     │ Error UI │
     └────┬─────┘
          │
          ▼
     ┌──────────┐
     │ Task 10  │
     │ Caching  │
     └──────────┘
```

---

## Recommended Implementation Order

```
1. Task 1: RepoConfig Types
   Why: Foundation types needed by all other tasks
   Command: /implement repo-config-types

2. Task 2: SDKInfo Types
   Why: Types for SDK data structure
   Command: /implement sdk-info-types

3. Task 4: TOML Parser
   Why: Parse logic before API service
   Command: /implement toml-parser

4. Task 3: GitHub API Service
   Why: Depends on types and parser
   Command: /implement github-api-service

5. Task 5: Store Integration
   Why: Central state management
   Command: /implement store-sdk-integration

6. Task 6: Step 1 Trigger
   Why: Connect UI to store
   Command: /implement step-1-sdk-fetch

7. Task 7: Step 2 Read-Only SDK
   Why: Display fetched SDK info
   Command: /implement step-2-readonly-sdk

8. Task 8: Auto Version
   Why: Simplify version management
   Command: /implement step-2-auto-version

9. Task 9: Loading/Error States
   Why: Polish UX
   Command: /implement loading-error-states

10. Task 10: SDK Caching
    Why: Performance optimization
    Command: /implement sdk-caching
```

---

## Quick Wins (< 30 min each)

| Task | Command | Impact |
|------|---------|--------|
| RepoConfig Types | `/implement repo-config-types` | Unblocks all other tasks |
| SDKInfo Types | `/implement sdk-info-types` | Unblocks store & UI |
| Auto Version | `/implement step-2-auto-version` | Simplifies Step 2 |
| TOML Parser | `/implement toml-parser` | Simple utility function |

---

## Files to Create

| File | Purpose |
|------|---------|
| `src/lib/services/github-api.ts` | GitHub API client |
| `src/lib/utils/toml-parser.ts` | TOML parsing utility |

## Files to Modify

| File | Changes |
|------|---------|
| `src/types/wizard.ts` | Add RepoConfig, SDKInfo, RepoFetchState |
| `src/store/wizard-store.ts` | Add repoFetch state, actions, hooks |
| `src/components/wizard/steps/step-1-app-selection.tsx` | Trigger SDK fetch |
| `src/components/wizard/steps/step-2-project-info.tsx` | Read-only SDK, auto version |

---

## Validation Checklist

After implementation, verify:

- [ ] Selecting app in Step 1 triggers SDK fetch
- [ ] SDK info displays as read-only badges in Step 2
- [ ] Loading state shows during fetch
- [ ] Error state shows with retry option
- [ ] Version is auto-generated (no input fields)
- [ ] SDK info cached for 5 minutes
- [ ] Changing app selection fetches new SDK info
- [ ] Store persists SDK info across page reloads

---

## Start Here

**Recommended First Action**:
```
/implement repo-config-types
```

**Reason**: This creates the foundational types (RepoConfig, APP_REPOSITORIES) that all other tasks depend on. It's a quick win that unblocks the entire v2-foundation sprint.

---

## Next Sprint Preview

After v2-foundation is complete, proceed to:

| Sprint | Focus | First Task |
|--------|-------|------------|
| Sprint 2 | File Generators | `/implement gradle-generator` |
| Sprint 3 | Step 8 iOS Config | `/implement step-8-ios-config` |
| Sprint 4 | Build System | `/implement github-workflow-trigger` |
