/**
 * Workflow Generator
 * Generates customized GitHub Actions workflow files for CI/CD
 */

import {
  type WorkflowConfig,
  type WorkflowGenerationOptions,
  type GeneratedContent,
  type GeneratorResult,
} from '@/types/wizard';

/**
 * Default paths for workflow files
 */
export const WORKFLOW_PATHS = {
  /** PR check workflow */
  PR_CHECK: '.github/workflows/pr-check.yml',
  /** Multi-platform build workflow */
  MULTI_PLATFORM: '.github/workflows/multi-platform-build-and-publish.yml',
} as const;

/**
 * Default ActionHub version for reusable workflows
 */
export const DEFAULT_ACTIONHUB_VERSION = 'v1.0.7';

/**
 * Default workflow configuration values
 */
export const DEFAULT_WORKFLOW_CONFIG: WorkflowConfig = {
  targetBranch: 'development',
  androidPackageName: 'cmp-android',
  iosPackageName: 'cmp-ios',
  desktopPackageName: 'cmp-desktop',
  webPackageName: 'cmp-web',
  sharedModule: ':cmp-shared',
  javaVersion: '21',
  appIdentifier: 'org.mifos.mobile',
  buildIos: true,
  useCocoapods: true,
  testerGroups: 'mifos-mobile-apps',
  matchType: 'adhoc',
  metadataPath: './fastlane/metadata/ios',
  desktopDir: 'cmp-desktop',
};

/**
 * Generate PR check workflow YAML content
 *
 * @param config - Workflow configuration
 * @param actionHubVersion - Version of ActionHub reusable workflow
 * @returns Generated YAML content
 */
export function generatePrCheckWorkflow(
  config: WorkflowConfig,
  actionHubVersion: string = DEFAULT_ACTIONHUB_VERSION
): string {
  const yaml = `## Overview
#
# This reusable GitHub Actions workflow provides a comprehensive Continuous Integration (CI) pipeline
# for multi-platform mobile and desktop applications, specifically designed for projects using Gradle and Java/Kotlin.
#
### Key Features
# - Automated code quality checks
# - Dependency management and verification
# - Cross-platform desktop application builds (Windows, Linux, MacOS)
# - Android APK build generation
# - Artifact generation and storage
#
### Workflow Jobs
# 1. **Setup**: Prepares the build environment
#   - Checks out repository code
#   - Sets up Java (configurable; defaults to 17)
#   - Configures Gradle
#   - Manages dependency caching
#
# 2. **Code Quality Checks**:
#   - Build logic verification
#   - Code formatting checks (Spotless)
#   - Static code analysis (Detekt)
#
# 3. **Dependency Guard**:
#   - Verifies dependencies against baseline
#   - Prevents unauthorized dependency changes
#   - Supports automatic baseline updates
#
# 4. **Android App Build**:
#   - Builds debug APK for demo flavor
#   - Uploads APK artifacts
#
# 5. **Desktop App Build**:
#   - Builds applications for Windows, Linux, and MacOS
#   - Generates platform-specific executables and packages
#
### Prerequisites
#   - Java (configurable; default 17)
#   - Gradle
#   - Configured build scripts for:
#       - Android module
#       - Desktop module
#   - Installed Gradle plugins:
#       - Spotless
#       - Detekt
#       - Dependency Guard
#
### Configuration Parameters
# The workflow requires two input parameters:
#
#   |         Parameter      |              Description           |  Type  | Required  |
#   |------------------------|------------------------------------|--------|-----------|
#   | \`android_package_name\` | Name of the Android project module | String |    Yes    |
#   | \`desktop_package_name\` | Name of the Desktop project module | String |    Yes    |
#   |\`web_package_name\`      | Name of the Web (Kotlin/JS) project/module | String | No|
#   |\`ios_package_name\`      | Name of the iOS project/module	| String |	No	       |
#   |\`build_ios\`	         | Build iOS targets as part of PR checks |	Boolean	| No   |
#   |\`use_cocoapods\`         | Use CocoaPods for iOS integration	| Boolean	| No   |
#   |\`shared_module	         | Path of the shared KMP module  |	String	| (required when build_ios=true) |
#   |\`java-version	         | Java version to use (configurable; defaults to 17)| No  |
#

# https://github.com/openMF/mifos-x-actionhub/blob/main/.github/workflows/pr-check.yaml

# ##############################################################################
#                 DON'T EDIT THIS FILE UNLESS NECESSARY                        #
# ##############################################################################


name: PR Checks for KMP

# Trigger conditions for the workflow
on:
  push:
    branches: [ ${config.targetBranch} ]  # Runs on pushes to target branch
  pull_request:
    branches: [ ${config.targetBranch} ]  # Runs on PRs to target branch

# Concurrency settings to prevent multiple simultaneous workflow runs
concurrency:
  group: pr-kmp-\${{ github.ref }}
  cancel-in-progress: true  # Cancels previous runs if a new one is triggered

permissions:
  contents: write

jobs:
  pr_checks:
    name: PR Checks KMP
    uses: openMF/mifos-x-actionhub/.github/workflows/pr-check.yaml@${actionHubVersion}
    secrets: inherit
    with:
      android_package_name: '${config.androidPackageName}'
      desktop_package_name: '${config.desktopPackageName}'
      web_package_name: '${config.webPackageName}'
      ios_package_name: '${config.iosPackageName}'
      build_ios: ${config.buildIos}
      use_cocoapods: ${config.useCocoapods}
      shared_module: '${config.sharedModule}'
      java-version: '${config.javaVersion}'
`;

  return yaml;
}

