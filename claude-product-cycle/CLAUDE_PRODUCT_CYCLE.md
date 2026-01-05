# Claude Product Cycle - MifosForge

> AI-Powered Development Framework for MifosForge Project Wizard

## Overview

The Claude Product Cycle is a structured approach to AI-assisted software development. It provides a layered documentation system that enables Claude to understand, navigate, and implement features consistently across the MifosForge project.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    CLAUDE PRODUCT CYCLE                                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  1. DESIGN SPEC LAYER                                             │  │
│  │     SPEC.md → MOCKUP.md → API.md → STATUS.md                     │  │
│  │     What to build, how it looks, what APIs needed                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ↓                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  2. COMPONENT LAYER                                               │  │
│  │     React components, shadcn/ui, shared utilities                │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ↓                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  3. CORE LAYER                                                    │  │
│  │     Generators, template engine, icon processor                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ↓                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  4. FEATURE LAYER                                                 │  │
│  │     Wizard steps, state management, form validation              │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ↓                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  5. TEMPLATE LAYER                                                │  │
│  │     KMP project templates, CI/CD workflows, generated files      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                              ↓                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  6. SERVER LAYER                                                  │  │
│  │     Template API, generator API, ZIP creation                    │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

## Layer Structure

### 1. Design Spec Layer (`design-spec-layer/`)

Contains feature specifications for all 10 wizard steps:

| Document | Purpose |
|----------|---------|
| `SPEC.md` | Requirements, user stories, acceptance criteria |
| `MOCKUP.md` | Visual mockups in ASCII art |
| `API.md` | TypeScript interfaces, state definitions |
| `STATUS.md` | Implementation status tracking |

### 2. Component Layer (`component-layer/`)

React component documentation and patterns:
- UI component registry
- shadcn/ui customizations
- Shared component patterns

### 3. Core Layer (`core-layer/`)

Shared utilities and generators:
- Design system components registry
- Generator utilities
- Common utilities

### 4. Feature Layer (`feature-layer/`)

Wizard step implementation patterns:
- React component patterns
- Zustand store patterns
- Form validation patterns
- Step navigation patterns

### 5. Template Layer (`template-layer/`)

KMP project generation templates:
- Mobile Wallet templates
- Mifos Mobile templates
- Android Client templates
- Base KMP templates
- CI/CD workflow templates

### 6. Server Layer (`server-layer/`)

API and generation documentation:
- Template engine API
- Generator API reference

## Commands Reference

| Command | Purpose | Usage |
|---------|---------|-------|
| `/projectstatus` | Show project overview | Get current state |
| `/design [step]` | Create/update spec | Design a wizard step |
| `/implement [step]` | Implement feature | Build a wizard step |
| `/component [name]` | Create component | Build UI component |
| `/template [type]` | Create template | Add generation template |
| `/verify [step]` | Validate implementation | Check completeness |
| `/mockup [step]` | Generate mockups | Create design prompts |
| `/gap-analysis` | Show gaps | Find missing pieces |

## Workflow

### New Feature Development

```
1. /design [step]           → Creates SPEC.md, MOCKUP.md, API.md
2. /mockup [step]           → Generates AI prompts for visual design
3. /implement [step]        → Builds React components
4. /verify [step]           → Validates implementation
5. Update STATUS.md         → Track progress
```

### Bug Fix / Update

```
1. Read STATUS.md           → Understand current state
2. Read SPEC.md             → Understand requirements
3. Make changes             → Fix/update code
4. Update STATUS.md         → Track changes
```

## Key Files

| File | Purpose | Location |
|------|---------|----------|
| `PRODUCT_MAP.md` | Feature registry & navigation | Root |
| `COMMANDS.md` | Quick command reference | Root |
| `CURRENT_WORK.md` | Session tracking | Root |
| `STATUS.md` | All features status | design-spec-layer/ |

## Best Practices

1. **Always read before writing** - Check existing specs before implementing
2. **Update status immediately** - Keep STATUS.md current after changes
3. **Follow patterns** - Use established patterns from instructions/
4. **Use components** - Check core-layer/COMPONENTS.md before creating new
5. **Test incrementally** - Verify each step before proceeding

## Project Structure

```
MifosLaunchpad/
├── claude-product-cycle/           # This documentation
├── src/
│   ├── app/                        # Next.js app
│   ├── components/                 # React components
│   ├── lib/                        # Utilities & generators
│   ├── store/                      # Zustand store
│   └── types/                      # TypeScript types
├── public/                         # Static assets
├── package.json
└── README.md
```

## Getting Help

- Read `PRODUCT_MAP.md` for feature overview
- Read `COMMANDS.md` for quick command reference
- Check `design-spec-layer/features/[step]/SPEC.md` for requirements
- Check `feature-layer/instructions/` for implementation patterns
