import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type WizardStore,
  type WizardState,
  type AppType,
  type Step1State,
  type Step2State,
  type Step3State,
  type Step4State,
  type Step5State,
  type Step6State,
  type Step7State,
  type Step8State,
  type Step9State,
  type Step10State,
  type RepoFetchState,
  type SDKInfo,
  type ColorRole,
  type HexColor,
  type IconShape,
  type GeneratedIcons,
  type EnvironmentType,
  type ServerEnvironment,
  type ConnectionResult,
  type PlatformConfig,
  type AndroidConfig,
  type IOSConfig,
  type DesktopConfig,
  type WebConfig,
  type AnalyticsConfig,
  type PushConfig,
  type SecurityConfig,
  type SocialLoginConfig,
  type CIPlatform,
  type FirebaseDistributionConfig,
  type PlayStoreConfig,
  type AppStoreConfig,
  type ReleaseAutomationConfig,
  type TestingConfig,
  type LintingConfig,
  type HooksConfig,
  type CoverageConfig,
  type GenerationProgress,
  APP_OPTIONS,
  TOTAL_STEPS,
  THEME_PRESETS,
  step2InitialState,
  step3InitialState,
  step4InitialState,
  step5InitialState,
  step6InitialState,
  step7InitialState,
  step8InitialState,
  step9InitialState,
  step10InitialState,
  repoFetchInitialState,
  generateDarkPalette,
  getPresetById
} from '@/types/wizard';
import { fetchSDKInfoCached, getCachedSDKInfo } from '@/lib/services/github-api';

/**
 * Initial state for Step 1
 */
const step1InitialState: Step1State = {
  selectedApp: null,
  appFeatures: []
};

/**
 * Initial state for the entire wizard
 */
const initialState: WizardState = {
  currentStep: 1,
  maxStepReached: 1,
  repoFetch: repoFetchInitialState,
  step1: step1InitialState,
  step2: step2InitialState,
  step3: step3InitialState,
  step4: step4InitialState,
  step5: step5InitialState,
  step6: step6InitialState,
  step7: step7InitialState,
  step8: step8InitialState,
  step9: step9InitialState,
  step10: step10InitialState
};

/**
 * Wizard store with persistence
 */
