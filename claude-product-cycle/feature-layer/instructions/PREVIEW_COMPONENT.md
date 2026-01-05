# Preview Component Patterns

> Live preview components

---

## Device Mockup

```typescript
interface DevicePreviewProps {
  colors: ColorPalette;
  appName: string;
  mode: 'light' | 'dark';
}

export function DevicePreview({ colors, appName, mode }: DevicePreviewProps) {
  const activeColors = mode === 'dark' ? colors.dark : colors.light;

  return (
    <div className="relative w-[280px] h-[560px]">
      {/* Phone frame */}
      <div className="absolute inset-0 bg-gray-900 rounded-[40px] p-3">
        {/* Screen */}
        <div
          className="h-full rounded-[32px] overflow-hidden"
          style={{ backgroundColor: activeColors.background }}
        >
          {/* Header */}
          <div
            className="h-14 flex items-center px-4"
            style={{ backgroundColor: activeColors.primary }}
          >
            <span style={{ color: activeColors.onPrimary }}>
              {appName}
            </span>
          </div>

          {/* Content */}
          <div className="p-4">
            <div
              className="rounded-lg p-4"
              style={{ backgroundColor: activeColors.surface }}
            >
              Sample Card
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Live Color Preview

```typescript
export function ThemePreview() {
  const colors = useWizardStore((state) => state.step3.colors);

  // Preview updates automatically when store changes
  return (
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(colors).map(([name, color]) => (
        <div key={name} className="text-center">
          <div
            className="w-12 h-12 rounded-lg mx-auto"
            style={{ backgroundColor: color }}
          />
          <span className="text-xs">{name}</span>
        </div>
      ))}
    </div>
  );
}
```
