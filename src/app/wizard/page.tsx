'use client';

import { WizardLayout } from '@/components/wizard/wizard-layout';
import { Step1AppSelection } from '@/components/wizard/steps/step-1-app-selection';
import { Step2ProjectInfo } from '@/components/wizard/steps/step-2-project-info';
import { Step3BrandingTheme } from '@/components/wizard/steps/step-3-branding-theme';
import { Step4AppIcons } from '@/components/wizard/steps/step-4-app-icons';
import { Step5ServerConfig } from '@/components/wizard/steps/step-5-server-config';
import { Step6PlatformSelection } from '@/components/wizard/steps/step-6-platform-selection';
import { Step7FeaturesSecurity } from '@/components/wizard/steps/step-7-features-security';
import { Step8CICDDeployment } from '@/components/wizard/steps/step-8-cicd-deployment';
import { Step9CodeQuality } from '@/components/wizard/steps/step-9-code-quality';
import { Step10ReviewGenerate } from '@/components/wizard/steps/step-10-review-generate';
import { useCurrentStep } from '@/store/wizard-store';

export default function WizardPage() {
  const currentStep = useCurrentStep();

  return (
    <WizardLayout>
      <StepContent step={currentStep} />
    </WizardLayout>
  );
}

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 1:
      return <Step1AppSelection />;
    case 2:
      return <Step2ProjectInfo />;
    case 3:
      return <Step3BrandingTheme />;
    case 4:
      return <Step4AppIcons />;
    case 5:
      return <Step5ServerConfig />;
    case 6:
      return <Step6PlatformSelection />;
    case 7:
      return <Step7FeaturesSecurity />;
    case 8:
      return <Step8CICDDeployment />;
    case 9:
      return <Step9CodeQuality />;
    case 10:
      return <Step10ReviewGenerate />;
    default:
      return <Step1AppSelection />;
  }
}