export const useWizardStore = create<WizardStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // ========================================
      // Navigation Actions
      // ========================================

      setCurrentStep: (step: number) => {
        const { maxStepReached } = get();
        if (step >= 1 && step <= TOTAL_STEPS && step <= maxStepReached) {
          set({ currentStep: step });
        }
      },

      nextStep: () => {
        const { currentStep, maxStepReached } = get();
        if (currentStep < TOTAL_STEPS) {
          const nextStep = currentStep + 1;
          set({
            currentStep: nextStep,
            maxStepReached: Math.max(maxStepReached, nextStep)
          });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      canNavigateToStep: (step: number) => {
        const { maxStepReached } = get();
        return step >= 1 && step <= maxStepReached;
      },

      // ========================================
      // Step 1: App Selection Actions
      // ========================================

      selectApp: (app: AppType) => {
        const appOption = APP_OPTIONS.find(opt => opt.id === app);
        set({
          step1: {
            selectedApp: app,
            appFeatures: appOption?.features || []
          }
        });
      },

      clearSelection: () => {
        set({
          step1: {
            selectedApp: null,
            appFeatures: []
          }
        });
      },

      setAppFeatures: (features: string[]) => {
        set((state) => ({
          step1: {
            ...state.step1,
            appFeatures: features
          }
        }));
      },

      // ========================================
      // SDK Fetch Actions
      // ========================================

      fetchSDKInfo: async (appType: AppType) => {
        // Check for cached data first (optimistic loading)
        const cachedInfo = getCachedSDKInfo(appType);

        if (cachedInfo) {
          // Use cached data immediately - no loading state needed
          set({
            repoFetch: {
              isLoading: false,
              error: null,
              sdkInfo: cachedInfo,
              lastFetched: Date.now(),
            },
          });
          return;
        }

        // No cache - show loading state and fetch
        set({
          repoFetch: {
            isLoading: true,
            error: null,
            sdkInfo: null,
            lastFetched: null,
          },
        });

        try {
          const sdkInfo = await fetchSDKInfoCached(appType);
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
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to fetch SDK info',
              sdkInfo: null,
              lastFetched: null,
            },
          });
        }
      },

      clearSDKInfo: () => {
        set({ repoFetch: repoFetchInitialState });
      },

      retryFetchSDKInfo: async () => {
        const { step1 } = get();
        if (step1.selectedApp) {
          const { fetchSDKInfo } = get();
          await fetchSDKInfo(step1.selectedApp);
        }
      },

      // ========================================
      // Step 2: Project Info Actions
      // ========================================

      updateStep2: (data: Partial<Step2State>) => {
        set((state) => {
          const newStep2 = { ...state.step2, ...data };
          // Auto-generate applicationId when packageName changes
          if (data.packageName !== undefined) {
            newStep2.applicationId = data.packageName;
          }
          return { step2: newStep2 };
        });
      },

      resetStep2: () => {
        set({ step2: step2InitialState });
      },

      // ========================================
      // Step 3: Branding & Theme Actions
      // ========================================

      updateColor: (role: ColorRole, value: HexColor, mode: 'light' | 'dark' = 'light') => {
        set((state) => {
          if (mode === 'dark') {
            return {
              step3: {
                ...state.step3,
                darkColors: {
                  ...state.step3.darkColors,
                  [role]: value
                },
                selectedPreset: null // Custom color means no preset
              }
            };
          }
          return {
            step3: {
              ...state.step3,
              colors: {
                ...state.step3.colors,
                [role]: value
              },
              selectedPreset: null // Custom color means no preset
            }
          };
        });
      },

      applyPreset: (presetId: string) => {
        const preset = getPresetById(presetId);
        if (preset) {
          set((state) => ({
            step3: {
              ...state.step3,
              colors: preset.colors,
              darkColors: generateDarkPalette(preset.colors),
              selectedPreset: presetId
            }
          }));
        }
      },

      toggleDarkMode: (enabled: boolean) => {
        set((state) => ({
          step3: {
            ...state.step3,
            darkModeEnabled: enabled,
            previewMode: enabled ? state.step3.previewMode : 'light'
          }
        }));
      },

      generateDarkColors: () => {
        set((state) => ({
          step3: {
            ...state.step3,
            darkColors: generateDarkPalette(state.step3.colors)
          }
        }));
      },

      setPreviewMode: (mode: 'light' | 'dark') => {
        set((state) => ({
          step3: {
            ...state.step3,
            previewMode: mode
          }
        }));
      },

      resetColors: () => {
        set({ step3: step3InitialState });
      },

      // ========================================
      // Step 4: App Icons Actions
      // ========================================

      setIconDataUrl: (dataUrl: string | null) => {
        set((state) => ({
          step4: {
            ...state.step4,
            iconDataUrl: dataUrl,
            iconsGenerated: false,
            generatedIcons: { android: {}, ios: {}, web: {} }
          }
        }));
      },

      setIconBackgroundColor: (color: HexColor) => {
        set((state) => ({
          step4: {
            ...state.step4,
            backgroundColor: color,
            iconsGenerated: false
          }
        }));
      },

      setIconShape: (shape: IconShape) => {
        set((state) => ({
          step4: {
            ...state.step4,
            iconShape: shape,
            iconsGenerated: false
          }
        }));
      },

      setGeneratedIcons: (icons: GeneratedIcons) => {
        set((state) => ({
          step4: {
            ...state.step4,
            generatedIcons: icons,
            iconsGenerated: true
          }
        }));
      },

      resetIcons: () => {
        set({ step4: step4InitialState });
      },

      // ========================================
      // Step 5: Server Configuration Actions
      // ========================================

      updateEnvironment: (env: EnvironmentType, data: Partial<ServerEnvironment>) => {
        set((state) => ({
          step5: {
            ...state.step5,
            environments: {
              ...state.step5.environments,
              [env]: {
                ...state.step5.environments[env],
                ...data
              }
            },
            testResults: {
              ...state.step5.testResults,
              [env]: null // Reset test result when config changes
            }
          }
        }));
      },

      setConnectionTimeout: (timeout: number) => {
        set((state) => ({
          step5: {
            ...state.step5,
            connectionTimeout: timeout
          }
        }));
      },

      setReadTimeout: (timeout: number) => {
        set((state) => ({
          step5: {
            ...state.step5,
            readTimeout: timeout
          }
        }));
      },

      setCertificatePinning: (enabled: boolean) => {
        set((state) => ({
          step5: {
            ...state.step5,
            certificatePinning: enabled
          }
        }));
      },

      setOfflineMode: (enabled: boolean) => {
        set((state) => ({
          step5: {
            ...state.step5,
            offlineMode: enabled
          }
        }));
      },

      setTestResult: (env: EnvironmentType, result: ConnectionResult | null) => {
        set((state) => ({
          step5: {
            ...state.step5,
            testResults: {
              ...state.step5.testResults,
              [env]: result
            }
          }
        }));
      },

      resetServerConfig: () => {
        set({ step5: step5InitialState });
      },

      // ========================================
      // Step 6: Platform Selection Actions
      // ========================================

      togglePlatform: (platform: keyof PlatformConfig, enabled: boolean) => {
        set((state) => ({
          step6: {
            ...state.step6,
            platforms: {
              ...state.step6.platforms,
              [platform]: {
                ...state.step6.platforms[platform],
                enabled
              }
            }
          }
        }));
      },

      updateAndroidConfig: (config: Partial<AndroidConfig>) => {
        set((state) => ({
          step6: {
            ...state.step6,
            platforms: {
              ...state.step6.platforms,
              android: {
                ...state.step6.platforms.android,
                ...config
              }
            }
          }
        }));
      },

      updateIOSConfig: (config: Partial<IOSConfig>) => {
        set((state) => ({
          step6: {
            ...state.step6,
            platforms: {
              ...state.step6.platforms,
              ios: {
                ...state.step6.platforms.ios,
                ...config
              }
            }
          }
        }));
      },

      updateDesktopConfig: (config: Partial<DesktopConfig>) => {
        set((state) => ({
          step6: {
            ...state.step6,
            platforms: {
              ...state.step6.platforms,
              desktop: {
                ...state.step6.platforms.desktop,
                ...config
              }
            }
          }
        }));
      },

      updateWebConfig: (config: Partial<WebConfig>) => {
        set((state) => ({
          step6: {
            ...state.step6,
            platforms: {
              ...state.step6.platforms,
              web: {
                ...state.step6.platforms.web,
                ...config
              }
            }
          }
        }));
      },

      resetPlatforms: () => {
        set({ step6: step6InitialState });
      },

      // ========================================
      // Step 7: Features & Security Actions
      // ========================================

      updateAnalyticsConfig: (config: Partial<AnalyticsConfig>) => {
        set((state) => ({
          step7: {
            ...state.step7,
            analytics: {
              ...state.step7.analytics,
              ...config
            }
          }
        }));
      },

      updatePushConfig: (config: Partial<PushConfig>) => {
        set((state) => ({
          step7: {
            ...state.step7,
            pushNotifications: {
              ...state.step7.pushNotifications,
              ...config
            }
          }
        }));
      },

      updateSecurityConfig: (config: Partial<SecurityConfig>) => {
        set((state) => ({
          step7: {
            ...state.step7,
            security: {
              ...state.step7.security,
              ...config
            }
          }
        }));
      },

      updateSocialLoginConfig: (config: Partial<SocialLoginConfig>) => {
        set((state) => ({
          step7: {
            ...state.step7,
            socialLogin: {
              ...state.step7.socialLogin,
              ...config
            }
          }
        }));
      },

      setTwoFactorAuth: (enabled: boolean) => {
        set((state) => ({
          step7: {
            ...state.step7,
            twoFactorAuth: enabled
          }
        }));
      },

      resetFeaturesAndSecurity: () => {
        set({ step7: step7InitialState });
      },

      // ========================================
      // Step 8: CI/CD & Deployment Actions
      // ========================================

      setCIPlatform: (platform: CIPlatform) => {
        set((state) => ({
          step8: {
            ...state.step8,
            ciPlatform: platform
          }
        }));
      },

      updateFirebaseConfig: (config: Partial<FirebaseDistributionConfig>) => {
        set((state) => ({
          step8: {
            ...state.step8,
            firebase: {
              ...state.step8.firebase,
              ...config
            }
          }
        }));
      },

      updatePlayStoreConfig: (config: Partial<PlayStoreConfig>) => {
        set((state) => ({
          step8: {
            ...state.step8,
            playStore: {
              ...state.step8.playStore,
              ...config
            }
          }
        }));
      },

      updateAppStoreConfig: (config: Partial<AppStoreConfig>) => {
        set((state) => ({
          step8: {
            ...state.step8,
            appStore: {
              ...state.step8.appStore,
              ...config
            }
          }
        }));
      },

      updateReleaseAutomation: (config: Partial<ReleaseAutomationConfig>) => {
        set((state) => ({
          step8: {
            ...state.step8,
            releaseAutomation: {
              ...state.step8.releaseAutomation,
              ...config
            }
          }
        }));
      },

      resetCICD: () => {
        set({ step8: step8InitialState });
      },

      // ========================================
      // Step 9: Code Quality Actions
      // ========================================

      updateTestingConfig: (config: Partial<TestingConfig>) => {
        set((state) => ({
          step9: {
            ...state.step9,
            testing: {
              ...state.step9.testing,
              ...config
            }
          }
        }));
      },

      updateLintingConfig: (config: Partial<LintingConfig>) => {
        set((state) => ({
          step9: {
            ...state.step9,
            linting: {
              ...state.step9.linting,
              ...config
            }
          }
        }));
      },

      updateHooksConfig: (config: Partial<HooksConfig>) => {
        set((state) => ({
          step9: {
            ...state.step9,
            hooks: {
              ...state.step9.hooks,
              ...config
            }
          }
        }));
      },

      updateCoverageConfig: (config: Partial<CoverageConfig>) => {
        set((state) => ({
          step9: {
            ...state.step9,
            coverage: {
              ...state.step9.coverage,
              ...config
            }
          }
        }));
      },

      resetCodeQuality: () => {
        set({ step9: step9InitialState });
      },

      // ========================================
      // Step 10: Review & Generate Actions
      // ========================================

      startGeneration: () => {
        set((state) => ({
          step10: {
            ...state.step10,
            isGenerating: true,
            error: null,
            downloadUrl: null,
            downloadFileName: null,
            downloadSize: null,
            generationProgress: {
              stage: 'validating',
              step: 1,
              total: 7,
              message: 'Validating configuration...'
            }
          }
        }));
      },

      setGenerationProgress: (progress: GenerationProgress) => {
        set((state) => ({
          step10: {
            ...state.step10,
            generationProgress: progress
          }
        }));
      },

      setDownloadReady: (url: string, fileName: string, size: number) => {
        set((state) => ({
          step10: {
            ...state.step10,
            isGenerating: false,
            downloadUrl: url,
            downloadFileName: fileName,
            downloadSize: size,
            generationProgress: {
              stage: 'complete',
              step: 7,
              total: 7,
              message: 'Generation complete!'
            }
          }
        }));
      },

      setGenerationError: (error: string) => {
        set((state) => ({
          step10: {
            ...state.step10,
            isGenerating: false,
            error,
            generationProgress: {
              stage: 'error',
              step: state.step10.generationProgress.step,
              total: 7,
              message: error
            }
          }
        }));
      },

      resetGeneration: () => {
        set({ step10: step10InitialState });
      },

      exportConfig: () => {
        const state = get();
        const config = {
          step1: state.step1,
          step2: state.step2,
          step3: state.step3,
          step4: state.step4,
          step5: state.step5,
          step6: state.step6,
          step7: state.step7,
          step8: state.step8,
          step9: state.step9,
        };
        return JSON.stringify(config, null, 2);
      },

      importConfig: (json: string) => {
        try {
          const config = JSON.parse(json);
          set({
            step1: config.step1 || step1InitialState,
            step2: config.step2 || step2InitialState,
            step3: config.step3 || step3InitialState,
            step4: config.step4 || step4InitialState,
            step5: config.step5 || step5InitialState,
            step6: config.step6 || step6InitialState,
            step7: config.step7 || step7InitialState,
            step8: config.step8 || step8InitialState,
            step9: config.step9 || step9InitialState,
          });
          return true;
        } catch {
          return false;
        }
      },

      // ========================================
      // Global Actions
      // ========================================

      resetWizard: () => {
        set(initialState);
      }
    }),
    {
      name: 'mifoslaunchpad-wizard',
      // Only persist wizard data, not navigation state
      partialize: (state) => ({
        step1: state.step1,
        step2: state.step2,
        step3: state.step3,
        step4: state.step4,
        step5: state.step5,
        step6: state.step6,
        step7: state.step7,
        step8: state.step8,
        step9: state.step9,
        maxStepReached: state.maxStepReached
      })
    }
  )
);

