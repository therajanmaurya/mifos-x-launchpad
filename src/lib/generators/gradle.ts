/**
 * Gradle Generator
 * Customizes libs.versions.toml files for project generation
 */

import {
  type TomlReplacements,
  type GeneratedContent,
  type GeneratorResult,
} from '@/types/wizard';

/**
 * Keys in libs.versions.toml that should be replaced
 */
const TOML_REPLACEMENT_KEYS = {
  PACKAGE_NAME: 'packageName',
  PACKAGE_NAMESPACE: 'packageNamespace',
  ANDROID_PACKAGE_NAMESPACE: 'androidPackageNamespace',
  PACKAGE_VERSION: 'packageVersion',
} as const;

/**
 * Replace a value in TOML content for a specific key
 * Handles both quoted and unquoted values
 *
 * @param content - Original TOML content
 * @param key - Key to replace (e.g., 'packageName')
 * @param newValue - New value to set
 * @returns Modified TOML content
 */
export function replaceTomlValue(
  content: string,
  key: string,
  newValue: string
): string {
  // Match: key = "value" or key = 'value' or key = value
  const regex = new RegExp(
    `^(${key}\\s*=\\s*)(?:"[^"]*"|'[^']*'|[^\\s#]+)`,
    'gm'
  );

  // Check if key exists
  if (!regex.test(content)) {
    return content;
  }

  // Reset regex state and replace
  regex.lastIndex = 0;
  return content.replace(regex, `$1"${newValue}"`);
}

/**
 * Apply multiple replacements to TOML content
 *
 * @param content - Original TOML content
 * @param replacements - Key-value pairs to replace
 * @returns Modified TOML content
 */
export function applyTomlReplacements(
  content: string,
  replacements: TomlReplacements
): string {
  let result = content;

  // Replace packageName (display name)
  result = replaceTomlValue(
    result,
    TOML_REPLACEMENT_KEYS.PACKAGE_NAME,
    replacements.packageName
  );

  // Replace packageNamespace (reverse domain)
  result = replaceTomlValue(
    result,
    TOML_REPLACEMENT_KEYS.PACKAGE_NAMESPACE,
    replacements.packageNamespace
  );

  // Replace androidPackageNamespace if provided
  if (replacements.androidPackageNamespace) {
    result = replaceTomlValue(
      result,
      TOML_REPLACEMENT_KEYS.ANDROID_PACKAGE_NAMESPACE,
      replacements.androidPackageNamespace
    );
  } else {
    // Use packageNamespace as fallback for androidPackageNamespace
    result = replaceTomlValue(
      result,
      TOML_REPLACEMENT_KEYS.ANDROID_PACKAGE_NAMESPACE,
      replacements.packageNamespace
    );
  }

  // Replace packageVersion
  result = replaceTomlValue(
    result,
    TOML_REPLACEMENT_KEYS.PACKAGE_VERSION,
    replacements.packageVersion
  );

  return result;
}

/**
 * Generate customized libs.versions.toml content
 *
 * @param originalContent - Original TOML file content
 * @param replacements - Values to replace in the TOML
 * @returns Generated file result
 */
export function generateLibsVersionsToml(
  originalContent: string,
  replacements: TomlReplacements
): GeneratedContent {
  const content = applyTomlReplacements(originalContent, replacements);

  return {
    path: 'gradle/libs.versions.toml',
    content,
    originalContent,
  };
}

/**
 * Validate TOML replacements configuration
 *
 * @param replacements - Replacements to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateTomlReplacements(
  replacements: TomlReplacements
): string[] {
  const errors: string[] = [];

  // Validate packageName (display name)
  if (!replacements.packageName || replacements.packageName.trim().length === 0) {
    errors.push('Package name (display name) is required');
  }

  // Validate packageNamespace (reverse domain format)
  if (!replacements.packageNamespace) {
    errors.push('Package namespace is required');
  } else if (!/^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$/.test(replacements.packageNamespace)) {
    errors.push('Package namespace must be in reverse domain format (e.g., com.example.app)');
  }

  // Validate packageVersion (semantic version)
  if (!replacements.packageVersion) {
    errors.push('Package version is required');
  } else if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$/.test(replacements.packageVersion)) {
    errors.push('Package version must be in semantic format (e.g., 1.0.0)');
  }

  return errors;
}

/**
 * Extract current values from TOML content
 *
 * @param content - TOML file content
 * @returns Current replacement values from the file
 */
