'use client';

import { Palette, Sun, Moon, Sparkles, RefreshCw, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ColorPicker } from '@/components/ui/color-picker';
import { useTheme } from '@/store/wizard-store';
import { THEME_PRESETS, type ColorRole, type HexColor, checkContrast } from '@/types/wizard';
import { cn } from '@/lib/utils';

// Color role labels for display
const COLOR_LABELS: Record<ColorRole, { label: string; description: string }> = {
  primary: { label: 'Primary', description: 'Main brand color' },
  secondary: { label: 'Secondary', description: 'Supporting color' },
  accent: { label: 'Accent', description: 'Highlight color' },
  background: { label: 'Background', description: 'App background' },
  surface: { label: 'Surface', description: 'Card backgrounds' },
  error: { label: 'Error', description: 'Error states' },
  success: { label: 'Success', description: 'Success states' },
  warning: { label: 'Warning', description: 'Warning states' },
  onPrimary: { label: 'On Primary', description: 'Text on primary' },
  onSecondary: { label: 'On Secondary', description: 'Text on secondary' },
  onBackground: { label: 'On Background', description: 'Text on background' },
  onSurface: { label: 'On Surface', description: 'Text on surface' },
};

// Main colors to display in the primary picker section
const MAIN_COLORS: ColorRole[] = ['primary', 'secondary', 'accent', 'background', 'surface'];

// Semantic colors
const SEMANTIC_COLORS: ColorRole[] = ['error', 'success', 'warning'];

// Text colors
const TEXT_COLORS: ColorRole[] = ['onPrimary', 'onSecondary', 'onBackground', 'onSurface'];

