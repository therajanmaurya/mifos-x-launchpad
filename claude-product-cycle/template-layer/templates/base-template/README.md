# Base Template

> Minimal KMP starter template

---

## Files Generated

```
project/
├── composeApp/
│   └── src/commonMain/kotlin/{{PACKAGE_PATH}}/
│       ├── App.kt
│       ├── theme/
│       │   ├── Theme.kt
│       │   └── Color.kt
│       └── config/
│           └── ServerConfig.kt
├── androidApp/
│   ├── src/main/
│   │   ├── AndroidManifest.xml
│   │   └── res/
│   │       ├── mipmap-*/ic_launcher.png
│   │       └── values/strings.xml
│   └── build.gradle.kts
├── iosApp/
│   ├── Assets.xcassets/AppIcon.appiconset/
│   └── Info.plist
├── build.gradle.kts
├── settings.gradle.kts
├── gradle.properties
└── README.md
```

---

## Template Variables

| Variable | Required |
|----------|:--------:|
| PACKAGE_NAME | ✓ |
| APP_NAME | ✓ |
| VERSION_NAME | ✓ |
| VERSION_CODE | ✓ |
| PRIMARY_COLOR | ✓ |
| SECONDARY_COLOR | ✓ |
| MIN_SDK | ✓ |
| TARGET_SDK | ✓ |
