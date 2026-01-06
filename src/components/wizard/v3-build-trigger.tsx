'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Rocket,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Clock,
  AlertTriangle,
  Zap,
  Info,
  Github,
  Download,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type WizardState } from '@/lib/generators';
import {
  createBuildIssue,
  pollBuildStatus,
  wizardStateToConfig,
  type BuildInfo,
  type BuildStatus,
} from '@/lib/services/github-issue';
import { useV3AuthStore, useV3OnboardingStore, useAuthInfo } from '@/store/v3-auth-store';
import { cn } from '@/lib/utils';

interface V3BuildTriggerProps {
  wizardState: WizardState;
  onComplete: () => void;
}

type TriggerStep = 'ready' | 'submitting' | 'waiting' | 'complete' | 'failed';

export function V3BuildTrigger({ wizardState, onComplete }: V3BuildTriggerProps) {
  const auth = useV3AuthStore();
  const onboarding = useV3OnboardingStore();
  const authInfo = useAuthInfo();

  const [step, setStep] = useState<TriggerStep>('ready');
  const [error, setError] = useState<string | null>(null);
  const [buildInfo, setBuildInfo] = useState<BuildInfo | null>(null);
  const [pollingStarted, setPollingStarted] = useState(false);

  // Check rate limit
  const canBuild = auth.canBuild();
  const remainingBuilds = auth.getRemainingBuilds();

  // Handle build submission
  const handleTriggerBuild = useCallback(async () => {
    if (!canBuild) {
      setError('Rate limit exceeded. Try again tomorrow.');
      return;
    }

    // For anonymous users, we can't create issues via API
    // They need to authenticate with GitHub
    if (auth.authType === 'anonymous') {
      setError('Anonymous users cannot trigger builds via API. Please sign in with GitHub to use the build feature.');
      return;
    }

    if (!auth.githubToken) {
      setError('GitHub authentication required to trigger builds.');
      return;
    }

    setStep('submitting');
    setError(null);

    try {
      // Create build config
      const config = wizardStateToConfig(
        wizardState,
        onboarding.organization,
        auth.authType!,
        authInfo.email || onboarding.organization.email,
        auth.userId
      );

      // Create GitHub issue
      const result = await createBuildIssue(auth.githubToken, config);

      if (!result.success) {
        throw new Error(result.error || 'Failed to create build request');
      }

      // Increment build count
      auth.incrementBuildCount();

      // Set initial build info
      setBuildInfo({
        issueNumber: result.issueNumber!,
        issueUrl: result.htmlUrl!,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        comments: [],
      });

      setStep('waiting');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger build');
      setStep('failed');
    }
  }, [canBuild, auth, onboarding, authInfo, wizardState]);

  // Start polling when in waiting state
  useEffect(() => {
    if (step !== 'waiting' || !buildInfo || pollingStarted || !auth.githubToken) {
      return;
    }

    setPollingStarted(true);

    const poll = async () => {
      const finalInfo = await pollBuildStatus(
        auth.githubToken!,
        buildInfo.issueNumber,
        (info) => {
          setBuildInfo(info);
        },
        { interval: 15000, timeout: 600000 } // Poll every 15s, max 10 min
      );

      if (finalInfo) {
        setBuildInfo(finalInfo);
        if (finalInfo.status === 'complete') {
          setStep('complete');
          onComplete();
        } else if (finalInfo.status === 'failed') {
          setStep('failed');
          setError('Build failed. Check the issue for details.');
        }
      }
    };

    poll();
  }, [step, buildInfo, pollingStarted, auth.githubToken, onComplete]);

  // Get status badge color
  const getStatusColor = (status: BuildStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'building': return 'bg-blue-100 text-blue-700';
      case 'complete': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get progress percentage based on status
  const getProgress = (status: BuildStatus) => {
    switch (status) {
      case 'pending': return 25;
      case 'building': return 60;
      case 'complete': return 100;
      case 'failed': return 100;
      default: return 0;
    }
  };

  return (
    <div className="space-y-6">
      {/* Rate Limit Info */}
      <Card className={cn('border', !canBuild && 'border-destructive')}>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={cn('w-4 h-4', canBuild ? 'text-green-600' : 'text-red-600')} />
              <span className="text-sm font-medium">
                Builds remaining today: {remainingBuilds}/{auth.maxBuildsPerDay}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {auth.authType === 'anonymous' && 'Sign in for more builds'}
              {auth.authType === 'github' && 'GitHub authenticated'}
              {auth.authType === 'supabase' && 'Premium account'}
            </span>
          </div>
          {!canBuild && (
            <p className="text-xs text-destructive mt-2">
              Rate limit exceeded. Build count resets daily at midnight UTC.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Anonymous User Warning */}
      {auth.authType === 'anonymous' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-800">GitHub Authentication Required</p>
                <p className="text-sm text-yellow-700 mt-1">
                  To trigger builds via the issue-based system, you need to sign in with GitHub.
                  This allows us to create build requests on your behalf.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => window.location.href = '/'}
                >
                  <Github className="w-4 h-4 mr-2" />
                  Sign in with GitHub
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ready State */}
      {step === 'ready' && auth.authType !== 'anonymous' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Rocket className="w-4 h-4" />
              Trigger Cloud Build
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-2">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">How it works:</p>
                  <ol className="list-decimal list-inside text-muted-foreground mt-1 space-y-1">
                    <li>Your configuration is submitted as a GitHub issue</li>
                    <li>GitHub Actions workflow picks up the build request</li>
                    <li>Your custom app is built from source</li>
                    <li>Download links appear when build completes</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <p className="text-sm font-medium mb-2">Build Configuration</p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Base App:</span>
                <span>{wizardState.step1.selectedApp}</span>
                <span className="text-muted-foreground">Project:</span>
                <span>{wizardState.step2.displayName || wizardState.step2.projectName}</span>
                <span className="text-muted-foreground">Package:</span>
                <span className="font-mono text-xs">{wizardState.step2.packageName}</span>
                <span className="text-muted-foreground">Platforms:</span>
                <span>
                  {[
                    wizardState.step6.platforms.android.enabled && 'Android',
                    wizardState.step6.platforms.ios.enabled && 'iOS',
                    wizardState.step6.platforms.desktop.enabled && 'Desktop',
                    wizardState.step6.platforms.web.enabled && 'Web',
                  ].filter(Boolean).join(', ') || 'None selected'}
                </span>
              </div>
            </div>

            <Button
              size="lg"
              onClick={handleTriggerBuild}
              disabled={!canBuild}
              className="w-full gap-2"
            >
              <Rocket className="w-5 h-5" />
              Start Build
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Submitting State */}
      {step === 'submitting' && (
        <Card className="border-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">Creating build request...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting State */}
      {step === 'waiting' && buildInfo && (
        <Card className="border-blue-500">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                <span className="font-medium">Build in progress...</span>
              </div>
              <span className={cn('px-2 py-1 rounded text-xs font-medium', getStatusColor(buildInfo.status))}>
                {buildInfo.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <Progress value={getProgress(buildInfo.status)} className="h-2" />

            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Issue #</span>
                <a
                  href={buildInfo.issueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  {buildInfo.issueNumber}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Started</span>
                <span>{new Date(buildInfo.createdAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Builds typically take 5-15 minutes</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete State */}
      {step === 'complete' && buildInfo && (
        <Card className="border-green-500">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-medium text-lg">Build Complete!</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Your custom app has been built successfully. Check the release page to download your app.
            </p>

            <div className="space-y-3">
              {buildInfo.releaseUrl && (
                <a
                  href={buildInfo.releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Download className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <p className="font-medium text-green-800">Download Release</p>
                    <p className="text-sm text-green-600">APK, IPA, and other artifacts</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-green-600" />
                </a>
              )}

              <a
                href={buildInfo.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <Github className="w-5 h-5" />
                <div className="flex-1">
                  <p className="font-medium">View Build Details</p>
                  <p className="text-sm text-muted-foreground">Issue #{buildInfo.issueNumber}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setStep('ready');
                setBuildInfo(null);
                setPollingStarted(false);
              }}
              className="w-full"
            >
              Start Another Build
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Failed State */}
      {step === 'failed' && (
        <Card className="border-destructive">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <span className="font-medium">Build Failed</span>
            </div>

            <p className="text-sm text-muted-foreground">{error}</p>

            {buildInfo && (
              <a
                href={buildInfo.issueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                View issue for details
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setStep('ready');
                setError(null);
                setBuildInfo(null);
                setPollingStarted(false);
              }}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && step === 'ready' && (
        <Card className="border-destructive">
          <CardContent className="pt-4">
            <div className="flex items-start gap-2 text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