export function Step3BrandingTheme() {
  const {
    colors,
    darkColors,
    activeColors,
    darkModeEnabled,
    selectedPreset,
    previewMode,
    updateColor,
    applyPreset,
    toggleDarkMode,
    generateDarkColors,
    setPreviewMode,
    resetColors,
  } = useTheme();

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Branding & Theme</h2>
          <p className="text-muted-foreground mt-1">
            Choose your color palette and configure theme options
          </p>
        </div>

        {/* Theme Presets */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Theme Presets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.id)}
                  className={cn(
                    'relative p-3 rounded-lg border-2 transition-all hover:scale-105',
                    selectedPreset === preset.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/50'
                  )}
                >
                  {selectedPreset === preset.id && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                  <div className="flex gap-1 mb-2">
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.colors.primary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.colors.secondary }}
                    />
                    <div
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: preset.colors.accent }}
                    />
                  </div>
                  <p className="text-xs font-medium truncate">{preset.name}</p>
                </button>
              ))}
            </div>
            {!selectedPreset && (
              <p className="text-xs text-muted-foreground mt-3">
                Custom colors selected. Choose a preset to reset.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Dark Mode Toggle */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-primary" />
                Dark Mode Support
              </span>
              <div className="flex items-center gap-2">
                <Label htmlFor="dark-mode" className="text-sm font-normal">
                  Enable dark mode
                </Label>
                <Switch
                  id="dark-mode"
                  checked={darkModeEnabled}
                  onCheckedChange={toggleDarkMode}
                />
              </div>
            </CardTitle>
          </CardHeader>
          {darkModeEnabled && (
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
                  <button
                    onClick={() => setPreviewMode('light')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                      previewMode === 'light'
                        ? 'bg-background shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Sun className="w-4 h-4" />
                    Light
                  </button>
                  <button
                    onClick={() => setPreviewMode('dark')}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                      previewMode === 'dark'
                        ? 'bg-background shadow text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Moon className="w-4 h-4" />
                    Dark
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={generateDarkColors}
                  className="gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  Auto-generate
                </Button>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Main Colors */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Main Colors
              {previewMode === 'dark' && darkModeEnabled && (
                <span className="text-xs bg-muted px-2 py-0.5 rounded">Dark Mode</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {MAIN_COLORS.map((role) => (
                <ColorPicker
                  key={role}
                  label={COLOR_LABELS[role].label}
                  value={previewMode === 'dark' && darkModeEnabled ? darkColors[role] : colors[role]}
                  onChange={(color) =>
                    updateColor(role, color, darkModeEnabled && previewMode === 'dark' ? 'dark' : 'light')
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Semantic Colors */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Semantic Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {SEMANTIC_COLORS.map((role) => (
                <ColorPicker
                  key={role}
                  label={COLOR_LABELS[role].label}
                  value={previewMode === 'dark' && darkModeEnabled ? darkColors[role] : colors[role]}
                  onChange={(color) =>
                    updateColor(role, color, darkModeEnabled && previewMode === 'dark' ? 'dark' : 'light')
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Text Colors */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Text Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TEXT_COLORS.map((role) => (
                <ColorPicker
                  key={role}
                  label={COLOR_LABELS[role].label}
                  value={previewMode === 'dark' && darkModeEnabled ? darkColors[role] : colors[role]}
                  onChange={(color) =>
                    updateColor(role, color, darkModeEnabled && previewMode === 'dark' ? 'dark' : 'light')
                  }
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={resetColors} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </Button>
        </div>
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <DevicePreview
          colors={activeColors}
          previewMode={previewMode}
          darkModeEnabled={darkModeEnabled}
        />
      </div>
    </div>
  );
}

// ============================================
// Device Preview Component
// ============================================

interface DevicePreviewProps {
  colors: {
    primary: HexColor;
    secondary: HexColor;
    accent: HexColor;
    background: HexColor;
    surface: HexColor;
    error: HexColor;
    success: HexColor;
    warning: HexColor;
    onPrimary: HexColor;
    onSecondary: HexColor;
    onBackground: HexColor;
    onSurface: HexColor;
  };
  previewMode: 'light' | 'dark';
  darkModeEnabled: boolean;
}

function DevicePreview({ colors, previewMode, darkModeEnabled }: DevicePreviewProps) {
  // Check contrast for accessibility
  const primaryContrast = checkContrast(colors.onPrimary, colors.primary);
  const bgContrast = checkContrast(colors.onBackground, colors.background);

  return (
    <div className="space-y-4 sticky top-24">
      {/* Phone Preview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            Live Preview
            {darkModeEnabled && (
              <span className="text-xs bg-muted px-2 py-0.5 rounded">
                {previewMode === 'dark' ? 'Dark' : 'Light'}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Phone Frame */}
          <div className="relative mx-auto w-[200px]">
            {/* Phone bezel */}
            <div className="rounded-[24px] border-4 border-gray-800 bg-gray-800 p-2 shadow-xl">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-b-xl z-10" />

              {/* Screen */}
              <div
                className="rounded-[16px] overflow-hidden h-[340px]"
                style={{ backgroundColor: colors.background }}
              >
                {/* Status Bar */}
                <div
                  className="h-6 px-4 flex items-center justify-between text-[8px]"
                  style={{ color: colors.onBackground }}
                >
                  <span>9:41</span>
                  <span>100%</span>
                </div>

                {/* App Header */}
                <div
                  className="px-3 py-2"
                  style={{ backgroundColor: colors.primary }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: colors.onPrimary }}
                  >
                    My App
                  </p>
                </div>

                {/* Content */}
                <div className="p-3 space-y-2">
                  {/* Card 1 */}
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <p
                      className="text-[10px] font-medium"
                      style={{ color: colors.onSurface }}
                    >
                      Account Balance
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: colors.primary }}
                    >
                      $12,450.00
                    </p>
                  </div>

                  {/* Card 2 */}
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: colors.surface }}
                  >
                    <p
                      className="text-[10px]"
                      style={{ color: colors.onSurface }}
                    >
                      Recent Transaction
                    </p>
                    <div className="flex justify-between items-center mt-1">
                      <span
                        className="text-[9px]"
                        style={{ color: colors.secondary }}
                      >
                        Coffee Shop
                      </span>
                      <span
                        className="text-[9px]"
                        style={{ color: colors.error }}
                      >
                        -$4.50
                      </span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      className="flex-1 py-1.5 rounded-md text-[9px] font-medium"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.onPrimary,
                      }}
                    >
                      Transfer
                    </button>
                    <button
                      className="flex-1 py-1.5 rounded-md text-[9px] font-medium border"
                      style={{
                        borderColor: colors.secondary,
                        color: colors.secondary,
                      }}
                    >
                      History
                    </button>
                  </div>

                  {/* Status indicators */}
                  <div className="flex gap-2 mt-2">
                    <div
                      className="flex-1 py-1 rounded text-center text-[8px]"
                      style={{
                        backgroundColor: colors.success + '20',
                        color: colors.success,
                      }}
                    >
                      Success
                    </div>
                    <div
                      className="flex-1 py-1 rounded text-center text-[8px]"
                      style={{
                        backgroundColor: colors.warning + '20',
                        color: colors.warning,
                      }}
                    >
                      Pending
                    </div>
                  </div>
                </div>

                {/* Bottom Nav */}
                <div
                  className="absolute bottom-0 left-0 right-0 px-3 py-2 flex justify-around"
                  style={{ backgroundColor: colors.surface }}
                >
                  <div
                    className="w-6 h-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                  />
                  <div
                    className="w-6 h-1 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  />
                  <div
                    className="w-6 h-1 rounded-full"
                    style={{ backgroundColor: colors.secondary }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contrast Check */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Accessibility</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Primary Contrast</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                primaryContrast.passesAA
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {primaryContrast.ratio}:1 {primaryContrast.passesAA ? 'AA' : 'Fail'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Background Contrast</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded text-xs font-medium',
                bgContrast.passesAA
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {bgContrast.ratio}:1 {bgContrast.passesAA ? 'AA' : 'Fail'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            WCAG AA requires 4.5:1 for normal text
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
