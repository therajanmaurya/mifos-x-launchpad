# Product Map - MifosForge

> Central Navigation Hub for All Features

## Quick Links

| Resource | Path | Purpose |
|----------|------|---------|
| Master Docs | [CLAUDE_PRODUCT_CYCLE.md](./CLAUDE_PRODUCT_CYCLE.md) | Framework overview |
| Commands | [COMMANDS.md](./COMMANDS.md) | Quick command reference |
| Current Work | [CURRENT_WORK.md](./CURRENT_WORK.md) | Session tracking |
| All Status | [design-spec-layer/STATUS.md](./design-spec-layer/STATUS.md) | Feature status |

---

## Feature Registry

### Wizard Steps (10 Features)

| Step | Feature | Status | Priority | Spec |
|:----:|---------|:------:|:--------:|------|
| 1 | App Selection | 📋 Planned | P0 | [SPEC](./design-spec-layer/features/step-1-app-selection/SPEC.md) |
| 2 | Project Info | 📋 Planned | P0 | [SPEC](./design-spec-layer/features/step-2-project-info/SPEC.md) |
| 3 | Branding & Theme | 📋 Planned | P0 | [SPEC](./design-spec-layer/features/step-3-branding-theme/SPEC.md) |
| 4 | App Icons | 📋 Planned | P0 | [SPEC](./design-spec-layer/features/step-4-app-icons/SPEC.md) |
| 5 | Server Config | 📋 Planned | P0 | [SPEC](./design-spec-layer/features/step-5-server-config/SPEC.md) |
| 6 | Platform Selection | 📋 Planned | P1 | [SPEC](./design-spec-layer/features/step-6-platform-selection/SPEC.md) |
| 7 | Features & Security | 📋 Planned | P1 | [SPEC](./design-spec-layer/features/step-7-features-security/SPEC.md) |
| 8 | CI/CD & Deployment | 📋 Planned | P1 | [SPEC](./design-spec-layer/features/step-8-cicd-deployment/SPEC.md) |
| 9 | Code Quality | 📋 Planned | P2 | [SPEC](./design-spec-layer/features/step-9-code-quality/SPEC.md) |
| 10 | Review & Generate | 📋 Planned | P0 | [SPEC](./design-spec-layer/features/step-10-review-generate/SPEC.md) |

**Status Legend**: ✅ Done | 🔄 In Progress | ⚠️ Needs Update | 📋 Planned | 🆕 Not Started

---

## Layer Overview

### 1. Design Spec Layer

```
design-spec-layer/
├── STATUS.md                           # All features status
├── TOOL_CONFIG.md                      # AI tool configuration
├── _shared/
│   ├── API_REFERENCE.md                # Template API reference
│   ├── COMPONENTS.md                   # Design system
│   └── PATTERNS.md                     # Implementation patterns
├── features/
│   ├── step-1-app-selection/
│   │   ├── SPEC.md                     # Requirements
│   │   ├── MOCKUP.md                   # Visual mockups
│   │   ├── API.md                      # Interfaces
│   │   ├── STATUS.md                   # Status
│   │   └── mockups/                    # AI prompts
│   └── ... (10 steps total)
└── mockup-tools/                       # Figma plugin & scripts
```

### 2. Component Layer

```
component-layer/
├── LAYER_GUIDE.md                      # Component guide
├── LAYER_STATUS.md                     # Component status
└── components/
    ├── wizard/                         # Wizard components
    ├── forms/                          # Form components
    ├── preview/                        # Preview components
    └── shared/                         # Shared components
```

### 3. Core Layer

```
core-layer/
├── COMPONENTS.md                       # Component registry
├── GENERATORS.md                       # Generator utilities
└── UTILS.md                            # Shared utilities
```

### 4. Feature Layer

```
feature-layer/
├── LAYER_GUIDE.md                      # Feature guide
├── LAYER_STATUS.md                     # Feature status
└── instructions/
    ├── REACT_COMPONENT.md              # React patterns
    ├── ZUSTAND_STORE.md                # State patterns
    ├── FORM_VALIDATION.md              # Form patterns
    ├── PREVIEW_COMPONENT.md            # Preview patterns
    └── STEP_NAVIGATION.md              # Navigation patterns
```

### 5. Template Layer

```
template-layer/
├── LAYER_GUIDE.md                      # Template guide
├── LAYER_STATUS.md                     # Template status
├── templates/
│   ├── mobile-wallet/                  # Mobile Wallet templates
│   ├── mifos-mobile/                   # Mifos Mobile templates
│   ├── android-client/                 # Android Client templates
│   └── base-template/                  # Base KMP template
└── generators/
    ├── android/                        # Android generators
    ├── ios/                            # iOS generators
    ├── cicd/                           # CI/CD generators
    └── icons/                          # Icon generators
```

### 6. Server Layer

```
server-layer/
├── TEMPLATE_API.md                     # Template engine docs
└── GENERATOR_API.md                    # Generator API docs
```

### 7. Gap Templates

```
templates/
├── gap-analysis/                       # Analysis templates
│   ├── dashboard.md
│   ├── layer-*.md
│   └── subsection/
└── gap-planning/                       # Planning templates
    ├── dashboard.md
    ├── layer-*.md
    └── subsection/
```

---

## Commands Layer

| Command | File | Purpose |
|---------|------|---------|
| `/design` | [design.md](./commands-layer/design.md) | Create feature specs |
| `/implement` | [implement.md](./commands-layer/implement.md) | Implement features |
| `/component` | [component.md](./commands-layer/component.md) | Create components |
| `/template` | [template.md](./commands-layer/template.md) | Create templates |
| `/verify` | [verify.md](./commands-layer/verify.md) | Validate implementation |
| `/mockup` | [mockup.md](./commands-layer/mockup.md) | Generate mockups |
| `/projectstatus` | [projectstatus.md](./commands-layer/projectstatus.md) | Show status |

---

## Implementation Priority

### P0 - MVP (Core Wizard)

1. Step 1: App Selection
2. Step 2: Project Info
3. Step 3: Branding & Theme
4. Step 4: App Icons
5. Step 5: Server Config
6. Step 10: Review & Generate

### P1 - Extended Features

7. Step 6: Platform Selection
8. Step 7: Features & Security
9. Step 8: CI/CD & Deployment

### P2 - Polish

10. Step 9: Code Quality

---

## Source Code Map

```
src/
├── app/
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Landing page
│   ├── globals.css                     # Global styles
│   └── wizard/
│       └── [[...step]]/
│           └── page.tsx                # Wizard step page
├── components/
│   ├── ui/                             # shadcn/ui components
│   ├── wizard/
│   │   ├── wizard-layout.tsx           # Wizard wrapper
│   │   ├── step-indicator.tsx          # Progress
│   │   ├── step-navigation.tsx         # Nav buttons
│   │   └── steps/                      # Step components
│   ├── preview/                        # Preview components
│   └── shared/                         # Shared components
├── lib/
│   ├── generators/                     # Project generators
│   ├── templates/                      # Template strings
│   └── utils/                          # Utilities
├── store/
│   └── wizard-store.ts                 # Zustand store
└── types/
    ├── wizard.ts                       # Wizard types
    ├── config.ts                       # Config types
    └── generator.ts                    # Generator types
```

---

## Quick Start

### View Project Status
```
/projectstatus
```

### Design a Feature
```
/design step-1-app-selection
```

### Implement a Feature
```
/implement step-1-app-selection
```

### Check Gaps
```
/gap-analysis
/gap-analysis design
```

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-05 | Initial PRODUCT_MAP.md created |