/**
 * Generate multi-platform build and publish workflow YAML content
 *
 * @param config - Workflow configuration
 * @param actionHubVersion - Version of ActionHub reusable workflow
 * @returns Generated YAML content
 */
export function generateMultiPlatformWorkflow(
  config: WorkflowConfig,
  actionHubVersion: string = DEFAULT_ACTIONHUB_VERSION
): string {
  const yaml = `# GitHub Actions Workflow for Kotlin Multi-Platform Application Deployment
#
# OVERVIEW:
# This workflow supports building and publishing applications across multiple platforms:
# - Android (APK/AAB)
# - iOS (IPA)
# - Desktop (EXE, MSI, DMG, DEB)
# - Web (GitHub Pages)
#
# PREREQUISITES:
# Ensure your project is configured with:
#  - Gradle build system
#  - Kotlin Multiplatform Project with Android, iOS, Desktop, and Web modules
#  - Fastlane for deployment automation
#  - Separate modules/package names for each platform
#
# REQUIRED SECRETS:
# Configure the following secrets in GitHub repository settings:
# - ORIGINAL_KEYSTORE_FILE: Base64 encoded Android release keystore
# - ORIGINAL_KEYSTORE_FILE_PASSWORD: Keystore password
# - ORIGINAL_KEYSTORE_ALIAS: Keystore alias
# - ORIGINAL_KEYSTORE_ALIAS_PASSWORD: Keystore alias password

# - UPLOAD_KEYSTORE_FILE: Base64 encoded Android release keystore
# - UPLOAD_KEYSTORE_FILE_PASSWORD: Keystore password
# - UPLOAD_KEYSTORE_ALIAS: Keystore alias
# - UPLOAD_KEYSTORE_ALIAS_PASSWORD: Keystore alias password

# - GOOGLESERVICES: Google Services configuration JSON
# - PLAYSTORECREDS: Play Store service account credentials
# - FIREBASECREDS: Firebase distribution credentials

# - NOTARIZATION_APPLE_ID: Apple ID for macOS app notarization
# - NOTARIZATION_PASSWORD: Notarization password
# - NOTARIZATION_TEAM_ID: Apple developer team ID

# WORKFLOW INPUTS:
# - release_type: 'internal' (default) or 'beta'
# - target_branch: Branch to use for release (default: '${config.targetBranch}')
# - android_package_name: Name of Android module
# - ios_package_name: Name of iOS module
# - desktop_package_name: Name of desktop module
# - web_package_name: Name of web module
# - publish_android: Enable/disable Android Play Store publishing
# - build_ios: Enable/disable iOS build
# - publish_ios: Enable/disable iOS App Store publishing

# USAGE:
# 1. Ensure all required secrets are configured
# 2. Customize package names in workflow inputs
# 3. Toggle platform-specific publishing flags
# 4. Trigger workflow manually or via GitHub Actions UI

# https://github.com/openMF/mifos-x-actionhub/blob/main/.github/workflows/multi-platform-build-and-publish.yaml

# ##############################################################################
#                 DON'T EDIT THIS FILE UNLESS NECESSARY                        #
# ##############################################################################
name: Multi-Platform Build and Publish

on:
  workflow_dispatch:
    inputs:
      release_type:
        type: choice
        options:
          - internal
          - beta
        default: internal
        description: Release Type

      target_branch:
        type: string
        default: '${config.targetBranch}'
        description: 'Target branch for release'

      distribute_ios_firebase:
        type: boolean
        default: false
        description: Distribute iOS App via Firebase App Distribution

      distribute_ios_testflight:
        type: boolean
        default: false
        description: Distribute iOS App via TestFlight (App Store Connect)

      distribute_ios_appstore:
        type: boolean
        default: false
        description: Distribute iOS App to Appstore

      distribute_macos_testflight:
        type: boolean
        default: false
        description: Distribute macOS App via TestFlight (App Store Connect)

      distribute_macos_appstore:
        type: boolean
        default: false
        description: Distribute macOS App to Appstore

permissions:
  contents: write
  id-token: write
  pages: write

concurrency:
  group: "reusable"
  cancel-in-progress: false

jobs:
  multi_platform_build_and_publish:
    name: Multi-Platform Build and Publish
    uses: openMF/mifos-x-actionhub/.github/workflows/multi-platform-build-and-publish.yaml@${actionHubVersion}
    with:
      java-version: ${config.javaVersion}
      release_type: \${{ inputs.release_type }}
      target_branch: \${{ inputs.target_branch }}
      android_package_name: '${config.androidPackageName}'
      ios_package_name: '${config.iosPackageName}'
      desktop_package_name: '${config.desktopPackageName}'
      web_package_name: '${config.webPackageName}'
      tester_groups: '${config.testerGroups || 'mifos-mobile-apps'}'
      app_identifier: '${config.appIdentifier}'
      git_url: '${config.provisioningGitUrl || 'git@github.com:openMF/ios-provisioning-profile.git'}'
      git_branch: '${config.provisioningGitBranch || 'mifos-mobile'}'
      match_type: '${config.matchType || 'adhoc'}'
      provisioning_profile_name: '${config.provisioningProfileName || `match AdHoc ${config.appIdentifier}`}'
      firebase_app_id: '${config.firebaseAppId || ''}'
      metadata_path: '${config.metadataPath || './fastlane/metadata/ios'}'
      use_cocoapods: ${config.useCocoapods}
      shared_module: '${config.sharedModule}'
      cmp_desktop_dir: '${config.desktopDir || 'cmp-desktop'}'
      keychain_name: signing.keychain-db
      distribute_ios_firebase: \${{ inputs.distribute_ios_firebase }}
      distribute_ios_testflight: \${{ inputs.distribute_ios_testflight }}
      distribute_ios_appstore: \${{ inputs.distribute_ios_appstore }}
      distribute_macos_testflight: \${{ inputs.distribute_macos_testflight }}
      distribute_macos_appstore: \${{ inputs.distribute_macos_appstore }}
    secrets:
      original_keystore_file: \${{ secrets.ORIGINAL_KEYSTORE_FILE }}
      original_keystore_file_password: \${{ secrets.ORIGINAL_KEYSTORE_FILE_PASSWORD }}
      original_keystore_alias: \${{ secrets.ORIGINAL_KEYSTORE_ALIAS }}
      original_keystore_alias_password: \${{ secrets.ORIGINAL_KEYSTORE_ALIAS_PASSWORD }}

      upload_keystore_file: \${{ secrets.UPLOAD_KEYSTORE_FILE }}
      upload_keystore_file_password: \${{ secrets.UPLOAD_KEYSTORE_FILE_PASSWORD }}
      upload_keystore_alias: \${{ secrets.UPLOAD_KEYSTORE_ALIAS }}
      upload_keystore_alias_password: \${{ secrets.UPLOAD_KEYSTORE_ALIAS_PASSWORD }}

      notarization_apple_id: \${{ secrets.NOTARIZATION_APPLE_ID }}
      notarization_password: \${{ secrets.NOTARIZATION_PASSWORD }}
      notarization_team_id: \${{ secrets.NOTARIZATION_TEAM_ID }}
      keychain_password: \${{ secrets.KEYCHAIN_PASSWORD }}
      certificates_password: \${{ secrets.CERTIFICATES_PASSWORD }}
      mac_app_distribution_certificate_b64: \${{ secrets.MAC_APP_DISTRIBUTION_CERTIFICATE_B64 }}
      mac_installer_distribution_certificate_b64: \${{ secrets.MAC_INSTALLER_DISTRIBUTION_CERTIFICATE_B64 }}
      mac_embedded_provision_b64: \${{ secrets.MAC_EMBEDDED_PROVISION_B64 }}
      mac_runtime_provision_b64: \${{ secrets.MAC_RUNTIME_PROVISION_B64 }}
      appstore_key_id: \${{ secrets.APPSTORE_KEY_ID }}
      appstore_issuer_id: \${{ secrets.APPSTORE_ISSUER_ID }}
      appstore_auth_key: \${{ secrets.APPSTORE_AUTH_KEY }}
      match_password: \${{ secrets.MATCH_PASSWORD }}
      match_ssh_private_key: \${{ secrets.MATCH_SSH_PRIVATE_KEY }}

      windows_signing_key: \${{ secrets.WINDOWS_SIGNING_KEY }}
      windows_signing_password: \${{ secrets.WINDOWS_SIGNING_PASSWORD }}
      windows_signing_certificate: \${{ secrets.WINDOWS_SIGNING_CERTIFICATE }}

      macos_signing_key: \${{ secrets.MACOS_SIGNING_KEY }}
      macos_signing_password: \${{ secrets.MACOS_SIGNING_PASSWORD }}
      macos_signing_certificate: \${{ secrets.MACOS_SIGNING_CERTIFICATE }}

      linux_signing_key: \${{ secrets.LINUX_SIGNING_KEY }}
      linux_signing_password: \${{ secrets.LINUX_SIGNING_PASSWORD }}
      linux_signing_certificate: \${{ secrets.LINUX_SIGNING_CERTIFICATE }}

      google_services: \${{ secrets.GOOGLESERVICES }}
      firebase_creds: \${{ secrets.FIREBASECREDS }}
      playstore_creds: \${{ secrets.PLAYSTORECREDS }}
      token: \${{ secrets.GITHUB_TOKEN }}
`;

  return yaml;
}