// ========================================
// Selector Hooks
// ========================================

/**
 * Hook to get current step
 */
export const useCurrentStep = () => useWizardStore((state) => state.currentStep);

/**
 * Hook to get Step 1 state
 */
export const useStep1 = () => useWizardStore((state) => state.step1);

/**
 * Hook to get Step 2 state
 */
export const useStep2 = () => useWizardStore((state) => state.step2);

/**
 * Hook to get Step 3 state
 */
export const useStep3 = () => useWizardStore((state) => state.step3);

/**
 * Hook to get Step 4 state
 */
export const useStep4 = () => useWizardStore((state) => state.step4);

/**
 * Hook to get Step 5 state
 */
export const useStep5 = () => useWizardStore((state) => state.step5);

/**
 * Hook to get Step 6 state
 */
export const useStep6 = () => useWizardStore((state) => state.step6);

/**
 * Hook to get Step 7 state
 */
export const useStep7 = () => useWizardStore((state) => state.step7);

/**
 * Hook to get Step 8 state
 */
export const useStep8 = () => useWizardStore((state) => state.step8);

/**
 * Hook to get Step 9 state
 */
export const useStep9 = () => useWizardStore((state) => state.step9);

/**
 * Hook to get Step 10 state
 */
export const useStep10 = () => useWizardStore((state) => state.step10);

