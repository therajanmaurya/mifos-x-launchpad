/**
 * iOS Generator
 * Customizes iOS Config.xcconfig files for project generation
 */

import {
  type IOSConfigReplacements,
  type GeneratedContent,
  type GeneratorResult,
} from '@/types/wizard';

/**
 * Standard configuration keys in Config.xcconfig
 */
const CONFIG_KEYS = {
  TEAM_ID: 'TEAM_ID',
  BUNDLE_ID: 'BUNDLE_ID',
  APP_NAME: 'APP_NAME',
} as const;

/**
 * Default path for Config.xcconfig
 */
export const IOS_CONFIG_PATH = 'cmp-ios/Configuration/Config.xcconfig';

/**
 * Replace a configuration value in xcconfig content
 *
 * @param content - Original xcconfig content
 * @param key - Configuration key (e.g., 'TEAM_ID')
 * @param newValue - New value to set
 * @returns Modified xcconfig content
 */
export function replaceConfigValue(
  content: string,
  key: string,
  newValue: string
): string {
  // Match: KEY = value or KEY=value (with optional whitespace)
  const regex = new RegExp(`^(${key}\\s*=\\s*)(.*)$`, 'gm');

  if (!regex.test(content)) {
    return content;
  }

  // Reset regex state and replace
  regex.lastIndex = 0;
  return content.replace(regex, `$1${newValue}`);
}

/**
 * Apply multiple configuration replacements to xcconfig content
 *
 * @param content - Original xcconfig content
 * @param replacements - Configuration replacements to apply
 * @returns Modified xcconfig content
 */
export function applyIOSConfigReplacements(
  content: string,
  replacements: IOSConfigReplacements
): string {
  let result = content;

  // Replace TEAM_ID
  result = replaceConfigValue(result, CONFIG_KEYS.TEAM_ID, replacements.teamId);

  // Replace BUNDLE_ID
  result = replaceConfigValue(result, CONFIG_KEYS.BUNDLE_ID, replacements.bundleId);

  // Replace APP_NAME
  result = replaceConfigValue(result, CONFIG_KEYS.APP_NAME, replacements.appName);

  // Apply custom config replacements
  if (replacements.customConfig) {
    for (const [key, value] of Object.entries(replacements.customConfig)) {
      result = replaceConfigValue(result, key, value);
    }
  }

  return result;
}

/**
 * Generate customized Config.xcconfig content
 *
 * @param originalContent - Original xcconfig file content
 * @param replacements - Values to replace
 * @param path - File path for the generated content
 * @returns Generated file result
 */
export function generateConfigXcconfig(
  originalContent: string,
  replacements: IOSConfigReplacements,
  path: string = IOS_CONFIG_PATH
): GeneratedContent {
  const content = applyIOSConfigReplacements(originalContent, replacements);

  return {
    path,
    content,
    originalContent,
  };
}

/**
 * Validate iOS configuration replacements
 *
 * @param replacements - Replacements to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateIOSConfigReplacements(
  replacements: IOSConfigReplacements
): string[] {
  const errors: string[] = [];

  // Validate teamId (10-character alphanumeric)
  if (!replacements.teamId) {
    errors.push('Team ID is required');
  } else if (!/^[A-Z0-9]{10}$/.test(replacements.teamId)) {
    errors.push('Team ID must be exactly 10 alphanumeric characters (uppercase)');
  }

  // Validate bundleId (reverse domain format)
  if (!replacements.bundleId) {
    errors.push('Bundle ID is required');
  } else if (!/^[a-z][a-z0-9_-]*(\.[a-z][a-z0-9_-]*)+$/i.test(replacements.bundleId)) {
    errors.push('Bundle ID must be in reverse domain format (e.g., com.example.app)');
  }

  // Validate appName
  if (!replacements.appName || replacements.appName.trim().length === 0) {
    errors.push('App name is required');
  } else if (replacements.appName.length > 30) {
    errors.push('App name should be 30 characters or less for iOS');
  }

  return errors;
}

/**
 * Extract current configuration values from xcconfig content
 *
 * @param content - xcconfig file content
 * @returns Current configuration values from the file
 */
export function extractConfigValues(
  content: string
): Partial<IOSConfigReplacements> {
  const result: Partial<IOSConfigReplacements> = {};

  const extractValue = (key: string): string | undefined => {
    const regex = new RegExp(`^${key}\\s*=\\s*(.*)$`, 'm');
    const match = content.match(regex);
    return match ? match[1].trim() : undefined;
  };

  result.teamId = extractValue(CONFIG_KEYS.TEAM_ID);
  result.bundleId = extractValue(CONFIG_KEYS.BUNDLE_ID);
  result.appName = extractValue(CONFIG_KEYS.APP_NAME);

  return result;
}

