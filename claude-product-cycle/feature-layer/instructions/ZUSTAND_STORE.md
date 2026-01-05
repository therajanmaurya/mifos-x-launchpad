# Zustand Store Patterns

> State management with Zustand

---

## Store Structure

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WizardState {
  currentStep: number;
  step1: Step1State;
  step2: Step2State;
  // ...
}

interface WizardActions {
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  updateStep1: (data: Partial<Step1State>) => void;
  resetWizard: () => void;
}

export const useWizardStore = create<WizardState & WizardActions>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStep: 1,
      step1: { selectedApp: null, appFeatures: [] },

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 10) {
          set({ currentStep: currentStep + 1 });
        }
      },

      previousStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },

      updateStep1: (data) => set((state) => ({
        step1: { ...state.step1, ...data }
      })),

      resetWizard: () => set(initialState),
    }),
    {
      name: 'mifosforge-wizard',
    }
  )
);
```

---

## Selectors

```typescript
// Use selectors for performance
const useStep1 = () => useWizardStore((state) => state.step1);
const useCurrentStep = () => useWizardStore((state) => state.currentStep);

// In component
function MyComponent() {
  const step1 = useStep1(); // Only re-renders when step1 changes
}
```

---

## Slice Pattern

```typescript
const createStep1Slice: StateCreator<WizardStore, [], [], Step1Slice> = (set) => ({
  selectedApp: null,
  appFeatures: [],

  selectApp: (app) => set({ selectedApp: app }),
  clearSelection: () => set({ selectedApp: null, appFeatures: [] }),
});
```
