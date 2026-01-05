/**
 * Project Generator
 * Orchestrates all file generators to produce a complete project configuration
 */

import JSZip from 'jszip';

import {
  type GeneratedContent,
  type GeneratorResult,
  type Step1State,
  type Step2State,
  type Step6State,
  type Step8State,
  APP_REPOSITORIES,
} from '@/types/wizard';

import {
  generateGradleFiles,
  createTomlReplacementsFromStep2,
} from './gradle';

import {
  generateAndroidFiles,
  createAndroidReplacementsFromWizard,
} from './android';

import {
  generateIOSFiles,
  createIOSReplacementsFromWizard,
} from './ios';

import {
  generateWebFiles,
  createWebReplacementsFromWizard,
} from './web';

import {
  generateWorkflowFiles,
  createWorkflowConfigFromWizard,
} from './workflow';

/**
 * Project generation progress callback
 */
export interface GenerationProgressCallback {
  (stage: string, step: number, total: number, message: string): void;
}

/**
 * Complete wizard state for project generation
 */
export interface WizardState {
  step1: Step1State;
  step2: Step2State;
  step3: { colors: { primary: string; secondary: string; accent: string }; darkModeEnabled: boolean };
  step4: { iconShape: string; generatedIcons: { android?: Record<string, string>; ios?: Record<string, string> } | null };
  step5: { environments: Record<string, { enabled: boolean; baseUrl: string }>; connectionTimeout: number };
  step6: Step6State;
  step7: { security: { biometric: boolean; sslPinning: boolean }; twoFactorAuth: boolean; analytics: { firebase: boolean } };
  step8: Step8State;
  step9: { testing: { unitTests: boolean }; linting: { detekt: boolean; ktlint: boolean }; coverage: { enabled: boolean; minimumPercent: number } };
}

/**
 * Template file content fetched from GitHub
 */
interface TemplateFiles {
  libsVersionsToml: string | null;
  stringsXml: string | null;
  configXcconfig: string | null;
  jsMainIndexHtml: string | null;
  wasmJsMainIndexHtml: string | null;
}

/**
 * Project generation result
 */
export interface ProjectGenerationResult {
  success: boolean;
  files: GeneratedContent[];
  errors: string[];
  warnings: string[];
}

/**
 * Fetch a file from GitHub repository
 */
