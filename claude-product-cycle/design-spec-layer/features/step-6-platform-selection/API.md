# Step 6: Platform Selection - API Reference

```typescript
interface PlatformConfig {
  android: AndroidConfig;
  ios: IOSConfig;
  desktop: DesktopConfig;
  web: WebConfig;
}

interface AndroidConfig {
  enabled: boolean;
  proguard: boolean;
  appBundle: boolean;
  abiSplits: ('arm64-v8a' | 'armeabi-v7a' | 'x86_64')[];
}

interface IOSConfig {
  enabled: boolean;
  teamId: string;
  supportedDevices: ('iphone' | 'ipad')[];
  deploymentTarget: string;
}

interface DesktopConfig {
  enabled: boolean;
  windows: boolean;
  macos: boolean;
  linux: boolean;
}

interface WebConfig {
  enabled: boolean;
  pwa: boolean;
  serviceWorkerStrategy: 'stale-while-revalidate' | 'network-first' | 'cache-first';
}

interface Step6Actions {
  togglePlatform: (platform: keyof PlatformConfig, enabled: boolean) => void;
  updatePlatformConfig: <K extends keyof PlatformConfig>(
    platform: K,
    config: Partial<PlatformConfig[K]>
  ) => void;
}
```
