'use client';

import {
  Smartphone,
  FileText,
  Palette,
  Image as ImageIcon,
  Server,
  Monitor,
  Shield,
  GitBranch,
  TestTube2,
  Download,
  Upload,
  Edit,
  CheckCircle2,
  Loader2,
  AlertCircle,
  RefreshCw,
  Folder,
  File,
  ChevronRight,
  Package,
  FileCode,
  AlertTriangle,
  Github,
  Cloud,
  Rocket,
} from 'lucide-react';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useReviewGenerate } from '@/store/wizard-store';
import {
  APP_OPTIONS,
  type GenerationStage,
  type GenerationMode,
  type GitHubAuthState,
  type GitHubRepoOptions,
  type GeneratedContent,
  gitHubAuthInitialState,
} from '@/types/wizard';
import { cn } from '@/lib/utils';
import {
  generateDownloadBundle,
  generateProject,
  getGenerationSummary,
  type WizardState,
} from '@/lib/generators';
import { GitHubGeneration } from '../github-generation';
import { V3BuildTrigger } from '../v3-build-trigger';

export function Step10ReviewGenerate() {
  const {
    isGenerating,
    generationProgress,
    downloadUrl,
    downloadFileName,
    downloadSize,
    error,
    summary,
    startGeneration,
    setGenerationProgress,
    setDownloadReady,
    setGenerationError,
    resetGeneration,
    exportConfig,
    importConfig,
    resetWizard,
    setCurrentStep,
  } = useReviewGenerate();

  const [showImportDialog, setShowImportDialog] = useState(false);

  // Generation mode state - extended for V3
  type ExtendedGenerationMode = GenerationMode | 'v3-build';
  const [generationMode, setGenerationMode] = useState<ExtendedGenerationMode>('download');
  const [githubAuth, setGithubAuth] = useState<GitHubAuthState>(gitHubAuthInitialState);
  const [githubRepoOptions, setGithubRepoOptions] = useState<Omit<GitHubRepoOptions, 'initReadme' | 'license' | 'templateOwner' | 'templateRepo'>>({
    name: summary.step2.projectName?.toLowerCase().replace(/[^a-z0-9-]/g, '-') || '',
    description: summary.step2.description || '',
    visibility: 'private',
  });
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedContent[]>([]);

  const handleExport = useCallback(() => {
    const json = exportConfig();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${summary.step2.projectName || 'mifos-app'}-config.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportConfig, summary.step2.projectName]);

  const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        const success = importConfig(json);
        if (!success) {
          alert('Failed to import configuration. Invalid format.');
        }
      };
      reader.readAsText(file);
    }
    setShowImportDialog(false);
  }, [importConfig]);

  const [generationWarnings, setGenerationWarnings] = useState<string[]>([]);
  const [generatedFileCount, setGeneratedFileCount] = useState(0);

  const handleGenerate = useCallback(async () => {
    startGeneration();
    setGenerationWarnings([]);
    setGeneratedFileCount(0);

    try {
      // Build wizard state from summary
      const wizardState: WizardState = {
        step1: summary.step1,
        step2: summary.step2,
        step3: summary.step3,
        step4: summary.step4,
        step5: summary.step5,
        step6: summary.step6,
        step7: summary.step7,
        step8: summary.step8,
        step9: summary.step9,
      };

      // Progress callback
      const onProgress = (stage: string, step: number, total: number, message: string) => {
        const stageMap: Record<string, GenerationStage> = {
          'validating': 'validating',
          'fetching': 'generating-gradle',
          'generating-gradle': 'generating-gradle',
          'generating-android': 'generating-theme',
          'generating-ios': 'processing-icons',
          'generating-web': 'generating-config',
          'generating-cicd': 'generating-cicd',
          'creating-zip': 'creating-zip',
        };

        setGenerationProgress({
          stage: stageMap[stage] || 'validating',
          step,
          total,
          message,
        });
      };

      // Generate the bundle using real generators
      const result = await generateDownloadBundle(wizardState, onProgress);

      // Store warnings
      if (result.warnings.length > 0) {
        setGenerationWarnings(result.warnings);
      }

      // Check for errors
      if (result.errors.length > 0) {
        setGenerationError(result.errors.join('\n'));
        return;
      }

      // Create download URL
      const url = URL.createObjectURL(result.blob);
      setGeneratedFileCount(result.fileCount);
      setDownloadReady(url, result.fileName, result.blob.size);

    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  }, [startGeneration, setGenerationProgress, setDownloadReady, setGenerationError, summary]);

  const handleDownload = useCallback(() => {
    if (downloadUrl && downloadFileName) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = downloadFileName;
      a.click();
    }
  }, [downloadUrl, downloadFileName]);

  const handleStartNew = useCallback(() => {
    resetWizard();
    setCurrentStep(1);
  }, [resetWizard, setCurrentStep]);

  // Prepare files for GitHub generation
  const handlePrepareForGitHub = useCallback(async () => {
    startGeneration();

    try {
      const wizardState: WizardState = {
        step1: summary.step1,
        step2: summary.step2,
        step3: summary.step3,
        step4: summary.step4,
        step5: summary.step5,
        step6: summary.step6,
        step7: summary.step7,
        step8: summary.step8,
        step9: summary.step9,
      };

      const onProgress = (stage: string, step: number, total: number, message: string) => {
        const stageMap: Record<string, GenerationStage> = {
          'validating': 'validating',
          'fetching': 'generating-gradle',
          'generating-gradle': 'generating-gradle',
          'generating-android': 'generating-theme',
          'generating-ios': 'processing-icons',
          'generating-web': 'generating-config',
          'generating-cicd': 'generating-cicd',
        };
        setGenerationProgress({
          stage: stageMap[stage] || 'validating',
          step,
          total,
          message,
        });
      };

      const result = await generateProject(wizardState, onProgress);

      if (result.errors.length > 0) {
        setGenerationError(result.errors.join('\n'));
        return;
      }

      setGeneratedFiles(result.files);
      setGenerationProgress({
        stage: 'complete',
        step: 7,
        total: 7,
        message: 'Files ready for GitHub',
      });
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [summary, startGeneration, setGenerationProgress, setGenerationError]);

  const handleGitHubComplete = useCallback(() => {
    // Reset generation state when GitHub flow completes
    setGeneratedFiles([]);
    resetGeneration();
  }, [resetGeneration]);

  const progressPercent = (generationProgress.step / generationProgress.total) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Review & Generate</h2>
          <p className="text-muted-foreground mt-1">
            Review your configuration and generate your project
          </p>
        </div>

        {/* Generation Progress/Complete State */}
        {(isGenerating || generationProgress.stage === 'complete' || error) && (
          <Card className={cn(
            'border-2',
            error ? 'border-destructive' : generationProgress.stage === 'complete' ? 'border-green-500' : 'border-primary'
          )}>
            <CardContent className="pt-6">
              {isGenerating && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    <span className="font-medium">Generating Project...</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {generationProgress.message} ({generationProgress.step}/{generationProgress.total})
                  </p>
                </div>
              )}

              {generationProgress.stage === 'complete' && !isGenerating && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-green-600">
                    <CheckCircle2 className="w-6 h-6" />
                    <span className="font-medium text-lg">Project Generated Successfully!</span>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Package className="w-8 h-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{downloadFileName}</p>
                        <p className="text-sm text-muted-foreground">
                          {generatedFileCount} files generated | Size: {downloadSize ? (downloadSize / 1024).toFixed(1) : 0} KB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Warnings */}
                  {generationWarnings.length > 0 && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800">Warnings:</p>
                          <ul className="list-disc list-inside text-yellow-700 mt-1">
                            {generationWarnings.map((warning, i) => (
                              <li key={i}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button onClick={handleDownload} className="gap-2">
                      <Download className="w-4 h-4" />
                      Download Configuration
                    </Button>
                    <Button variant="outline" onClick={handleStartNew} className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Start New Project
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-medium">Generation Failed</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{error}</p>
                  <Button variant="outline" onClick={resetGeneration} className="gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Configuration Summary */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Configuration Summary</h3>

          {/* Step 1: App Selection */}
          <SummaryCard
            title="Base Application"
            icon={<Smartphone className="w-4 h-4" />}
            stepNumber={1}
            onEdit={() => setCurrentStep(1)}
          >
            <p className="font-medium">
              {APP_OPTIONS.find((a) => a.id === summary.step1.selectedApp)?.name || 'Not selected'}
            </p>
            {summary.step1.appFeatures.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Features: {summary.step1.appFeatures.join(', ')}
              </p>
            )}
          </SummaryCard>

          {/* Step 2: Project Info */}
          <SummaryCard
            title="Project Info"
            icon={<FileText className="w-4 h-4" />}
            stepNumber={2}
            onEdit={() => setCurrentStep(2)}
          >
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted-foreground">Name:</span>
              <span>{summary.step2.displayName || summary.step2.projectName || 'Not set'}</span>
              <span className="text-muted-foreground">Package:</span>
              <span className="font-mono text-xs">{summary.step2.packageName || 'Not set'}</span>
              <span className="text-muted-foreground">Version:</span>
              <span>{summary.step2.versionName} ({summary.step2.versionCode})</span>
            </div>
          </SummaryCard>

          {/* Step 3: Branding */}
          <SummaryCard
            title="Branding & Theme"
            icon={<Palette className="w-4 h-4" />}
            stepNumber={3}
            onEdit={() => setCurrentStep(3)}
          >
            <div className="flex items-center gap-4">
              <div className="flex gap-1">
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: summary.step3.colors.primary }}
                  title="Primary"
                />
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: summary.step3.colors.secondary }}
                  title="Secondary"
                />
                <div
                  className="w-6 h-6 rounded border"
                  style={{ backgroundColor: summary.step3.colors.accent }}
                  title="Accent"
                />
              </div>
              <span className="text-sm text-muted-foreground">
                Dark mode: {summary.step3.darkModeEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </SummaryCard>

          {/* Step 4: App Icons */}
          <SummaryCard
            title="App Icons"
            icon={<ImageIcon className="w-4 h-4" />}
            stepNumber={4}
            onEdit={() => setCurrentStep(4)}
          >
            <div className="flex items-center gap-3">
              {summary.step4.generatedIcons?.android && (
                <img
                  src={summary.step4.generatedIcons.android['192']}
                  alt="App icon"
                  className="w-12 h-12 rounded-lg"
                />
              )}
              <div className="text-sm">
                <p>Shape: {summary.step4.iconShape}</p>
                <p className="text-muted-foreground">
                  {summary.step4.generatedIcons ? 'Icons generated' : 'No icons generated'}
                </p>
              </div>
            </div>
          </SummaryCard>

          {/* Step 5: Server Config */}
          <SummaryCard
            title="Server Configuration"
            icon={<Server className="w-4 h-4" />}
            stepNumber={5}
            onEdit={() => setCurrentStep(5)}
          >
            <p className="text-sm">
              {Object.values(summary.step5.environments).filter(e => e.enabled).length} environment(s) enabled
            </p>
            <p className="text-sm text-muted-foreground">
              Timeout: {summary.step5.connectionTimeout / 1000}s
            </p>
          </SummaryCard>

          {/* Step 6: Platforms */}
          <SummaryCard
            title="Platforms"
            icon={<Monitor className="w-4 h-4" />}
            stepNumber={6}
            onEdit={() => setCurrentStep(6)}
          >
            <div className="flex flex-wrap gap-2">
              {summary.step6.platforms.android.enabled && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">Android</span>
              )}
              {summary.step6.platforms.ios.enabled && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">iOS</span>
              )}
              {summary.step6.platforms.desktop.enabled && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">Desktop</span>
              )}
              {summary.step6.platforms.web.enabled && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded">Web</span>
              )}
            </div>
          </SummaryCard>

          {/* Step 7: Features & Security */}
          <SummaryCard
            title="Features & Security"
            icon={<Shield className="w-4 h-4" />}
            stepNumber={7}
            onEdit={() => setCurrentStep(7)}
          >
            <div className="flex flex-wrap gap-2 text-sm">
              {summary.step7.security.biometric && <span className="text-muted-foreground">Biometric</span>}
              {summary.step7.security.sslPinning && <span className="text-muted-foreground">SSL Pinning</span>}
              {summary.step7.twoFactorAuth && <span className="text-muted-foreground">2FA</span>}
              {summary.step7.analytics.firebase && <span className="text-muted-foreground">Firebase</span>}
            </div>
          </SummaryCard>

          {/* Step 8: CI/CD */}
          <SummaryCard
            title="CI/CD & Deployment"
            icon={<GitBranch className="w-4 h-4" />}
            stepNumber={8}
            onEdit={() => setCurrentStep(8)}
          >
            <p className="text-sm capitalize">{summary.step8.ciPlatform.replace('-', ' ')}</p>
            <div className="flex gap-2 text-xs text-muted-foreground">
              {summary.step8.firebase.enabled && <span>Firebase</span>}
              {summary.step8.playStore.enabled && <span>Play Store</span>}
              {summary.step8.appStore.enabled && <span>App Store</span>}
            </div>
          </SummaryCard>

          {/* Step 9: Code Quality */}
          <SummaryCard
            title="Code Quality"
            icon={<TestTube2 className="w-4 h-4" />}
            stepNumber={9}
            onEdit={() => setCurrentStep(9)}
          >
            <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
              {summary.step9.testing.unitTests && <span>Unit Tests</span>}
              {summary.step9.linting.detekt && <span>Detekt</span>}
              {summary.step9.linting.ktlint && <span>ktlint</span>}
              {summary.step9.coverage.enabled && <span>Coverage {summary.step9.coverage.minimumPercent}%</span>}
            </div>
          </SummaryCard>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={handleExport} className="gap-2">
            <Download className="w-4 h-4" />
            Export JSON
          </Button>
          <label>
            <Button variant="outline" asChild className="gap-2 cursor-pointer">
              <span>
                <Upload className="w-4 h-4" />
                Import JSON
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImport}
            />
          </label>
        </div>

        {/* Generation Preview */}
        {generationProgress.stage === 'idle' && summary.step1.selectedApp && (
          <GenerationPreview summary={summary} />
        )}

        {/* Mode Selector */}
        {generationProgress.stage === 'idle' && summary.step1.selectedApp && (
          <Card className="border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Choose Generation Method</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setGenerationMode('download')}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    generationMode === 'download'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Download className="w-6 h-6 mb-2 text-primary" />
                  <p className="font-medium">Download ZIP</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Download config files
                  </p>
                </button>

                <button
                  onClick={() => setGenerationMode('v3-build')}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all relative',
                    generationMode === 'v3-build'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded">NEW</span>
                  <Rocket className="w-6 h-6 mb-2 text-primary" />
                  <p className="font-medium">Cloud Build</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Build via GitHub Actions
                  </p>
                </button>

                <button
                  onClick={() => setGenerationMode('github')}
                  className={cn(
                    'p-4 rounded-lg border-2 text-left transition-all',
                    generationMode === 'github'
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  <Github className="w-6 h-6 mb-2 text-primary" />
                  <p className="font-medium">Fork Repo</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Fork to your account
                  </p>
                </button>
              </div>

              {/* Download Mode Button */}
              {generationMode === 'download' && (
                <Button
                  size="lg"
                  onClick={handleGenerate}
                  className="w-full gap-2"
                >
                  <Package className="w-5 h-5" />
                  Generate & Download ZIP
                </Button>
              )}

              {/* GitHub Mode - Prepare Files */}
              {generationMode === 'github' && generatedFiles.length === 0 && !isGenerating && (
                <Button
                  size="lg"
                  onClick={handlePrepareForGitHub}
                  className="w-full gap-2"
                >
                  <Cloud className="w-5 h-5" />
                  Prepare Files for GitHub
                </Button>
              )}

              {/* V3 Cloud Build Mode */}
              {generationMode === 'v3-build' && (
                <V3BuildTrigger
                  wizardState={{
                    step1: summary.step1,
                    step2: summary.step2,
                    step3: summary.step3,
                    step4: summary.step4,
                    step5: summary.step5,
                    step6: summary.step6,
                    step7: summary.step7,
                    step8: summary.step8,
                    step9: summary.step9,
                  } as WizardState}
                  onComplete={() => {
                    // Reset or show success
                    resetGeneration();
                  }}
                />
              )}
            </CardContent>
          </Card>
        )}

        {/* GitHub Generation Flow */}
        {generationMode === 'github' && generatedFiles.length > 0 && (
          <GitHubGeneration
            auth={githubAuth}
            onAuthChange={setGithubAuth}
            repoOptions={githubRepoOptions}
            onRepoOptionsChange={(opts) => setGithubRepoOptions(prev => ({ ...prev, ...opts }))}
            selectedApp={summary.step1.selectedApp}
            generatedFiles={generatedFiles}
            projectName={summary.step2.projectName || 'MifosApp'}
            onComplete={handleGitHubComplete}
          />
        )}
      </div>

      {/* File Tree Preview - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <FileTreePreview projectName={summary.step2.projectName || 'MifosApp'} />
      </div>
    </div>
  );
}

// ============================================
// Summary Card Component
// ============================================

interface SummaryCardProps {
  title: string;
  icon: React.ReactNode;
  stepNumber: number;
  onEdit: () => void;
  children: React.ReactNode;
}

function SummaryCard({ title, icon, stepNumber, onEdit, children }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {icon}
            </div>
            <div className="space-y-1">
              <p className="font-medium text-sm">{title}</p>
              {children}
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit} className="shrink-0">
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// File Tree Preview Component
// ============================================

function FileTreePreview({ projectName }: { projectName: string }) {
  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Folder className="w-4 h-4" />
            Generated Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-mono text-sm space-y-1">
            <TreeItem name={projectName} type="folder" level={0}>
              <TreeItem name="composeApp" type="folder" level={1}>
                <TreeItem name="src" type="folder" level={2}>
                  <TreeItem name="commonMain" type="folder" level={3} />
                  <TreeItem name="androidMain" type="folder" level={3} />
                  <TreeItem name="iosMain" type="folder" level={3} />
                </TreeItem>
                <TreeItem name="build.gradle.kts" type="file" level={2} />
              </TreeItem>
              <TreeItem name="androidApp" type="folder" level={1}>
                <TreeItem name="src" type="folder" level={2} />
                <TreeItem name="build.gradle.kts" type="file" level={2} />
              </TreeItem>
              <TreeItem name="iosApp" type="folder" level={1}>
                <TreeItem name="iosApp.xcodeproj" type="folder" level={2} />
              </TreeItem>
              <TreeItem name=".github" type="folder" level={1}>
                <TreeItem name="workflows" type="folder" level={2}>
                  <TreeItem name="build.yml" type="file" level={3} />
                  <TreeItem name="release.yml" type="file" level={3} />
                </TreeItem>
              </TreeItem>
              <TreeItem name="gradle" type="folder" level={1} />
              <TreeItem name="build.gradle.kts" type="file" level={1} />
              <TreeItem name="settings.gradle.kts" type="file" level={1} />
              <TreeItem name="README.md" type="file" level={1} />
            </TreeItem>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            ~50+ files will be generated
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface TreeItemProps {
  name: string;
  type: 'file' | 'folder';
  level: number;
  children?: React.ReactNode;
}

function TreeItem({ name, type, level, children }: TreeItemProps) {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = !!children;

  return (
    <div>
      <div
        className={cn(
          'flex items-center gap-1 py-0.5 hover:bg-muted/50 rounded cursor-pointer',
          level > 0 && 'ml-4'
        )}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {type === 'folder' ? (
          <>
            <ChevronRight
              className={cn(
                'w-3 h-3 transition-transform',
                expanded && 'rotate-90',
                !hasChildren && 'invisible'
              )}
            />
            <Folder className="w-4 h-4 text-blue-500" />
          </>
        ) : (
          <>
            <span className="w-3" />
            <File className="w-4 h-4 text-muted-foreground" />
          </>
        )}
        <span className="text-xs">{name}</span>
      </div>
      {expanded && children}
    </div>
  );
}

// ============================================
// Generation Preview Component
// ============================================

interface GenerationPreviewProps {
  summary: {
    step1: { selectedApp: string | null };
    step2: { projectName: string; displayName: string; packageName: string };
    step6: {
      platforms: {
        android: { enabled: boolean };
        ios: { enabled: boolean };
        desktop: { enabled: boolean };
        web: { enabled: boolean };
      };
    };
  };
}

function GenerationPreview({ summary }: GenerationPreviewProps) {
  const generationInfo = getGenerationSummary({
    step1: summary.step1 as WizardState['step1'],
    step2: summary.step2 as WizardState['step2'],
    step3: {} as WizardState['step3'],
    step4: {} as WizardState['step4'],
    step5: {} as WizardState['step5'],
    step6: {
      platforms: {
        android: { enabled: summary.step6.platforms.android.enabled },
        ios: { enabled: summary.step6.platforms.ios.enabled },
        desktop: { enabled: summary.step6.platforms.desktop.enabled },
        web: { enabled: summary.step6.platforms.web.enabled },
      },
    } as WizardState['step6'],
    step7: {} as WizardState['step7'],
    step8: {} as WizardState['step8'],
    step9: {} as WizardState['step9'],
  });

  return (
    <Card className="bg-blue-50/50 border-blue-200">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start gap-3">
          <FileCode className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium text-blue-900">Ready to Generate</p>
            <div className="text-sm text-blue-700 space-y-1">
              <p>
                <span className="font-medium">{generationInfo.fileCount} files</span> will be generated for{' '}
                <span className="font-medium">{generationInfo.platforms.join(', ')}</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {generationInfo.generators.map((gen, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {gen}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
