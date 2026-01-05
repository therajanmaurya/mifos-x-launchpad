'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  Github,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  GitBranch,
  Play,
  Package,
  Download,
  RefreshCw,
  Clock,
  XCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  type GitHubAuthState,
  type GitHubRepoOptions,
  type RepoCreationResult,
  type CommitResult,
  type WorkflowRunInfo,
  type GitHubArtifact,
  type GeneratedContent,
  APP_REPOSITORIES,
  type AppType,
} from '@/types/wizard';
import {
  forkRepository,
  commitMultipleFiles,
  listWorkflowRuns,
  getWorkflowRun,
  listArtifacts,
  downloadArtifact,
  getDefaultBranch,
} from '@/lib/services/github-api';
import { GitHubAuth, RepoOptionsForm } from './github-auth';
import { cn } from '@/lib/utils';

interface GitHubGenerationProps {
  auth: GitHubAuthState;
  onAuthChange: (auth: GitHubAuthState) => void;
  repoOptions: Omit<GitHubRepoOptions, 'initReadme' | 'license' | 'templateOwner' | 'templateRepo'>;
  onRepoOptionsChange: (options: Partial<GitHubRepoOptions>) => void;
  selectedApp: AppType | null;
  generatedFiles: GeneratedContent[];
  projectName: string;
  onComplete: () => void;
}

type GenerationStep = 'auth' | 'configure' | 'creating' | 'committing' | 'waiting' | 'complete' | 'error';

