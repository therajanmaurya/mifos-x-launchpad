/**
 * Icon Generator Utility
 * Uses Canvas API to generate app icons in various sizes
 */

import type { IconShape, GeneratedIcons } from '@/types/wizard';
import { ANDROID_ICON_SIZES, IOS_ICON_SIZES, WEB_ICON_SIZES } from '@/types/wizard';

/**
 * Apply shape mask to canvas context
 */
function applyShapeMask(
  ctx: CanvasRenderingContext2D,
  size: number,
  shape: IconShape
): void {
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
    default:
      ctx.rect(0, 0, size, size);
      break;
  }

  ctx.clip();
}

/**
 * Draw rounded rectangle path
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

/**
 * Draw iOS-style squircle path
 */
function squircle(ctx: CanvasRenderingContext2D, size: number): void {
  const n = 4; // Squircle exponent (4 gives iOS-like shape)
  const radius = size / 2;
  const points = 360;

  ctx.moveTo(size, radius);

  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    // Superellipse formula
    const x = radius + radius * Math.sign(cos) * Math.pow(Math.abs(cos), 2 / n);
    const y = radius + radius * Math.sign(sin) * Math.pow(Math.abs(sin), 2 / n);

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }

  ctx.closePath();
}

/**
 * Generate a single icon at specified size
 */
export async function generateIcon(
  source: HTMLImageElement,
  size: number,
  shape: IconShape,
  backgroundColor: string
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Fill background
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Apply shape mask
  applyShapeMask(ctx, size, shape);

  // Draw scaled image centered
  const scale = Math.min(size / source.width, size / source.height);
  const scaledWidth = source.width * scale;
  const scaledHeight = source.height * scale;
  const x = (size - scaledWidth) / 2;
  const y = (size - scaledHeight) / 2;

  ctx.drawImage(source, x, y, scaledWidth, scaledHeight);

  return canvas.toDataURL('image/png');
}

/**
 * Load image from data URL
 */
export function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Generate all icons for all platforms
 */
export async function generateAllIcons(
  iconDataUrl: string,
  shape: IconShape,
  backgroundColor: string
): Promise<GeneratedIcons> {
  const source = await loadImage(iconDataUrl);

  const android: Record<string, string> = {};
  const ios: Record<string, string> = {};
  const web: Record<string, string> = {};

  // Generate Android icons
  for (const [density, size] of Object.entries(ANDROID_ICON_SIZES)) {
    android[density] = await generateIcon(source, size, shape, backgroundColor);
  }

  // Generate iOS icons
  for (const { size, scales } of IOS_ICON_SIZES) {
    for (const scale of scales) {
      const pixelSize = Math.round(size * scale);
      const key = `${size}@${scale}x`;
      ios[key] = await generateIcon(source, pixelSize, shape, backgroundColor);
    }
  }

  // Generate Web icons
  for (const [name, size] of Object.entries(WEB_ICON_SIZES)) {
    web[name] = await generateIcon(source, size, shape, backgroundColor);
  }

  return { android, ios, web };
}

/**
 * Validate icon file
 */
export function validateIconFile(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/png', 'image/svg+xml', 'image/jpeg', 'image/jpg'];

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please use PNG, SVG, or JPG.' };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }

  return { valid: true };
}

/**
 * Read file as data URL
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Download a single icon
 */
export function downloadIcon(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
