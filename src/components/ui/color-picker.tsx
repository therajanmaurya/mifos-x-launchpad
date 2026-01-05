'use client';

import { useState, useEffect } from 'react';
import { HexColorPicker, HexColorInput } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { HexColor } from '@/types/wizard';

interface ColorPickerProps {
  value: HexColor;
  onChange: (color: HexColor) => void;
  label: string;
  presets?: HexColor[];
  disabled?: boolean;
}

const DEFAULT_PRESETS: HexColor[] = [
  '#2563eb' as HexColor,
  '#059669' as HexColor,
  '#7c3aed' as HexColor,
  '#ea580c' as HexColor,
  '#0d9488' as HexColor,
  '#dc2626' as HexColor,
  '#64748b' as HexColor,
  '#0f172a' as HexColor,
];

export function ColorPicker({
  value,
  onChange,
  label,
  presets = DEFAULT_PRESETS,
  disabled = false,
}: ColorPickerProps) {
  const [localColor, setLocalColor] = useState(value);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setLocalColor(value);
  }, [value]);

  const handleColorChange = (color: string) => {
    setLocalColor(color as HexColor);
  };

  const handleClose = () => {
    onChange(localColor);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-full justify-start gap-2 h-10',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            disabled={disabled}
          >
            <div
              className="w-6 h-6 rounded border border-border"
              style={{ backgroundColor: value }}
            />
            <span className="font-mono text-sm uppercase">{value}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <HexColorPicker color={localColor} onChange={handleColorChange} />

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">#</span>
              <HexColorInput
                color={localColor}
                onChange={handleColorChange}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm font-mono uppercase"
                prefixed={false}
              />
            </div>

            {/* Preset colors */}
            <div className="space-y-2">
              <span className="text-xs text-muted-foreground">Presets</span>
              <div className="flex flex-wrap gap-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={cn(
                      'w-6 h-6 rounded border border-border hover:scale-110 transition-transform',
                      localColor.toLowerCase() === preset.toLowerCase() && 'ring-2 ring-primary'
                    )}
                    style={{ backgroundColor: preset }}
                    onClick={() => setLocalColor(preset)}
                    title={preset}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalColor(value);
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleClose}>
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
