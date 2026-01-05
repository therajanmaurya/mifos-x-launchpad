'use client';

import { useCallback } from 'react';
import { Check, ExternalLink, Wallet, Smartphone, Users, FileCode, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAppSelection, useSDKInfo } from '@/store/wizard-store';
import {
  APP_OPTIONS,
  PLATFORM_LABELS,
  type AppOption,
  type AppType,
  type SDKInfo
} from '@/types/wizard';

export function Step1AppSelection() {
  const { selectedApp, selectedAppData, selectApp } = useAppSelection();
  const { sdkInfo, isLoading, error, fetchSDKInfo, retryFetchSDKInfo } = useSDKInfo();

  // Handle app selection with SDK fetch
  const handleAppSelect = useCallback((appType: AppType) => {
    selectApp(appType);
    fetchSDKInfo(appType);
  }, [selectApp, fetchSDKInfo]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Select Base Application</h2>
          <p className="text-muted-foreground mt-1">
            Choose which Mifos application to customize as your starting point
          </p>
        </div>

        {/* App Grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {APP_OPTIONS.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              isSelected={selectedApp === app.id}
              onSelect={handleAppSelect}
              isLoadingSDK={isLoading && selectedApp === app.id}
            />
          ))}
        </div>

        {/* SDK Fetch Error */}
        {error && selectedApp && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-destructive">Failed to load SDK info</p>
              <p className="text-sm text-muted-foreground truncate">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={retryFetchSDKInfo}>
              Retry
            </Button>
          </div>
        )}
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[350px] shrink-0">
        <PreviewPanel
          selectedApp={selectedAppData ?? null}
          sdkInfo={sdkInfo}
          isLoadingSDK={isLoading}
        />
      </div>
    </div>
  );
}

// ============================================
// App Card Component
// ============================================

interface AppCardProps {
  app: AppOption;
  isSelected: boolean;
  onSelect: (appId: AppType) => void;
  isLoadingSDK?: boolean;
}

function AppCard({ app, isSelected, onSelect, isLoadingSDK }: AppCardProps) {
  const Icon = getAppIcon(app.icon);

  return (
    <Card
      className={`
        relative cursor-pointer transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isSelected
          ? 'ring-2 ring-primary bg-primary/5 border-primary'
          : 'hover:border-primary/50'
        }
      `}
      onClick={() => onSelect(app.id)}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      aria-label={`Select ${app.name}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(app.id);
        }
      }}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          {isLoadingSDK ? (
            <Loader2 className="w-4 h-4 text-primary-foreground animate-spin" />
          ) : (
            <Check className="w-4 h-4 text-primary-foreground" />
          )}
        </div>
      )}

      <CardContent className="p-5">
        {/* Icon and Title */}
        <div className="flex items-start gap-4">
          <div className={`
            w-12 h-12 rounded-lg flex items-center justify-center shrink-0
            ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}
          `}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-lg leading-tight">{app.name}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {app.description}
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="mt-4 space-y-1.5">
          {app.features.slice(0, 3).map((feature, index) => (
            <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
              <span className="truncate">{feature}</span>
            </div>
          ))}
        </div>

        {/* Platform Badges */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {app.platforms.map((platform) => (
            <Badge key={platform} variant="secondary" className="text-xs">
              {PLATFORM_LABELS[platform]}
            </Badge>
          ))}
        </div>

        {/* GitHub Link */}
        <Button
          variant="link"
          size="sm"
          className="mt-3 h-auto p-0 text-primary"
          asChild
        >
          <a
            href={app.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            View on GitHub
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// Preview Panel Component
// ============================================

interface PreviewPanelProps {
  selectedApp: AppOption | null;
  sdkInfo: SDKInfo | null;
  isLoadingSDK: boolean;
}

function PreviewPanel({ selectedApp, sdkInfo, isLoadingSDK }: PreviewPanelProps) {
  if (!selectedApp) {
    return (
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8" />
            </div>
            <p className="font-medium">Select an Application</p>
            <p className="text-sm mt-1">
              Choose a base app to see its features and configuration options
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const Icon = getAppIcon(selectedApp.icon);

  return (
    <Card className="sticky top-24">
      <CardContent className="p-6 space-y-6">
        {/* App Header */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center mx-auto mb-3">
            <Icon className="w-8 h-8 text-primary-foreground" />
          </div>
          <h3 className="font-semibold text-lg">{selectedApp.name}</h3>
          <Badge variant="outline" className="mt-2">
            {selectedApp.status === 'active' ? 'Actively Maintained' : 'Maintained'}
          </Badge>
        </div>

        {/* SDK Info */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            SDK Configuration
          </h4>
          {isLoadingSDK ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading SDK info...</span>
            </div>
          ) : sdkInfo ? (
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="secondary" className="text-xs">
                Kotlin {sdkInfo.kotlin}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Compose {sdkInfo.compose}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                AGP {sdkInfo.androidGradlePlugin}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Android {sdkInfo.minAndroidSdk}-{sdkInfo.targetAndroidSdk}
              </Badge>
              <Badge variant="outline" className="text-xs">
                iOS {sdkInfo.minIosVersion}+
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              SDK info will be loaded when app is selected
            </p>
          )}
        </div>

        {/* Features */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            Included Features
          </h4>
          <div className="space-y-2">
            {selectedApp.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-primary shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platforms */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            Supported Platforms
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedApp.platforms.map((platform) => (
              <Badge key={platform} variant="secondary">
                {PLATFORM_LABELS[platform]}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div>
          <h4 className="font-medium text-sm text-muted-foreground mb-3">
            Technology Stack
          </h4>
          <div className="flex flex-wrap gap-2">
            {selectedApp.techStack.map((tech, index) => (
              <Badge key={index} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* GitHub Link */}
        <Button variant="outline" className="w-full" asChild>
          <a
            href={selectedApp.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View Source Code
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================
// Helper Functions
// ============================================

function getAppIcon(iconName: string) {
  const icons: Record<string, typeof Wallet> = {
    wallet: Wallet,
    smartphone: Smartphone,
    users: Users,
    file: FileCode
  };
  return icons[iconName] || FileCode;
}
