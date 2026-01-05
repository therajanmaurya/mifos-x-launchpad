'use client';

import { useState, useCallback } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Trash2,
  Download,
  Smartphone,
  Monitor,
  Globe,
  RefreshCw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useIconUpload } from '@/store/wizard-store';
import {
  ICON_SHAPE_OPTIONS,
  ANDROID_ICON_SIZES,
  IOS_ICON_SIZES,
  WEB_ICON_SIZES,
  type IconShape,
  type HexColor,
} from '@/types/wizard';
import {
  generateAllIcons,
  validateIconFile,
  readFileAsDataUrl,
  downloadIcon,
} from '@/lib/icon-generator';
import { cn } from '@/lib/utils';

type Platform = 'android' | 'ios' | 'web';

export function Step4AppIcons() {
  const {
    iconDataUrl,
    backgroundColor,
    iconShape,
    generatedIcons,
    iconsGenerated,
    setIconDataUrl,
    setIconBackgroundColor,
    setIconShape,
    setGeneratedIcons,
    resetIcons,
  } = useIconUpload();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('android');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = useCallback(
    async (file: File) => {
      setError(null);

      const validation = validateIconFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');
        return;
      }

      try {
        const dataUrl = await readFileAsDataUrl(file);
        setIconDataUrl(dataUrl);
      } catch {
        setError('Failed to read file');
      }
    },
    [setIconDataUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload]
  );

  const handleGenerateIcons = useCallback(async () => {
    if (!iconDataUrl) return;

    setIsGenerating(true);
    setError(null);

    try {
      const icons = await generateAllIcons(iconDataUrl, iconShape, backgroundColor);
      setGeneratedIcons(icons);
    } catch {
      setError('Failed to generate icons');
    } finally {
      setIsGenerating(false);
    }
  }, [iconDataUrl, iconShape, backgroundColor, setGeneratedIcons]);

  const handleRemoveIcon = useCallback(() => {
    resetIcons();
    setError(null);
  }, [resetIcons]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">App Icons</h2>
          <p className="text-muted-foreground mt-1">
            Upload your app icon and generate all required sizes for each platform
          </p>
        </div>

        {/* Icon Upload */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-primary" />
              Source Icon
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!iconDataUrl ? (
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => document.getElementById('icon-upload')?.click()}
              >
                <input
                  id="icon-upload"
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Drop your icon here</p>
                <p className="text-sm text-muted-foreground mt-1">
                  or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-4">
                  PNG, SVG, or JPG • Minimum 1024x1024 • Max 5MB
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-6">
                <div
                  className="w-32 h-32 rounded-lg border overflow-hidden flex-shrink-0"
                  style={{ backgroundColor }}
                >
                  <img
                    src={iconDataUrl}
                    alt="App icon"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('icon-upload')?.click()}
                    >
                      Change Icon
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveIcon}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <input
                    id="icon-upload"
                    type="file"
                    accept="image/png,image/svg+xml,image/jpeg,image/jpg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <p className="text-sm text-muted-foreground">
                    Icon uploaded successfully. Configure options below and generate icons.
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Icon Options */}
        {iconDataUrl && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Icon Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Shape Selection */}
              <div className="space-y-3">
                <Label>Icon Shape</Label>
                <div className="grid grid-cols-4 gap-3">
                  {ICON_SHAPE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setIconShape(option.value)}
                      className={cn(
                        'relative p-4 rounded-lg border-2 transition-all text-center',
                        iconShape === option.value
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {iconShape === option.value && (
                        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                      <ShapePreview
                        shape={option.value}
                        size={48}
                        color={backgroundColor}
                      />
                      <p className="text-xs font-medium mt-2">{option.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-3">
                <Label>Background Color</Label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setIconBackgroundColor(e.target.value as HexColor)}
                      className="w-10 h-10 rounded border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => {
                        if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                          setIconBackgroundColor(e.target.value as HexColor);
                        }
                      }}
                      className="w-24 px-2 py-1 border rounded text-sm font-mono uppercase"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['#ffffff', '#000000', '#f3f4f6', '#2563eb', '#059669'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setIconBackgroundColor(color as HexColor)}
                        className={cn(
                          'w-8 h-8 rounded border',
                          backgroundColor === color && 'ring-2 ring-primary ring-offset-2'
                        )}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Generate Button */}
              <div className="pt-4">
                <Button
                  onClick={handleGenerateIcons}
                  disabled={isGenerating}
                  className="gap-2"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      {iconsGenerated ? 'Regenerate Icons' : 'Generate Icons'}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generated Icons */}
        {iconsGenerated && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Generated Icons</span>
                <div className="flex gap-1 p-1 bg-muted rounded-lg">
                  {(['android', 'ios', 'web'] as Platform[]).map((platform) => (
                    <button
                      key={platform}
                      onClick={() => setSelectedPlatform(platform)}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors capitalize',
                        selectedPlatform === platform
                          ? 'bg-background shadow text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {platform === 'android' && <Smartphone className="w-4 h-4" />}
                      {platform === 'ios' && <Monitor className="w-4 h-4" />}
                      {platform === 'web' && <Globe className="w-4 h-4" />}
                      {platform}
                    </button>
                  ))}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IconGrid
                icons={generatedIcons[selectedPlatform]}
                platform={selectedPlatform}
              />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Preview Panel - Desktop Only */}
      <div className="hidden lg:block w-[320px] shrink-0">
        <IconPreviewPanel
          iconDataUrl={iconDataUrl}
          backgroundColor={backgroundColor}
          iconShape={iconShape}
        />
      </div>
    </div>
  );
}

