# Gradle File Generator

> Generate Gradle build files

---

## build.gradle.kts (Root)

```kotlin
plugins {
    alias(libs.plugins.kotlinMultiplatform) apply false
    alias(libs.plugins.androidApplication) apply false
    alias(libs.plugins.androidLibrary) apply false
    alias(libs.plugins.jetbrainsCompose) apply false
}
```

---

## settings.gradle.kts

```kotlin
rootProject.name = "{{PROJECT_NAME}}"

pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}

dependencyResolutionManagement {
    repositories {
        google()
        mavenCentral()
    }
}

include(":composeApp")
include(":androidApp")
```

---

## androidApp/build.gradle.kts

```kotlin
plugins {
    alias(libs.plugins.androidApplication)
    alias(libs.plugins.kotlinAndroid)
    alias(libs.plugins.jetbrainsCompose)
}

android {
    namespace = "{{PACKAGE_NAME}}"
    compileSdk = {{TARGET_SDK}}

    defaultConfig {
        applicationId = "{{APPLICATION_ID}}"
        minSdk = {{MIN_SDK}}
        targetSdk = {{TARGET_SDK}}
        versionCode = {{VERSION_CODE}}
        versionName = "{{VERSION_NAME}}"
    }

    buildTypes {
        release {
            isMinifyEnabled = {{PROGUARD_ENABLED}}
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

dependencies {
    implementation(project(":composeApp"))
}
```

---

## libs.versions.toml

```toml
[versions]
kotlin = "1.9.22"
compose = "1.6.0"
agp = "8.2.2"

[libraries]
# Core
androidx-core-ktx = { module = "androidx.core:core-ktx", version = "1.12.0" }

[plugins]
kotlinMultiplatform = { id = "org.jetbrains.kotlin.multiplatform", version.ref = "kotlin" }
androidApplication = { id = "com.android.application", version.ref = "agp" }
jetbrainsCompose = { id = "org.jetbrains.compose", version.ref = "compose" }
```
