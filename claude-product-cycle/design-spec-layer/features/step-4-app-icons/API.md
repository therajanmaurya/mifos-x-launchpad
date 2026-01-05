# Step 4: App Icons - API Reference

> Interfaces and types for App Icons

---

## Type Definitions

```typescript
type IconShape = 'circle' | 'rounded' | 'squircle' | 'square';

interface Step4State {
  iconFile: File | null;
  iconDataUrl: string | null;
  backgroundColor: string;
  iconShape: IconShape;
  generatedIcons: {
    android: Record<string, string>;
    ios: Record<string, string>;
    web: Record<string, string>;
  };
}

interface Step4Actions {
  uploadIcon: (file: File) => Promise<void>;
  removeIcon: () => void;
  setBackgroundColor: (color: string) => void;
  setIconShape: (shape: IconShape) => void;
  generateIcons: () => Promise<void>;
}
```

---

## Icon Size Constants

```typescript
const ANDROID_ICON_SIZES = {
  mdpi: 48,
  hdpi: 72,
  xhdpi: 96,
  xxhdpi: 144,
  xxxhdpi: 192,
};

const IOS_ICON_SIZES = [
  { size: 20, scales: [1, 2, 3] },
  { size: 29, scales: [1, 2, 3] },
  { size: 40, scales: [1, 2, 3] },
  { size: 60, scales: [2, 3] },
  { size: 76, scales: [1, 2] },
  { size: 83.5, scales: [2] },
  { size: 1024, scales: [1] },
];

const WEB_ICON_SIZES = {
  favicon16: 16,
  favicon32: 32,
  appleTouchIcon: 180,
  pwa192: 192,
  pwa512: 512,
};
```

---

## Icon Generator

```typescript
async function generateIcon(
  source: HTMLImageElement,
  size: number,
  shape: IconShape,
  backgroundColor: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Apply shape mask
  applyShapeMask(ctx, size, shape);

  // Draw scaled image
  ctx.drawImage(source, 0, 0, size, size);

  return canvas.toDataURL('image/png');
}

function applyShapeMask(ctx: CanvasRenderingContext2D, size: number, shape: IconShape) {
  ctx.beginPath();

  switch (shape) {
    case 'circle':
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      break;
    case 'rounded':
      roundRect(ctx, 0, 0, size, size, size * 0.15);
      break;
    case 'squircle':
      squircle(ctx, size);
      break;
    case 'square':
      ctx.rect(0, 0, size, size);
      break;
  }

  ctx.clip();
}
```

---

## Validation

```typescript
const step4Schema = z.object({
  iconFile: z.instanceof(File).nullable(),
  iconDataUrl: z.string().nullable(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  iconShape: z.enum(['circle', 'rounded', 'squircle', 'square']),
});

function validateIconFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/png', 'image/svg+xml', 'image/jpeg'];

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File too large (max 5MB)' };
  }

  return { valid: true };
}
```

---

## Component Props

```typescript
interface IconUploaderProps {
  onUpload: (file: File) => void;
  currentIcon: string | null;
  onRemove: () => void;
}

interface ShapeSelectorProps {
  value: IconShape;
  onChange: (shape: IconShape) => void;
}

interface IconGridProps {
  icons: Record<string, string>;
  platform: 'android' | 'ios' | 'web';
}
```

---

## Related Files

- [SPEC.md](./SPEC.md)
- [MOCKUP.md](./MOCKUP.md)
