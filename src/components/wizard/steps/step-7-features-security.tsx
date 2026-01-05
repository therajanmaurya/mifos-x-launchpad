'use client';

import {
  BarChart3,
  Bell,
  Shield,
  Users,
  KeyRound,
  Fingerprint,
  Lock,
  Smartphone,
  Camera,
  Clock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Check,
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
import { useFeaturesAndSecurity } from '@/store/wizard-store';
import {
  ANALYTICS_PROVIDERS,
  PUSH_PROVIDERS,
  SECURITY_FEATURES,
  SOCIAL_LOGIN_PROVIDERS,
  SESSION_TIMEOUT_OPTIONS,
  type AnalyticsConfig,
  type SecurityConfig,
} from '@/types/wizard';
import { cn } from '@/lib/utils';

type SectionKey = 'analytics' | 'push' | 'security' | 'social' | 'twofa';

export function Step7FeaturesSecurity() {
  const {
    analytics,
    pushNotifications,
    security,
    socialLogin,
    twoFactorAuth,
    updateAnalyticsConfig,
    updatePushConfig,
    updateSecurityConfig,
    updateSocialLoginConfig,
    setTwoFactorAuth,
    resetFeaturesAndSecurity,
  } = useFeaturesAndSecurity();

  const [expandedSection, setExpandedSection] = useState<SectionKey | null>('analytics');

  const toggleSection = (section: SectionKey) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Features & Security</h2>
          <p className="text-muted-foreground mt-1">
            Configure analytics, authentication, and security features
          </p>
        </div>

        {/* Analytics Section */}
        <SectionCard
          title="Analytics & Monitoring"
          description="Track app usage and performance"
          icon={<BarChart3 className="w-5 h-5" />}
          isExpanded={expandedSection === 'analytics'}
          onToggle={() => toggleSection('analytics')}
        >
          <div className="space-y-4">
            {ANALYTICS_PROVIDERS.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{provider.name}</Label>
                  <p className="text-xs text-muted-foreground">{provider.description}</p>
                </div>
                <Switch
                  checked={analytics[provider.id as keyof Omit<AnalyticsConfig, 'customEndpoint'>] as boolean}
                  onCheckedChange={(checked) =>
                    updateAnalyticsConfig({ [provider.id]: checked })
                  }
                />
              </div>
            ))}

            {/* Custom Endpoint */}
            <div className="space-y-2 pt-3 border-t">
              <Label>Custom Analytics Endpoint</Label>
              <Input
                value={analytics.customEndpoint}
                onChange={(e) => updateAnalyticsConfig({ customEndpoint: e.target.value })}
                placeholder="https://analytics.example.com/collect"
              />
              <p className="text-xs text-muted-foreground">
                Optional: Send analytics to your own server
              </p>
            </div>
          </div>
        </SectionCard>

        {/* Push Notifications Section */}
        <SectionCard
          title="Push Notifications"
          description="Configure notification providers"
          icon={<Bell className="w-5 h-5" />}
          isExpanded={expandedSection === 'push'}
          onToggle={() => toggleSection('push')}
        >
          <div className="space-y-4">
            {PUSH_PROVIDERS.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>{provider.name}</Label>
                  <p className="text-xs text-muted-foreground">{provider.description}</p>
                </div>
                <Switch
                  checked={pushNotifications[provider.id as keyof typeof pushNotifications]}
                  onCheckedChange={(checked) =>
                    updatePushConfig({ [provider.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Security Section */}
        <SectionCard
          title="Security Features"
          description="Protect your app and user data"
          icon={<Shield className="w-5 h-5" />}
          isExpanded={expandedSection === 'security'}
          onToggle={() => toggleSection('security')}
        >
          <div className="space-y-4">
            {SECURITY_FEATURES.map((feature) => (
              <div key={feature.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {getSecurityIcon(feature.id)}
                  </div>
                  <div className="space-y-0.5">
                    <Label>{feature.name}</Label>
                    <p className="text-xs text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
                <Switch
                  checked={security[feature.id as keyof Omit<SecurityConfig, 'sessionTimeout'>] as boolean}
                  onCheckedChange={(checked) =>
                    updateSecurityConfig({ [feature.id]: checked })
                  }
                />
              </div>
            ))}

            {/* Session Timeout */}
            <div className="space-y-3 pt-3 border-t">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <Label>Session Timeout</Label>
                  <p className="text-xs text-muted-foreground">Auto-logout after inactivity</p>
                </div>
              </div>
              <Select
                value={security.sessionTimeout.toString()}
                onValueChange={(value) =>
                  updateSecurityConfig({ sessionTimeout: parseInt(value) })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SESSION_TIMEOUT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value.toString()}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        {/* Social Login Section */}
        <SectionCard
          title="Social Login"
          description="Enable third-party authentication"
          icon={<Users className="w-5 h-5" />}
          isExpanded={expandedSection === 'social'}
          onToggle={() => toggleSection('social')}
        >
          <div className="space-y-4">
            {SOCIAL_LOGIN_PROVIDERS.map((provider) => (
              <div key={provider.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    {getSocialIcon(provider.id)}
                  </div>
                  <div className="space-y-0.5">
                    <Label>{provider.name}</Label>
                    <p className="text-xs text-muted-foreground">{provider.description}</p>
                  </div>
                </div>
                <Switch
                  checked={socialLogin[provider.id as keyof typeof socialLogin]}
                  onCheckedChange={(checked) =>
                    updateSocialLoginConfig({ [provider.id]: checked })
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* Two-Factor Auth Section */}
        <SectionCard
          title="Two-Factor Authentication"
          description="Add an extra layer of security"
          icon={<KeyRound className="w-5 h-5" />}
          isExpanded={expandedSection === 'twofa'}
          onToggle={() => toggleSection('twofa')}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable 2FA</Label>
                <p className="text-xs text-muted-foreground">
                  Require verification code for login
                </p>
              </div>
              <Switch
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            {twoFactorAuth && (
              <div className="p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Supported Methods:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Time-based One-Time Password (TOTP)</li>
                  <li>SMS verification codes</li>
                  <li>Email verification codes</li>
                </ul>
              </div>
            )}
          </div>
        </SectionCard>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetFeaturesAndSecurity} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <FeaturesPreviewPanel
          analytics={analytics}
          pushNotifications={pushNotifications}
          security={security}
          socialLogin={socialLogin}
          twoFactorAuth={twoFactorAuth}
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
  children: React.ReactNode;
}

function SectionCard({
  title,
  description,
  icon,
  isExpanded,
  onToggle,
  children,
}: SectionCardProps) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onToggle}>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      {isExpanded && <CardContent className="pt-0">{children}</CardContent>}
    </Card>
  );
}

// ============================================
// Preview Panel Component
// ============================================

interface FeaturesPreviewPanelProps {
  analytics: AnalyticsConfig;
  pushNotifications: { fcm: boolean; oneSignal: boolean };
  security: SecurityConfig;
  socialLogin: { google: boolean; apple: boolean; facebook: boolean };
  twoFactorAuth: boolean;
}

function FeaturesPreviewPanel({
  analytics,
  pushNotifications,
  security,
  socialLogin,
  twoFactorAuth,
}: FeaturesPreviewPanelProps) {
  const enabledAnalytics = ANALYTICS_PROVIDERS.filter(
    (p) => analytics[p.id as keyof Omit<AnalyticsConfig, 'customEndpoint'>]
  );
  const enabledPush = PUSH_PROVIDERS.filter(
    (p) => pushNotifications[p.id as keyof typeof pushNotifications]
  );
  const enabledSecurity = SECURITY_FEATURES.filter(
    (f) => security[f.id as keyof Omit<SecurityConfig, 'sessionTimeout'>]
  );
  const enabledSocial = SOCIAL_LOGIN_PROVIDERS.filter(
    (p) => socialLogin[p.id as keyof typeof socialLogin]
  );

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Analytics */}
          <div className="space-y-2">
            <p className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-3 h-3" />
              Analytics
            </p>
            {enabledAnalytics.length === 0 && !analytics.customEndpoint ? (
              <p className="text-xs text-muted-foreground">No providers enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledAnalytics.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{p.name}</span>
                  </div>
                ))}
                {analytics.customEndpoint && (
                  <div className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>Custom Endpoint</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Push Notifications */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <Bell className="w-3 h-3" />
              Push Notifications
            </p>
            {enabledPush.length === 0 ? (
              <p className="text-xs text-muted-foreground">No providers enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledPush.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Security */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-3 h-3" />
              Security Features
            </p>
            {enabledSecurity.length === 0 ? (
              <p className="text-xs text-muted-foreground">No features enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledSecurity.map((f) => (
                  <div key={f.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{f.name}</span>
                  </div>
                ))}
              </div>
            )}
            {security.sessionTimeout > 0 && (
              <p className="text-xs text-muted-foreground">
                Session timeout: {SESSION_TIMEOUT_OPTIONS.find(o => o.value === security.sessionTimeout)?.label}
              </p>
            )}
          </div>

          {/* Social Login */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <Users className="w-3 h-3" />
              Social Login
            </p>
            {enabledSocial.length === 0 ? (
              <p className="text-xs text-muted-foreground">No providers enabled</p>
            ) : (
              <div className="space-y-1">
                {enabledSocial.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 text-xs">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{p.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 2FA */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-sm font-medium flex items-center gap-2">
              <KeyRound className="w-3 h-3" />
              Two-Factor Auth
            </p>
            <div className={cn(
              'flex items-center gap-2 text-xs',
              twoFactorAuth ? 'text-green-600' : 'text-muted-foreground'
            )}>
              {twoFactorAuth ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Enabled</span>
                </>
              ) : (
                <span>Disabled</span>
              )}
            </div>
          </div>

          {/* Generated Files */}
          <div className="space-y-3 pt-3 border-t">
            <p className="text-sm font-medium">Generated Files</p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                security_config.kt
              </p>
              <p className="flex items-center gap-2">
                <BarChart3 className="w-3 h-3" />
                analytics_config.kt
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-3 h-3" />
                auth_providers.kt
              </p>
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

function getSecurityIcon(id: string) {
  switch (id) {
    case 'biometric':
      return <Fingerprint className="w-4 h-4" />;
    case 'pinAuth':
      return <Lock className="w-4 h-4" />;
    case 'rootDetection':
      return <Smartphone className="w-4 h-4" />;
    case 'screenshotPrevention':
      return <Camera className="w-4 h-4" />;
    case 'secureStorage':
      return <Shield className="w-4 h-4" />;
    case 'sslPinning':
      return <Lock className="w-4 h-4" />;
    default:
      return <Shield className="w-4 h-4" />;
  }
}

function getSocialIcon(id: string) {
  // Simple placeholder icons - in a real app you'd use brand icons
  switch (id) {
    case 'google':
      return <span className="text-xs font-bold">G</span>;
    case 'apple':
      return <span className="text-xs font-bold"></span>;
    case 'facebook':
      return <span className="text-xs font-bold">f</span>;
    default:
      return <Users className="w-4 h-4" />;
  }
}
