# CI/CD Template Planning

> Planning template for CI/CD workflow templates

---

## Template Overview

| Category | Total | Complete | Remaining | Priority |
|----------|-------|----------|-----------|----------|
| GitHub Actions | 6 | {{COMPLETE}} | {{REMAINING}} | P0 |
| GitLab CI | 1 | {{COMPLETE}} | {{REMAINING}} | P2 |
| Fastlane | 3 | {{COMPLETE}} | {{REMAINING}} | P1 |

---

## GitHub Actions Plan

### build.yml

**Purpose**: Build and test on every push/PR

**Triggers**:
- Push to main, develop
- Pull requests to main

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create workflow | 1h | {{STATUS}} | {{NOTES}} |
| JDK setup | 0.5h | {{STATUS}} | {{NOTES}} |
| Gradle caching | 1h | {{STATUS}} | {{NOTES}} |
| Build step | 0.5h | {{STATUS}} | {{NOTES}} |
| Test step | 0.5h | {{STATUS}} | {{NOTES}} |
| Artifact upload | 0.5h | {{STATUS}} | {{NOTES}} |
| Test workflow | 1h | {{STATUS}} | {{NOTES}} |

**Variables**:
```yaml
env:
  JAVA_VERSION: '{{JDK_VERSION}}'
  GRADLE_VERSION: '{{GRADLE_VERSION}}'
```

### firebase-distribution.yml

**Purpose**: Deploy to Firebase App Distribution

**Triggers**:
- Push to develop
- Manual dispatch

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create workflow | 1h | {{STATUS}} | {{NOTES}} |
| Build APK | 0.5h | {{STATUS}} | {{NOTES}} |
| Firebase action setup | 1h | {{STATUS}} | {{NOTES}} |
| Secrets config | 0.5h | {{STATUS}} | {{NOTES}} |
| Tester groups | 0.5h | {{STATUS}} | {{NOTES}} |
| Release notes | 1h | {{STATUS}} | {{NOTES}} |
| Test deployment | 1h | {{STATUS}} | {{NOTES}} |

**Variables**:
```yaml
env:
  FIREBASE_APP_ID: '{{FIREBASE_APP_ID}}'
secrets:
  FIREBASE_CREDENTIALS: ${{ secrets.FIREBASE_CREDENTIALS }}
```

### play-store.yml

**Purpose**: Deploy to Google Play Store

**Triggers**:
- Tag push (v*)
- Manual dispatch

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create workflow | 1h | {{STATUS}} | {{NOTES}} |
| Signing setup | 2h | {{STATUS}} | {{NOTES}} |
| Build AAB | 1h | {{STATUS}} | {{NOTES}} |
| Upload action | 1h | {{STATUS}} | {{NOTES}} |
| Track selection | 0.5h | {{STATUS}} | {{NOTES}} |
| Test with internal track | 1h | {{STATUS}} | {{NOTES}} |

**Variables**:
```yaml
env:
  PACKAGE_NAME: '{{PACKAGE_NAME}}'
  PLAY_STORE_TRACK: '{{PLAY_STORE_TRACK}}'
secrets:
  KEYSTORE_BASE64: ${{ secrets.KEYSTORE_BASE64 }}
  KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
  KEY_ALIAS: ${{ secrets.KEY_ALIAS }}
  KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
  SERVICE_ACCOUNT_JSON: ${{ secrets.SERVICE_ACCOUNT_JSON }}
```

### app-store.yml

**Purpose**: Deploy to App Store / TestFlight

**Triggers**:
- Tag push (v*)
- Manual dispatch

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create workflow | 1h | {{STATUS}} | {{NOTES}} |
| Xcode setup | 1h | {{STATUS}} | {{NOTES}} |
| Certificates (match) | 2h | {{STATUS}} | {{NOTES}} |
| Build archive | 1h | {{STATUS}} | {{NOTES}} |
| TestFlight upload | 1h | {{STATUS}} | {{NOTES}} |
| App Store upload | 1h | {{STATUS}} | {{NOTES}} |
| Test deployment | 1h | {{STATUS}} | {{NOTES}} |

**Variables**:
```yaml
env:
  SCHEME: '{{APP_SCHEME}}'
  BUNDLE_ID: '{{BUNDLE_ID}}'
secrets:
  MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
  MATCH_GIT_BASIC_AUTH: ${{ secrets.MATCH_GIT_BASIC_AUTH }}
  APP_STORE_CONNECT_API_KEY: ${{ secrets.APP_STORE_CONNECT_API_KEY }}
```

---

## Fastlane Plan

### Fastfile

**Android Lanes**:
| Lane | Purpose | Status |
|------|---------|--------|
| build_debug | Build debug APK | {{STATUS}} |
| build_release | Build signed release | {{STATUS}} |
| firebase | Deploy to Firebase | {{STATUS}} |
| playstore | Deploy to Play Store | {{STATUS}} |
| increment_version | Bump version | {{STATUS}} |

**iOS Lanes**:
| Lane | Purpose | Status |
|------|---------|--------|
| build | Build for testing | {{STATUS}} |
| beta | Deploy to TestFlight | {{STATUS}} |
| release | Deploy to App Store | {{STATUS}} |
| match_dev | Sync dev certs | {{STATUS}} |
| match_prod | Sync prod certs | {{STATUS}} |

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create Fastfile | 2h | {{STATUS}} | {{NOTES}} |
| Android lanes | 3h | {{STATUS}} | {{NOTES}} |
| iOS lanes | 3h | {{STATUS}} | {{NOTES}} |
| Environment handling | 1h | {{STATUS}} | {{NOTES}} |
| Test locally | 2h | {{STATUS}} | {{NOTES}} |

### Appfile

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 0.5h | {{STATUS}} | {{NOTES}} |
| Android config | 0.5h | {{STATUS}} | {{NOTES}} |
| iOS config | 0.5h | {{STATUS}} | {{NOTES}} |

### Matchfile

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 0.5h | {{STATUS}} | {{NOTES}} |
| Git URL config | 0.5h | {{STATUS}} | {{NOTES}} |
| Type config | 0.5h | {{STATUS}} | {{NOTES}} |

---

## Secrets Documentation

### Required Secrets

| Secret | Platform | Description | How to Generate |
|--------|----------|-------------|-----------------|
| KEYSTORE_BASE64 | Android | Base64 keystore | `base64 keystore.jks` |
| KEYSTORE_PASSWORD | Android | Keystore password | Create during keytool |
| KEY_ALIAS | Android | Key alias | Create during keytool |
| KEY_PASSWORD | Android | Key password | Create during keytool |
| SERVICE_ACCOUNT_JSON | Android | Play Console SA | GCP Console |
| FIREBASE_CREDENTIALS | Android | Firebase SA | Firebase Console |
| MATCH_PASSWORD | iOS | Match encryption | Generate random |
| MATCH_GIT_BASIC_AUTH | iOS | Git credentials | GitHub PAT |
| APP_STORE_CONNECT_API_KEY | iOS | ASC API key | App Store Connect |

---

## Security Checklist

- [ ] No secrets in workflow files
- [ ] All secrets use ${{ secrets.NAME }}
- [ ] Actions pinned to specific versions
- [ ] Minimal permissions scope
- [ ] No write access to repos
- [ ] Secrets rotation documented

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | build.yml | PR/push workflows |
| 2 | Firebase + Play Store | Android deployment |
| 3 | App Store | iOS deployment |
| 4 | Fastlane | Local automation |
| 5 | Testing | End-to-end validation |

---

*Last Updated: {{TIMESTAMP}}*
