# Step 8: CI/CD & Deployment - API Reference

```typescript
type CIPlatform = 'github-actions' | 'gitlab-ci' | 'bitrise' | 'codemagic';
type PlayStoreTrack = 'internal' | 'alpha' | 'beta' | 'production';

interface Step8State {
  ciPlatform: CIPlatform;
  firebase: FirebaseDistributionConfig;
  playStore: PlayStoreConfig;
  appStore: AppStoreConfig;
  releaseAutomation: ReleaseConfig;
}

interface FirebaseDistributionConfig {
  enabled: boolean;
  androidAppId: string;
  iosAppId: string;
  testerGroups: string[];
}

interface PlayStoreConfig {
  enabled: boolean;
  track: PlayStoreTrack;
  autoPromotion: boolean;
  rolloutPercentage: number;
}

interface AppStoreConfig {
  enabled: boolean;
  testFlight: boolean;
  autoSubmit: boolean;
  phasedRelease: boolean;
}

interface ReleaseConfig {
  versionBumping: boolean;
  changelogGeneration: boolean;
  githubRelease: boolean;
}

interface Step8Actions {
  setCIPlatform: (platform: CIPlatform) => void;
  updateFirebase: (config: Partial<FirebaseDistributionConfig>) => void;
  updatePlayStore: (config: Partial<PlayStoreConfig>) => void;
  updateAppStore: (config: Partial<AppStoreConfig>) => void;
}
```
