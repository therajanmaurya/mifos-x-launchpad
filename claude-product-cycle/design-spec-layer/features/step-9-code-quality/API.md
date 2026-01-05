# Step 9: Code Quality - API Reference

```typescript
interface Step9State {
  testing: TestingConfig;
  linting: LintingConfig;
  hooks: HooksConfig;
  coverage: CoverageConfig;
}

interface TestingConfig {
  unitTests: boolean;
  uiTests: boolean;
  screenshotTests: boolean;
  maestro: boolean;
}

interface LintingConfig {
  detekt: boolean;
  ktlint: boolean;
  spotless: boolean;
}

interface HooksConfig {
  preCommit: boolean;
  husky: boolean;
  conventionalCommits: boolean;
}

interface CoverageConfig {
  enabled: boolean;
  minimumPercent: number;
  failOnDecrease: boolean;
}

interface Step9Actions {
  toggleTestingOption: (option: keyof TestingConfig) => void;
  toggleLintingOption: (option: keyof LintingConfig) => void;
  toggleHooksOption: (option: keyof HooksConfig) => void;
  setCoverageMinimum: (percent: number) => void;
}
```
