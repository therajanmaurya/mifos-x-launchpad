/**
 * MifosLaunchpad Wizard Types
 * Type definitions for the project configuration wizard
 */

// ============================================
// Step 1: App Selection Types
// ============================================

/**
 * Available base application types
 */
export type AppType = 'mobile-wallet' | 'mifos-mobile' | 'android-client' | 'blank';

/**
 * Application maintenance status
 */
export type AppStatus = 'active' | 'maintained' | 'community' | 'deprecated';

/**
 * Supported target platforms
 */
export type Platform = 'android' | 'ios' | 'desktop' | 'web';

/**
 * Represents a selectable application option
 */
export interface AppOption {
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
}

/**
 * State for Step 1: App Selection
 */
export interface Step1State {
  /** Currently selected application (null if none) */
  selectedApp: AppType | null;
  /** Features included with selected app */
  appFeatures: string[];
}

// ============================================
// Step 2: Project Info Types
// ============================================

/**
 * Hex color string (e.g., "#2563eb")
 */
export type HexColor = `#${string}`;

/**
 * Color role in theme
 */
export type ColorRole =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'background'
  | 'surface'
  | 'error'
  | 'success'
  | 'warning'
  | 'onPrimary'
  | 'onSecondary'
  | 'onBackground'
  | 'onSurface';

/**
 * State for Step 2: Project Information
 */