/**
 * Generate iOS configuration files
 * Main entry point for iOS config generation
 *
 * @param originalContent - Original Config.xcconfig content
 * @param replacements - Values to use for generation
 * @param path - File path for the output
 * @returns Generator result with files and any errors
 */
export function generateIOSFiles(
  originalContent: string,
  replacements: IOSConfigReplacements,
  path: string = IOS_CONFIG_PATH
): GeneratorResult {
  const result: GeneratorResult = {
    files: [],
    errors: [],
    warnings: [],
  };

  // Validate replacements
  const validationErrors = validateIOSConfigReplacements(replacements);
  if (validationErrors.length > 0) {
    result.errors.push(...validationErrors);
    return result;
  }

  // Extract current values for comparison
  const currentValues = extractConfigValues(originalContent);

  // Check if required keys exist in the file
  if (!currentValues.teamId) {
    result.warnings.push('No TEAM_ID found in the original file');
  }
  if (!currentValues.bundleId) {
    result.warnings.push('No BUNDLE_ID found in the original file');
  }
  if (!currentValues.appName) {
    result.warnings.push('No APP_NAME found in the original file');
  }

  // Generate Config.xcconfig
  try {
    const configFile = generateConfigXcconfig(originalContent, replacements, path);
    result.files.push(configFile);
  } catch (error) {
    result.errors.push(
      `Failed to generate Config.xcconfig: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Create iOS config replacements from wizard state
 * Helper to convert Step 2 and Step 8 form data to iOS config
 *
 * @param step2 - Step 2 form state
 * @param step8 - Step 8 form state (for iOS-specific config)
 * @returns iOS configuration replacements
 */
export function createIOSReplacementsFromWizard(
  step2: {
    displayName: string;
    packageName: string;
  },
  step8?: {
    iosConfig?: {
      teamId?: string;
    };
  }
): IOSConfigReplacements {
  return {
    teamId: step8?.iosConfig?.teamId || 'XXXXXXXXXX', // Placeholder if not provided
    bundleId: step2.packageName,
    appName: step2.displayName,
  };
}

/**
 * Preview diff of iOS config changes
 * Returns descriptions of changes that will be made
 *
 * @param originalContent - Original xcconfig content
 * @param replacements - Replacements to apply
 * @returns Array of change descriptions
 */
export function previewIOSConfigChanges(
  originalContent: string,
  replacements: IOSConfigReplacements
): string[] {
  const changes: string[] = [];
  const currentValues = extractConfigValues(originalContent);

  if (currentValues.teamId !== replacements.teamId) {
    changes.push(
      `TEAM_ID: "${currentValues.teamId || ''}" → "${replacements.teamId}"`
    );
  }

  if (currentValues.bundleId !== replacements.bundleId) {
    changes.push(
      `BUNDLE_ID: "${currentValues.bundleId || ''}" → "${replacements.bundleId}"`
    );
  }

  if (currentValues.appName !== replacements.appName) {
    changes.push(
      `APP_NAME: "${currentValues.appName || ''}" → "${replacements.appName}"`
    );
  }

  return changes;
}

/**
 * Add a new configuration entry to xcconfig content
 * Useful for adding entries that don't exist in the original
 *
 * @param content - Original xcconfig content
 * @param key - Configuration key to add
 * @param value - Value for the configuration
 * @returns Modified xcconfig content with the new entry
 */
export function addConfigEntry(
  content: string,
  key: string,
  value: string
): string {
  // Check if key already exists
  const regex = new RegExp(`^${key}\\s*=`, 'm');
  if (regex.test(content)) {
    // Key exists, replace it
    return replaceConfigValue(content, key, value);
  }

  // Add new entry at the end
  const trimmedContent = content.trimEnd();
  return `${trimmedContent}\n${key} = ${value}\n`;
}

/**
 * Parse xcconfig file into key-value map
 *
 * @param content - xcconfig file content
 * @returns Map of all configuration keys to values
 */
export function parseXcconfig(content: string): Map<string, string> {
  const result = new Map<string, string>();
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('#')) {
      continue;
    }

    // Parse key = value
    const match = trimmed.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      result.set(key, value.trim());
    }
  }

  return result;
}

/**
 * Generate xcconfig content from key-value map
 *
 * @param config - Map of configuration keys to values
 * @param header - Optional header comment
 * @returns xcconfig file content
 */
export function generateXcconfigFromMap(
  config: Map<string, string>,
  header?: string
): string {
  const lines: string[] = [];

  if (header) {
    lines.push(`// ${header}`);
    lines.push('');
  }

  config.forEach((value, key) => {
    lines.push(`${key} = ${value}`);
  });

  return lines.join('\n') + '\n';
}
