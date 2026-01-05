'use client';

import { Lock, FileCode, Building2, Package, Hash } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStep2Form } from '@/store/wizard-store';
import { ANDROID_SDK_VERSIONS, IOS_VERSIONS } from '@/types/wizard';

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
    versionName,
    versionCode,
    minAndroidSdk,
    targetAndroidSdk,
    minIosVersion,
    handleChange,
  } = useStep2Form();

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

        {/* Version Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hash className="w-5 h-5 text-primary" />
              Version Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <FormField
                label="Version Name"
                required
                value={versionName}
                onChange={(value) => handleChange('versionName', value)}
                placeholder="1.0.0"
                helperText="Semantic versioning (X.Y.Z)"
              />
              <div className="space-y-2">
                <Label>
                  Version Code <span className="text-destructive">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  value={versionCode}
                  onChange={(e) => handleChange('versionCode', parseInt(e.target.value) || 1)}
                />
                <p className="text-xs text-muted-foreground">
                  Integer, incremented for each release
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SDK Configuration Section */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">SDK Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  Min Android SDK <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={minAndroidSdk.toString()}
                  onValueChange={(value) => handleChange('minAndroidSdk', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select SDK" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANDROID_SDK_VERSIONS.filter(v => v.value >= 21 && v.value <= 30).map((sdk) => (
                      <SelectItem key={sdk.value} value={sdk.value.toString()}>
                        {sdk.value} - {sdk.name.split(' ').slice(1).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Target Android SDK <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={targetAndroidSdk.toString()}
                  onValueChange={(value) => handleChange('targetAndroidSdk', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select SDK" />
                  </SelectTrigger>
                  <SelectContent>
                    {ANDROID_SDK_VERSIONS.filter(v => v.value >= 28).map((sdk) => (
                      <SelectItem key={sdk.value} value={sdk.value.toString()}>
                        {sdk.value} - {sdk.name.split(' ').slice(1).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>
                  Min iOS Version <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={minIosVersion}
                  onValueChange={(value) => handleChange('minIosVersion', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select version" />
                  </SelectTrigger>
                  <SelectContent>
                    {IOS_VERSIONS.map((ios) => (
                      <SelectItem key={ios.value} value={ios.value}>
                        {ios.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <PreviewPanel
          projectName={projectName}
          displayName={displayName}
          packageName={packageName}
          versionName={versionName}
          versionCode={versionCode}
          minAndroidSdk={minAndroidSdk}
          minIosVersion={minIosVersion}
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
  versionName: string;
  versionCode: number;
  minAndroidSdk: number;
  minIosVersion: string;
}

function PreviewPanel({
  projectName,
  displayName,
  packageName,
  versionName,
  versionCode,
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
            <p className="font-medium">
              {versionName || '1.0.0'} ({versionCode})
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