/**
 * Hook for app selection with derived data
 */
export function useAppSelection() {
  const step1 = useWizardStore((state) => state.step1);
  const selectApp = useWizardStore((state) => state.selectApp);
  const clearSelection = useWizardStore((state) => state.clearSelection);

  const selectedAppData = step1.selectedApp
    ? APP_OPTIONS.find(app => app.id === step1.selectedApp)
    : null;

  return {
    selectedApp: step1.selectedApp,
    selectedAppData,
    appFeatures: step1.appFeatures,
    selectApp,
    clearSelection,
    isSelected: step1.selectedApp !== null
  };
}

/**
 * Hook for wizard navigation
 */
export function useWizardNavigation() {
  const currentStep = useWizardStore((state) => state.currentStep);
  const maxStepReached = useWizardStore((state) => state.maxStepReached);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);
  const nextStep = useWizardStore((state) => state.nextStep);
  const previousStep = useWizardStore((state) => state.previousStep);
  const canNavigateToStep = useWizardStore((state) => state.canNavigateToStep);

  return {
    currentStep,
    maxStepReached,
    setCurrentStep,
    nextStep,
    previousStep,
    canNavigateToStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === TOTAL_STEPS,
    progress: (currentStep / TOTAL_STEPS) * 100
  };
}

