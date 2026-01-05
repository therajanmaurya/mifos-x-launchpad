# GitHub Actions Generator

> Generate GitHub Actions workflows

---

## Build Workflow

```yaml
# .github/workflows/build.yml
name: Build

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: Build
        run: ./gradlew build

      - name: Run tests
        run: ./gradlew test
```

---

## Firebase Distribution

```yaml
# .github/workflows/firebase-distribution.yml
name: Firebase Distribution

on:
  push:
    branches: [develop]

jobs:
  distribute:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Build APK
        run: ./gradlew assembleRelease

      - name: Upload to Firebase
        uses: wzieba/Firebase-Distribution-Github-Action@v1
        with:
          appId: ${{ secrets.FIREBASE_APP_ID }}
          serviceCredentialsFileContent: ${{ secrets.FIREBASE_CREDENTIALS }}
          groups: {{TESTER_GROUPS}}
          file: app/build/outputs/apk/release/app-release.apk
```

---

## Play Store Deployment

```yaml
# .github/workflows/play-store.yml
name: Play Store

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Build AAB
        run: ./gradlew bundleRelease

      - name: Upload to Play Store
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.SERVICE_ACCOUNT_JSON }}
          packageName: {{PACKAGE_NAME}}
          releaseFiles: app/build/outputs/bundle/release/app-release.aab
          track: {{PLAY_STORE_TRACK}}
```
