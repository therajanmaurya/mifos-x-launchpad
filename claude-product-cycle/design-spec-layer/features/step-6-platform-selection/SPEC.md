# Step 6: Platform Selection - Specification

> Select target platforms and configure platform-specific settings

**Feature ID**: `step-6-platform-selection`
**Priority**: P1
**Status**: 📋 Planned

---

## Overview

Step 6 allows users to select which platforms to target (Android, iOS, Desktop, Web) and configure platform-specific settings.

---

## Functional Requirements

### FR-1: Platform Selection

| Platform | Options |
|----------|---------|
| Android | Enabled, ProGuard, App Bundle, ABI splits |
| iOS | Enabled, Team ID, Supported devices |
| Desktop | Windows, macOS, Linux |
| Web | PWA, Service worker strategy |

### FR-2: Android Settings
- Enable ProGuard/R8
- Generate App Bundle (.aab)
- ABI splits (arm64, armeabi-v7a, x86_64)
- Target SDK validation

### FR-3: iOS Settings
- Apple Team ID
- Supported devices (iPhone, iPad)
- Deployment target
- Code signing mode

### FR-4: Desktop Settings
- Windows (x64)
- macOS (arm64, x64)
- Linux (x64)

### FR-5: Web Settings
- Enable PWA
- Service worker strategy (stale-while-revalidate, network-first)
- App manifest configuration

---

## State Management

```typescript
interface Step6State {
  platforms: {
    android: {
      enabled: boolean;
      proguard: boolean;
      appBundle: boolean;
      abiSplits: string[];
    };
    ios: {
      enabled: boolean;
      teamId: string;
      supportedDevices: string[];
    };
    desktop: {
      enabled: boolean;
      windows: boolean;
      macos: boolean;
      linux: boolean;
    };
    web: {
      enabled: boolean;
      pwa: boolean;
      serviceWorkerStrategy: string;
    };
  };
}
```

---

## Related Files

- [MOCKUP.md](./MOCKUP.md)
- [API.md](./API.md)