// ========================================
// Validation Hooks
// ========================================

/**
 * Hook to validate Step 1 completion
 */
export function useStep1Validation() {
  const { selectedApp } = useAppSelection();
  const { isLoading, error, sdkInfo } = useSDKInfo();

  const errors: string[] = [];

  // Check if app is selected
  if (!selectedApp) {
    errors.push('Please select a base application');
  }

  // Check if SDK is loading
  if (isLoading) {
    errors.push('Loading SDK configuration...');
  }

  // Check if SDK fetch failed
  if (error) {
    errors.push('Failed to load SDK info. Please retry or select a different app.');
  }

  // Check if SDK info was successfully loaded
  if (selectedApp && !isLoading && !error && !sdkInfo) {
    errors.push('SDK configuration not loaded');
  }

  const isValid = selectedApp !== null && !isLoading && !error && sdkInfo !== null;

  return { isValid, errors };
}

/**
 * Hook to validate Step 2 completion
 */
export function useStep2Validation() {
  const step2 = useStep2();
  const errors: string[] = [];

  // Required field validations (organization fields moved to onboarding)
  if (!step2.projectName || step2.projectName.length < 2) {
    errors.push('Project name is required (min 2 characters)');
  }
  if (!step2.displayName || step2.displayName.length < 2) {
    errors.push('Display name is required (min 2 characters)');
  }
  if (!step2.packageName) {
    errors.push('Package name is required');
  } else if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(step2.packageName)) {
    errors.push('Package name must be in reverse domain format (e.g., com.example.app)');
  }
  if (!step2.versionName || !/^\d+\.\d+\.\d+$/.test(step2.versionName)) {
    errors.push('Version must be in format X.Y.Z');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 2 form management
 */
export function useStep2Form() {
  const step2 = useStep2();
  const updateStep2 = useWizardStore((state) => state.updateStep2);

  const handleChange = <K extends keyof Step2State>(field: K, value: Step2State[K]) => {
    updateStep2({ [field]: value });
  };

  return {
    ...step2,
    updateStep2,
    handleChange
  };
}

/**
 * Hook for Step 3 theme management
 */
export function useTheme() {
  const step3 = useStep3();
  const updateColor = useWizardStore((state) => state.updateColor);
  const applyPreset = useWizardStore((state) => state.applyPreset);
  const toggleDarkMode = useWizardStore((state) => state.toggleDarkMode);
  const generateDarkColors = useWizardStore((state) => state.generateDarkColors);
  const setPreviewMode = useWizardStore((state) => state.setPreviewMode);
  const resetColors = useWizardStore((state) => state.resetColors);

  const activeColors = step3.previewMode === 'dark' ? step3.darkColors : step3.colors;

  return {
    colors: step3.colors,
    darkColors: step3.darkColors,
    activeColors,
    darkModeEnabled: step3.darkModeEnabled,
    selectedPreset: step3.selectedPreset,
    previewMode: step3.previewMode,
    updateColor,
    applyPreset,
    toggleDarkMode,
    generateDarkColors,
    setPreviewMode,
    resetColors
  };
}

/**
 * Hook to validate Step 3 completion
 */
export function useStep3Validation() {
  const step3 = useStep3();
  const errors: string[] = [];

  // All colors should be valid hex colors (the type system enforces this)
  // Just check that colors exist
  if (!step3.colors.primary) {
    errors.push('Primary color is required');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 4 icon management
 */
export function useIconUpload() {
  const step4 = useStep4();
  const setIconDataUrl = useWizardStore((state) => state.setIconDataUrl);
  const setIconBackgroundColor = useWizardStore((state) => state.setIconBackgroundColor);
  const setIconShape = useWizardStore((state) => state.setIconShape);
  const setGeneratedIcons = useWizardStore((state) => state.setGeneratedIcons);
  const resetIcons = useWizardStore((state) => state.resetIcons);

  return {
    iconDataUrl: step4.iconDataUrl,
    backgroundColor: step4.backgroundColor,
    iconShape: step4.iconShape,
    generatedIcons: step4.generatedIcons,
    iconsGenerated: step4.iconsGenerated,
    setIconDataUrl,
    setIconBackgroundColor,
    setIconShape,
    setGeneratedIcons,
    resetIcons,
    hasIcon: step4.iconDataUrl !== null
  };
}

/**
 * Hook to validate Step 4 completion
 */
export function useStep4Validation() {
  const step4 = useStep4();
  const errors: string[] = [];

  // Icon is optional but if uploaded, it should be valid
  // For now, we just check basic state
  // Step 4 validation is lenient - icon is optional

  return { isValid: true, errors };
}

/**
 * Hook for Step 5 server configuration management
 */
export function useServerConfig() {
  const step5 = useStep5();
  const updateEnvironment = useWizardStore((state) => state.updateEnvironment);
  const setConnectionTimeout = useWizardStore((state) => state.setConnectionTimeout);
  const setReadTimeout = useWizardStore((state) => state.setReadTimeout);
  const setCertificatePinning = useWizardStore((state) => state.setCertificatePinning);
  const setOfflineMode = useWizardStore((state) => state.setOfflineMode);
  const setTestResult = useWizardStore((state) => state.setTestResult);
  const resetServerConfig = useWizardStore((state) => state.resetServerConfig);

  return {
    environments: step5.environments,
    connectionTimeout: step5.connectionTimeout,
    readTimeout: step5.readTimeout,
    certificatePinning: step5.certificatePinning,
    offlineMode: step5.offlineMode,
    testResults: step5.testResults,
    updateEnvironment,
    setConnectionTimeout,
    setReadTimeout,
    setCertificatePinning,
    setOfflineMode,
    setTestResult,
    resetServerConfig
  };
}

/**
 * Hook to validate Step 5 completion
 */
export function useStep5Validation() {
  const step5 = useStep5();
  const errors: string[] = [];

  // Check if at least one environment is enabled and has a valid base URL
  const enabledEnvs = Object.entries(step5.environments).filter(([, env]) => env.enabled);

  if (enabledEnvs.length === 0) {
    errors.push('At least one environment must be enabled');
  } else {
    for (const [key, env] of enabledEnvs) {
      if (!env.baseUrl) {
        errors.push(`${env.name || key} requires a base URL`);
      }
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 6 platform configuration management
 */
export function usePlatformConfig() {
  const step6 = useStep6();
  const togglePlatform = useWizardStore((state) => state.togglePlatform);
  const updateAndroidConfig = useWizardStore((state) => state.updateAndroidConfig);
  const updateIOSConfig = useWizardStore((state) => state.updateIOSConfig);
  const updateDesktopConfig = useWizardStore((state) => state.updateDesktopConfig);
  const updateWebConfig = useWizardStore((state) => state.updateWebConfig);
  const resetPlatforms = useWizardStore((state) => state.resetPlatforms);

  const enabledPlatforms = Object.entries(step6.platforms)
    .filter(([, config]) => config.enabled)
    .map(([key]) => key as keyof PlatformConfig);

  return {
    platforms: step6.platforms,
    enabledPlatforms,
    togglePlatform,
    updateAndroidConfig,
    updateIOSConfig,
    updateDesktopConfig,
    updateWebConfig,
    resetPlatforms,
    hasAndroid: step6.platforms.android.enabled,
    hasIOS: step6.platforms.ios.enabled,
    hasDesktop: step6.platforms.desktop.enabled,
    hasWeb: step6.platforms.web.enabled
  };
}

/**
 * Hook to validate Step 6 completion
 */
export function useStep6Validation() {
  const step6 = useStep6();
  const errors: string[] = [];

  // Check if at least one platform is enabled
  const { android, ios, desktop, web } = step6.platforms;
  const hasEnabledPlatform = android.enabled || ios.enabled || desktop.enabled || web.enabled;

  if (!hasEnabledPlatform) {
    errors.push('At least one platform must be enabled');
  }

  // iOS requires team ID if enabled
  if (ios.enabled && !ios.teamId) {
    // Team ID is optional for now, will be validated later
    // errors.push('Apple Team ID is required for iOS');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 7 features and security management
 */
export function useFeaturesAndSecurity() {
  const step7 = useStep7();
  const updateAnalyticsConfig = useWizardStore((state) => state.updateAnalyticsConfig);
  const updatePushConfig = useWizardStore((state) => state.updatePushConfig);
  const updateSecurityConfig = useWizardStore((state) => state.updateSecurityConfig);
  const updateSocialLoginConfig = useWizardStore((state) => state.updateSocialLoginConfig);
  const setTwoFactorAuth = useWizardStore((state) => state.setTwoFactorAuth);
  const resetFeaturesAndSecurity = useWizardStore((state) => state.resetFeaturesAndSecurity);

  const enabledAnalytics = Object.entries(step7.analytics)
    .filter(([key, value]) => key !== 'customEndpoint' && value === true)
    .map(([key]) => key);

  const enabledSecurityFeatures = Object.entries(step7.security)
    .filter(([key, value]) => key !== 'sessionTimeout' && value === true)
    .map(([key]) => key);

  return {
    analytics: step7.analytics,
    pushNotifications: step7.pushNotifications,
    security: step7.security,
    socialLogin: step7.socialLogin,
    twoFactorAuth: step7.twoFactorAuth,
    enabledAnalytics,
    enabledSecurityFeatures,
    updateAnalyticsConfig,
    updatePushConfig,
    updateSecurityConfig,
    updateSocialLoginConfig,
    setTwoFactorAuth,
    resetFeaturesAndSecurity
  };
}

/**
 * Hook to validate Step 7 completion
 */
export function useStep7Validation() {
  const step7 = useStep7();
  const errors: string[] = [];

  // Step 7 has no required fields - all features are optional
  // Just validate that if custom analytics endpoint is set, it's a valid URL
  if (step7.analytics.customEndpoint) {
    try {
      new URL(step7.analytics.customEndpoint);
    } catch {
      errors.push('Custom analytics endpoint must be a valid URL');
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 8 CI/CD configuration management
 */
export function useCICDConfig() {
  const step8 = useStep8();
  const setCIPlatform = useWizardStore((state) => state.setCIPlatform);
  const updateFirebaseConfig = useWizardStore((state) => state.updateFirebaseConfig);
  const updatePlayStoreConfig = useWizardStore((state) => state.updatePlayStoreConfig);
  const updateAppStoreConfig = useWizardStore((state) => state.updateAppStoreConfig);
  const updateReleaseAutomation = useWizardStore((state) => state.updateReleaseAutomation);
  const resetCICD = useWizardStore((state) => state.resetCICD);

  const enabledDistributionChannels = [
    step8.firebase.enabled && 'firebase',
    step8.playStore.enabled && 'playStore',
    step8.appStore.enabled && 'appStore',
  ].filter(Boolean) as string[];

  const enabledReleaseFeatures = [
    step8.releaseAutomation.versionBumping && 'versionBumping',
    step8.releaseAutomation.changelogGeneration && 'changelogGeneration',
    step8.releaseAutomation.githubRelease && 'githubRelease',
  ].filter(Boolean) as string[];

  return {
    ciPlatform: step8.ciPlatform,
    firebase: step8.firebase,
    playStore: step8.playStore,
    appStore: step8.appStore,
    releaseAutomation: step8.releaseAutomation,
    enabledDistributionChannels,
    enabledReleaseFeatures,
    setCIPlatform,
    updateFirebaseConfig,
    updatePlayStoreConfig,
    updateAppStoreConfig,
    updateReleaseAutomation,
    resetCICD,
    hasFirebase: step8.firebase.enabled,
    hasPlayStore: step8.playStore.enabled,
    hasAppStore: step8.appStore.enabled
  };
}

/**
 * Hook to validate Step 8 completion
 */
export function useStep8Validation() {
  const step8 = useStep8();
  const errors: string[] = [];

  // Step 8 has no required fields - all CI/CD options are optional
  // Just validate that if Firebase is enabled, app IDs are provided
  if (step8.firebase.enabled) {
    if (!step8.firebase.androidAppId && !step8.firebase.iosAppId) {
      // App IDs are optional for now, can be configured later
    }
  }

  // Validate rollout percentage is in valid range
  if (step8.playStore.enabled && step8.playStore.rolloutPercentage < 1 || step8.playStore.rolloutPercentage > 100) {
    errors.push('Rollout percentage must be between 1 and 100');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 9 code quality configuration management
 */
export function useCodeQualityConfig() {
  const step9 = useStep9();
  const updateTestingConfig = useWizardStore((state) => state.updateTestingConfig);
  const updateLintingConfig = useWizardStore((state) => state.updateLintingConfig);
  const updateHooksConfig = useWizardStore((state) => state.updateHooksConfig);
  const updateCoverageConfig = useWizardStore((state) => state.updateCoverageConfig);
  const resetCodeQuality = useWizardStore((state) => state.resetCodeQuality);

  const enabledTestingOptions = Object.entries(step9.testing)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);

  const enabledLintingOptions = Object.entries(step9.linting)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);

  const enabledHooksOptions = Object.entries(step9.hooks)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key);

  return {
    testing: step9.testing,
    linting: step9.linting,
    hooks: step9.hooks,
    coverage: step9.coverage,
    enabledTestingOptions,
    enabledLintingOptions,
    enabledHooksOptions,
    updateTestingConfig,
    updateLintingConfig,
    updateHooksConfig,
    updateCoverageConfig,
    resetCodeQuality,
    hasUnitTests: step9.testing.unitTests,
    hasUITests: step9.testing.uiTests,
    hasCoverage: step9.coverage.enabled
  };
}

/**
 * Hook to validate Step 9 completion
 */
export function useStep9Validation() {
  const step9 = useStep9();
  const errors: string[] = [];

  // Step 9 has no required fields - all code quality options are optional
  // Just validate coverage percentage is in valid range
  if (step9.coverage.enabled && (step9.coverage.minimumPercent < 0 || step9.coverage.minimumPercent > 100)) {
    errors.push('Coverage percentage must be between 0 and 100');
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Hook for Step 10 review and generation management
 */
export function useReviewGenerate() {
  const step10 = useStep10();
  const startGeneration = useWizardStore((state) => state.startGeneration);
  const setGenerationProgress = useWizardStore((state) => state.setGenerationProgress);
  const setDownloadReady = useWizardStore((state) => state.setDownloadReady);
  const setGenerationError = useWizardStore((state) => state.setGenerationError);
  const resetGeneration = useWizardStore((state) => state.resetGeneration);
  const exportConfig = useWizardStore((state) => state.exportConfig);
  const importConfig = useWizardStore((state) => state.importConfig);
  const resetWizard = useWizardStore((state) => state.resetWizard);
  const setCurrentStep = useWizardStore((state) => state.setCurrentStep);

  // Get all step states for summary
  const step1 = useWizardStore((state) => state.step1);
  const step2 = useWizardStore((state) => state.step2);
  const step3 = useWizardStore((state) => state.step3);
  const step4 = useWizardStore((state) => state.step4);
  const step5 = useWizardStore((state) => state.step5);
  const step6 = useWizardStore((state) => state.step6);
  const step7 = useWizardStore((state) => state.step7);
  const step8 = useWizardStore((state) => state.step8);
  const step9 = useWizardStore((state) => state.step9);

  return {
    ...step10,
    startGeneration,
    setGenerationProgress,
    setDownloadReady,
    setGenerationError,
    resetGeneration,
    exportConfig,
    importConfig,
    resetWizard,
    setCurrentStep,
    // Summary data
    summary: {
      step1,
      step2,
      step3,
      step4,
      step5,
      step6,
      step7,
      step8,
      step9,
    }
  };
}

/**
 * Hook to check if current step is valid and can proceed
 */
export function useCanProceed() {
  const currentStep = useWizardStore((state) => state.currentStep);
  const step1Validation = useStep1Validation();
  const step2Validation = useStep2Validation();
  const step3Validation = useStep3Validation();
  const step4Validation = useStep4Validation();
  const step5Validation = useStep5Validation();
  const step6Validation = useStep6Validation();
  const step7Validation = useStep7Validation();
  const step8Validation = useStep8Validation();
  const step9Validation = useStep9Validation();

  // Add more step validations as they are implemented
  const validations: Record<number, { isValid: boolean; errors: string[] }> = {
    1: step1Validation,
    2: step2Validation,
    3: step3Validation,
    4: step4Validation,
    5: step5Validation,
    6: step6Validation,
    7: step7Validation,
    8: step8Validation,
    9: step9Validation
  };

  const validation = validations[currentStep] || { isValid: true, errors: [] };

  return {
    canProceed: validation.isValid,
    errors: validation.errors
  };
}

/**
 * Hook for SDK info state and actions
 */
export function useSDKInfo() {
  const repoFetch = useWizardStore((state) => state.repoFetch);
  const fetchSDKInfo = useWizardStore((state) => state.fetchSDKInfo);
  const clearSDKInfo = useWizardStore((state) => state.clearSDKInfo);
  const retryFetchSDKInfo = useWizardStore((state) => state.retryFetchSDKInfo);

  return {
    ...repoFetch,
    fetchSDKInfo,
    clearSDKInfo,
    retryFetchSDKInfo,
  };
}

/**
 * Hook for just the SDK info data (no actions)
 */
export function useSDKInfoData() {
  return useWizardStore((state) => state.repoFetch.sdkInfo);
}

/**
 * Hook for SDK fetch loading state
 */
export function useSDKInfoLoading() {
  return useWizardStore((state) => state.repoFetch.isLoading);
}

/**
 * Hook for SDK fetch error state
 */
export function useSDKInfoError() {
  return useWizardStore((state) => state.repoFetch.error);
}
