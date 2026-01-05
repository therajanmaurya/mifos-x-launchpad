# Step 7: Features & Security - API Reference

```typescript
interface Step7State {
  analytics: AnalyticsConfig;
  pushNotifications: PushConfig;
  security: SecurityConfig;
  socialLogin: SocialLoginConfig;
  twoFactorAuth: boolean;
}

interface AnalyticsConfig {
  firebase: boolean;
  sentry: boolean;
  mixpanel: boolean;
  customEndpoint: string | null;
}

interface SecurityConfig {
  biometric: boolean;
  pinAuth: boolean;
  rootDetection: boolean;
  screenshotPrevention: boolean;
  secureStorage: boolean;
  sessionTimeout: number; // minutes
  sslPinning: boolean;
}

interface SocialLoginConfig {
  google: boolean;
  apple: boolean;
  facebook: boolean;
}

interface Step7Actions {
  toggleFeature: (category: string, feature: string, enabled: boolean) => void;
  setSessionTimeout: (minutes: number) => void;
}
```