/**
 * Validate workflow configuration
 *
 * @param config - Configuration to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateWorkflowConfig(config: WorkflowConfig): string[] {
  const errors: string[] = [];

  // Validate targetBranch
  if (!config.targetBranch || config.targetBranch.trim().length === 0) {
    errors.push('Target branch is required');
  }

  // Validate package names
  if (!config.androidPackageName || config.androidPackageName.trim().length === 0) {
    errors.push('Android package name is required');
  }

  if (!config.iosPackageName || config.iosPackageName.trim().length === 0) {
    errors.push('iOS package name is required');
  }

  if (!config.desktopPackageName || config.desktopPackageName.trim().length === 0) {
    errors.push('Desktop package name is required');
  }

  if (!config.webPackageName || config.webPackageName.trim().length === 0) {
    errors.push('Web package name is required');
  }

  // Validate shared module
  if (!config.sharedModule || config.sharedModule.trim().length === 0) {
    errors.push('Shared module path is required');
  } else if (!config.sharedModule.startsWith(':')) {
    errors.push('Shared module path should start with colon (e.g., :cmp-shared)');
  }

  // Validate Java version
  const validJavaVersions = ['17', '21'];
  if (!validJavaVersions.includes(config.javaVersion)) {
    errors.push(`Java version must be one of: ${validJavaVersions.join(', ')}`);
  }

  // Validate app identifier
  if (!config.appIdentifier || config.appIdentifier.trim().length === 0) {
    errors.push('App identifier is required');
  } else if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/i.test(config.appIdentifier)) {
    errors.push('App identifier must be in reverse domain format (e.g., com.example.app)');
  }

  // Validate match type if provided
  if (config.matchType && !['adhoc', 'appstore', 'development'].includes(config.matchType)) {
    errors.push('Match type must be one of: adhoc, appstore, development');
  }

  return errors;
}

/**
 * Extract workflow configuration from existing YAML content
 *
 * @param content - YAML workflow content
 * @returns Partial workflow configuration
 */
