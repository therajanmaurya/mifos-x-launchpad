'use client';

import { Lock, FileCode, Building2, Package, Hash, Loader2, AlertCircle, Cpu, GitBranch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useStep2Form, useSDKInfo, useAppSelection } from '@/store/wizard-store';

export function Step2ProjectInfo() {
  const {
    organizationName,
    organizationWebsite,
    supportEmail,
    projectName,
    displayName,
    description,
    packageName,
    applicationId,
    handleChange,
  } = useStep2Form();

  const { sdkInfo, isLoading: isLoadingSDK, error: sdkError } = useSDKInfo();
  const { selectedAppData } = useAppSelection();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Project Information</h2>
          <p className="text-muted-foreground mt-1">
            Configure your project metadata and package identifiers
          </p>
        </div>

        {/* Organization Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Organization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Organization Name"
                required
                value={organizationName}
                onChange={(value) => handleChange('organizationName', value)}
                placeholder="Acme Financial Services"
              />
              <FormField
                label="Website"
                value={organizationWebsite}
                onChange={(value) => handleChange('organizationWebsite', value)}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            <FormField
              label="Support Email"
              value={supportEmail}
              onChange={(value) => handleChange('supportEmail', value)}
              placeholder="support@example.com"
              type="email"
            />
          </CardContent>
        </Card>

        {/* Project Details Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Project Name"
                required
                value={projectName}
                onChange={(value) => handleChange('projectName', value)}
                placeholder="AcmePay"
                helperText="Alphanumeric, no spaces (e.g., AcmePay)"
              />
              <FormField
                label="Display Name"
                required
                value={displayName}
                onChange={(value) => handleChange('displayName', value)}
                placeholder="Acme Pay"
                helperText="Shown to users in the app"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="A brief description of your mobile banking application..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                {description.length}/500 characters
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Package Configuration Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Package Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Package Name"
                required
                value={packageName}
                onChange={(value) => handleChange('packageName', value)}
                placeholder="com.example.app"
                helperText="Reverse domain format (e.g., com.acme.pay)"
              />
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  Application ID
                  <Lock className="w-3 h-3 text-muted-foreground" />
                </Label>
                <Input
                  value={applicationId || packageName}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Auto-generated from package name
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Version Section - Auto Generated */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Version Information
              <Badge variant="secondary" className="ml-2 text-xs font-normal">
                <GitBranch className="w-3 h-3 mr-1" />
                Auto-managed
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Version 1.0.0</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Build number auto-generated on each build
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    Auto
                  </Badge>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground">
                  Versioning is managed automatically using semantic versioning (1.0.0).
                  Build codes are generated based on timestamp during the build process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDK Configuration Section - Read Only from Selected App */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" />
              SDK Configuration
              <Badge variant="secondary" className="ml-2 text-xs font-normal">
                <Lock className="w-3 h-3 mr-1" />
                Auto-detected
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingSDK ? (
              <div className="flex items-center gap-3 py-4 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading SDK configuration from {selectedAppData?.name || 'repository'}...</span>
              </div>
            ) : sdkError ? (
              <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-destructive">Failed to load SDK configuration</p>
                  <p className="text-sm text-muted-foreground">Please go back and select an app first</p>
                </div>
              </div>
            ) : sdkInfo ? (
              <div className="space-y-4">
                {/* Build Tools */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Build Tools</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="secondary" className="text-sm">
                      Kotlin {sdkInfo.kotlin}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      Compose {sdkInfo.compose}
                    </Badge>
                    <Badge variant="secondary" className="text-sm">
                      AGP {sdkInfo.androidGradlePlugin}
                    </Badge>
                  </div>
                </div>

                {/* Platform Requirements */}
                <div>
                  <Label className="text-xs text-muted-foreground uppercase tracking-wide">Platform Requirements</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200">
                      Android {sdkInfo.minAndroidSdk} - {sdkInfo.targetAndroidSdk}
                    </Badge>
                    <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
                      iOS {sdkInfo.minIosVersion}+
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  SDK versions are automatically detected from the selected base application and cannot be modified.
                </p>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No app selected</p>
                <p className="text-xs mt-1">Go back to Step 1 to select a base application</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <PreviewPanel
          projectName={projectName}
          displayName={displayName}
          packageName={packageName}
          minAndroidSdk={sdkInfo?.minAndroidSdk ?? 24}
          minIosVersion={sdkInfo?.minIosVersion ?? '15.0'}
        />
      </div>
    </div>
  );
}

// ============================================
// Form Field Component
// ============================================

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'url';
  helperText?: string;
}

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  helperText,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

// ============================================
// Preview Panel Component
// ============================================

interface PreviewPanelProps {
  projectName: string;
  displayName: string;
  packageName: string;
  minAndroidSdk: number;
  minIosVersion: string;
}

function PreviewPanel({
  projectName,
  displayName,
  packageName,
  minAndroidSdk,
  minIosVersion,
}: PreviewPanelProps) {
  return (
    <div className="space-y-4 sticky top-24">
      {/* Project Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Project Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <p className="font-medium">{displayName || 'Not set'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Package:</span>
            <p className="font-mono text-xs">{packageName || 'com.example.app'}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Version:</span>
            <p className="font-medium flex items-center gap-2">
              1.0.0
              <Badge variant="outline" className="text-xs font-normal">
                <Lock className="w-2.5 h-2.5 mr-1" />
                Auto
              </Badge>
            </p>
          </div>
          <div className="pt-2 border-t">
            <span className="text-muted-foreground">Target Platforms:</span>
            <div className="flex gap-2 mt-1">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                Android {minAndroidSdk}+
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                iOS {minIosVersion}+
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Files Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Generated Files</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCode className="w-4 h-4" />
            <span>build.gradle.kts</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCode className="w-4 h-4" />
            <span>settings.gradle.kts</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCode className="w-4 h-4" />
            <span>AndroidManifest.xml</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCode className="w-4 h-4" />
            <span>Info.plist</span>
          </div>
          {projectName && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileCode className="w-4 h-4" />
              <span>{projectName}App.kt</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
