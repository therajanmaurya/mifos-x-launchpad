# Template Command

Create generation templates for the MifosLaunchpad wizard output.

**Template Type**: $ARGUMENTS

## Instructions

### If no template type provided:
Show available template types:

```
Available Template Types:
- android-manifest - Android manifest.xml template
- build-gradle - Gradle build file template
- github-actions - GitHub Actions workflow template
- theme-kt - Kotlin theme file template
- colors-xml - Android colors.xml template
- strings-xml - Android strings.xml template
- app-config - Application configuration template
- readme - README.md template
```

### If template type provided:

1. **Read Template Context**
   - Read `claude-product-cycle/PRODUCT_MAP.md`
   - Check existing templates in `src/lib/generators/`

2. **Create Template File**

Create template in appropriate location:

```typescript
// src/lib/generators/[template-name].ts

import { WizardState } from '@/types/wizard';

export interface [TemplateName]Options {
  // Options extracted from wizard state
}

export function generate[TemplateName](state: WizardState): string {
  const {
    step1,  // App selection
    step2,  // Project info
    step3,  // Branding
    // ... other steps
  } = state;

  return `
// Generated template content
// Use template literals with state values
  `.trim();
}
```

3. **Create Test Cases**

If tests exist, add test cases:

```typescript
// __tests__/generators/[template-name].test.ts

import { generate[TemplateName] } from '@/lib/generators/[template-name]';

describe('[TemplateName] Generator', () => {
  it('should generate valid output', () => {
    const state = createMockWizardState();
    const result = generate[TemplateName](state);
    expect(result).toContain('expected content');
  });
});
```

4. **Update Registry**

Update the generators index:

```typescript
// src/lib/generators/index.ts

export { generate[TemplateName] } from './[template-name]';
```

## Template Patterns

### Android Manifest Template
```typescript
export function generateAndroidManifest(state: WizardState): string {
  const { applicationId, appName } = state.step2;

  return `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="${applicationId}">

    <application
        android:label="${appName}"
        android:icon="@mipmap/ic_launcher">
        <!-- Activities -->
    </application>
</manifest>`;
}
```

### GitHub Actions Template
```typescript
export function generateGitHubActions(state: WizardState): string {
  const { projectName } = state.step2;
  const { enableCI } = state.step8;

  if (!enableCI) return '';

  return `name: ${projectName} CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      # ... build steps
`;
}
```

## Model Recommendation
Use **Sonnet** for template creation.
