# iOS Template Planning

> Planning template for iOS code generation templates

---

## Template Overview

| Category | Total | Complete | Remaining | Priority |
|----------|-------|----------|-----------|----------|
| Project Files | 4 | {{COMPLETE}} | {{REMAINING}} | P0 |
| Swift Source | 5 | {{COMPLETE}} | {{REMAINING}} | P0 |
| Asset Catalog | 3 | {{COMPLETE}} | {{REMAINING}} | P0 |
| Icon Generation | 12 | {{COMPLETE}} | {{REMAINING}} | P0 |

---

## Project File Templates Plan

### Info.plist

**Variables**:
- `{{APP_NAME}}`
- `{{BUNDLE_ID}}`
- `{{VERSION}}`
- `{{BUILD_NUMBER}}`
- `{{MIN_IOS_VERSION}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Required keys | 1h | {{STATUS}} | {{NOTES}} |
| App transport security | 0.5h | {{STATUS}} | {{NOTES}} |
| URL schemes | 0.5h | {{STATUS}} | {{NOTES}} |
| Permissions | 1h | {{STATUS}} | {{NOTES}} |
| Test Xcode open | 0.5h | {{STATUS}} | {{NOTES}} |

### project.pbxproj

**Variables**:
- `{{PROJECT_NAME}}`
- `{{BUNDLE_ID}}`
- `{{TEAM_ID}}`
- `{{TARGET_NAME}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 3h | {{STATUS}} | Complex format |
| Build settings | 2h | {{STATUS}} | {{NOTES}} |
| File references | 2h | {{STATUS}} | {{NOTES}} |
| Build phases | 1h | {{STATUS}} | {{NOTES}} |
| Target config | 1h | {{STATUS}} | {{NOTES}} |
| Test Xcode build | 1h | {{STATUS}} | {{NOTES}} |

### Podfile (if using CocoaPods)

**Variables**:
- `{{PROJECT_NAME}}`
- `{{MIN_IOS_VERSION}}`
- `{{PODS}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 0.5h | {{STATUS}} | {{NOTES}} |
| Platform config | 0.5h | {{STATUS}} | {{NOTES}} |
| Pod list | 1h | {{STATUS}} | {{NOTES}} |
| Post-install hooks | 0.5h | {{STATUS}} | {{NOTES}} |

### Package.swift (if using SPM)

**Variables**:
- `{{PACKAGE_NAME}}`
- `{{MIN_IOS_VERSION}}`
- `{{DEPENDENCIES}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 0.5h | {{STATUS}} | {{NOTES}} |
| Platform config | 0.5h | {{STATUS}} | {{NOTES}} |
| Dependencies | 1h | {{STATUS}} | {{NOTES}} |
| Target config | 0.5h | {{STATUS}} | {{NOTES}} |

---

## Swift Source Templates Plan

### Theme.swift

**Variables**:
- `{{PRIMARY_COLOR_RGB}}`
- `{{SECONDARY_COLOR_RGB}}`
- `{{ACCENT_COLOR_RGB}}`
- `{{DARK_MODE_ENABLED}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Color definitions | 1h | {{STATUS}} | {{NOTES}} |
| Typography | 1h | {{STATUS}} | {{NOTES}} |
| Dark mode support | 1h | {{STATUS}} | {{NOTES}} |
| SwiftUI integration | 1h | {{STATUS}} | {{NOTES}} |

### ServerConfig.swift

**Variables**:
- `{{ENVIRONMENTS}}`
- `{{CONNECTION_TIMEOUT}}`
- `{{DEFAULT_ENVIRONMENT}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Environment enum | 1h | {{STATUS}} | {{NOTES}} |
| URL construction | 1h | {{STATUS}} | {{NOTES}} |
| Configuration struct | 0.5h | {{STATUS}} | {{NOTES}} |

### AppDelegate.swift

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Application lifecycle | 0.5h | {{STATUS}} | {{NOTES}} |
| Push notification setup | 1h | {{STATUS}} | {{NOTES}} |
| Analytics init | 0.5h | {{STATUS}} | {{NOTES}} |

---

## Icon Generation Plan

### Size Matrix

| Size | Scale | Pixels | Idiom | Status |
|------|-------|--------|-------|--------|
| 20pt | 2x | 40 | iphone | {{STATUS}} |
| 20pt | 3x | 60 | iphone | {{STATUS}} |
| 29pt | 2x | 58 | iphone | {{STATUS}} |
| 29pt | 3x | 87 | iphone | {{STATUS}} |
| 40pt | 2x | 80 | iphone | {{STATUS}} |
| 40pt | 3x | 120 | iphone | {{STATUS}} |
| 60pt | 2x | 120 | iphone | {{STATUS}} |
| 60pt | 3x | 180 | iphone | {{STATUS}} |
| 76pt | 1x | 76 | ipad | {{STATUS}} |
| 76pt | 2x | 152 | ipad | {{STATUS}} |
| 83.5pt | 2x | 167 | ipad | {{STATUS}} |
| 1024pt | 1x | 1024 | ios-marketing | {{STATUS}} |

### Canvas Processing Tasks

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Size calculation | 1h | {{STATUS}} | {{NOTES}} |
| PNG generation | 2h | {{STATUS}} | {{NOTES}} |
| Quality optimization | 1h | {{STATUS}} | {{NOTES}} |
| Batch processing | 1h | {{STATUS}} | {{NOTES}} |

### Contents.json Generation

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| JSON structure | 1h | {{STATUS}} | {{NOTES}} |
| Image entries | 1h | {{STATUS}} | {{NOTES}} |
| Idiom mapping | 0.5h | {{STATUS}} | {{NOTES}} |
| Validation | 0.5h | {{STATUS}} | {{NOTES}} |

---

## Asset Catalog Structure

```
Assets.xcassets/
├── AppIcon.appiconset/
│   ├── Contents.json
│   ├── icon-20@2x.png
│   ├── icon-20@3x.png
│   ├── icon-29@2x.png
│   ├── icon-29@3x.png
│   ├── icon-40@2x.png
│   ├── icon-40@3x.png
│   ├── icon-60@2x.png
│   ├── icon-60@3x.png
│   ├── icon-76.png
│   ├── icon-76@2x.png
│   ├── icon-83.5@2x.png
│   └── icon-1024.png
├── AccentColor.colorset/
│   └── Contents.json
└── Contents.json
```

---

## Validation Plan

| Check | Method | Automated |
|-------|--------|-----------|
| Xcode opens project | Manual | No |
| Swift compiles | xcodebuild | Yes |
| Asset catalog valid | xcassets validation | Yes |
| Info.plist valid | plutil | Yes |
| Archive builds | xcodebuild archive | Yes |

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Info.plist + Swift templates | Basic files |
| 2 | Icon generation | All sizes + Contents.json |
| 3 | project.pbxproj | Xcode project support |
| 4 | Testing | Build validation |

---

*Last Updated: {{TIMESTAMP}}*
