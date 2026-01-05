# Android Template Planning

> Planning template for Android code generation templates

---

## Template Overview

| Category | Total | Complete | Remaining | Priority |
|----------|-------|----------|-----------|----------|
| Gradle Files | 6 | {{COMPLETE}} | {{REMAINING}} | P0 |
| Manifest Files | 1 | {{COMPLETE}} | {{REMAINING}} | P0 |
| Resource Files | 4 | {{COMPLETE}} | {{REMAINING}} | P1 |
| Kotlin Source | 5 | {{COMPLETE}} | {{REMAINING}} | P0 |
| Icon Generation | 6 | {{COMPLETE}} | {{REMAINING}} | P0 |

---

## Gradle Templates Plan

### build.gradle.kts (Root)

**Variables**:
- `{{KOTLIN_VERSION}}`
- `{{COMPOSE_VERSION}}`
- `{{AGP_VERSION}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Add plugin blocks | 1h | {{STATUS}} | {{NOTES}} |
| Variable substitution | 1h | {{STATUS}} | {{NOTES}} |
| Test compilation | 1h | {{STATUS}} | {{NOTES}} |

### settings.gradle.kts

**Variables**:
- `{{PROJECT_NAME}}`
- `{{MODULES}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 0.5h | {{STATUS}} | {{NOTES}} |
| Plugin management | 0.5h | {{STATUS}} | {{NOTES}} |
| Repository config | 0.5h | {{STATUS}} | {{NOTES}} |
| Test build | 0.5h | {{STATUS}} | {{NOTES}} |

### androidApp/build.gradle.kts

**Variables**:
- `{{PACKAGE_NAME}}`
- `{{APPLICATION_ID}}`
- `{{MIN_SDK}}`
- `{{TARGET_SDK}}`
- `{{VERSION_NAME}}`
- `{{VERSION_CODE}}`
- `{{PROGUARD_ENABLED}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 2h | {{STATUS}} | {{NOTES}} |
| Android config | 1h | {{STATUS}} | {{NOTES}} |
| Build types | 1h | {{STATUS}} | {{NOTES}} |
| Dependencies | 1h | {{STATUS}} | {{NOTES}} |
| Signing config | 1h | {{STATUS}} | {{NOTES}} |
| Test build | 1h | {{STATUS}} | {{NOTES}} |

### libs.versions.toml

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Version definitions | 1h | {{STATUS}} | {{NOTES}} |
| Library definitions | 1h | {{STATUS}} | {{NOTES}} |
| Plugin definitions | 0.5h | {{STATUS}} | {{NOTES}} |

---

## Source File Templates Plan

### Theme.kt

**Variables**:
- `{{PACKAGE_NAME}}`
- `{{PRIMARY_COLOR}}`
- `{{SECONDARY_COLOR}}`
- `{{DARK_MODE_ENABLED}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Light theme | 1h | {{STATUS}} | {{NOTES}} |
| Dark theme | 1h | {{STATUS}} | {{NOTES}} |
| Color scheme | 1h | {{STATUS}} | {{NOTES}} |
| Typography | 0.5h | {{STATUS}} | {{NOTES}} |
| Test compilation | 0.5h | {{STATUS}} | {{NOTES}} |

### Color.kt

**Variables**:
- `{{PACKAGE_NAME}}`
- `{{PRIMARY_COLOR}}`
- `{{SECONDARY_COLOR}}`
- `{{ACCENT_COLOR}}`
- `{{BACKGROUND_COLOR}}`
- `{{SURFACE_COLOR}}`
- `{{ERROR_COLOR}}`
- `{{ON_PRIMARY}}`
- `{{ON_SECONDARY}}`
- `{{ON_BACKGROUND}}`
- `{{ON_SURFACE}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Light colors | 1h | {{STATUS}} | {{NOTES}} |
| Dark colors | 1h | {{STATUS}} | {{NOTES}} |
| Hex to Compose Color | 1h | {{STATUS}} | {{NOTES}} |

### ServerConfig.kt

**Variables**:
- `{{PACKAGE_NAME}}`
- `{{ENVIRONMENTS}}`
- `{{CONNECTION_TIMEOUT}}`
- `{{READ_TIMEOUT}}`

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Create template | 1h | {{STATUS}} | {{NOTES}} |
| Environment enum | 1h | {{STATUS}} | {{NOTES}} |
| Config class | 1h | {{STATUS}} | {{NOTES}} |
| Default values | 0.5h | {{STATUS}} | {{NOTES}} |

---

## Icon Generation Plan

### Canvas Processing

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Set up canvas | 1h | {{STATUS}} | {{NOTES}} |
| Resize algorithm | 2h | {{STATUS}} | {{NOTES}} |
| Shape masking | 2h | {{STATUS}} | {{NOTES}} |
| Quality optimization | 1h | {{STATUS}} | {{NOTES}} |

### Output Generation

| Density | Size | Task | Status |
|---------|------|------|--------|
| mdpi | 48×48 | Generate + validate | {{STATUS}} |
| hdpi | 72×72 | Generate + validate | {{STATUS}} |
| xhdpi | 96×96 | Generate + validate | {{STATUS}} |
| xxhdpi | 144×144 | Generate + validate | {{STATUS}} |
| xxxhdpi | 192×192 | Generate + validate | {{STATUS}} |

### Adaptive Icon

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Foreground layer | 2h | {{STATUS}} | {{NOTES}} |
| Background layer | 1h | {{STATUS}} | {{NOTES}} |
| ic_launcher.xml | 1h | {{STATUS}} | {{NOTES}} |
| ic_launcher_round.xml | 1h | {{STATUS}} | {{NOTES}} |

---

## Variable Processing

### Template Engine Tasks

| Task | Effort | Status | Notes |
|------|--------|--------|-------|
| Variable parser | 2h | {{STATUS}} | {{NOTES}} |
| Nested variables | 1h | {{STATUS}} | {{NOTES}} |
| Conditional blocks | 2h | {{STATUS}} | {{NOTES}} |
| Loop support | 2h | {{STATUS}} | {{NOTES}} |
| Error handling | 1h | {{STATUS}} | {{NOTES}} |

### Validation

| Check | Implementation | Status |
|-------|----------------|--------|
| All vars replaced | Regex scan | {{STATUS}} |
| Syntax valid | Kotlin compiler | {{STATUS}} |
| Build passes | Gradle build | {{STATUS}} |

---

## Timeline

| Week | Focus | Deliverables |
|------|-------|--------------|
| 1 | Gradle templates | build.gradle.kts files |
| 2 | Source templates | Theme.kt, Color.kt, ServerConfig.kt |
| 3 | Icon generation | All densities + adaptive |
| 4 | Testing | Build validation, CI integration |

---

*Last Updated: {{TIMESTAMP}}*