export function GitHubGeneration({
  auth,
  onAuthChange,
  repoOptions,
  onRepoOptionsChange,
  selectedApp,
  generatedFiles,
  projectName,
  onComplete,
}: GitHubGenerationProps) {
  const [step, setStep] = useState<GenerationStep>('auth');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Results
  const [createdRepo, setCreatedRepo] = useState<RepoCreationResult | null>(null);
  const [commitResult, setCommitResult] = useState<CommitResult | null>(null);
  const [workflowRun, setWorkflowRun] = useState<WorkflowRunInfo | null>(null);
  const [artifacts, setArtifacts] = useState<GitHubArtifact[]>([]);

  // Auto-populate repo name from project name
  useEffect(() => {
    if (!repoOptions.name && projectName) {
      onRepoOptionsChange({
        name: projectName.toLowerCase().replace(/[^a-z0-9-]/g, '-')
      });
    }
  }, [projectName, repoOptions.name, onRepoOptionsChange]);

  // Update step based on auth state
  useEffect(() => {
    if (auth.isAuthenticated && step === 'auth') {
      setStep('configure');
    } else if (!auth.isAuthenticated) {
      setStep('auth');
    }
  }, [auth.isAuthenticated, step]);

  const handleCreateAndCommit = useCallback(async () => {
    if (!auth.accessToken || !selectedApp || generatedFiles.length === 0) {
      setError('Missing required data for repository creation');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setStep('creating');

    try {
      // Get source repository info
      const sourceRepo = APP_REPOSITORIES[selectedApp];
      if (!sourceRepo) {
        throw new Error('Invalid source application selected');
      }

      // Step 1: Fork the repository
      const forkResult = await forkRepository(
        auth.accessToken,
        sourceRepo.owner,
        sourceRepo.repo,
        repoOptions.name || undefined
      );

      if (!forkResult.success) {
        throw new Error(forkResult.error || 'Failed to fork repository');
      }

      setCreatedRepo(forkResult);
      setStep('committing');

      // Wait for GitHub to finish creating the fork (forks can take a while)
      // Retry getting the default branch with exponential backoff
      let defaultBranch: string | null = null;
      const repoName = repoOptions.name || sourceRepo.repo;

      for (let attempt = 0; attempt < 5; attempt++) {
        // Wait progressively longer: 3s, 5s, 7s, 10s, 15s
        const waitTime = [3000, 5000, 7000, 10000, 15000][attempt];
        await new Promise(resolve => setTimeout(resolve, waitTime));

        defaultBranch = await getDefaultBranch(
          auth.accessToken,
          auth.username!,
          repoName
        );

        if (defaultBranch) break;
      }

      // Use source repo's branch as fallback (usually 'development')
      if (!defaultBranch) {
        defaultBranch = sourceRepo.branch;
      }

      // Step 2: Commit generated files
      const commitFiles = generatedFiles.map(file => ({
        path: file.path,
        content: file.content,
      }));

      const commit = await commitMultipleFiles(
        auth.accessToken,
        auth.username!,
        repoOptions.name || sourceRepo.repo,
        commitFiles,
        'Apply custom configuration from MifosLaunchpad\n\n🤖 Generated with MifosLaunchpad',
        defaultBranch
      );

      if (!commit.success) {
        throw new Error(commit.error || 'Failed to commit files');
      }

      setCommitResult(commit);
      setStep('waiting');

      // Step 3: Wait for and monitor workflow runs
      // Poll for workflow runs (triggered by the commit)
      let attempts = 0;
      const maxAttempts = 30; // 5 minutes max

      while (attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // 10 second intervals

        const runs = await listWorkflowRuns(
          auth.accessToken,
          auth.username!,
          repoOptions.name || sourceRepo.repo
        );

        if (runs.length > 0) {
          const latestRun = runs[0];
          setWorkflowRun(latestRun);

          if (latestRun.status === 'completed') {
            // Get artifacts
            const runArtifacts = await listArtifacts(
              auth.accessToken,
              auth.username!,
              repoOptions.name || sourceRepo.repo,
              latestRun.id
            );
            setArtifacts(runArtifacts);
            setStep('complete');
            onComplete();
            break;
          }
        }

        attempts++;
      }

      if (attempts >= maxAttempts) {
        // Timeout - still show success but note that workflow is still running
        setStep('complete');
        onComplete();
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('error');
    } finally {
      setIsProcessing(false);
    }
  }, [auth, selectedApp, generatedFiles, repoOptions, onComplete]);

  const handleDownloadArtifact = useCallback(async (artifact: GitHubArtifact) => {
    if (!auth.accessToken || !auth.username || !createdRepo) return;

    const repoName = repoOptions.name || (selectedApp ? APP_REPOSITORIES[selectedApp]?.repo : '');

    const result = await downloadArtifact(
      auth.accessToken,
      auth.username,
      repoName,
      artifact.id
    );

    if (result.success && result.blobUrl) {
      const a = document.createElement('a');
      a.href = result.blobUrl;
      a.download = `${artifact.name}.zip`;
      a.click();
      URL.revokeObjectURL(result.blobUrl);
    }
  }, [auth, createdRepo, repoOptions.name, selectedApp]);

  const handleRetry = useCallback(() => {
    setStep('configure');
    setError(null);
    setCreatedRepo(null);
    setCommitResult(null);
    setWorkflowRun(null);
    setArtifacts([]);
  }, []);

  // Render based on current step
  return (
    <div className="space-y-6">
      {/* Step 1: Authentication */}
      <GitHubAuth auth={auth} onAuthChange={onAuthChange} />

      {/* Step 2: Configure Repository */}
      {auth.isAuthenticated && step === 'configure' && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="w-4 h-4" />
              Repository Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RepoOptionsForm
              options={repoOptions}
              onOptionsChange={onRepoOptionsChange}
              disabled={isProcessing}
            />

            <div className="p-3 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium mb-1">What will happen:</p>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Fork the {selectedApp ? APP_REPOSITORIES[selectedApp]?.repo : 'base'} repository to your account</li>
                <li>Apply {generatedFiles.length} generated configuration files</li>
                <li>Trigger CI/CD workflow to build your app</li>
              </ol>
            </div>

            <Button
              onClick={handleCreateAndCommit}
              disabled={isProcessing || !repoOptions.name}
              className="w-full"
            >
              <Github className="w-4 h-4 mr-2" />
              Create Repository & Build
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Progress */}
      {(step === 'creating' || step === 'committing' || step === 'waiting') && (
        <Card className="border-primary">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span className="font-medium">
                {step === 'creating' && 'Creating repository...'}
                {step === 'committing' && 'Committing configuration files...'}
                {step === 'waiting' && 'Waiting for build to complete...'}
              </span>
            </div>

            <Progress
              value={
                step === 'creating' ? 25 :
                step === 'committing' ? 50 :
                step === 'waiting' ? 75 : 100
              }
              className="h-2"
            />

            {createdRepo?.repoUrl && (
              <a
                href={createdRepo.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
              >
                View repository on GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {workflowRun && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">{workflowRun.name}</span>
                  </div>
                  <StatusBadge status={workflowRun.status} conclusion={workflowRun.conclusion} />
                </div>
                <a
                  href={workflowRun.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:underline mt-1 inline-flex items-center gap-1"
                >
                  View workflow run
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {step === 'complete' && (
        <Card className="border-green-500">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              <span className="font-medium text-lg">Repository Created Successfully!</span>
            </div>

            <div className="space-y-3">
              {createdRepo?.repoUrl && (
                <a
                  href={createdRepo.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="font-medium">{auth.username}/{repoOptions.name}</p>
                    <p className="text-sm text-muted-foreground">View on GitHub</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              )}

              {commitResult?.htmlUrl && (
                <a
                  href={commitResult.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                >
                  View commit
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Artifacts */}
            {artifacts.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Build Artifacts</h4>
                <div className="space-y-2">
                  {artifacts.map(artifact => (
                    <div
                      key={artifact.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{artifact.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(artifact.sizeInBytes / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadArtifact(artifact)}
                        disabled={artifact.expired}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {workflowRun && workflowRun.status !== 'completed' && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                <Clock className="w-4 h-4 inline mr-1" />
                Build is still running. Check back later for artifacts.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {step === 'error' && (
        <Card className="border-destructive">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <span className="font-medium">Repository Creation Failed</span>
            </div>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" onClick={handleRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Status badge component
function StatusBadge({ status, conclusion }: { status: string; conclusion: string | null }) {
  const getColor = () => {
    if (status === 'completed') {
      return conclusion === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    }
    if (status === 'in_progress' || status === 'queued') {
      return 'bg-yellow-100 text-yellow-700';
    }
    return 'bg-gray-100 text-gray-700';
  };

  const getIcon = () => {
    if (status === 'completed') {
      return conclusion === 'success' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />;
    }
    if (status === 'in_progress' || status === 'queued') {
      return <Loader2 className="w-3 h-3 animate-spin" />;
    }
    return null;
  };

  return (
    <span className={cn('px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1', getColor())}>
      {getIcon()}
      {status === 'completed' ? conclusion : status}
    </span>
  );
}
