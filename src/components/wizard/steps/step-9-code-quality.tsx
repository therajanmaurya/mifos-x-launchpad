'use client';

import {
  TestTube2,
  FileSearch,
  GitCommit,
  BarChart3,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
  Layout,
  Camera,
  Workflow,
  CheckSquare,
  Sparkles,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCodeQualityConfig } from '@/store/wizard-store';
import {
  TESTING_OPTIONS,
  LINTING_OPTIONS,
  HOOKS_OPTIONS,
  COVERAGE_PERCENTAGES,
  type TestingConfig,
  type LintingConfig,
  type HooksConfig,
  type Step9State,
} from '@/types/wizard';
import { cn } from '@/lib/utils';

type SectionKey = 'testing' | 'linting' | 'hooks' | 'coverage';

export function Step9CodeQuality() {
  const {
    testing,
    linting,
    hooks,
    coverage,
    updateTestingConfig,
    updateLintingConfig,
    updateHooksConfig,
    updateCoverageConfig,
    resetCodeQuality,
  } = useCodeQualityConfig();

  const [expandedSection, setExpandedSection] = useState<SectionKey | null>('testing');

  const toggleSection = (section: SectionKey) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Code Quality</h2>
          <p className="text-muted-foreground mt-1">
            Configure testing frameworks, linting tools, and code quality standards
          </p>
        </div>

        {/* Testing Section */}
        <SectionCard
          title="Testing Frameworks"
          description="Choose test types for your project"
          icon={<TestTube2 className="w-5 h-5" />}
          isExpanded={expandedSection === 'testing'}
          onToggle={() => toggleSection('testing')}
        >
          <div className="space-y-4">
            {TESTING_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {getTestingIcon(option.id)}
                  </div>
                  <div className="space-y-0.5">
                    <Label>{option.name}</Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={testing[option.id]}
                  onCheckedChange={(checked) =>
                    updateTestingConfig({ [option.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Linting Section */}
        <SectionCard
          title="Linting & Static Analysis"
          description="Enforce code style and find issues"
          icon={<FileSearch className="w-5 h-5" />}
          isExpanded={expandedSection === 'linting'}
          onToggle={() => toggleSection('linting')}
        >
          <div className="space-y-4">
            {LINTING_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {getLintingIcon(option.id)}
                  </div>
                  <div className="space-y-0.5">
                    <Label>{option.name}</Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={linting[option.id]}
                  onCheckedChange={(checked) =>
                    updateLintingConfig({ [option.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Git Hooks Section */}
        <SectionCard
          title="Git Hooks"
          description="Automate quality checks on commits"
          icon={<GitCommit className="w-5 h-5" />}
          isExpanded={expandedSection === 'hooks'}
          onToggle={() => toggleSection('hooks')}
        >
          <div className="space-y-4">
            {HOOKS_OPTIONS.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {getHooksIcon(option.id)}
                  </div>
                  <div className="space-y-0.5">
                    <Label>{option.name}</Label>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </div>
                </div>
                <Switch
                  checked={hooks[option.id]}
                  onCheckedChange={(checked) =>
                    updateHooksConfig({ [option.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Code Coverage Section */}
        <SectionCard
          title="Code Coverage"
          description="Set coverage requirements"
          icon={<BarChart3 className="w-5 h-5" />}
          isExpanded={expandedSection === 'coverage'}
          onToggle={() => toggleSection('coverage')}
          toggleControl={
            <Switch
              checked={coverage.enabled}
              onCheckedChange={(checked) => updateCoverageConfig({ enabled: checked })}
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          {coverage.enabled && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Minimum Coverage</Label>
                  <span className="text-sm font-medium">{coverage.minimumPercent}%</span>
                </div>
                <Slider
                  value={[coverage.minimumPercent]}
                  onValueChange={([value]) =>
                    updateCoverageConfig({ minimumPercent: value })
                  }
                  min={0}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Quick Select</Label>
                <Select
                  value={coverage.minimumPercent.toString()}
                  onValueChange={(value) =>
                    updateCoverageConfig({ minimumPercent: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COVERAGE_PERCENTAGES.map((percent) => (
                      <SelectItem key={percent} value={percent.toString()}>
                        {percent}% coverage
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="space-y-0.5">
                  <Label>Fail on Decrease</Label>
                  <p className="text-xs text-muted-foreground">
                    Fail builds if coverage decreases
                  </p>
                </div>
                <Switch
                  checked={coverage.failOnDecrease}
                  onCheckedChange={(checked) =>
                    updateCoverageConfig({ failOnDecrease: checked })
                  }
                />
              </div>
            </div>
          )}
        </SectionCard>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetCodeQuality} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <CodeQualityPreviewPanel
          testing={testing}
          linting={linting}
          hooks={hooks}
          coverage={coverage}
        />
      </div>
    </div>
  );
}

// ============================================
// Section Card Component
// ============================================

interface SectionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  toggleControl?: React.ReactNode;
  children: React.ReactNode;
}

function SectionCard({
  title,
  description,
  icon,
  isExpanded,
  onToggle,
  toggleControl,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {toggleControl}
            <Button variant="ghost" size="sm" onClick={onToggle}>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

// ============================================
// Preview Panel Component
// ============================================

interface CodeQualityPreviewPanelProps {
  testing: TestingConfig;
  linting: LintingConfig;
  hooks: HooksConfig;
  coverage: Step9State['coverage'];
}

function CodeQualityPreviewPanel({
  testing,
  linting,
  hooks,
  coverage,
}: CodeQualityPreviewPanelProps) {
  const enabledTesting = TESTING_OPTIONS.filter((opt) => testing[opt.id]);
  const enabledLinting = LINTING_OPTIONS.filter((opt) => linting[opt.id]);
  const enabledHooks = HOOKS_OPTIONS.filter((opt) => hooks[opt.id]);

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TestTube2 className="w-4 h-4" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Testing */}
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <TestTube2 className="w-3 h-3" />
              Testing ({enabledTesting.length})
            </p>
            {enabledTesting.length === 0 ? (
              <p className="text-xs text-muted-foreground">No testing enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledTesting.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{opt.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Linting */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <FileSearch className="w-3 h-3" />
              Linting ({enabledLinting.length})
            </p>
            {enabledLinting.length === 0 ? (
              <p className="text-xs text-muted-foreground">No linting enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledLinting.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{opt.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Git Hooks */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <GitCommit className="w-3 h-3" />
              Git Hooks ({enabledHooks.length})
            </p>
            {enabledHooks.length === 0 ? (
              <p className="text-xs text-muted-foreground">No hooks enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledHooks.map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{opt.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Coverage */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              Code Coverage
            </p>
            {coverage.enabled ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Minimum</span>
                  <span className="font-medium">{coverage.minimumPercent}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${coverage.minimumPercent}%` }}
                  />
                </div>
                {coverage.failOnDecrease && (
                  <p className="text-xs text-muted-foreground">
                    Fail on decrease enabled
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">Coverage disabled</p>
            )}
          </div>

          {/* Generated Files */}
          <div className="space-y-3 pt-3 border-t">
            <p className="text-sm font-medium">Generated Files</p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {(linting.detekt || linting.ktlint || linting.spotless) && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  detekt.yml / .editorconfig
                </p>
              )}
              {(hooks.preCommit || hooks.husky) && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  .pre-commit-config.yaml
                </p>
              )}
              {hooks.conventionalCommits && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  commitlint.config.js
                </p>
              )}
              {coverage.enabled && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  jacoco.gradle.kts
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// Helper Functions
// ============================================

function getTestingIcon(id: keyof TestingConfig) {
  switch (id) {
    case 'unitTests':
      return <TestTube2 className="w-4 h-4" />;
    case 'uiTests':
      return <Layout className="w-4 h-4" />;
    case 'screenshotTests':
      return <Camera className="w-4 h-4" />;
    case 'maestro':
      return <Workflow className="w-4 h-4" />;
    default:
      return <TestTube2 className="w-4 h-4" />;
  }
}

function getLintingIcon(id: keyof LintingConfig) {
  switch (id) {
    case 'detekt':
      return <FileSearch className="w-4 h-4" />;
    case 'ktlint':
      return <CheckSquare className="w-4 h-4" />;
    case 'spotless':
      return <Sparkles className="w-4 h-4" />;
    default:
      return <FileSearch className="w-4 h-4" />;
  }
}

function getHooksIcon(id: keyof HooksConfig) {
  switch (id) {
    case 'preCommit':
      return <GitCommit className="w-4 h-4" />;
    case 'husky':
      return <GitCommit className="w-4 h-4" />;
    case 'conventionalCommits':
      return <MessageSquare className="w-4 h-4" />;
    default:
      return <GitCommit className="w-4 h-4" />;
  }
}
