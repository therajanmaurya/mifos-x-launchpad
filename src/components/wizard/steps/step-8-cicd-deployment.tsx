'use client';

import {
  GitBranch,
  Flame,
  Play,
  Apple,
  Tag,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
  Plus,
  X,
  Github,
  Gitlab,
  Rocket,
  FileText,
} from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCICDConfig } from '@/store/wizard-store';
import {
  CI_PLATFORM_OPTIONS,
  PLAY_STORE_TRACKS,
  ROLLOUT_PERCENTAGES,
  type CIPlatform,
  type Step8State,
} from '@/types/wizard';
import { cn } from '@/lib/utils';

type SectionKey = 'ci' | 'firebase' | 'playstore' | 'appstore' | 'release';

export function Step8CICDDeployment() {
  const {
    ciPlatform,
    firebase,
    playStore,
    appStore,
    releaseAutomation,
    setCIPlatform,
    updateFirebaseConfig,
    updatePlayStoreConfig,
    updateAppStoreConfig,
    updateReleaseAutomation,
    resetCICD,
  } = useCICDConfig();

  const [expandedSection, setExpandedSection] = useState<SectionKey | null>('ci');
  const [newTesterGroup, setNewTesterGroup] = useState('');

  const toggleSection = (section: SectionKey) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const addTesterGroup = () => {
    if (newTesterGroup.trim()) {
      updateFirebaseConfig({
        testerGroups: [...firebase.testerGroups, newTesterGroup.trim()],
      });
      setNewTesterGroup('');
    }
  };

  const removeTesterGroup = (group: string) => {
    updateFirebaseConfig({
      testerGroups: firebase.testerGroups.filter((g) => g !== group),
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">CI/CD & Deployment</h2>
          <p className="text-muted-foreground mt-1">
            Configure build pipelines and release automation
          </p>
        </div>

        {/* CI Platform Section */}
        <SectionCard
          title="CI Platform"
          description="Choose your build automation platform"
          icon={<GitBranch className="w-5 h-5" />}
          isExpanded={expandedSection === 'ci'}
          onToggle={() => toggleSection('ci')}
        >
          <div className="space-y-3">
            {CI_PLATFORM_OPTIONS.map((platform) => (
              <div
                key={platform.value}
                onClick={() => setCIPlatform(platform.value)}
                className={cn(
                  'flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-all',
                  ciPlatform === platform.value
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-primary/50'
                )}
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  {getCIPlatformIcon(platform.value)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {platform.name}
                    {platform.value === 'github-actions' && (
                      <span className="ml-2 text-xs text-muted-foreground">(Recommended)</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{platform.description}</p>
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                    ciPlatform === platform.value
                      ? 'border-primary bg-primary'
                      : 'border-muted-foreground'
                  )}
                >
                  {ciPlatform === platform.value && (
                    <Check className="w-3 h-3 text-primary-foreground" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Firebase App Distribution Section */}
        <SectionCard
          title="Firebase App Distribution"
          description="Distribute builds to testers"
          icon={<Flame className="w-5 h-5" />}
          isExpanded={expandedSection === 'firebase'}
          onToggle={() => toggleSection('firebase')}
          toggleControl={
            <Switch
              checked={firebase.enabled}
              onCheckedChange={(checked) => updateFirebaseConfig({ enabled: checked })}
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          {firebase.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Android App ID</Label>
                <Input
                  value={firebase.androidAppId}
                  onChange={(e) => updateFirebaseConfig({ androidAppId: e.target.value })}
                  placeholder="1:123456789:android:abc123def456"
                />
                <p className="text-xs text-muted-foreground">
                  Find in Firebase Console under Project Settings
                </p>
              </div>

              <div className="space-y-2">
                <Label>iOS App ID</Label>
                <Input
                  value={firebase.iosAppId}
                  onChange={(e) => updateFirebaseConfig({ iosAppId: e.target.value })}
                  placeholder="1:123456789:ios:abc123def456"
                />
              </div>

              <div className="space-y-2">
                <Label>Tester Groups</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTesterGroup}
                    onChange={(e) => setNewTesterGroup(e.target.value)}
                    placeholder="Add tester group name"
                    onKeyDown={(e) => e.key === 'Enter' && addTesterGroup()}
                  />
                  <Button variant="outline" size="icon" onClick={addTesterGroup}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {firebase.testerGroups.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {firebase.testerGroups.map((group) => (
                      <div
                        key={group}
                        className="flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-sm"
                      >
                        <span>{group}</span>
                        <button
                          onClick={() => removeTesterGroup(group)}
                          className="hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </SectionCard>

        {/* Play Store Section */}
        <SectionCard
          title="Play Store"
          description="Automated Play Store releases"
          icon={<Play className="w-5 h-5" />}
          isExpanded={expandedSection === 'playstore'}
          onToggle={() => toggleSection('playstore')}
          toggleControl={
            <Switch
              checked={playStore.enabled}
              onCheckedChange={(checked) => updatePlayStoreConfig({ enabled: checked })}
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          {playStore.enabled && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Release Track</Label>
                <Select
                  value={playStore.track}
                  onValueChange={(value) =>
                    updatePlayStoreConfig({ track: value as typeof playStore.track })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAY_STORE_TRACKS.map((track) => (
                      <SelectItem key={track.value} value={track.value}>
                        <div className="flex flex-col">
                          <span>{track.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {PLAY_STORE_TRACKS.find((t) => t.value === playStore.track)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Rollout Percentage</Label>
                <Select
                  value={playStore.rolloutPercentage.toString()}
                  onValueChange={(value) =>
                    updatePlayStoreConfig({ rolloutPercentage: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLLOUT_PERCENTAGES.map((percentage) => (
                      <SelectItem key={percentage} value={percentage.toString()}>
                        {percentage}%
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Percentage of users who will receive the update
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label>Auto-Promotion</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically promote to next track
                  </p>
                </div>
                <Switch
                  checked={playStore.autoPromotion}
                  onCheckedChange={(checked) =>
                    updatePlayStoreConfig({ autoPromotion: checked })
                  }
                />
              </div>
            </div>
          )}
        </SectionCard>

        {/* App Store Section */}
        <SectionCard
          title="App Store"
          description="Automated App Store releases"
          icon={<Apple className="w-5 h-5" />}
          isExpanded={expandedSection === 'appstore'}
          onToggle={() => toggleSection('appstore')}
          toggleControl={
            <Switch
              checked={appStore.enabled}
              onCheckedChange={(checked) => updateAppStoreConfig({ enabled: checked })}
              onClick={(e) => e.stopPropagation()}
            />
          }
        >
          {appStore.enabled && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>TestFlight Distribution</Label>
                  <p className="text-xs text-muted-foreground">
                    Upload builds to TestFlight for beta testing
                  </p>
                </div>
                <Switch
                  checked={appStore.testFlight}
                  onCheckedChange={(checked) =>
                    updateAppStoreConfig({ testFlight: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-Submit for Review</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically submit to App Store review
                  </p>
                </div>
                <Switch
                  checked={appStore.autoSubmit}
                  onCheckedChange={(checked) =>
                    updateAppStoreConfig({ autoSubmit: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Phased Release</Label>
                  <p className="text-xs text-muted-foreground">
                    Gradually roll out over 7 days
                  </p>
                </div>
                <Switch
                  checked={appStore.phasedRelease}
                  onCheckedChange={(checked) =>
                    updateAppStoreConfig({ phasedRelease: checked })
                  }
                />
              </div>
            </div>
          )}
        </SectionCard>

        {/* Release Automation Section */}
        <SectionCard
          title="Release Automation"
          description="Automate versioning and changelogs"
          icon={<Tag className="w-5 h-5" />}
          isExpanded={expandedSection === 'release'}
          onToggle={() => toggleSection('release')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Version Bumping</Label>
                <p className="text-xs text-muted-foreground">
                  Increment version numbers based on commit messages
                </p>
              </div>
              <Switch
                checked={releaseAutomation.versionBumping}
                onCheckedChange={(checked) =>
                  updateReleaseAutomation({ versionBumping: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Changelog Generation</Label>
                <p className="text-xs text-muted-foreground">
                  Auto-generate changelog from commits
                </p>
              </div>
              <Switch
                checked={releaseAutomation.changelogGeneration}
                onCheckedChange={(checked) =>
                  updateReleaseAutomation({ changelogGeneration: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>GitHub Releases</Label>
                <p className="text-xs text-muted-foreground">
                  Create GitHub releases with artifacts
                </p>
              </div>
              <Switch
                checked={releaseAutomation.githubRelease}
                onCheckedChange={(checked) =>
                  updateReleaseAutomation({ githubRelease: checked })
                }
              />
            </div>
          </div>
        </SectionCard>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetCICD} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <CICDPreviewPanel
          ciPlatform={ciPlatform}
          firebase={firebase}
          playStore={playStore}
          appStore={appStore}
          releaseAutomation={releaseAutomation}
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

interface CICDPreviewPanelProps {
  ciPlatform: CIPlatform;
  firebase: Step8State['firebase'];
  playStore: Step8State['playStore'];
  appStore: Step8State['appStore'];
  releaseAutomation: Step8State['releaseAutomation'];
}

function CICDPreviewPanel({
  ciPlatform,
  firebase,
  playStore,
  appStore,
  releaseAutomation,
}: CICDPreviewPanelProps) {
  const ciPlatformInfo = CI_PLATFORM_OPTIONS.find((p) => p.value === ciPlatform);
  const playStoreTrackInfo = PLAY_STORE_TRACKS.find((t) => t.value === playStore.track);

  const enabledDistribution = [
    firebase.enabled && 'Firebase App Distribution',
    playStore.enabled && 'Google Play Store',
    appStore.enabled && 'Apple App Store',
  ].filter(Boolean);

  const enabledReleaseFeatures = [
    releaseAutomation.versionBumping && 'Version Bumping',
    releaseAutomation.changelogGeneration && 'Changelog Generation',
    releaseAutomation.githubRelease && 'GitHub Releases',
  ].filter(Boolean);

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Rocket className="w-4 h-4" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* CI Platform */}
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <GitBranch className="w-3 h-3" />
              CI Platform
            </p>
            <div className="flex items-center gap-2 text-sm">
              {getCIPlatformIcon(ciPlatform)}
              <span>{ciPlatformInfo?.name}</span>
            </div>
          </div>

          {/* Distribution */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-3 h-3" />
              Distribution Channels
            </p>
            {enabledDistribution.length === 0 ? (
              <p className="text-xs text-muted-foreground">No channels enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledDistribution.map((channel) => (
                  <div key={channel as string} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{channel}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Play Store Details */}
          {playStore.enabled && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium flex items-center gap-2">
                <Play className="w-3 h-3" />
                Play Store Settings
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Track: {playStoreTrackInfo?.name}</p>
                <p>Rollout: {playStore.rolloutPercentage}%</p>
                {playStore.autoPromotion && <p>Auto-promotion enabled</p>}
              </div>
            </div>
          )}

          {/* App Store Details */}
          {appStore.enabled && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium flex items-center gap-2">
                <Apple className="w-3 h-3" />
                App Store Settings
              </p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {appStore.testFlight && <p>TestFlight enabled</p>}
                {appStore.autoSubmit && <p>Auto-submit enabled</p>}
                {appStore.phasedRelease && <p>Phased release (7 days)</p>}
              </div>
            </div>
          )}

          {/* Release Automation */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <Tag className="w-3 h-3" />
              Release Automation
            </p>
            {enabledReleaseFeatures.length === 0 ? (
              <p className="text-xs text-muted-foreground">No features enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledReleaseFeatures.map((feature) => (
                  <div key={feature as string} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generated Files */}
          <div className="space-y-3 pt-3 border-t">
            <p className="text-sm font-medium">Generated Files</p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {ciPlatform === 'github-actions' && (
                <>
                  <p className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    .github/workflows/build.yml
                  </p>
                  <p className="flex items-center gap-2">
                    <FileText className="w-3 h-3" />
                    .github/workflows/release.yml
                  </p>
                </>
              )}
              {ciPlatform === 'gitlab-ci' && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  .gitlab-ci.yml
                </p>
              )}
              {ciPlatform === 'bitrise' && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  bitrise.yml
                </p>
              )}
              {ciPlatform === 'codemagic' && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  codemagic.yaml
                </p>
              )}
              {firebase.enabled && (
                <p className="flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  firebase-app-distribution.json
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

function getCIPlatformIcon(platform: CIPlatform) {
  switch (platform) {
    case 'github-actions':
      return <Github className="w-5 h-5" />;
    case 'gitlab-ci':
      return <Gitlab className="w-5 h-5" />;
    case 'bitrise':
      return <Rocket className="w-5 h-5" />;
    case 'codemagic':
      return <Rocket className="w-5 h-5" />;
    default:
      return <GitBranch className="w-5 h-5" />;
  }
}
