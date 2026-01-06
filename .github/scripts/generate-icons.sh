#!/bin/bash
# Generate app icons for all platforms using ImageMagick
# Input: Single high-res icon (1024x1024 recommended)
# Output: Platform-specific icon sizes

set -e

INPUT_ICON="$1"
OUTPUT_DIR="$2"
PLATFORM="$3"

if [ -z "$INPUT_ICON" ] || [ -z "$OUTPUT_DIR" ]; then
  echo "Error: Missing arguments"
  echo "Usage: $0 <input-icon> <output-dir> [platform]"
  echo "Platforms: android, ios, desktop, web, all (default: all)"
  exit 1
fi

if [ ! -f "$INPUT_ICON" ]; then
  echo "Error: Input icon not found: $INPUT_ICON"
  exit 1
fi

PLATFORM="${PLATFORM:-all}"

# Ensure ImageMagick is installed
if ! command -v magick &> /dev/null && ! command -v convert &> /dev/null; then
  echo "Installing ImageMagick..."
  if command -v apt-get &> /dev/null; then
    sudo apt-get update && sudo apt-get install -y imagemagick
  elif command -v brew &> /dev/null; then
    brew install imagemagick
  else
    echo "Error: Please install ImageMagick"
    exit 1
  fi
fi

# Use 'magick' command if available, otherwise fall back to 'convert'
if command -v magick &> /dev/null; then
  CONVERT_CMD="magick"
else
  CONVERT_CMD="convert"
fi

echo "========================================"
echo "MifosLaunchpad Icon Generator"
echo "========================================"
echo "Input: $INPUT_ICON"
echo "Output: $OUTPUT_DIR"
echo "Platform: $PLATFORM"
echo "========================================"

# Generate Android icons
generate_android_icons() {
  echo ""
  echo "[Android] Generating icons..."

  local android_dir="$OUTPUT_DIR/android"
  mkdir -p "$android_dir"

  # Mipmap densities
  declare -A sizes=(
    ["mdpi"]=48
    ["hdpi"]=72
    ["xhdpi"]=96
    ["xxhdpi"]=144
    ["xxxhdpi"]=192
  )

  for density in "${!sizes[@]}"; do
    local size=${sizes[$density]}
    local dest_dir="$android_dir/mipmap-$density"
    mkdir -p "$dest_dir"

    # Generate launcher icon
    $CONVERT_CMD "$INPUT_ICON" -resize ${size}x${size} "$dest_dir/ic_launcher.png"
    echo "  - Generated mipmap-$density/ic_launcher.png (${size}x${size})"

    # Generate round launcher icon
    $CONVERT_CMD "$INPUT_ICON" -resize ${size}x${size} "$dest_dir/ic_launcher_round.png"
    echo "  - Generated mipmap-$density/ic_launcher_round.png (${size}x${size})"
  done

  # Generate adaptive icon foreground (432x432 for xxxhdpi)
  mkdir -p "$android_dir/mipmap-xxxhdpi"
  $CONVERT_CMD "$INPUT_ICON" -resize 432x432 -gravity center -background transparent -extent 432x432 \
    "$android_dir/mipmap-xxxhdpi/ic_launcher_foreground.png"
  echo "  - Generated adaptive icon foreground (432x432)"

  echo "[Android] Done!"
}

# Generate iOS icons
generate_ios_icons() {
  echo ""
  echo "[iOS] Generating icons..."

  local ios_dir="$OUTPUT_DIR/ios/Assets.xcassets/AppIcon.appiconset"
  mkdir -p "$ios_dir"

  # iOS icon sizes
  local sizes=(20 29 40 58 60 76 80 87 120 152 167 180 1024)

  for size in "${sizes[@]}"; do
    $CONVERT_CMD "$INPUT_ICON" -resize ${size}x${size} "$ios_dir/icon_${size}x${size}.png"
    echo "  - Generated icon_${size}x${size}.png"
  done

  # Generate Contents.json
  cat > "$ios_dir/Contents.json" << 'EOF'
{
  "images" : [
    {"filename": "icon_40x40.png", "idiom": "iphone", "scale": "2x", "size": "20x20"},
    {"filename": "icon_60x60.png", "idiom": "iphone", "scale": "3x", "size": "20x20"},
    {"filename": "icon_58x58.png", "idiom": "iphone", "scale": "2x", "size": "29x29"},
    {"filename": "icon_87x87.png", "idiom": "iphone", "scale": "3x", "size": "29x29"},
    {"filename": "icon_80x80.png", "idiom": "iphone", "scale": "2x", "size": "40x40"},
    {"filename": "icon_120x120.png", "idiom": "iphone", "scale": "3x", "size": "40x40"},
    {"filename": "icon_120x120.png", "idiom": "iphone", "scale": "2x", "size": "60x60"},
    {"filename": "icon_180x180.png", "idiom": "iphone", "scale": "3x", "size": "60x60"},
    {"filename": "icon_20x20.png", "idiom": "ipad", "scale": "1x", "size": "20x20"},
    {"filename": "icon_40x40.png", "idiom": "ipad", "scale": "2x", "size": "20x20"},
    {"filename": "icon_29x29.png", "idiom": "ipad", "scale": "1x", "size": "29x29"},
    {"filename": "icon_58x58.png", "idiom": "ipad", "scale": "2x", "size": "29x29"},
    {"filename": "icon_40x40.png", "idiom": "ipad", "scale": "1x", "size": "40x40"},
    {"filename": "icon_80x80.png", "idiom": "ipad", "scale": "2x", "size": "40x40"},
    {"filename": "icon_76x76.png", "idiom": "ipad", "scale": "1x", "size": "76x76"},
    {"filename": "icon_152x152.png", "idiom": "ipad", "scale": "2x", "size": "76x76"},
    {"filename": "icon_167x167.png", "idiom": "ipad", "scale": "2x", "size": "83.5x83.5"},
    {"filename": "icon_1024x1024.png", "idiom": "ios-marketing", "scale": "1x", "size": "1024x1024"}
  ],
  "info" : {"author": "MifosLaunchpad", "version": 1}
}
EOF
  echo "  - Generated Contents.json"

  echo "[iOS] Done!"
}