async function fetchGitHubFile(
  owner: string,
  repo: string,
  branch: string,
  path: string
): Promise<string | null> {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch ${path}: ${response.status}`);
      return null;
    }
    return await response.text();
  } catch (error) {
    console.warn(`Error fetching ${path}:`, error);
    return null;
  }
}

/**
 * Fetch template files from the selected base app repository
 */
async function fetchTemplateFiles(
  step1: Step1State,
  onProgress?: GenerationProgressCallback
): Promise<TemplateFiles> {
  const appType = step1.selectedApp;
  if (!appType) {
    return {
      libsVersionsToml: null,
      stringsXml: null,
      configXcconfig: null,
      jsMainIndexHtml: null,
      wasmJsMainIndexHtml: null,
    };
  }

  const repoConfig = APP_REPOSITORIES[appType];
  if (!repoConfig) {
    return {
      libsVersionsToml: null,
      stringsXml: null,
      configXcconfig: null,
      jsMainIndexHtml: null,
      wasmJsMainIndexHtml: null,
    };
  }

  const { owner, repo, branch } = repoConfig;

  onProgress?.('fetching', 1, 6, 'Fetching template files from GitHub...');

  // Fetch all template files in parallel
  const [
    libsVersionsToml,
    stringsXml,
    configXcconfig,
    jsMainIndexHtml,
    wasmJsMainIndexHtml,
  ] = await Promise.all([
    fetchGitHubFile(owner, repo, branch, 'gradle/libs.versions.toml'),
    fetchGitHubFile(owner, repo, branch, 'cmp-android/src/main/res/values/strings.xml'),
    fetchGitHubFile(owner, repo, branch, 'cmp-ios/Configuration/Config.xcconfig'),
    fetchGitHubFile(owner, repo, branch, 'cmp-web/src/jsMain/resources/index.html'),
    fetchGitHubFile(owner, repo, branch, 'cmp-web/src/wasmJsMain/resources/index.html'),
  ]);

  return {
    libsVersionsToml,
    stringsXml,
    configXcconfig,
    jsMainIndexHtml,
    wasmJsMainIndexHtml,
  };
}

/**
 * Generate all project files based on wizard state
 */
export async function generateProject(
  wizardState: WizardState,
  onProgress?: GenerationProgressCallback
): Promise<ProjectGenerationResult> {
  const result: ProjectGenerationResult = {
    success: false,
    files: [],
    errors: [],
    warnings: [],
  };

  const totalSteps = 7;
  let currentStep = 0;

  try {
    // Step 1: Validate wizard state
    currentStep++;
    onProgress?.('validating', currentStep, totalSteps, 'Validating configuration...');

    if (!wizardState.step1.selectedApp) {
      result.errors.push('No base application selected');
      return result;
    }

    if (!wizardState.step2.packageName) {
      result.errors.push('Package name is required');
      return result;
    }

    // Step 2: Fetch template files
    currentStep++;
    onProgress?.('fetching', currentStep, totalSteps, 'Fetching template files...');

    const templates = await fetchTemplateFiles(wizardState.step1, onProgress);

    // Step 3: Generate Gradle files
    currentStep++;
    onProgress?.('generating-gradle', currentStep, totalSteps, 'Generating Gradle configuration...');

    if (templates.libsVersionsToml) {
      const tomlReplacements = createTomlReplacementsFromStep2({
        displayName: wizardState.step2.displayName,
        packageName: wizardState.step2.packageName,
        versionName: wizardState.step2.versionName,
      });

      const gradleResult = generateGradleFiles(templates.libsVersionsToml, tomlReplacements);
      result.files.push(...gradleResult.files);
      result.errors.push(...gradleResult.errors);
      result.warnings.push(...gradleResult.warnings);
    } else {
      result.warnings.push('Could not fetch libs.versions.toml - Gradle files not generated');
    }

    // Step 4: Generate Android files
    currentStep++;
    onProgress?.('generating-android', currentStep, totalSteps, 'Generating Android resources...');

    if (templates.stringsXml && wizardState.step6.platforms.android.enabled) {
      const androidReplacements = createAndroidReplacementsFromWizard(
        {
          displayName: wizardState.step2.displayName,
          supportEmail: wizardState.step2.supportEmail || '',
        },
        {
          supportPhone: undefined, // Could add to step7 if needed
        }
      );

      const androidResult = generateAndroidFiles(templates.stringsXml, androidReplacements);
      result.files.push(...androidResult.files);
      result.errors.push(...androidResult.errors);
      result.warnings.push(...androidResult.warnings);
    } else if (wizardState.step6.platforms.android.enabled) {
      result.warnings.push('Could not fetch strings.xml - Android resources not generated');
    }

    // Step 5: Generate iOS files
    currentStep++;
    onProgress?.('generating-ios', currentStep, totalSteps, 'Generating iOS configuration...');

    if (templates.configXcconfig && wizardState.step6.platforms.ios.enabled) {
      const iosReplacements = createIOSReplacementsFromWizard(
        {
          displayName: wizardState.step2.displayName,
          packageName: wizardState.step2.packageName,
        },
        {
          iosConfig: {
            teamId: undefined, // Team ID would need to be added to Step 8
          },
        }
      );

      const iosResult = generateIOSFiles(templates.configXcconfig, iosReplacements);
      result.files.push(...iosResult.files);
      result.errors.push(...iosResult.errors);
      result.warnings.push(...iosResult.warnings);
    } else if (wizardState.step6.platforms.ios.enabled) {
      result.warnings.push('Could not fetch Config.xcconfig - iOS configuration not generated');
    }

    // Step 6: Generate Web files
    currentStep++;
    onProgress?.('generating-web', currentStep, totalSteps, 'Generating Web configuration...');

    if (templates.jsMainIndexHtml && templates.wasmJsMainIndexHtml && wizardState.step6.platforms.web.enabled) {
      const webReplacements = createWebReplacementsFromWizard({
        projectName: wizardState.step2.projectName,
        displayName: wizardState.step2.displayName,
        description: wizardState.step2.description,
        organizationName: wizardState.step2.organizationName,
        organizationWebsite: wizardState.step2.organizationWebsite,
      });

      const webResult = generateWebFiles(
        templates.jsMainIndexHtml,
        templates.wasmJsMainIndexHtml,
        webReplacements
      );
      result.files.push(...webResult.files);
      result.errors.push(...webResult.errors);
      result.warnings.push(...webResult.warnings);
    } else if (wizardState.step6.platforms.web.enabled) {
      result.warnings.push('Could not fetch index.html files - Web configuration not generated');
    }

    // Step 7: Generate Workflow files
    currentStep++;
    onProgress?.('generating-cicd', currentStep, totalSteps, 'Generating CI/CD workflows...');

    const workflowConfig = createWorkflowConfigFromWizard(
      {
        packageName: wizardState.step2.packageName,
        projectName: wizardState.step2.projectName,
      },
      {
        platforms: {
          android: wizardState.step6.platforms.android.enabled,
          ios: wizardState.step6.platforms.ios.enabled,
          desktop: wizardState.step6.platforms.desktop.enabled,
          web: wizardState.step6.platforms.web.enabled,
        },
      },
      {
        targetBranch: 'development',
        javaVersion: '21',
        firebaseAppId: wizardState.step8.firebase?.iosAppId,
        testerGroups: wizardState.step8.firebase?.testerGroups?.join(','),
      }
    );

    const workflowResult = generateWorkflowFiles(workflowConfig);
    result.files.push(...workflowResult.files);
    result.errors.push(...workflowResult.errors);
    result.warnings.push(...workflowResult.warnings);

    // Check for critical errors
    if (result.errors.length === 0) {
      result.success = true;
    }

  } catch (error) {
    result.errors.push(
      `Project generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Create a ZIP file from generated content
 * Uses JSZip library to create actual ZIP archives
 */
export async function createProjectZip(
  files: GeneratedContent[],
  projectName: string
): Promise<Blob> {
  const zip = new JSZip();

  // Create project folder in ZIP
  const projectFolder = zip.folder(projectName);
  if (!projectFolder) {
    throw new Error('Failed to create project folder in ZIP');
  }

  // Add each generated file to the ZIP
  for (const file of files) {
    projectFolder.file(file.path, file.content);
  }

  // Create README with instructions
  const readme = `# ${projectName} - Generated Configuration

Generated by MifosLaunchpad on ${new Date().toISOString()}

## Generated Files

${files.map(f => `- ${f.path}`).join('\n')}

## How to Use

1. Clone your base application repository:
   \`\`\`bash
   git clone https://github.com/openMF/mifos-mobile.git ${projectName}
   cd ${projectName}
   \`\`\`

2. Copy the generated files from this ZIP to your project:
   - Extract this ZIP
   - Copy all files from the \`${projectName}/\` folder to your project root
   - Overwrite existing files when prompted

3. Review the changes:
   \`\`\`bash
   git diff
   \`\`\`

4. Commit and push to trigger CI/CD:
   \`\`\`bash
   git add .
   git commit -m "Apply custom configuration from MifosLaunchpad"
   git push
   \`\`\`

## File Descriptions

| File | Description |
|------|-------------|
| \`gradle/libs.versions.toml\` | Package name, namespace, and version |
| \`cmp-android/src/main/res/values/strings.xml\` | Android app name and strings |
| \`cmp-ios/Configuration/Config.xcconfig\` | iOS Team ID, Bundle ID, App Name |
| \`cmp-web/src/jsMain/resources/index.html\` | Web app metadata and branding |
| \`cmp-web/src/wasmJsMain/resources/index.html\` | WASM web app title |
| \`.github/workflows/pr-check.yml\` | PR check CI workflow |
| \`.github/workflows/multi-platform-build-and-publish.yml\` | Build & release workflow |

## Need Help?

Visit https://github.com/openMF/mifos-mobile for documentation.
`;

  projectFolder.file('README.md', readme);

  // Generate the ZIP file as a Blob
  return await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
}

/**
 * Generate a downloadable configuration bundle
 */
export async function generateDownloadBundle(
  wizardState: WizardState,
  onProgress?: GenerationProgressCallback
): Promise<{
  blob: Blob;
  fileName: string;
  fileCount: number;
  errors: string[];
  warnings: string[];
}> {
  // Generate all files
  const result = await generateProject(wizardState, onProgress);

  onProgress?.('creating-zip', 7, 7, 'Creating download bundle...');

  // Create ZIP/bundle
  const projectName = wizardState.step2.projectName || 'MifosApp';
  const blob = await createProjectZip(result.files, projectName);

  return {
    blob,
    fileName: `${projectName}-config.zip`,
    fileCount: result.files.length,
    errors: result.errors,
    warnings: result.warnings,
  };
}

/**
 * Get summary of what will be generated
 */
export function getGenerationSummary(wizardState: WizardState): {
  fileCount: number;
  platforms: string[];
  generators: string[];
} {
  const platforms: string[] = [];
  const generators: string[] = ['Gradle (libs.versions.toml)'];

  if (wizardState.step6.platforms.android.enabled) {
    platforms.push('Android');
    generators.push('Android (strings.xml)');
  }
  if (wizardState.step6.platforms.ios.enabled) {
    platforms.push('iOS');
    generators.push('iOS (Config.xcconfig)');
  }
  if (wizardState.step6.platforms.desktop.enabled) {
    platforms.push('Desktop');
  }
  if (wizardState.step6.platforms.web.enabled) {
    platforms.push('Web');
    generators.push('Web (index.html)');
  }

  generators.push('GitHub Actions (pr-check.yml, multi-platform-build.yml)');

  // Estimate file count
  let fileCount = 1; // libs.versions.toml
  if (wizardState.step6.platforms.android.enabled) fileCount += 1; // strings.xml
  if (wizardState.step6.platforms.ios.enabled) fileCount += 1; // Config.xcconfig
  if (wizardState.step6.platforms.web.enabled) fileCount += 2; // 2 index.html files
  fileCount += 2; // workflow files

  return {
    fileCount,
    platforms,
    generators,
  };
}