export function extractTomlValues(content: string): Partial<TomlReplacements> {
  const result: Partial<TomlReplacements> = {};

  const extractValue = (key: string): string | undefined => {
    const regex = new RegExp(`^${key}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s#]+))`, 'm');
    const match = content.match(regex);
    if (match) {
      return match[1] || match[2] || match[3];
    }
    return undefined;
  };

  result.packageName = extractValue(TOML_REPLACEMENT_KEYS.PACKAGE_NAME);
  result.packageNamespace = extractValue(TOML_REPLACEMENT_KEYS.PACKAGE_NAMESPACE);
  result.androidPackageNamespace = extractValue(TOML_REPLACEMENT_KEYS.ANDROID_PACKAGE_NAMESPACE);
  result.packageVersion = extractValue(TOML_REPLACEMENT_KEYS.PACKAGE_VERSION);

  return result;
}

/**
 * Generate Gradle configuration files
 * Main entry point for Gradle-related file generation
 *
 * @param originalTomlContent - Original libs.versions.toml content
 * @param replacements - Values to use for generation
 * @returns Generator result with files and any errors
 */
export function generateGradleFiles(
  originalTomlContent: string,
  replacements: TomlReplacements
): GeneratorResult {
  const result: GeneratorResult = {
    files: [],
    errors: [],
    warnings: [],
  };

  // Validate replacements
  const validationErrors = validateTomlReplacements(replacements);
  if (validationErrors.length > 0) {
    result.errors.push(...validationErrors);
    return result;
  }

  // Extract current values for comparison
  const currentValues = extractTomlValues(originalTomlContent);

  // Check if values are the same (warn but continue)
  if (currentValues.packageNamespace === replacements.packageNamespace) {
    result.warnings.push(
      'Package namespace matches original - no change will be visible'
    );
  }

  // Generate libs.versions.toml
  try {
    const tomlFile = generateLibsVersionsToml(originalTomlContent, replacements);
    result.files.push(tomlFile);
  } catch (error) {
    result.errors.push(
      `Failed to generate libs.versions.toml: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Create TOML replacements from wizard state
 * Helper to convert Step 2 form data to TOML replacements
 *
 * @param step2 - Step 2 form state
 * @returns TOML replacements configuration
 */
export function createTomlReplacementsFromStep2(step2: {
  displayName: string;
  packageName: string;
  versionName: string;
}): TomlReplacements {
  return {
    packageName: step2.displayName,
    packageNamespace: step2.packageName,
    androidPackageNamespace: step2.packageName,
    packageVersion: step2.versionName || '1.0.0',
  };
}

/**
 * Preview diff of TOML changes
 * Returns lines that will be changed
 *
 * @param originalContent - Original TOML content
 * @param replacements - Replacements to apply
 * @returns Array of change descriptions
 */
export function previewTomlChanges(
  originalContent: string,
  replacements: TomlReplacements
): string[] {
  const changes: string[] = [];
  const currentValues = extractTomlValues(originalContent);

  if (currentValues.packageName !== replacements.packageName) {
    changes.push(
      `packageName: "${currentValues.packageName || ''}" → "${replacements.packageName}"`
    );
  }

  if (currentValues.packageNamespace !== replacements.packageNamespace) {
    changes.push(
      `packageNamespace: "${currentValues.packageNamespace || ''}" → "${replacements.packageNamespace}"`
    );
  }

  if (currentValues.androidPackageNamespace !== replacements.androidPackageNamespace) {
    const newValue = replacements.androidPackageNamespace || replacements.packageNamespace;
    changes.push(
      `androidPackageNamespace: "${currentValues.androidPackageNamespace || ''}" → "${newValue}"`
    );
  }

  if (currentValues.packageVersion !== replacements.packageVersion) {
    changes.push(
      `packageVersion: "${currentValues.packageVersion || ''}" → "${replacements.packageVersion}"`
    );
  }

  return changes;
}