# Generate Desktop icons
generate_desktop_icons() {
  echo ""
  echo "[Desktop] Generating icons..."

  local desktop_dir="$OUTPUT_DIR/desktop"
  mkdir -p "$desktop_dir"

  # Windows ICO (multiple sizes in one file)
  echo "  Generating Windows ICO..."
  $CONVERT_CMD "$INPUT_ICON" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    \( -clone 0 -resize 48x48 \) \
    \( -clone 0 -resize 64x64 \) \
    \( -clone 0 -resize 128x128 \) \
    \( -clone 0 -resize 256x256 \) \
    -delete 0 "$desktop_dir/app.ico"
  echo "  - Generated app.ico"

  # macOS ICNS sizes (PNG format, will need to be converted to ICNS)
  local macos_sizes=(16 32 64 128 256 512 1024)
  for size in "${macos_sizes[@]}"; do
    $CONVERT_CMD "$INPUT_ICON" -resize ${size}x${size} "$desktop_dir/icon_${size}x${size}.png"
    echo "  - Generated icon_${size}x${size}.png (macOS)"
  done

  # Linux PNG sizes
  local linux_sizes=(16 24 32 48 64 128 256 512)
  mkdir -p "$desktop_dir/linux"
  for size in "${linux_sizes[@]}"; do
    local size_dir="$desktop_dir/linux/${size}x${size}"
    mkdir -p "$size_dir"
    $CONVERT_CMD "$INPUT_ICON" -resize ${size}x${size} "$size_dir/app.png"
    echo "  - Generated linux/${size}x${size}/app.png"
  done

  echo "[Desktop] Done!"
}

# Generate Web icons
generate_web_icons() {
  echo ""
  echo "[Web] Generating icons..."

  local web_dir="$OUTPUT_DIR/web"
  mkdir -p "$web_dir"

  # Favicon ICO
  $CONVERT_CMD "$INPUT_ICON" \
    \( -clone 0 -resize 16x16 \) \
    \( -clone 0 -resize 32x32 \) \
    -delete 0 "$web_dir/favicon.ico"
  echo "  - Generated favicon.ico (16x16, 32x32)"

  # Favicon PNG
  $CONVERT_CMD "$INPUT_ICON" -resize 32x32 "$web_dir/favicon-32x32.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 16x16 "$web_dir/favicon-16x16.png"
  echo "  - Generated favicon PNGs"

  # Apple touch icon
  $CONVERT_CMD "$INPUT_ICON" -resize 180x180 "$web_dir/apple-touch-icon.png"
  echo "  - Generated apple-touch-icon.png (180x180)"

  # Android Chrome icons
  $CONVERT_CMD "$INPUT_ICON" -resize 192x192 "$web_dir/android-chrome-192x192.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 512x512 "$web_dir/android-chrome-512x512.png"
  echo "  - Generated android-chrome icons (192x192, 512x512)"

  # PWA icons
  $CONVERT_CMD "$INPUT_ICON" -resize 72x72 "$web_dir/icon-72x72.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 96x96 "$web_dir/icon-96x96.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 128x128 "$web_dir/icon-128x128.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 144x144 "$web_dir/icon-144x144.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 152x152 "$web_dir/icon-152x152.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 192x192 "$web_dir/icon-192x192.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 384x384 "$web_dir/icon-384x384.png"
  $CONVERT_CMD "$INPUT_ICON" -resize 512x512 "$web_dir/icon-512x512.png"
  echo "  - Generated PWA icons"

  # Safari pinned tab (SVG mask) - create a simple version
  $CONVERT_CMD "$INPUT_ICON" -resize 512x512 "$web_dir/safari-pinned-tab.png"
  echo "  - Generated safari-pinned-tab.png"

  # Open Graph image (1200x630 with centered icon)
  $CONVERT_CMD "$INPUT_ICON" -resize 400x400 -gravity center -background white -extent 1200x630 \
    "$web_dir/og-image.png"
  echo "  - Generated og-image.png (1200x630)"

  # Generate site.webmanifest
  cat > "$web_dir/site.webmanifest" << 'EOF'
{
  "icons": [
    {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
    {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"}
  ]
}
EOF
  echo "  - Generated site.webmanifest"

  echo "[Web] Done!"
}

# Main execution
case "$PLATFORM" in
  android)
    generate_android_icons
    ;;
  ios)
    generate_ios_icons
    ;;
  desktop)
    generate_desktop_icons
    ;;
  web)
    generate_web_icons
    ;;
  all)
    generate_android_icons
    generate_ios_icons
    generate_desktop_icons
    generate_web_icons
    ;;
  *)
    echo "Error: Unknown platform: $PLATFORM"
    echo "Valid platforms: android, ios, desktop, web, all"
    exit 1
    ;;
esac

echo ""
echo "========================================"
echo "Icon generation complete!"
echo "Output: $OUTPUT_DIR"
echo "========================================"