export function extractWorkflowConfig(content: string): Partial<WorkflowConfig> {
  const config: Partial<WorkflowConfig> = {};

  // Extract android_package_name
  const androidMatch = content.match(/android_package_name:\s*['"]?([^'"\n]+)['"]?/);
  if (androidMatch) {
    config.androidPackageName = androidMatch[1].trim();
  }

  // Extract ios_package_name
  const iosMatch = content.match(/ios_package_name:\s*['"]?([^'"\n]+)['"]?/);
  if (iosMatch) {
    config.iosPackageName = iosMatch[1].trim();
  }

  // Extract desktop_package_name
  const desktopMatch = content.match(/desktop_package_name:\s*['"]?([^'"\n]+)['"]?/);
  if (desktopMatch) {
    config.desktopPackageName = desktopMatch[1].trim();
  }

  // Extract web_package_name
  const webMatch = content.match(/web_package_name:\s*['"]?([^'"\n]+)['"]?/);
  if (webMatch) {
    config.webPackageName = webMatch[1].trim();
  }

  // Extract shared_module
  const sharedMatch = content.match(/shared_module:\s*['"]?([^'"\n]+)['"]?/);
  if (sharedMatch) {
    config.sharedModule = sharedMatch[1].trim();
  }

  // Extract java-version
  const javaMatch = content.match(/java-version:\s*['"]?([^'"\n]+)['"]?/);
  if (javaMatch) {
    config.javaVersion = javaMatch[1].trim();
  }

  // Extract app_identifier
  const appIdMatch = content.match(/app_identifier:\s*['"]?([^'"\n]+)['"]?/);
  if (appIdMatch) {
    config.appIdentifier = appIdMatch[1].trim();
  }

  // Extract build_ios
  const buildIosMatch = content.match(/build_ios:\s*(true|false)/);
  if (buildIosMatch) {
    config.buildIos = buildIosMatch[1] === 'true';
  }

  // Extract use_cocoapods
  const cocoapodsMatch = content.match(/use_cocoapods:\s*(true|false)/);
  if (cocoapodsMatch) {
    config.useCocoapods = cocoapodsMatch[1] === 'true';
  }

  // Extract target branch from branches array
  const branchMatch = content.match(/branches:\s*\[\s*([^\]]+)\s*\]/);
  if (branchMatch) {
    const branches = branchMatch[1].trim();
    // Remove quotes and get first branch
    const firstBranch = branches.split(',')[0].trim().replace(/['"]/g, '');
    config.targetBranch = firstBranch;
  }

  return config;
}

/**
 * Generate workflow files
 * Main entry point for workflow generation
 *
 * @param config - Workflow configuration
 * @param options - Generation options
 * @returns Generator result with files and any errors
 */
export function generateWorkflowFiles(
  config: WorkflowConfig,
  options: WorkflowGenerationOptions = {
    generatePrCheck: true,
    generateMultiPlatform: true,
    actionHubVersion: DEFAULT_ACTIONHUB_VERSION,
  }
): GeneratorResult {
  const result: GeneratorResult = {
    files: [],
    errors: [],
    warnings: [],
  };

  // Validate configuration
  const validationErrors = validateWorkflowConfig(config);
  if (validationErrors.length > 0) {
    result.errors.push(...validationErrors);
    return result;
  }

  // Generate PR check workflow
  if (options.generatePrCheck) {
    try {
      const prCheckContent = generatePrCheckWorkflow(config, options.actionHubVersion);
      result.files.push({
        path: WORKFLOW_PATHS.PR_CHECK,
        content: prCheckContent,
      });
    } catch (error) {
      result.errors.push(
        `Failed to generate PR check workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Generate multi-platform build workflow
  if (options.generateMultiPlatform) {
    try {
      const multiPlatformContent = generateMultiPlatformWorkflow(config, options.actionHubVersion);
      result.files.push({
        path: WORKFLOW_PATHS.MULTI_PLATFORM,
        content: multiPlatformContent,
      });
    } catch (error) {
      result.errors.push(
        `Failed to generate multi-platform workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Add warnings for optional configurations
  if (!config.firebaseAppId) {
    result.warnings.push('Firebase App ID not configured - iOS Firebase distribution will not work');
  }

  if (!config.provisioningGitUrl) {
    result.warnings.push('Provisioning Git URL not configured - using default Mifos provisioning');
  }

  return result;
}

/**
 * Create workflow configuration from wizard state
 * Helper to convert wizard form data to workflow config
 *
 * @param step2 - Step 2 form state (project info)
 * @param step6 - Step 6 form state (platform selection)
 * @param step8 - Step 8 form state (CI/CD config)
 * @returns Workflow configuration
 */
export function createWorkflowConfigFromWizard(
  step2: {
    packageName: string;
    projectName: string;
  },
  step6: {
    platforms: {
      android: boolean;
      ios: boolean;
      desktop: boolean;
      web: boolean;
    };
  },
  step8: {
    targetBranch?: string;
    javaVersion?: string;
    firebaseAppId?: string;
    testerGroups?: string;
    provisioningGitUrl?: string;
    provisioningGitBranch?: string;
  }
): WorkflowConfig {
  return {
    targetBranch: step8.targetBranch || 'development',
    androidPackageName: 'cmp-android',
    iosPackageName: 'cmp-ios',
    desktopPackageName: 'cmp-desktop',
    webPackageName: 'cmp-web',
    sharedModule: ':cmp-shared',
    javaVersion: step8.javaVersion || '21',
    appIdentifier: step2.packageName,
    buildIos: step6.platforms.ios,
    useCocoapods: true,
    testerGroups: step8.testerGroups,
    firebaseAppId: step8.firebaseAppId,
    provisioningGitUrl: step8.provisioningGitUrl,
    provisioningGitBranch: step8.provisioningGitBranch || step2.projectName.toLowerCase(),
    matchType: 'adhoc',
    metadataPath: './fastlane/metadata/ios',
    desktopDir: 'cmp-desktop',
  };
}

/**
 * Preview diff of workflow changes
 * Returns descriptions of changes that will be made
 *
 * @param originalContent - Original workflow content (if exists)
 * @param config - New configuration to apply
 * @returns Array of change descriptions
 */
export function previewWorkflowChanges(
  originalContent: string | null,
  config: WorkflowConfig
): string[] {
  const changes: string[] = [];

  if (!originalContent) {
    changes.push('Creating new workflow file');
    changes.push(`  Target branch: ${config.targetBranch}`);
    changes.push(`  App identifier: ${config.appIdentifier}`);
    changes.push(`  Java version: ${config.javaVersion}`);
    changes.push(`  Build iOS: ${config.buildIos}`);
    return changes;
  }

  const currentConfig = extractWorkflowConfig(originalContent);

  if (currentConfig.targetBranch !== config.targetBranch) {
    changes.push(`Target branch: "${currentConfig.targetBranch || ''}" -> "${config.targetBranch}"`);
  }

  if (currentConfig.appIdentifier !== config.appIdentifier) {
    changes.push(`App identifier: "${currentConfig.appIdentifier || ''}" -> "${config.appIdentifier}"`);
  }

  if (currentConfig.javaVersion !== config.javaVersion) {
    changes.push(`Java version: "${currentConfig.javaVersion || ''}" -> "${config.javaVersion}"`);
  }

  if (currentConfig.buildIos !== config.buildIos) {
    changes.push(`Build iOS: ${currentConfig.buildIos} -> ${config.buildIos}`);
  }

  if (currentConfig.androidPackageName !== config.androidPackageName) {
    changes.push(`Android package: "${currentConfig.androidPackageName || ''}" -> "${config.androidPackageName}"`);
  }

  return changes;
}

/**
 * Get list of required secrets for workflow
 *
 * @param config - Workflow configuration
 * @returns List of required secret names with descriptions
 */
export function getRequiredSecrets(config: WorkflowConfig): Array<{ name: string; description: string }> {
  const secrets = [
    { name: 'ORIGINAL_KEYSTORE_FILE', description: 'Base64 encoded Android release keystore' },
    { name: 'ORIGINAL_KEYSTORE_FILE_PASSWORD', description: 'Keystore password' },
    { name: 'ORIGINAL_KEYSTORE_ALIAS', description: 'Keystore alias' },
    { name: 'ORIGINAL_KEYSTORE_ALIAS_PASSWORD', description: 'Keystore alias password' },
    { name: 'UPLOAD_KEYSTORE_FILE', description: 'Base64 encoded Android upload keystore' },
    { name: 'UPLOAD_KEYSTORE_FILE_PASSWORD', description: 'Upload keystore password' },
    { name: 'UPLOAD_KEYSTORE_ALIAS', description: 'Upload keystore alias' },
    { name: 'UPLOAD_KEYSTORE_ALIAS_PASSWORD', description: 'Upload keystore alias password' },
  ];

  if (config.buildIos) {
    secrets.push(
      { name: 'NOTARIZATION_APPLE_ID', description: 'Apple ID for macOS notarization' },
      { name: 'NOTARIZATION_PASSWORD', description: 'Apple notarization password' },
      { name: 'NOTARIZATION_TEAM_ID', description: 'Apple Developer Team ID' },
      { name: 'KEYCHAIN_PASSWORD', description: 'Keychain password for signing' },
      { name: 'CERTIFICATES_PASSWORD', description: 'Certificate password' },
      { name: 'MATCH_PASSWORD', description: 'Fastlane Match password' },
      { name: 'MATCH_SSH_PRIVATE_KEY', description: 'SSH key for provisioning repo' },
      { name: 'APPSTORE_KEY_ID', description: 'App Store Connect API Key ID' },
      { name: 'APPSTORE_ISSUER_ID', description: 'App Store Connect Issuer ID' },
      { name: 'APPSTORE_AUTH_KEY', description: 'App Store Connect Auth Key' },
    );
  }

  if (config.firebaseAppId) {
    secrets.push(
      { name: 'GOOGLESERVICES', description: 'Google Services JSON configuration' },
      { name: 'FIREBASECREDS', description: 'Firebase distribution credentials' },
    );
  }

  secrets.push(
    { name: 'PLAYSTORECREDS', description: 'Play Store service account credentials' },
  );

  return secrets;
}
