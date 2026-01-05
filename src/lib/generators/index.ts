/**
 * File Generators
 * Export all generator utilities for project customization
 */

// Gradle generator (libs.versions.toml)
export {
  replaceTomlValue,
  applyTomlReplacements,
  generateLibsVersionsToml,
  validateTomlReplacements,
  extractTomlValues,
  generateGradleFiles,
  createTomlReplacementsFromStep2,
  previewTomlChanges,
} from './gradle';

// Android generator (strings.xml)
export {
  ANDROID_STRINGS_PATHS,
  escapeXmlString,
  replaceStringResource,
  applyAndroidStringReplacements,
  generateStringsXml,
  validateAndroidStringReplacements,
  extractStringValues,
  findStringsContaining,
  replaceTextInAllStrings,
  generateAndroidFiles,
  createAndroidReplacementsFromWizard,
  previewAndroidStringChanges,
} from './android';

// iOS generator (Config.xcconfig)
export {
  IOS_CONFIG_PATH,
  replaceConfigValue,
  applyIOSConfigReplacements,
  generateConfigXcconfig,
  validateIOSConfigReplacements,
  extractConfigValues,
  generateIOSFiles,
  createIOSReplacementsFromWizard,
  previewIOSConfigChanges,
  addConfigEntry,
  parseXcconfig,
  generateXcconfigFromMap,
} from './ios';

// Web generator (cmp-web HTML files)
export {
  WEB_HTML_PATHS,
  escapeHtmlString,
  replaceTitle,
  replaceMetaByName,
  replaceMetaByProperty,
  replaceTextInHtml,
  applyWebStringReplacements,
  generateJsMainHtml,
  generateWasmJsMainHtml,
  validateWebStringReplacements,
  extractHtmlValues,
  generateWebFiles,
  createWebReplacementsFromWizard,
  previewWebHtmlChanges,
} from './web';

// Workflow generator (GitHub Actions YAML files)
export {
  WORKFLOW_PATHS,
  DEFAULT_ACTIONHUB_VERSION,
  DEFAULT_WORKFLOW_CONFIG,
  generatePrCheckWorkflow,
  generateMultiPlatformWorkflow,
  validateWorkflowConfig,
  extractWorkflowConfig,
  generateWorkflowFiles,
  createWorkflowConfigFromWizard,
  previewWorkflowChanges,
  getRequiredSecrets,
} from './workflow';

// Project generator (orchestrates all generators)
export {
  generateProject,
  createProjectZip,
  generateDownloadBundle,
  getGenerationSummary,
  type WizardState,
  type ProjectGenerationResult,
  type GenerationProgressCallback,
} from './project-generator';

// Re-export types for convenience
export type {
  GeneratorConfig,
  TomlReplacements,
  AndroidStringReplacements,
  IOSConfigReplacements,
  WebStringReplacements,
  WorkflowConfig,
  WorkflowGenerationOptions,
  GeneratedContent,
  GeneratorResult,
} from '@/types/wizard';
