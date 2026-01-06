import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type V3AuthState,
  type V3OnboardingState,
  type V3AuthType,
  type OrganizationInfo,
  v3AuthInitialState,
  v3OnboardingInitialState,
  V3_RATE_LIMITS,
  V3_STORAGE_KEYS,
} from '@/types/wizard';

// ============================================
// V3 Auth Store
// ============================================

interface V3AuthStore extends V3AuthState {
  // Actions
  setAuthType: (type: V3AuthType) => void;
  setGitHubAuth: (data: {
    token: string;
    username: string;
    email?: string;
    avatarUrl?: string;
    scopes?: string[];
  }) => void;
  clearAuth: () => void;
  incrementBuildCount: () => void;
  canBuild: () => boolean;
  getRemainingBuilds: () => number;
  resetBuildCountIfNewDay: () => void;
}

export const useV3AuthStore = create<V3AuthStore>()(
  persist(
    (set, get) => ({
      ...v3AuthInitialState,

      setAuthType: (type: V3AuthType) => {
        set({
          authType: type,
          isAuthenticated: type === 'anonymous',
          maxBuildsPerDay: V3_RATE_LIMITS[type],
        });
      },

      setGitHubAuth: (data) => {
        set({
          authType: 'github',
          isAuthenticated: true,
          userId: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl,
          githubToken: data.token,
          githubScopes: data.scopes,
          maxBuildsPerDay: V3_RATE_LIMITS.github,
        });
      },

      clearAuth: () => {
        set(v3AuthInitialState);
      },

      incrementBuildCount: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();

        // Reset count if new day
        if (state.lastBuildDate !== today) {
          set({
            buildsToday: 1,
            lastBuildDate: today,
          });
        } else {
          set({
            buildsToday: state.buildsToday + 1,
          });
        }
      },

      canBuild: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        // Reset on new day
        if (state.lastBuildDate !== today) {
          return true;
        }

        return state.buildsToday < state.maxBuildsPerDay;
      },

      getRemainingBuilds: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        // Reset on new day
        if (state.lastBuildDate !== today) {
          return state.maxBuildsPerDay;
        }

        return Math.max(0, state.maxBuildsPerDay - state.buildsToday);
      },

      resetBuildCountIfNewDay: () => {
        const state = get();
        const today = new Date().toISOString().split('T')[0];

        if (state.lastBuildDate !== today) {
          set({
            buildsToday: 0,
            lastBuildDate: today,
          });
        }
      },
    }),
    {
      name: V3_STORAGE_KEYS.AUTH,
      partialize: (state) => ({
        authType: state.authType,
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        email: state.email,
        avatarUrl: state.avatarUrl,
        githubToken: state.githubToken,
        githubScopes: state.githubScopes,
        buildsToday: state.buildsToday,
        maxBuildsPerDay: state.maxBuildsPerDay,
        lastBuildDate: state.lastBuildDate,
      }),
    }
  )
);

// ============================================
// V3 Onboarding Store
// ============================================

interface V3OnboardingStore extends V3OnboardingState {
  // Actions
  setOrganizationField: <K extends keyof OrganizationInfo>(
    field: K,
    value: OrganizationInfo[K]
  ) => void;
  setOrganization: (org: OrganizationInfo) => void;
  setTermsAccepted: (accepted: boolean) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useV3OnboardingStore = create<V3OnboardingStore>()(
  persist(
    (set, get) => ({
      ...v3OnboardingInitialState,

      setOrganizationField: (field, value) => {
        set((state) => ({
          organization: {
            ...state.organization,
            [field]: value,
          },
        }));
      },

      setOrganization: (org) => {
        set({
          organization: org,
        });
      },

      setTermsAccepted: (accepted) => {
        set({
          termsAccepted: accepted,
        });
      },

      completeOnboarding: () => {
        set({
          completed: true,
        });
      },

      resetOnboarding: () => {
        set(v3OnboardingInitialState);
      },
    }),
    {
      name: V3_STORAGE_KEYS.ONBOARDING,
    }
  )
);

// ============================================
// Combined Hooks
// ============================================

/**
 * Hook to check if user needs to login
 */
export function useNeedsLogin(): boolean {
  const authType = useV3AuthStore((state) => state.authType);
  return authType === null;
}

/**
 * Hook to check if user needs onboarding
 */
export function useNeedsOnboarding(): boolean {
  const completed = useV3OnboardingStore((state) => state.completed);
  return !completed;
}

/**
 * Hook to check if user can access wizard
 */
export function useCanAccessWizard(): boolean {
  const authType = useV3AuthStore((state) => state.authType);
  const onboardingCompleted = useV3OnboardingStore((state) => state.completed);
  return authType !== null && onboardingCompleted;
}

/**
 * Hook to get current auth info
 */
export function useAuthInfo() {
  const auth = useV3AuthStore();
  const onboarding = useV3OnboardingStore();

  return {
    authType: auth.authType,
    isAuthenticated: auth.isAuthenticated,
    userId: auth.userId,
    email: auth.email || onboarding.organization.email,
    avatarUrl: auth.avatarUrl,
    canBuild: auth.canBuild(),
    remainingBuilds: auth.getRemainingBuilds(),
    maxBuildsPerDay: auth.maxBuildsPerDay,
    organization: onboarding.organization,
    onboardingCompleted: onboarding.completed,
  };
}