export interface Step2State {
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
  applicationId: string;

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
export const step2InitialState: Step2State = {
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

// ============================================
// Step 3: Branding & Theme Types
// ============================================

/**
 * Theme color palette
 */
export interface ColorPalette {
  primary: HexColor;
  secondary: HexColor;
  accent: HexColor;
  background: HexColor;
  surface: HexColor;
  error: HexColor;
  success: HexColor;
  warning: HexColor;
  onPrimary: HexColor;
  onSecondary: HexColor;
  onBackground: HexColor;
  onSurface: HexColor;
}

/**
 * Pre-configured theme preset
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  colors: ColorPalette;
}

/**
 * State for Step 3: Branding & Theme
 */
export interface Step3State {
  /** Light mode colors */
  colors: ColorPalette;
  /** Dark mode enabled */
  darkModeEnabled: boolean;
  /** Dark mode colors */
  darkColors: ColorPalette;
  /** Selected preset ID (null if custom) */
  selectedPreset: string | null;
  /** Current preview mode */
  previewMode: 'light' | 'dark';
}

// ============================================
// Step 4: App Icons Types
// ============================================

/**
 * Icon shape options
 */
export type IconShape = 'circle' | 'rounded' | 'squircle' | 'square';

/**
 * Generated icons for each platform
 */
export interface GeneratedIcons {
  android: Record<string, string>;
  ios: Record<string, string>;
  web: Record<string, string>;
}

/**
 * State for Step 4: App Icons
 */
export interface Step4State {
  /** Original icon data URL (base64) */
  iconDataUrl: string | null;
  /** Background color for icon */
  backgroundColor: HexColor;
  /** Icon shape */
  iconShape: IconShape;
  /** Generated icons for each platform */
  generatedIcons: GeneratedIcons;
  /** Whether icons have been generated */
  iconsGenerated: boolean;
}

// ============================================
// Step 5: Server Configuration Types
// ============================================

/**
 * Protocol type for server connections
 */
export type Protocol = 'https' | 'http';

/**
 * Environment type
 */
export type EnvironmentType = 'development' | 'staging' | 'production';

/**
 * Server environment configuration
 */
export interface ServerEnvironment {
  name: string;
  protocol: Protocol;
  baseUrl: string;
  apiPath: string;
  port: number;
  tenantId: string;
  enabled: boolean;
}

/**
 * Connection test result
 */
export interface ConnectionResult {
  success: boolean;
  responseTime?: number;
  error?: string;
  timestamp?: number;
}

/**
 * State for Step 5: Server Configuration
 */
export interface Step5State {
  environments: Record<EnvironmentType, ServerEnvironment>;
  connectionTimeout: number;
  readTimeout: number;
  certificatePinning: boolean;
  offlineMode: boolean;
  testResults: Record<EnvironmentType, ConnectionResult | null>;
}

// ============================================
// Step 6: Platform Selection Types
// ============================================

/**
 * Android ABI options
 */
export type AndroidAbi = 'arm64-v8a' | 'armeabi-v7a' | 'x86_64';

/**
 * iOS device types
 */
export type IOSDevice = 'iphone' | 'ipad';

/**
 * Service worker caching strategy
 */
export type ServiceWorkerStrategy = 'stale-while-revalidate' | 'network-first' | 'cache-first';

/**
 * Android platform configuration
 */
export interface AndroidConfig {
  enabled: boolean;
  proguard: boolean;
  appBundle: boolean;
  abiSplits: AndroidAbi[];
}

/**
 * iOS platform configuration
 */
export interface IOSConfig {
  enabled: boolean;
  teamId: string;
  supportedDevices: IOSDevice[];
  deploymentTarget: string;
}

/**
 * Desktop platform configuration
 */
export interface DesktopConfig {
  enabled: boolean;
  windows: boolean;
  macos: boolean;
  linux: boolean;
}

/**
 * Web platform configuration
 */
export interface WebConfig {
  enabled: boolean;
  pwa: boolean;
  serviceWorkerStrategy: ServiceWorkerStrategy;
}

/**
 * Complete platform configuration
 */
export interface PlatformConfig {
  android: AndroidConfig;
  ios: IOSConfig;
  desktop: DesktopConfig;
  web: WebConfig;
}

/**
 * State for Step 6: Platform Selection
 */
export interface Step6State {
  platforms: PlatformConfig;
}

// ============================================
// Step 7: Features & Security Types
// ============================================

/**
 * Analytics provider configuration
 */
export interface AnalyticsConfig {
  firebase: boolean;
  sentry: boolean;
  mixpanel: boolean;
  customEndpoint: string;
}

/**
 * Push notification provider configuration
 */
export interface PushConfig {
  fcm: boolean;
  oneSignal: boolean;
}

/**
 * Security features configuration
 */
export interface SecurityConfig {
  biometric: boolean;
  pinAuth: boolean;
  rootDetection: boolean;
  screenshotPrevention: boolean;
  secureStorage: boolean;
  sessionTimeout: number; // in minutes
  sslPinning: boolean;
}

/**
 * Social login provider configuration
 */
export interface SocialLoginConfig {
  google: boolean;
  apple: boolean;
  facebook: boolean;
}

/**
 * State for Step 7: Features & Security
 */
export interface Step7State {
  analytics: AnalyticsConfig;
  pushNotifications: PushConfig;
  security: SecurityConfig;
  socialLogin: SocialLoginConfig;
  twoFactorAuth: boolean;
}

// ============================================
// Step 8: CI/CD & Deployment Types
// ============================================

/**
 * CI/CD platform options
 */
export type CIPlatform = 'github-actions' | 'gitlab-ci' | 'bitrise' | 'codemagic';

/**
 * Play Store release track
 */
export type PlayStoreTrack = 'internal' | 'alpha' | 'beta' | 'production';

/**
 * Firebase App Distribution configuration
 */
export interface FirebaseDistributionConfig {
  enabled: boolean;
  androidAppId: string;
  iosAppId: string;
  testerGroups: string[];
}

/**
 * Play Store deployment configuration
 */
export interface PlayStoreConfig {
  enabled: boolean;
  track: PlayStoreTrack;
  autoPromotion: boolean;
  rolloutPercentage: number;
}

/**
 * App Store deployment configuration
 */
export interface AppStoreConfig {
  enabled: boolean;
  testFlight: boolean;
  autoSubmit: boolean;
  phasedRelease: boolean;
}

/**
 * Release automation configuration
 */
export interface ReleaseAutomationConfig {
  versionBumping: boolean;
  changelogGeneration: boolean;
  githubRelease: boolean;
}

/**
 * State for Step 8: CI/CD & Deployment
 */
export interface Step8State {
  ciPlatform: CIPlatform;
  firebase: FirebaseDistributionConfig;
  playStore: PlayStoreConfig;
  appStore: AppStoreConfig;
  releaseAutomation: ReleaseAutomationConfig;
}

// ============================================
// Step 9: Code Quality Types
// ============================================

/**
 * Testing framework configuration
 */
export interface TestingConfig {
  unitTests: boolean;
  uiTests: boolean;
  screenshotTests: boolean;
  maestro: boolean;
}

/**
 * Linting tools configuration
 */
export interface LintingConfig {
  detekt: boolean;
  ktlint: boolean;
  spotless: boolean;
}

/**
 * Git hooks configuration
 */
export interface HooksConfig {
  preCommit: boolean;
  husky: boolean;
  conventionalCommits: boolean;
}

/**
 * Code coverage configuration
 */
export interface CoverageConfig {
  enabled: boolean;
  minimumPercent: number;
  failOnDecrease: boolean;
}

/**
 * State for Step 9: Code Quality
 */
export interface Step9State {
  testing: TestingConfig;
  linting: LintingConfig;
  hooks: HooksConfig;
  coverage: CoverageConfig;
}

// ============================================
// Step 10: Review & Generate Types
// ============================================

/**
 * Generation stage during project creation
 */
export type GenerationStage =
  | 'idle'
  | 'validating'
  | 'generating-gradle'
  | 'generating-theme'
  | 'processing-icons'
  | 'generating-config'
  | 'generating-cicd'
  | 'creating-zip'
  | 'complete'
  | 'error';

/**
 * Progress information during generation
 */
export interface GenerationProgress {
  stage: GenerationStage;
  step: number;
  total: number;
  message: string;
}

/**
 * File in the generated project tree
 */
export interface GeneratedFile {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  children?: GeneratedFile[];
}

/**
 * State for Step 10: Review & Generate
 */
export interface Step10State {
  isGenerating: boolean;
  generationProgress: GenerationProgress;
  downloadUrl: string | null;
  downloadFileName: string | null;
  downloadSize: number | null;
  error: string | null;
}

// ============================================
// Wizard State Types
// ============================================

/**
 * Complete wizard state combining all steps
 */
export interface WizardState {
  /** Current step number (1-10) */
  currentStep: number;
  /** Maximum step reached (for navigation limits) */
  maxStepReached: number;
  /** Step 1: App Selection */
  step1: Step1State;
  /** Step 2: Project Info */
  step2: Step2State;
  /** Step 3: Branding & Theme */
  step3: Step3State;
  /** Step 4: App Icons */
  step4: Step4State;
  /** Step 5: Server Configuration */
  step5: Step5State;
  /** Step 6: Platform Selection */
  step6: Step6State;
  /** Step 7: Features & Security */
  step7: Step7State;
  /** Step 8: CI/CD & Deployment */
  step8: Step8State;
  /** Step 9: Code Quality */
  step9: Step9State;
  /** Step 10: Review & Generate */
  step10: Step10State;
}

/**
 * Wizard navigation actions
 */
export interface WizardNavigationActions {
  /** Set current step directly */
  setCurrentStep: (step: number) => void;
  /** Navigate to next step */
  nextStep: () => void;
  /** Navigate to previous step */
  previousStep: () => void;
  /** Check if can navigate to step */
  canNavigateToStep: (step: number) => boolean;
}

/**
 * Step 1 actions
 */
export interface Step1Actions {
  /** Select a base application */
  selectApp: (app: AppType) => void;
  /** Clear current selection */
  clearSelection: () => void;
  /** Update selected app features */
  setAppFeatures: (features: string[]) => void;
}

/**
 * Step 2 actions
 */
export interface Step2Actions {
  /** Update Step 2 state with partial data */
  updateStep2: (data: Partial<Step2State>) => void;
  /** Reset Step 2 to initial state */
  resetStep2: () => void;
}

/**
 * Step 3 actions
 */
export interface Step3Actions {
  /** Update a single color */
  updateColor: (role: ColorRole, value: HexColor, mode?: 'light' | 'dark') => void;
  /** Apply a theme preset */
  applyPreset: (presetId: string) => void;
  /** Toggle dark mode support */
  toggleDarkMode: (enabled: boolean) => void;
  /** Auto-generate dark mode colors from light colors */
  generateDarkColors: () => void;
  /** Set preview mode */
  setPreviewMode: (mode: 'light' | 'dark') => void;
  /** Reset colors to default */
  resetColors: () => void;
}

/**
 * Step 4 actions
 */
export interface Step4Actions {
  /** Set icon from data URL */
  setIconDataUrl: (dataUrl: string | null) => void;
  /** Set background color for icon */
  setIconBackgroundColor: (color: HexColor) => void;
  /** Set icon shape */
  setIconShape: (shape: IconShape) => void;
  /** Set generated icons */
  setGeneratedIcons: (icons: GeneratedIcons) => void;
  /** Reset Step 4 to initial state */
  resetIcons: () => void;
}

/**
 * Step 5 actions
 */
export interface Step5Actions {
  /** Update an environment configuration */
  updateEnvironment: (env: EnvironmentType, data: Partial<ServerEnvironment>) => void;
  /** Set connection timeout */
  setConnectionTimeout: (timeout: number) => void;
  /** Set read timeout */
  setReadTimeout: (timeout: number) => void;
  /** Toggle certificate pinning */
  setCertificatePinning: (enabled: boolean) => void;
  /** Toggle offline mode */
  setOfflineMode: (enabled: boolean) => void;
  /** Set connection test result */
  setTestResult: (env: EnvironmentType, result: ConnectionResult | null) => void;
  /** Reset Step 5 to initial state */
  resetServerConfig: () => void;
}

/**
 * Step 6 actions
 */
export interface Step6Actions {
  /** Toggle a platform on/off */
  togglePlatform: (platform: keyof PlatformConfig, enabled: boolean) => void;
  /** Update Android configuration */
  updateAndroidConfig: (config: Partial<AndroidConfig>) => void;
  /** Update iOS configuration */
  updateIOSConfig: (config: Partial<IOSConfig>) => void;
  /** Update Desktop configuration */
  updateDesktopConfig: (config: Partial<DesktopConfig>) => void;
  /** Update Web configuration */
  updateWebConfig: (config: Partial<WebConfig>) => void;
  /** Reset Step 6 to initial state */
  resetPlatforms: () => void;
}

/**
 * Step 7 actions
 */
export interface Step7Actions {
  /** Update analytics configuration */
  updateAnalyticsConfig: (config: Partial<AnalyticsConfig>) => void;
  /** Update push notifications configuration */
  updatePushConfig: (config: Partial<PushConfig>) => void;
  /** Update security configuration */
  updateSecurityConfig: (config: Partial<SecurityConfig>) => void;
  /** Update social login configuration */
  updateSocialLoginConfig: (config: Partial<SocialLoginConfig>) => void;
  /** Toggle two-factor authentication */
  setTwoFactorAuth: (enabled: boolean) => void;
  /** Reset Step 7 to initial state */
  resetFeaturesAndSecurity: () => void;
}

/**
 * Step 8 actions
 */
export interface Step8Actions {
  /** Set CI/CD platform */
  setCIPlatform: (platform: CIPlatform) => void;
  /** Update Firebase App Distribution configuration */
  updateFirebaseConfig: (config: Partial<FirebaseDistributionConfig>) => void;
  /** Update Play Store configuration */
  updatePlayStoreConfig: (config: Partial<PlayStoreConfig>) => void;
  /** Update App Store configuration */
  updateAppStoreConfig: (config: Partial<AppStoreConfig>) => void;
  /** Update release automation configuration */
  updateReleaseAutomation: (config: Partial<ReleaseAutomationConfig>) => void;
  /** Reset Step 8 to initial state */
  resetCICD: () => void;
}

/**
 * Step 9 actions
 */
export interface Step9Actions {
  /** Update testing configuration */
  updateTestingConfig: (config: Partial<TestingConfig>) => void;
  /** Update linting configuration */
  updateLintingConfig: (config: Partial<LintingConfig>) => void;
  /** Update hooks configuration */
  updateHooksConfig: (config: Partial<HooksConfig>) => void;
  /** Update coverage configuration */
  updateCoverageConfig: (config: Partial<CoverageConfig>) => void;
  /** Reset Step 9 to initial state */
  resetCodeQuality: () => void;
}

/**
 * Step 10 actions
 */
export interface Step10Actions {
  /** Start project generation */
  startGeneration: () => void;
  /** Update generation progress */
  setGenerationProgress: (progress: GenerationProgress) => void;
  /** Set download ready */
  setDownloadReady: (url: string, fileName: string, size: number) => void;
  /** Set generation error */
  setGenerationError: (error: string) => void;
  /** Reset generation state */
  resetGeneration: () => void;
  /** Export configuration as JSON */
  exportConfig: () => string;
  /** Import configuration from JSON */
  importConfig: (json: string) => boolean;
}

/**
 * Wizard actions combining all step actions
 */
export interface WizardActions extends WizardNavigationActions, Step1Actions, Step2Actions, Step3Actions, Step4Actions, Step5Actions, Step6Actions, Step7Actions, Step8Actions, Step9Actions, Step10Actions {
  /** Reset entire wizard to initial state */
  resetWizard: () => void;
}

/**
 * Complete wizard store type
 */
export type WizardStore = WizardState & WizardActions;

// ============================================
// Validation Types
// ============================================

/**
 * Validation result type
 */
export interface ValidationResult {
  success: boolean;
  errors: Record<string, string>;
}

/**
 * Step validation function type
 */
export type StepValidator<T> = (data: T) => ValidationResult;

// ============================================
// Constants
// ============================================

/**
 * All available app options
 */
export const APP_OPTIONS: AppOption[] = [
  {
    id: 'mobile-wallet',
    name: 'Mobile Wallet',
    description: 'Digital wallet for peer-to-peer transfers, payments, and savings management',
    icon: 'wallet',
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
    icon: 'smartphone',
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
    icon: 'users',
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
    icon: 'file',
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
export const APP_STATUS_LABELS: Record<AppStatus, string> = {
  active: 'Actively Maintained',
  maintained: 'Maintained',
  community: 'Community Supported',
  deprecated: 'Deprecated'
};

/**
 * Platform display names
 */
export const PLATFORM_LABELS: Record<Platform, string> = {
  android: 'Android',
  ios: 'iOS',
  desktop: 'Desktop',
  web: 'Web'
};

/**
 * Total number of steps in the wizard
 */
export const TOTAL_STEPS = 10;

/**
 * Android SDK versions with names
 */
export const ANDROID_SDK_VERSIONS = [
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
export const IOS_VERSIONS = [
  { value: '13.0', name: 'iOS 13.0' },
  { value: '14.0', name: 'iOS 14.0' },
  { value: '15.0', name: 'iOS 15.0' },
  { value: '16.0', name: 'iOS 16.0' },
  { value: '17.0', name: 'iOS 17.0' },
];

/**
 * Theme presets for Step 3
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Professional blue theme',
    colors: {
      primary: '#2563eb' as HexColor,
      secondary: '#64748b' as HexColor,
      accent: '#06b6d4' as HexColor,
      background: '#ffffff' as HexColor,
      surface: '#f8fafc' as HexColor,
      error: '#ef4444' as HexColor,
      success: '#22c55e' as HexColor,
      warning: '#f59e0b' as HexColor,
      onPrimary: '#ffffff' as HexColor,
      onSecondary: '#ffffff' as HexColor,
      onBackground: '#0f172a' as HexColor,
      onSurface: '#0f172a' as HexColor,
    },
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    description: 'Nature-inspired green theme',
    colors: {
      primary: '#059669' as HexColor,
      secondary: '#6b7280' as HexColor,
      accent: '#14b8a6' as HexColor,
      background: '#ffffff' as HexColor,
      surface: '#f0fdf4' as HexColor,
      error: '#dc2626' as HexColor,
      success: '#16a34a' as HexColor,
      warning: '#d97706' as HexColor,
      onPrimary: '#ffffff' as HexColor,
      onSecondary: '#ffffff' as HexColor,
      onBackground: '#052e16' as HexColor,
      onSurface: '#052e16' as HexColor,
    },
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Elegant purple theme',
    colors: {
      primary: '#7c3aed' as HexColor,
      secondary: '#6b7280' as HexColor,
      accent: '#ec4899' as HexColor,
      background: '#ffffff' as HexColor,
      surface: '#faf5ff' as HexColor,
      error: '#dc2626' as HexColor,
      success: '#22c55e' as HexColor,
      warning: '#f59e0b' as HexColor,
      onPrimary: '#ffffff' as HexColor,
      onSecondary: '#ffffff' as HexColor,
      onBackground: '#1e1b4b' as HexColor,
      onSurface: '#1e1b4b' as HexColor,
    },
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm orange theme',
    colors: {
      primary: '#ea580c' as HexColor,
      secondary: '#78716c' as HexColor,
      accent: '#f59e0b' as HexColor,
      background: '#ffffff' as HexColor,
      surface: '#fff7ed' as HexColor,
      error: '#dc2626' as HexColor,
      success: '#16a34a' as HexColor,
      warning: '#ca8a04' as HexColor,
      onPrimary: '#ffffff' as HexColor,
      onSecondary: '#ffffff' as HexColor,
      onBackground: '#431407' as HexColor,
      onSurface: '#431407' as HexColor,
    },
  },
  {
    id: 'mifos-teal',
    name: 'Mifos Teal',
    description: 'Official Mifos branding',
    colors: {
      primary: '#0d9488' as HexColor,
      secondary: '#64748b' as HexColor,
      accent: '#2563eb' as HexColor,
      background: '#ffffff' as HexColor,
      surface: '#f0fdfa' as HexColor,
      error: '#ef4444' as HexColor,
      success: '#22c55e' as HexColor,
      warning: '#f59e0b' as HexColor,
      onPrimary: '#ffffff' as HexColor,
      onSecondary: '#ffffff' as HexColor,
      onBackground: '#134e4a' as HexColor,
      onSurface: '#134e4a' as HexColor,
    },
  },
];

/**
 * Default dark colors (used for generating dark mode palette)
 */
export const DEFAULT_DARK_COLORS: ColorPalette = {
  primary: '#3b82f6' as HexColor,
  secondary: '#94a3b8' as HexColor,
  accent: '#22d3ee' as HexColor,
  background: '#0f172a' as HexColor,
  surface: '#1e293b' as HexColor,
  error: '#f87171' as HexColor,
  success: '#4ade80' as HexColor,
  warning: '#fbbf24' as HexColor,
  onPrimary: '#ffffff' as HexColor,
  onSecondary: '#ffffff' as HexColor,
  onBackground: '#f8fafc' as HexColor,
  onSurface: '#e2e8f0' as HexColor,
};

/**
 * Initial state for Step 3
 */
export const step3InitialState: Step3State = {
  colors: THEME_PRESETS[0].colors,
  darkModeEnabled: false,
  darkColors: DEFAULT_DARK_COLORS,
  selectedPreset: 'ocean-blue',
  previewMode: 'light',
};

/**
 * Android icon sizes (mipmap densities)
 */
export const ANDROID_ICON_SIZES: Record<string, number> = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

/**
 * iOS icon sizes with scales
 */
export const IOS_ICON_SIZES: Array<{ size: number; scales: number[] }> = [
  { size: 20, scales: [1, 2, 3] },
  { size: 29, scales: [1, 2, 3] },
  { size: 40, scales: [1, 2, 3] },
  { size: 60, scales: [2, 3] },
  { size: 76, scales: [1, 2] },
  { size: 83.5, scales: [2] },
  { size: 1024, scales: [1] },
];

/**
 * Web icon sizes
 */
export const WEB_ICON_SIZES: Record<string, number> = {
  favicon16: 16,
  favicon32: 32,
  appleTouchIcon: 180,
  pwa192: 192,
  pwa512: 512,
};

/**
 * Icon shape options with labels
 */
export const ICON_SHAPE_OPTIONS: Array<{ value: IconShape; label: string; description: string }> = [
  { value: 'square', label: 'Square', description: 'Sharp corners' },
  { value: 'rounded', label: 'Rounded', description: 'Rounded corners' },
  { value: 'squircle', label: 'Squircle', description: 'iOS style' },
  { value: 'circle', label: 'Circle', description: 'Circular mask' },
];

/**
 * Initial state for Step 4
 */
export const step4InitialState: Step4State = {
  iconDataUrl: null,
  backgroundColor: '#ffffff' as HexColor,
  iconShape: 'squircle',
  generatedIcons: {
    android: {},
    ios: {},
    web: {},
  },
  iconsGenerated: false,
};

/**
 * Default server environment configuration
 */
export const DEFAULT_SERVER_ENVIRONMENT: ServerEnvironment = {
  name: '',
  protocol: 'https',
  baseUrl: '',
  apiPath: '/fineract-provider/api/v1',
  port: 443,
  tenantId: 'default',
  enabled: true,
};

/**
 * Environment display names
 */
export const ENVIRONMENT_LABELS: Record<EnvironmentType, { name: string; description: string }> = {
  development: { name: 'Development', description: 'Local or development server' },
  staging: { name: 'Staging', description: 'Pre-production testing server' },
  production: { name: 'Production', description: 'Live production server' },
};

/**
 * Initial state for Step 5
 */
export const step5InitialState: Step5State = {
  environments: {
    development: {
      ...DEFAULT_SERVER_ENVIRONMENT,
      name: 'Development',
      baseUrl: 'localhost',
      port: 8443,
    },
    staging: {
      ...DEFAULT_SERVER_ENVIRONMENT,
      name: 'Staging',
      baseUrl: '',
      enabled: false,
    },
    production: {
      ...DEFAULT_SERVER_ENVIRONMENT,
      name: 'Production',
      baseUrl: '',
      enabled: false,
    },
  },
  connectionTimeout: 30000,
  readTimeout: 30000,
  certificatePinning: false,
  offlineMode: false,
  testResults: {
    development: null,
    staging: null,
    production: null,
  },
};

/**
 * Android ABI options with labels
 */
export const ANDROID_ABI_OPTIONS: Array<{ value: AndroidAbi; label: string; description: string }> = [
  { value: 'arm64-v8a', label: 'ARM64', description: '64-bit ARM devices (most modern phones)' },
  { value: 'armeabi-v7a', label: 'ARM32', description: '32-bit ARM devices (older phones)' },
  { value: 'x86_64', label: 'x86_64', description: '64-bit x86 devices (emulators, Chromebooks)' },
];

/**
 * iOS device options with labels
 */
export const IOS_DEVICE_OPTIONS: Array<{ value: IOSDevice; label: string; description: string }> = [
  { value: 'iphone', label: 'iPhone', description: 'iPhone devices' },
  { value: 'ipad', label: 'iPad', description: 'iPad devices' },
];

/**
 * iOS deployment target versions
 */
export const IOS_DEPLOYMENT_TARGETS = [
  { value: '14.0', name: 'iOS 14.0' },
  { value: '15.0', name: 'iOS 15.0' },
  { value: '16.0', name: 'iOS 16.0' },
  { value: '17.0', name: 'iOS 17.0' },
];

/**
 * Service worker strategy options with labels
 */
export const SERVICE_WORKER_STRATEGIES: Array<{ value: ServiceWorkerStrategy; label: string; description: string }> = [
  { value: 'stale-while-revalidate', label: 'Stale While Revalidate', description: 'Return cached data immediately, update in background' },
  { value: 'network-first', label: 'Network First', description: 'Try network first, fallback to cache' },
  { value: 'cache-first', label: 'Cache First', description: 'Return cached data, only fetch if not cached' },
];

/**
 * Initial state for Step 6
 */
export const step6InitialState: Step6State = {
  platforms: {
    android: {
      enabled: true,
      proguard: true,
      appBundle: true,
      abiSplits: ['arm64-v8a', 'armeabi-v7a'],
    },
    ios: {
      enabled: true,
      teamId: '',
      supportedDevices: ['iphone', 'ipad'],
      deploymentTarget: '15.0',
    },
    desktop: {
      enabled: false,
      windows: true,
      macos: true,
      linux: true,
    },
    web: {
      enabled: false,
      pwa: true,
      serviceWorkerStrategy: 'stale-while-revalidate',
    },
  },
};

/**
 * Session timeout options (in minutes)
 */
export const SESSION_TIMEOUT_OPTIONS = [
  { value: 5, label: '5 minutes' },
  { value: 10, label: '10 minutes' },
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 0, label: 'Never' },
];

/**
 * Analytics provider options with labels
 */
export const ANALYTICS_PROVIDERS = [
  { id: 'firebase', name: 'Firebase Analytics', description: 'Google Analytics for mobile apps' },
  { id: 'sentry', name: 'Sentry', description: 'Error tracking and performance monitoring' },
  { id: 'mixpanel', name: 'Mixpanel', description: 'Product analytics and user tracking' },
];

/**
 * Push notification provider options
 */
export const PUSH_PROVIDERS = [
  { id: 'fcm', name: 'Firebase Cloud Messaging', description: 'Google push notifications' },
  { id: 'oneSignal', name: 'OneSignal', description: 'Cross-platform push notifications' },
];

/**
 * Social login provider options
 */
export const SOCIAL_LOGIN_PROVIDERS = [
  { id: 'google', name: 'Google Sign-In', description: 'Sign in with Google account' },
  { id: 'apple', name: 'Apple Sign-In', description: 'Sign in with Apple ID' },
  { id: 'facebook', name: 'Facebook Login', description: 'Sign in with Facebook account' },
];

/**
 * Security feature options with labels
 */
export const SECURITY_FEATURES = [
  { id: 'biometric', name: 'Biometric Authentication', description: 'Fingerprint and Face ID support' },
  { id: 'pinAuth', name: 'PIN Authentication', description: '4-6 digit PIN for app access' },
  { id: 'rootDetection', name: 'Root/Jailbreak Detection', description: 'Detect compromised devices' },
  { id: 'screenshotPrevention', name: 'Screenshot Prevention', description: 'Block screenshots in sensitive areas' },
  { id: 'secureStorage', name: 'Secure Storage', description: 'Encrypted preferences and data' },
  { id: 'sslPinning', name: 'SSL Pinning', description: 'Certificate pinning for API calls' },
];

/**
 * Initial state for Step 7
 */
export const step7InitialState: Step7State = {
  analytics: {
    firebase: true,
    sentry: false,
    mixpanel: false,
    customEndpoint: '',
  },
  pushNotifications: {
    fcm: true,
    oneSignal: false,
  },
  security: {
    biometric: true,
    pinAuth: false,
    rootDetection: true,
    screenshotPrevention: false,
    secureStorage: true,
    sessionTimeout: 15,
    sslPinning: false,
  },
  socialLogin: {
    google: false,
    apple: false,
    facebook: false,
  },
  twoFactorAuth: false,
};

/**
 * CI/CD platform options with labels
 */
export const CI_PLATFORM_OPTIONS: Array<{ value: CIPlatform; name: string; description: string; icon: string }> = [
  { value: 'github-actions', name: 'GitHub Actions', description: 'Native GitHub CI/CD workflows', icon: 'github' },
  { value: 'gitlab-ci', name: 'GitLab CI', description: 'GitLab integrated pipelines', icon: 'gitlab' },
  { value: 'bitrise', name: 'Bitrise', description: 'Mobile-first CI/CD platform', icon: 'bitrise' },
  { value: 'codemagic', name: 'Codemagic', description: 'CI/CD for mobile apps', icon: 'codemagic' },
];

/**
 * Play Store track options
 */
export const PLAY_STORE_TRACKS: Array<{ value: PlayStoreTrack; name: string; description: string }> = [
  { value: 'internal', name: 'Internal Testing', description: 'Up to 100 internal testers' },
  { value: 'alpha', name: 'Closed Testing (Alpha)', description: 'Limited group of testers' },
  { value: 'beta', name: 'Open Testing (Beta)', description: 'Public beta testing' },
  { value: 'production', name: 'Production', description: 'Full public release' },
];

/**
 * Rollout percentage options
 */
export const ROLLOUT_PERCENTAGES = [5, 10, 20, 50, 100];

/**
 * Initial state for Step 8
 */
export const step8InitialState: Step8State = {
  ciPlatform: 'github-actions',
  firebase: {
    enabled: true,
    androidAppId: '',
    iosAppId: '',
    testerGroups: [],
  },
  playStore: {
    enabled: false,
    track: 'internal',
    autoPromotion: false,
    rolloutPercentage: 100,
  },
  appStore: {
    enabled: false,
    testFlight: true,
    autoSubmit: false,
    phasedRelease: true,
  },
  releaseAutomation: {
    versionBumping: true,
    changelogGeneration: true,
    githubRelease: true,
  },
};

/**
 * Testing options with labels
 */
export const TESTING_OPTIONS: Array<{ id: keyof TestingConfig; name: string; description: string; icon: string }> = [
  { id: 'unitTests', name: 'Unit Tests (JUnit/Kotest)', description: 'Core business logic testing', icon: 'test-tube' },
  { id: 'uiTests', name: 'UI Tests (Compose)', description: 'Compose UI component testing', icon: 'layout' },
  { id: 'screenshotTests', name: 'Screenshot Tests (Paparazzi)', description: 'Visual regression testing', icon: 'camera' },
  { id: 'maestro', name: 'E2E Tests (Maestro)', description: 'End-to-end flow testing', icon: 'workflow' },
];

/**
 * Linting options with labels
 */
export const LINTING_OPTIONS: Array<{ id: keyof LintingConfig; name: string; description: string; icon: string }> = [
  { id: 'detekt', name: 'Detekt', description: 'Kotlin static code analysis', icon: 'search' },
  { id: 'ktlint', name: 'ktlint', description: 'Kotlin code style checker', icon: 'check-square' },
  { id: 'spotless', name: 'Spotless', description: 'Code formatting enforcement', icon: 'sparkles' },
];

/**
 * Git hooks options with labels
 */
export const HOOKS_OPTIONS: Array<{ id: keyof HooksConfig; name: string; description: string; icon: string }> = [
  { id: 'preCommit', name: 'Pre-commit Hooks', description: 'Run linting before commits', icon: 'git-commit' },
  { id: 'husky', name: 'Husky', description: 'Modern Git hooks manager', icon: 'dog' },
  { id: 'conventionalCommits', name: 'Conventional Commits', description: 'Enforce commit message format', icon: 'message-square' },
];

/**
 * Coverage percentage options
 */
export const COVERAGE_PERCENTAGES = [50, 60, 70, 80, 90, 95];

/**
 * Initial state for Step 9
 */
export const step9InitialState: Step9State = {
  testing: {
    unitTests: true,
    uiTests: true,
    screenshotTests: false,
    maestro: false,
  },
  linting: {
    detekt: true,
    ktlint: true,
    spotless: false,
  },
  hooks: {
    preCommit: true,
    husky: false,
    conventionalCommits: true,
  },
  coverage: {
    enabled: true,
    minimumPercent: 80,
    failOnDecrease: true,
  },
};

/**
 * Generation stage labels
 */
export const GENERATION_STAGES: Record<GenerationStage, string> = {
  idle: 'Ready to generate',
  validating: 'Validating configuration...',
  'generating-gradle': 'Generating Gradle files...',
  'generating-theme': 'Creating theme files...',
  'processing-icons': 'Processing app icons...',
  'generating-config': 'Generating configuration...',
  'generating-cicd': 'Setting up CI/CD...',
  'creating-zip': 'Creating ZIP archive...',
  complete: 'Generation complete!',
  error: 'Generation failed',
};

/**
 * Initial state for Step 10
 */
export const step10InitialState: Step10State = {
  isGenerating: false,
  generationProgress: {
    stage: 'idle',
    step: 0,
    total: 7,
    message: 'Ready to generate project',
  },
  downloadUrl: null,
  downloadFileName: null,
  downloadSize: null,
  error: null,
};

/**
 * Step labels for the progress indicator
 */
export const STEP_LABELS: Record<number, string> = {
  1: 'App Selection',
  2: 'Project Info',
  3: 'Branding',
  4: 'App Icons',
  5: 'Server Config',
  6: 'Platforms',
  7: 'Features',
  8: 'CI/CD',
  9: 'Code Quality',
  10: 'Review'
};

// ============================================
// Utility Functions
// ============================================

/**
 * Get app option by ID
 */
export function getAppById(id: AppType): AppOption | undefined {
  return APP_OPTIONS.find(app => app.id === id);
}

/**
 * Get default features for an app
 */
export function getAppFeatures(id: AppType): string[] {
  const app = getAppById(id);
  return app?.features || [];
}

/**
 * Get supported platforms for an app
 */
export function getAppPlatforms(id: AppType): Platform[] {
  const app = getAppById(id);
  return app?.platforms || [];
}

/**
 * Check if an app supports a specific platform
 */
export function appSupportsPlatform(id: AppType, platform: Platform): boolean {
  const platforms = getAppPlatforms(id);
  return platforms.includes(platform);
}

// ============================================
// Color Utility Functions
// ============================================

/**
 * Parse hex color to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) throw new Error('Invalid hex color');
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): HexColor {
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}` as HexColor;
}

/**
 * Calculate relative luminance for contrast calculation
 */
export function getLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const srgb = c / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG requirements
 */
export function checkContrast(foreground: string, background: string): {
  ratio: number;
  passesAA: boolean;
  passesAAA: boolean;
} {
  const ratio = getContrastRatio(foreground, background);
  return {
    ratio: Math.round(ratio * 10) / 10,
    passesAA: ratio >= 4.5,
    passesAAA: ratio >= 7.0,
  };
}

/**
 * Generate appropriate text color for background
 */
export function getOnColor(background: string): HexColor {
  const luminance = getLuminance(background);
  return (luminance > 0.179 ? '#000000' : '#ffffff') as HexColor;
}

/**
 * Adjust color lightness
 */
export function adjustLightness(hex: string, amount: number): HexColor {
  const { r, g, b } = hexToRgb(hex);
  const adjust = (c: number) => Math.min(255, Math.max(0, c + amount));
  return rgbToHex(adjust(r), adjust(g), adjust(b));
}

/**
 * Generate dark mode palette from light palette
 */
export function generateDarkPalette(light: ColorPalette): ColorPalette {
  return {
    primary: light.primary,
    secondary: adjustLightness(light.secondary, 20),
    accent: light.accent,
    background: '#0f172a' as HexColor,
    surface: '#1e293b' as HexColor,
    error: adjustLightness(light.error, 10),
    success: adjustLightness(light.success, 10),
    warning: adjustLightness(light.warning, 10),
    onPrimary: getOnColor(light.primary),
    onSecondary: '#ffffff' as HexColor,
    onBackground: '#f8fafc' as HexColor,
    onSurface: '#e2e8f0' as HexColor,
  };
}

/**
 * Get theme preset by ID
 */
export function getPresetById(id: string): ThemePreset | undefined {
  return THEME_PRESETS.find(preset => preset.id === id);
}

// ============================================
// Server Utility Functions
// ============================================

/**
 * Build full server URL from environment config
 */
export function buildServerUrl(env: ServerEnvironment): string {
  const port = (env.protocol === 'https' && env.port === 443) ||
               (env.protocol === 'http' && env.port === 80)
               ? '' : `:${env.port}`;
  return `${env.protocol}://${env.baseUrl}${port}${env.apiPath}`;
}

/**
 * Validate server environment configuration
 */
export function validateServerEnvironment(env: ServerEnvironment): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!env.baseUrl) {
    errors.push('Base URL is required');
  } else if (!/^[a-zA-Z0-9.-]+$/.test(env.baseUrl)) {
    errors.push('Base URL contains invalid characters');
  }

  if (!env.apiPath.startsWith('/')) {
    errors.push('API path must start with /');
  }

  if (env.port < 1 || env.port > 65535) {
    errors.push('Port must be between 1 and 65535');
  }

  if (!env.tenantId) {
    errors.push('Tenant ID is required');
  }

  return { valid: errors.length === 0, errors };
}
