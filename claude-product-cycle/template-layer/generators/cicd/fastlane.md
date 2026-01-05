# Fastlane Generator

> Generate Fastlane configuration

---

## Fastfile

```ruby
# fastlane/Fastfile

default_platform(:android)

platform :android do
  desc "Build debug APK"
  lane :build_debug do
    gradle(task: "assembleDebug")
  end

  desc "Build release APK"
  lane :build_release do
    gradle(
      task: "assembleRelease",
      properties: {
        "android.injected.signing.store.file" => ENV["KEYSTORE_PATH"],
        "android.injected.signing.store.password" => ENV["KEYSTORE_PASSWORD"],
        "android.injected.signing.key.alias" => ENV["KEY_ALIAS"],
        "android.injected.signing.key.password" => ENV["KEY_PASSWORD"],
      }
    )
  end

  desc "Deploy to Firebase App Distribution"
  lane :firebase do
    build_release
    firebase_app_distribution(
      app: "{{FIREBASE_APP_ID}}",
      groups: "{{TESTER_GROUPS}}",
      release_notes: changelog_from_git_commits
    )
  end

  desc "Deploy to Play Store"
  lane :playstore do
    gradle(task: "bundleRelease")
    upload_to_play_store(
      track: "{{PLAY_STORE_TRACK}}",
      aab: "app/build/outputs/bundle/release/app-release.aab"
    )
  end
end

platform :ios do
  desc "Build for TestFlight"
  lane :beta do
    build_app(scheme: "{{APP_NAME}}")
    upload_to_testflight
  end

  desc "Deploy to App Store"
  lane :release do
    build_app(scheme: "{{APP_NAME}}")
    upload_to_app_store
  end
end
```

---

## Appfile

```ruby
# fastlane/Appfile

# Android
json_key_file(ENV["GOOGLE_PLAY_JSON_KEY"])
package_name("{{PACKAGE_NAME}}")

# iOS
app_identifier("{{BUNDLE_ID}}")
apple_id("{{APPLE_ID}}")
team_id("{{TEAM_ID}}")
```

---

## Matchfile

```ruby
# fastlane/Matchfile

git_url("{{CERTIFICATES_REPO}}")
storage_mode("git")
type("appstore")
app_identifier("{{BUNDLE_ID}}")
```
