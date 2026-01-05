'use client';

import { useState, useCallback } from 'react';
import {
  Server,
  Globe,
  Shield,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
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
import { useServerConfig } from '@/store/wizard-store';
import {
  type EnvironmentType,
  type Protocol,
  type ServerEnvironment,
  type ConnectionResult,
  ENVIRONMENT_LABELS,
  buildServerUrl,
} from '@/types/wizard';
import { cn } from '@/lib/utils';

const ENVIRONMENTS: EnvironmentType[] = ['development', 'staging', 'production'];

export function Step5ServerConfig() {
  const {
    environments,
    connectionTimeout,
    readTimeout,
    certificatePinning,
    offlineMode,
    testResults,
    updateEnvironment,
    setConnectionTimeout,
    setReadTimeout,
    setCertificatePinning,
    setOfflineMode,
    setTestResult,
    resetServerConfig,
  } = useServerConfig();

  const [expandedEnv, setExpandedEnv] = useState<EnvironmentType | null>('development');
  const [testingEnv, setTestingEnv] = useState<EnvironmentType | null>(null);

  const handleTestConnection = useCallback(
    async (env: EnvironmentType) => {
      const config = environments[env];
      if (!config.baseUrl) return;

      setTestingEnv(env);
      setTestResult(env, null);

      const startTime = Date.now();

      try {
        const url = buildServerUrl(config);
        // Simulate connection test (in real app, would make actual API call)
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000));

        // For demo purposes, succeed if URL looks valid
        const success = config.baseUrl.length > 0;

        setTestResult(env, {
          success,
          responseTime: Date.now() - startTime,
          timestamp: Date.now(),
          error: success ? undefined : 'Connection failed',
        });
      } catch (error) {
        setTestResult(env, {
          success: false,
          responseTime: Date.now() - startTime,
          timestamp: Date.now(),
          error: error instanceof Error ? error.message : 'Connection failed',
        });
      } finally {
        setTestingEnv(null);
      }
    },
    [environments, setTestResult]
  );

  const toggleExpanded = (env: EnvironmentType) => {
    setExpandedEnv(expandedEnv === env ? null : env);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Server Configuration</h2>
          <p className="text-muted-foreground mt-1">
            Configure API endpoints for different environments
          </p>
        </div>

        {/* Environment Cards */}
        {ENVIRONMENTS.map((env) => (
          <EnvironmentCard
            key={env}
            environment={env}
            config={environments[env]}
            testResult={testResults[env]}
            isExpanded={expandedEnv === env}
            isTesting={testingEnv === env}
            onToggleExpand={() => toggleExpanded(env)}
            onChange={(data) => updateEnvironment(env, data)}
            onTest={() => handleTestConnection(env)}
          />
        ))}

        {/* Connection Settings */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Connection Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timeouts */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label>Connection Timeout</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={connectionTimeout / 1000}
                    onChange={(e) => setConnectionTimeout(parseInt(e.target.value) * 1000 || 30000)}
                    min={5}
                    max={120}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">seconds</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Time to wait for initial connection
                </p>
              </div>

              <div className="space-y-3">
                <Label>Read Timeout</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={readTimeout / 1000}
                    onChange={(e) => setReadTimeout(parseInt(e.target.value) * 1000 || 30000)}
                    min={5}
                    max={120}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">seconds</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Time to wait for response data
                </p>
              </div>
            </div>

            {/* Security Options */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Certificate Pinning
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Validate server SSL certificates for enhanced security
                  </p>
                </div>
                <Switch
                  checked={certificatePinning}
                  onCheckedChange={setCertificatePinning}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    {offlineMode ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                    Offline Mode Support
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Enable local caching for offline functionality
                  </p>
                </div>
                <Switch checked={offlineMode} onCheckedChange={setOfflineMode} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetServerConfig} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <ServerPreviewPanel environments={environments} testResults={testResults} />
      </div>
    </div>
  );
}

// ============================================
// Environment Card Component
// ============================================

interface EnvironmentCardProps {
  environment: EnvironmentType;
  config: ServerEnvironment;
  testResult: ConnectionResult | null;
  isExpanded: boolean;
  isTesting: boolean;
  onToggleExpand: () => void;
  onChange: (data: Partial<ServerEnvironment>) => void;
  onTest: () => void;
}

function EnvironmentCard({
  environment,
  config,
  testResult,
  isExpanded,
  isTesting,
  onToggleExpand,
  onChange,
  onTest,
}: EnvironmentCardProps) {
  const envInfo = ENVIRONMENT_LABELS[environment];

  const getStatusIcon = () => {
    if (isTesting) {
      return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    }
    if (testResult?.success) {
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    }
    if (testResult?.success === false) {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  return (
    <Card className={cn(!config.enabled && 'opacity-60')}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                environment === 'development' && 'bg-blue-500',
                environment === 'staging' && 'bg-yellow-500',
                environment === 'production' && 'bg-green-500'
              )}
            />
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {envInfo.name}
                {getStatusIcon()}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{envInfo.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={(enabled) => onChange({ enabled })}
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
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Protocol</Label>
              <Select
                value={config.protocol}
                onValueChange={(value: Protocol) => onChange({ protocol: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="https">HTTPS</SelectItem>
                  <SelectItem value="http">HTTP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Port</Label>
              <Input
                type="number"
                value={config.port}
                onChange={(e) => onChange({ port: parseInt(e.target.value) || 443 })}
                min={1}
                max={65535}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Base URL</Label>
            <Input
              value={config.baseUrl}
              onChange={(e) => onChange({ baseUrl: e.target.value })}
              placeholder="api.example.com"
            />
            <p className="text-xs text-muted-foreground">
              Domain or IP address without protocol
            </p>
          </div>

          <div className="space-y-2">
            <Label>API Path</Label>
            <Input
              value={config.apiPath}
              onChange={(e) => onChange({ apiPath: e.target.value })}
              placeholder="/fineract-provider/api/v1"
            />
          </div>

          <div className="space-y-2">
            <Label>Tenant ID</Label>
            <Input
              value={config.tenantId}
              onChange={(e) => onChange({ tenantId: e.target.value })}
              placeholder="default"
            />
          </div>

          {/* Full URL Preview */}
          {config.baseUrl && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Full URL</p>
              <code className="text-xs break-all">{buildServerUrl(config)}</code>
            </div>
          )}

          {/* Test Connection */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {testResult && (
                <p
                  className={cn(
                    'text-sm',
                    testResult.success ? 'text-green-600' : 'text-red-600'
                  )}
                >
                  {testResult.success
                    ? `Connected in ${testResult.responseTime}ms`
                    : testResult.error || 'Connection failed'}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onTest}
              disabled={!config.baseUrl || isTesting}
              className="gap-2"
            >
              {isTesting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Test Connection
                </>
              )}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ============================================
// Preview Panel Component
// ============================================

interface ServerPreviewPanelProps {
  environments: Record<EnvironmentType, ServerEnvironment>;
  testResults: Record<EnvironmentType, ConnectionResult | null>;
}

function ServerPreviewPanel({ environments, testResults }: ServerPreviewPanelProps) {
  const enabledEnvs = ENVIRONMENTS.filter((env) => environments[env].enabled);

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Server className="w-4 h-4" />
            Configuration Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Enabled Environments */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Enabled Environments</p>
            {enabledEnvs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No environments enabled</p>
            ) : (
              <div className="space-y-2">
                {enabledEnvs.map((env) => {
                  const config = environments[env];
                  const result = testResults[env];

                  return (
                    <div
                      key={env}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'w-2 h-2 rounded-full',
                            env === 'development' && 'bg-blue-500',
                            env === 'staging' && 'bg-yellow-500',
                            env === 'production' && 'bg-green-500'
                          )}
                        />
                        <span className="text-sm font-medium capitalize">{env}</span>
                      </div>
                      {result && (
                        <span className="text-xs">
                          {result.success ? (
                            <span className="text-green-600">OK</span>
                          ) : (
                            <span className="text-red-600">Failed</span>
                          )}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* URL Preview */}
          {enabledEnvs.length > 0 && (
            <div className="space-y-3 pt-3 border-t">
              <p className="text-sm font-medium">Configured URLs</p>
              <div className="space-y-2">
                {enabledEnvs.map((env) => {
                  const config = environments[env];
                  if (!config.baseUrl) return null;

                  return (
                    <div key={env} className="space-y-1">
                      <p className="text-xs text-muted-foreground capitalize">{env}</p>
                      <code className="text-[10px] block break-all bg-muted p-1.5 rounded">
                        {buildServerUrl(config)}
                      </code>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated Files */}
          <div className="space-y-3 pt-3 border-t">
            <p className="text-sm font-medium">Generated Files</p>
            <div className="space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Server className="w-3 h-3" />
                network_config.kt
              </p>
              <p className="flex items-center gap-2">
                <Server className="w-3 h-3" />
                ApiEndpoints.swift
              </p>
              <p className="flex items-center gap-2">
                <Server className="w-3 h-3" />
                build.gradle.kts
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