// ============================================
// Shape Preview Component
// ============================================

function ShapePreview({
  shape,
  size,
  color,
}: {
  shape: IconShape;
  size: number;
  color: string;
}) {
  const getShapeStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: size,
      height: size,
      backgroundColor: color,
      margin: '0 auto',
      border: '1px solid var(--border)',
    };

    switch (shape) {
      case 'circle':
        return { ...base, borderRadius: '50%' };
      case 'rounded':
        return { ...base, borderRadius: size * 0.15 };
      case 'squircle':
        return { ...base, borderRadius: size * 0.22 };
      case 'square':
      default:
        return base;
    }
  };

  return <div style={getShapeStyle()} />;
}

// ============================================
// Icon Grid Component
// ============================================

function IconGrid({
  icons,
  platform,
}: {
  icons: Record<string, string>;
  platform: Platform;
}) {
  const getIconLabel = (key: string): string => {
    if (platform === 'android') {
      const size = ANDROID_ICON_SIZES[key];
      return `${key} (${size}x${size})`;
    }
    if (platform === 'ios') {
      const [size, scale] = key.split('@');
      return `${size}pt ${scale}`;
    }
    if (platform === 'web') {
      const size = WEB_ICON_SIZES[key];
      const labels: Record<string, string> = {
        favicon16: 'Favicon 16x16',
        favicon32: 'Favicon 32x32',
        appleTouchIcon: 'Apple Touch 180x180',
        pwa192: 'PWA 192x192',
        pwa512: 'PWA 512x512',
      };
      return labels[key] || `${size}x${size}`;
    }
    return key;
  };

  const entries = Object.entries(icons);

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground py-8">
        No icons generated yet
      </p>
    );
  }

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
      {entries.map(([key, dataUrl]) => (
        <div key={key} className="text-center">
          <div className="relative group">
            <img
              src={dataUrl}
              alt={key}
              className="w-12 h-12 mx-auto rounded border bg-muted object-contain"
            />
            <button
              onClick={() => downloadIcon(dataUrl, `icon-${key}.png`)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded"
              title="Download"
            >
              <Download className="w-4 h-4 text-white" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{getIconLabel(key)}</p>
        </div>
      ))}
    </div>
  );
}

// ============================================
// Preview Panel Component
// ============================================

function IconPreviewPanel({
  iconDataUrl,
  backgroundColor,
  iconShape,
}: {
  iconDataUrl: string | null;
  backgroundColor: string;
  iconShape: IconShape;
}) {
  const getBorderRadius = (): string => {
    switch (iconShape) {
      case 'circle':
        return '50%';
      case 'rounded':
        return '15%';
      case 'squircle':
        return '22%';
      case 'square':
      default:
        return '0';
    }
  };

  return (
    <div className="space-y-4 sticky top-24">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Preview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Large Preview */}
          <div className="flex justify-center">
            <div
              className="w-32 h-32 flex items-center justify-center border"
              style={{
                backgroundColor,
                borderRadius: getBorderRadius(),
              }}
            >
              {iconDataUrl ? (
                <img
                  src={iconDataUrl}
                  alt="Icon preview"
                  className="w-24 h-24 object-contain"
                />
              ) : (
                <ImageIcon className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Size Previews */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Size Comparison</p>
            <div className="flex items-end justify-center gap-3">
              {[16, 32, 48, 72, 96].map((size) => (
                <div key={size} className="text-center">
                  <div
                    className="border flex items-center justify-center mx-auto"
                    style={{
                      width: size,
                      height: size,
                      backgroundColor,
                      borderRadius:
                        iconShape === 'circle'
                          ? '50%'
                          : iconShape === 'squircle'
                          ? '22%'
                          : iconShape === 'rounded'
                          ? '15%'
                          : '0',
                    }}
                  >
                    {iconDataUrl && (
                      <img
                        src={iconDataUrl}
                        alt={`${size}px`}
                        style={{
                          width: size * 0.75,
                          height: size * 0.75,
                          objectFit: 'contain',
                        }}
                      />
                    )}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">{size}px</p>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Stats */}
          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-medium">Generated Sizes</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-lg font-bold">{Object.keys(ANDROID_ICON_SIZES).length}</p>
                <p className="text-xs text-muted-foreground">Android</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-lg font-bold">
                  {IOS_ICON_SIZES.reduce((sum, { scales }) => sum + scales.length, 0)}
                </p>
                <p className="text-xs text-muted-foreground">iOS</p>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <p className="text-lg font-bold">{Object.keys(WEB_ICON_SIZES).length}</p>
                <p className="text-xs text-muted-foreground">Web</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
