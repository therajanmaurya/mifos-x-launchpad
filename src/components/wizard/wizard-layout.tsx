'use client';

import { ArrowLeft, Github, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useWizardNavigation, useCanProceed } from '@/store/wizard-store';
import { STEP_LABELS, TOTAL_STEPS } from '@/types/wizard';

interface WizardLayoutProps {
  children: React.ReactNode;
}

export function WizardLayout({ children }: WizardLayoutProps) {
  const {
    currentStep,
    nextStep,
    previousStep,
    isFirstStep,
    isLastStep,
    progress
  } = useWizardNavigation();

  const { canProceed, errors } = useCanProceed();

  const handleNext = () => {
    if (canProceed) {
      nextStep();
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">M</span>
              </div>
              <span className="font-semibold">MifosLaunchpad</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Step {currentStep} of {TOTAL_STEPS}
            </span>
            <a
              href="https://github.com/openMF"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Progress value={progress} className="h-2 flex-1" />
            <span className="text-sm font-medium text-muted-foreground min-w-[60px] text-right">
              {Math.round(progress)}%
            </span>
          </div>
          {/* Step Indicator */}
          <div className="mt-3 flex items-center justify-between overflow-x-auto pb-2 -mb-2">
            <StepIndicator />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer Navigation */}
      <footer className="border-t bg-background sticky bottom-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={previousStep}
            disabled={isFirstStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center gap-4">
            {errors.length > 0 && (
              <div className="hidden sm:flex items-center gap-2">
                {errors[0].toLowerCase().includes('loading') && (
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                )}
                <span className={`text-sm ${errors[0].toLowerCase().includes('loading') ? 'text-muted-foreground' : 'text-destructive'}`}>
                  {errors[0]}
                </span>
              </div>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed || isLastStep}
            >
              {isLastStep ? 'Generate Project' : 'Next Step'}
              {!isLastStep && (
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StepIndicator() {
  const { currentStep, maxStepReached, setCurrentStep } = useWizardNavigation();

  return (
    <div className="flex items-center gap-1 min-w-max">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => {
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        const isReachable = step <= maxStepReached;

        return (
          <button
            key={step}
            onClick={() => isReachable && setCurrentStep(step)}
            disabled={!isReachable}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium
              transition-all
              ${isActive
                ? 'bg-primary text-primary-foreground'
                : isCompleted
                  ? 'bg-primary/20 text-primary hover:bg-primary/30'
                  : isReachable
                    ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                    : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
              }
            `}
            title={STEP_LABELS[step]}
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] border border-current/20">
              {step}
            </span>
            <span className="hidden lg:inline">{STEP_LABELS[step]}</span>
          </button>
        );
      })}
    </div>
  );
}
