# Android Icon Generator

> Generate Android app icons

---

## Icon Sizes

| Density | Size | Path |
|---------|------|------|
| mdpi | 48x48 | mipmap-mdpi/ic_launcher.png |
| hdpi | 72x72 | mipmap-hdpi/ic_launcher.png |
| xhdpi | 96x96 | mipmap-xhdpi/ic_launcher.png |
| xxhdpi | 144x144 | mipmap-xxhdpi/ic_launcher.png |
| xxxhdpi | 192x192 | mipmap-xxxhdpi/ic_launcher.png |

---

## Adaptive Icons

```xml
<!-- mipmap-anydpi-v26/ic_launcher.xml -->
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

---

## Generation Code

```typescript
async function generateAndroidIcons(
  source: HTMLImageElement,
  config: IconConfig
): Promise<Map<string, Blob>> {
  const sizes = {
    mdpi: 48,
    hdpi: 72,
    xhdpi: 96,
    xxhdpi: 144,
    xxxhdpi: 192,
  };

  const icons = new Map<string, Blob>();

  for (const [density, size] of Object.entries(sizes)) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Apply background
    ctx.fillStyle = config.backgroundColor;
    ctx.fillRect(0, 0, size, size);

    // Apply shape mask
    applyShapeMask(ctx, size, config.shape);

    // Draw image
    ctx.drawImage(source, 0, 0, size, size);

    const blob = await canvasToBlob(canvas);
    icons.set(`mipmap-${density}/ic_launcher.png`, blob);
  }

  return icons;
}
```
