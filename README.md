# MifosForge - Mifos KMP Project Wizard

> Generate white-labeled Mifos Kotlin Multiplatform mobile banking applications with complete CI/CD pipelines

## Overview

MifosForge is a web-based project generator wizard that allows financial institutions and organizations to create customized, white-labeled Mifos mobile banking applications. The wizard generates production-ready projects with complete CI/CD pipelines for deploying to Firebase App Distribution, Google Play Store, and Apple App Store.

## Features

- **Multiple Base Apps**: Choose from Mobile Wallet, Mifos Mobile, or Android Client
- **Custom Branding**: Configure colors, themes, icons, and splash screens
- **Server Configuration**: Set up multiple environments (Production, Staging, Demo)
- **Platform Selection**: Target Android, iOS, Desktop, and Web platforms
- **Security Features**: Biometric auth, PIN, root detection, SSL pinning
- **CI/CD Pipelines**: Pre-configured GitHub Actions, GitLab CI, Bitrise, Codemagic
- **Code Quality**: Detekt, Ktlint, unit tests, UI tests

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/openMF/mifosforge.git
cd mifosforge

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the wizard.

### Building for Production

```bash
npm run build
npm start
```

## Wizard Steps

1. **App Selection** - Choose your base Mifos application
2. **Project Info** - Configure organization and project metadata
3. **Branding & Theme** - Set up colors, theme, dark mode
4. **App Icons** - Upload and configure app icons
5. **Server Config** - Set up API endpoints and environments
6. **Platform Selection** - Choose target platforms
7. **Features & Security** - Enable analytics and security features
8. **CI/CD & Deployment** - Configure deployment pipelines
9. **Code Quality** - Set up linting and testing
10. **Review & Generate** - Download your project

## Generated Project Structure

```
your-project/
├── composeApp/           # Shared KMP code
├── androidApp/           # Android-specific code
├── iosApp/               # iOS-specific code
├── desktopApp/           # Desktop-specific code (optional)
├── .github/workflows/    # CI/CD pipelines
├── fastlane/             # Fastlane configuration
└── README.md             # Setup instructions
```

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: Zustand
- **ZIP Generation**: JSZip
- **Icon Processing**: Canvas API

## Documentation

See the `/claude-product-cycle` directory for comprehensive development documentation:

- `CLAUDE_PRODUCT_CYCLE.md` - Master documentation
- `PRODUCT_MAP.md` - Feature registry
- `COMMANDS.md` - Quick command reference

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

Apache License 2.0 - see [LICENSE](LICENSE) for details.

## Links

- [Mifos Initiative](https://mifos.org/)
- [Mobile Wallet](https://github.com/openMF/mobile-wallet)
- [Mifos Mobile](https://github.com/openMF/mifos-mobile)
- [Android Client](https://github.com/openMF/android-client)
