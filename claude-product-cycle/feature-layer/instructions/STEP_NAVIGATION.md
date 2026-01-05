# Step Navigation Patterns

> Wizard navigation implementation

---

## Navigation Component

```typescript
interface StepNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  canGoBack?: boolean;
  canProceed?: boolean;
  isLastStep?: boolean;
}

export function StepNavigation({
  onPrevious,
  onNext,
  canGoBack = true,
  canProceed = true,
  isLastStep = false,
}: StepNavigationProps) {
  return (
    <div className="flex justify-between pt-6 border-t">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={!canGoBack}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>

      <Button onClick={onNext} disabled={!canProceed}>
        {isLastStep ? (
          <>
            <Download className="mr-2 h-4 w-4" />
            Generate Project
          </>
        ) : (
          <>
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}
```

---

## Step Indicator

```typescript
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn(
            'w-3 h-3 rounded-full transition-colors',
            i + 1 === currentStep
              ? 'bg-primary'
              : i + 1 < currentStep
              ? 'bg-primary/50'
              : 'bg-muted'
          )}
        />
      ))}
    </div>
  );
}
```

---

## Dynamic Routing

```typescript
// app/wizard/[[...step]]/page.tsx
export default function WizardPage({ params }: { params: { step?: string[] } }) {
  const stepNumber = params.step?.[0] ? parseInt(params.step[0]) : 1;

  const StepComponent = STEP_COMPONENTS[stepNumber];

  return (
    <WizardLayout>
      <StepComponent />
    </WizardLayout>
  );
}
```
