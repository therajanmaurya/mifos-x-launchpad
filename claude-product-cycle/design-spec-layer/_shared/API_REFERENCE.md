# API Reference

> TypeScript interfaces and API documentation for MifosLaunchpad

## Core Types

### WizardState

Complete wizard state interface:

```typescript
interface WizardState {
  currentStep: number;
  step1: Step1State;
  step2: Step2State;
  step3: Step3State;
  step4: Step4State;
  step5: Step5State;
  step6: Step6State;
  step7: Step7State;
  step8: Step8State;
  step9: Step9State;
  step10: Step10State;
}
```

### WizardActions

Store actions:

```typescript
interface WizardActions {
  // Navigation
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;

  // Step updates
  updateStep1: (data: Partial<Step1State>) => void;
  updateStep2: (data: Partial<Step2State>) => void;
  updateStep3: (data: Partial<Step3State>) => void;
  updateStep4: (data: Partial<Step4State>) => void;
  updateStep5: (data: Partial<Step5State>) => void;
  updateStep6: (data: Partial<Step6State>) => void;
  updateStep7: (data: Partial<Step7State>) => void;
  updateStep8: (data: Partial<Step8State>) => void;
  updateStep9: (data: Partial<Step9State>) => void;
  updateStep10: (data: Partial<Step10State>) => void;

  // Reset
  resetWizard: () => void;
  resetStep: (step: number) => void;

  // Import/Export
  exportConfig: () => WizardConfig;
  importConfig: (config: WizardConfig) => void;
}
```

---

## Step Interfaces

### Step 1: App Selection

```typescript
interface Step1State {
  selectedApp: AppType | null;
  appFeatures: string[];
}

type AppType = 'mobile-wallet' | 'mifos-mobile' | 'android-client' | 'blank';

interface AppOption {
  id: AppType;
  name: string;
  description: string;
  features: string[];
  repoUrl: string;
  previewImage?: string;
}
```

### Step 2: Project Info

```typescript
interface Step2State {
  organizationName: string;
  projectName: string;
  packageName: string;
  applicationId: string;
  versionName: string;
  versionCode: number;
  description: string;
  minAndroidSdk: number;
  minIosSdk: string;
}
```

### Step 3: Branding & Theme

```typescript
interface Step3State {
  colors: ColorPalette;
  darkModeEnabled: boolean;
  darkColors: ColorPalette;
  selectedPreset: string | null;
}

interface ColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  error: string;
  onPrimary: string;
  onSecondary: string;
  onBackground: string;
  onSurface: string;
}

interface ThemePreset {
  id: string;
  name: string;
  colors: ColorPalette;
  darkColors: ColorPalette;
}
```

### Step 4: App Icons

```typescript
interface Step4State {
  iconFile: File | null;
  iconDataUrl: string | null;
  backgroundColor: string;
  iconShape: IconShape;
  generatedIcons: GeneratedIcons;
}

type IconShape = 'circle' | 'rounded' | 'squircle' | 'square';

interface GeneratedIcons {
  android: Record<string, string>;
  ios: Record<string, string>;
  web: Record<string, string>;
}

interface IconSize {
  name: string;
  size: number;
  platform: 'android' | 'ios' | 'web';
  path: string;
}
```

### Step 5: Server Config

```typescript
interface Step5State {
  environments: Record<string, EnvironmentConfig>;
  connectionTimeout: number;
  readTimeout: number;
  certificatePinning: boolean;
  offlineMode: boolean;
}

interface EnvironmentConfig {
  name: string;
  protocol: 'https' | 'http';
  baseUrl: string;
  apiPath: string;
  port: number;
  tenantId: string;
  isDefault?: boolean;
}
```

### Step 6: Platform Selection

```typescript
interface Step6State {
  platforms: PlatformConfig;
}

interface PlatformConfig {
  android: AndroidConfig;
  ios: IosConfig;
  desktop: DesktopConfig;
  web: WebConfig;
}

interface AndroidConfig {
  enabled: boolean;
  proguard: boolean;
  appBundle: boolean;
  abiSplits: boolean;
}

interface IosConfig {
  enabled: boolean;
  teamId: string;
  supportedDevices: string[];
}

interface DesktopConfig {
  enabled: boolean;
  windows: boolean;
  macos: boolean;
  linux: boolean;
}

interface WebConfig {
  enabled: boolean;
  pwa: boolean;
  serviceWorkerStrategy: ServiceWorkerStrategy;
}

type ServiceWorkerStrategy = 'network-first' | 'cache-first' | 'stale-while-revalidate';
```

### Step 7: Features & Security

```typescript
interface Step7State {
  analytics: AnalyticsConfig;
  pushNotifications: PushConfig;
  security: SecurityConfig;
  socialLogin: SocialLoginConfig;
  twoFactorAuth: boolean;
}

interface AnalyticsConfig {
  firebase: boolean;
  sentry: boolean;
  mixpanel: boolean;
  customEndpoint: string | null;
}

interface PushConfig {
  fcm: boolean;
  oneSignal: boolean;
}

interface SecurityConfig {
  biometric: boolean;
  pinAuth: boolean;
  rootDetection: boolean;
  screenshotPrevention: boolean;
  secureStorage: boolean;
  sessionTimeout: number;
  sslPinning: boolean;
}

interface SocialLoginConfig {
  google: boolean;
  apple: boolean;
  facebook: boolean;
}
```

### Step 8: CI/CD & Deployment

```typescript
interface Step8State {
  ciPlatform: CIPlatform;
  firebase: FirebaseConfig;
  playStore: PlayStoreConfig;
  appStore: AppStoreConfig;
  releaseAutomation: ReleaseConfig;
}

type CIPlatform = 'github-actions' | 'gitlab-ci' | 'bitrise' | 'codemagic';

interface FirebaseConfig {
  enabled: boolean;
  androidAppId: string;
  iosAppId: string;
  testerGroups: string[];
}

interface PlayStoreConfig {
  enabled: boolean;
  track: PlayStoreTrack;
  autoPromotion: boolean;
}

type PlayStoreTrack = 'internal' | 'alpha' | 'beta' | 'production';

interface AppStoreConfig {
  enabled: boolean;
  testFlight: boolean;
  autoSubmit: boolean;
}

interface ReleaseConfig {
  versionBumping: boolean;
  changelogGeneration: boolean;
  githubRelease: boolean;
}
```

### Step 9: Code Quality

```typescript
interface Step9State {
  testing: TestingConfig;
  linting: LintingConfig;
  hooks: HooksConfig;
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
}

interface HooksConfig {
  preCommit: boolean;
  husky: boolean;
  conventionalCommits: boolean;
}
```

### Step 10: Review & Generate

```typescript
interface Step10State {
  isGenerating: boolean;
  generationProgress: number;
  downloadUrl: string | null;
  configJson: string;
  shareUrl: string | null;
}
```

---

## Generator Types

### GeneratorConfig

```typescript
interface GeneratorConfig {
  wizard: WizardState;
  outputFormat: 'zip' | 'github';
  includeReadme: boolean;
}
```

### GeneratedFile

```typescript
interface GeneratedFile {
  path: string;
  content: string | Blob;
  type: 'text' | 'binary';
}

interface GeneratedProject {
  files: GeneratedFile[];
  totalSize: number;
}
```

---

## Utility Types

### ValidationResult

```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
}
```

### StepValidation

```typescript
interface StepValidation {
  step: number;
  isValid: boolean;
  errors: ValidationError[];
  canProceed: boolean;
}
```
