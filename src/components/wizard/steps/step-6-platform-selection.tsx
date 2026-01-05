'use client';

import { useState } from 'react';
import {
  Smartphone,
  Apple,
  Monitor,
  Globe,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Check,
  Package,
  Shield,
  Cpu,
  Tablet,
  Layers,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { usePlatformConfig } from '@/store/wizard-store';
import {
  type PlatformConfig,
  type AndroidAbi,
  type IOSDevice,
  type ServiceWorkerStrategy,
  ANDROID_ABI_OPTIONS,
  IOS_DEVICE_OPTIONS,
  IOS_DEPLOYMENT_TARGETS,
  SERVICE_WORKER_STRATEGIES,
} from '@/types/wizard';
import { cn } from '@/lib/utils';

type PlatformKey = keyof PlatformConfig;

interface PlatformInfo {
  key: PlatformKey;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const PLATFORMS: PlatformInfo[] = [
  {
    key: 'android',
    name: 'Android',
    description: 'Target Android devices with native performance',
    icon: <Smartphone className="w-5 h-5" />,
    color: 'bg-green-500',
  },
  {
    key: 'ios',
    name: 'iOS',
    description: 'Target iPhone and iPad devices',
    icon: <Apple className="w-5 h-5" />,
    color: 'bg-gray-800',
  },
  {
    key: 'desktop',
    name: 'Desktop',
    description: 'Windows, macOS, and Linux applications',
    icon: <Monitor className="w-5 h-5" />,
    color: 'bg-blue-500',
  },
  {
    key: 'web',
    name: 'Web',
    description: 'Progressive Web App with offline support',
    icon: <Globe className="w-5 h-5" />,
    color: 'bg-purple-500',
  },
];

export function Step6PlatformSelection() {
  const {
    platforms,
    togglePlatform,
    updateAndroidConfig,
    updateIOSConfig,
    updateDesktopConfig,
    updateWebConfig,
    resetPlatforms,
  } = usePlatformConfig();

  const [expandedPlatform, setExpandedPlatform] = useState<PlatformKey | null>('android');

  const toggleExpanded = (key: PlatformKey) => {
    setExpandedPlatform(expandedPlatform === key ? null : key);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Platform Selection</h2>
          <p className="text-muted-foreground mt-1">
            Choose target platforms and configure platform-specific settings
          </p>
        </div>

        {/* Platform Cards */}
        {PLATFORMS.map((platform) => (
          <PlatformCard
            key={platform.key}
            platform={platform}
            config={platforms[platform.key]}
            isExpanded={expandedPlatform === platform.key}
            onToggleExpand={() => toggleExpanded(platform.key)}
            onToggleEnabled={(enabled) => togglePlatform(platform.key, enabled)}
            onUpdateAndroid={updateAndroidConfig}
            onUpdateIOS={updateIOSConfig}
            onUpdateDesktop={updateDesktopConfig}
            onUpdateWeb={updateWebConfig}
          />
        ))}

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetPlatforms} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <PlatformPreviewPanel platforms={platforms} />
      </div>
    </div>
  );
}

// ============================================
// Platform Card Component
// ============================================

interface PlatformCardProps {
  platform: PlatformInfo;
  config: PlatformConfig[PlatformKey];
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: (enabled: boolean) => void;
  onUpdateAndroid: (config: Partial<PlatformConfig['android']>) => void;
  onUpdateIOS: (config: Partial<PlatformConfig['ios']>) => void;
  onUpdateDesktop: (config: Partial<PlatformConfig['desktop']>) => void;
  onUpdateWeb: (config: Partial<PlatformConfig['web']>) => void;
}

function PlatformCard({
  platform,
  config,
  isExpanded,
  onToggleExpand,
  onToggleEnabled,
  onUpdateAndroid,
  onUpdateIOS,
  onUpdateDesktop,
  onUpdateWeb,
}: PlatformCardProps) {
  return (
    <Card className={cn(!config.enabled && 'opacity-60')}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center text-white', platform.color)}>
              {platform.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <p className="text-xs text-muted-foreground">{platform.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={onToggleEnabled}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="ml-2"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && config.enabled && (
        <CardContent className="space-y-4 pt-0">
          {platform.key === 'android' && (
            <AndroidSettings
              config={config as PlatformConfig['android']}
              onUpdate={onUpdateAndroid}
            />
          )}
          {platform.key === 'ios' && (
            <IOSSettings
              config={config as PlatformConfig['ios']}
              onUpdate={onUpdateIOS}
            />
          )}
          {platform.key === 'desktop' && (
            <DesktopSettings
              config={config as PlatformConfig['desktop']}
              onUpdate={onUpdateDesktop}
            />
          )}
          {platform.key === 'web' && (
            <WebSettings
              config={config as PlatformConfig['web']}
              onUpdate={onUpdateWeb}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// Android Settings Component
// ============================================

interface AndroidSettingsProps {
  config: PlatformConfig['android'];
  onUpdate: (config: Partial<PlatformConfig['android']>) => void;
}

function AndroidSettings({ config, onUpdate }: AndroidSettingsProps) {
  const toggleAbi = (abi: AndroidAbi) => {
    const current = config.abiSplits;
    const updated = current.includes(abi)
      ? current.filter((a) => a !== abi)
      : [...current, abi];
    onUpdate({ abiSplits: updated });
  };

  return (
    <div className="space-y-4">
      {/* Build Options */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Build Options</p>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ProGuard/R8 Minification
              </Label>
              <p className="text-xs text-muted-foreground">
                Shrink and obfuscate code for release builds
              </p>
            </div>
            <Switch
              checked={config.proguard}
              onCheckedChange={(proguard) => onUpdate({ proguard })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Android App Bundle (.aab)
              </Label>
              <p className="text-xs text-muted-foreground">
                Recommended format for Play Store distribution
              </p>
            </div>
            <Switch
              checked={config.appBundle}
              onCheckedChange={(appBundle) => onUpdate({ appBundle })}
            />
          </div>
        </div>
      </div>

      {/* ABI Splits */}
      <div className="space-y-3 pt-3 border-t">
        <p className="text-sm font-medium flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          ABI Splits
        </p>
        <p className="text-xs text-muted-foreground">
          Select target CPU architectures
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {ANDROID_ABI_OPTIONS.map((abi) => (
            <label
              key={abi.value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                config.abiSplits.includes(abi.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Checkbox
                checked={config.abiSplits.includes(abi.value)}
                onCheckedChange={() => toggleAbi(abi.value)}
              />
              <div>
                <p className="text-sm font-medium">{abi.label}</p>
                <p className="text-xs text-muted-foreground">{abi.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// iOS Settings Component
// ============================================

interface IOSSettingsProps {
  config: PlatformConfig['ios'];
  onUpdate: (config: Partial<PlatformConfig['ios']>) => void;
}

function IOSSettings({ config, onUpdate }: IOSSettingsProps) {
  const toggleDevice = (device: IOSDevice) => {
    const current = config.supportedDevices;
    const updated = current.includes(device)
      ? current.filter((d) => d !== device)
      : [...current, device];
    // Ensure at least one device is selected
    if (updated.length > 0) {
      onUpdate({ supportedDevices: updated });
    }
  };

  return (
    <div className="space-y-4">
      {/* Team ID */}
      <div className="space-y-2">
        <Label>Apple Team ID</Label>
        <Input
          value={config.teamId}
          onChange={(e) => onUpdate({ teamId: e.target.value })}
          placeholder="XXXXXXXXXX"
        />
        <p className="text-xs text-muted-foreground">
          Your 10-character Apple Developer Team ID
        </p>
      </div>

      {/* Deployment Target */}
      <div className="space-y-2">
        <Label>Deployment Target</Label>
        <Select
          value={config.deploymentTarget}
          onValueChange={(deploymentTarget) => onUpdate({ deploymentTarget })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {IOS_DEPLOYMENT_TARGETS.map((version) => (
              <SelectItem key={version.value} value={version.value}>
                {version.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Minimum iOS version required
        </p>
      </div>

      {/* Supported Devices */}
      <div className="space-y-3 pt-3 border-t">
        <p className="text-sm font-medium">Supported Devices</p>
        <div className="grid grid-cols-2 gap-3">
          {IOS_DEVICE_OPTIONS.map((device) => (
            <label
              key={device.value}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
                config.supportedDevices.includes(device.value)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Checkbox
                checked={config.supportedDevices.includes(device.value)}
                onCheckedChange={() => toggleDevice(device.value)}
              />
              <div className="flex items-center gap-2">
                {device.value === 'iphone' ? (
                  <Smartphone className="w-4 h-4" />
                ) : (
                  <Tablet className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{device.label}</span>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// Desktop Settings Component
// ============================================

interface DesktopSettingsProps {
  config: PlatformConfig['desktop'];
  onUpdate: (config: Partial<PlatformConfig['desktop']>) => void;
}

function DesktopSettings({ config, onUpdate }: DesktopSettingsProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Target Operating Systems</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
            config.windows
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Checkbox
            checked={config.windows}
            onCheckedChange={(checked: boolean | 'indeterminate') => onUpdate({ windows: checked === true })}
          />
          <div>
            <p className="text-sm font-medium">Windows</p>
            <p className="text-xs text-muted-foreground">x64 architecture</p>
          </div>
        </label>

        <label
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
            config.macos
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Checkbox
            checked={config.macos}
            onCheckedChange={(checked: boolean | 'indeterminate') => onUpdate({ macos: checked === true })}
          />
          <div>
            <p className="text-sm font-medium">macOS</p>
            <p className="text-xs text-muted-foreground">arm64 & x64</p>
          </div>
        </label>

        <label
          className={cn(
            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
            config.linux
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/50'
          )}
        >
          <Checkbox
            checked={config.linux}
            onCheckedChange={(checked: boolean | 'indeterminate') => onUpdate({ linux: checked === true })}
          />
          <div>
            <p className="text-sm font-medium">Linux</p>
            <p className="text-xs text-muted-foreground">x64 architecture</p>
          </div>
        </label>
      </div>
    </div>
  );
}

// ============================================
// Web Settings Component
// ============================================

interface WebSettingsProps {
  config: PlatformConfig['web'];
  onUpdate: (config: Partial<PlatformConfig['web']>) => void;
}

function WebSettings({ config, onUpdate }: WebSettingsProps) {
  return (
    <div className="space-y-4">
      {/* PWA Toggle */}
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Progressive Web App (PWA)
          </Label>
          <p className="text-xs text-muted-foreground">
            Enable offline support and installability
          </p>
        </div>
        <Switch
          checked={config.pwa}
          onCheckedChange={(pwa) => onUpdate({ pwa })}
        />
      </div>

      {/* Service Worker Strategy */}
      {config.pwa && (
        <div className="space-y-3 pt-3 border-t">
          <Label>Service Worker Strategy</Label>
          <Select
            value={config.serviceWorkerStrategy}
            onValueChange={(serviceWorkerStrategy: ServiceWorkerStrategy) =>
              onUpdate({ serviceWorkerStrategy })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_WORKER_STRATEGIES.map((strategy) => (
                <SelectItem key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {SERVICE_WORKER_STRATEGIES.find(
              (s) => s.value === config.serviceWorkerStrategy
            )?.description}
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================
// Preview Panel Component
// ============================================

interface PlatformPreviewPanelProps {
  platforms: PlatformConfig;
}

function PlatformPreviewPanel({ platforms }: PlatformPreviewPanelProps) {
  const enabledPlatforms = PLATFORMS.filter((p) => platforms[p.key].enabled);

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enabled Platforms */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Enabled Platforms</p>
            {enabledPlatforms.length === 0 ? (
              <p className="text-sm text-muted-foreground">No platforms enabled</p>
            ) : (
              <div className="space-y-2">
                {enabledPlatforms.map((platform) => (
                  <div
                    key={platform.key}
                    className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                  >
                    <div className={cn('w-6 h-6 rounded flex items-center justify-center text-white', platform.color)}>
                      {platform.icon}
                    </div>
                    <span className="text-sm font-medium">{platform.name}</span>
                    <Check className="w-4 h-4 text-green-500 ml-auto" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform-Specific Summary */}
          {platforms.android.enabled && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium">Android</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>ABIs: {platforms.android.abiSplits.join(', ')}</p>
                <p>ProGuard: {platforms.android.proguard ? 'Enabled' : 'Disabled'}</p>
                <p>App Bundle: {platforms.android.appBundle ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}

          {platforms.ios.enabled && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium">iOS</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Team ID: {platforms.ios.teamId || 'Not set'}</p>
                <p>Target: iOS {platforms.ios.deploymentTarget}+</p>
                <p>Devices: {platforms.ios.supportedDevices.join(', ')}</p>
              </div>
            </div>
          )}

          {platforms.desktop.enabled && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium">Desktop</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                {platforms.desktop.windows && <p>Windows (x64)</p>}
                {platforms.desktop.macos && <p>macOS (arm64, x64)</p>}
                {platforms.desktop.linux && <p>Linux (x64)</p>}
              </div>
            </div>
          )}

          {platforms.web.enabled && (
            <div className="space-y-2 pt-3 border-t">
              <p className="text-sm font-medium">Web</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>PWA: {platforms.web.pwa ? 'Enabled' : 'Disabled'}</p>
                {platforms.web.pwa && (
                  <p>
                    Strategy:{' '}
                    {SERVICE_WORKER_STRATEGIES.find(
                      (s) => s.value === platforms.web.serviceWorkerStrategy
                    )?.label}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Generated Files Preview */}
          <div className="space-y-3 pt-3 border-t">
            <p className="text-sm font-medium">Generated Files</p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              {platforms.android.enabled && (
                <p className="flex items-center gap-2">
                  <Smartphone className="w-3 h-3" />
                  build.gradle.kts
                </p>
              )}
              {platforms.ios.enabled && (
                <p className="flex items-center gap-2">
                  <Apple className="w-3 h-3" />
                  project.pbxproj
                </p>
              )}
              {platforms.desktop.enabled && (
                <p className="flex items-center gap-2">
                  <Monitor className="w-3 h-3" />
                  compose-desktop.pro
                </p>
              )}
              {platforms.web.enabled && (
                <p className="flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  manifest.json
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
