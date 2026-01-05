/**
 * Android Generator
 * Customizes Android strings.xml files for project generation
 */

import {
  type AndroidStringReplacements,
  type GeneratedContent,
  type GeneratorResult,
} from '@/types/wizard';

/**
 * Standard string resource names that we replace
 */
const STRING_RESOURCE_NAMES = {
  APP_NAME: 'app_name',
  FEATURE_ABOUT_APP_NAME: 'feature_about_app_name',
  HELP_LINE_NUMBER: 'help_line_number',
  CONTACT_EMAIL: 'contact_email',
} as const;

/**
 * Default paths for strings.xml files in different project structures
 */
export const ANDROID_STRINGS_PATHS = [
  'cmp-android/src/main/res/values/strings.xml',
  'app/src/main/res/values/strings.xml',
  'core/ui/src/main/res/values/strings.xml',
  'feature/about/src/main/res/values/strings.xml',
] as const;

/**
 * Escape special XML characters in a string value
 *
 * @param value - String to escape
 * @returns Escaped string safe for XML
 */
export function escapeXmlString(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, "\\'"); // Android uses \' for apostrophes in strings.xml
}

/**
 * Replace a string resource value in XML content
 *
 * @param content - Original XML content
 * @param name - String resource name (e.g., 'app_name')
 * @param newValue - New value for the string
 * @returns Modified XML content
 */
export function replaceStringResource(
  content: string,
  name: string,
  newValue: string
): string {
  // Match: <string name="name">value</string> or <string name="name" translatable="false">value</string>
  const regex = new RegExp(
    `(<string\\s+name="${name}"[^>]*>)([^<]*)(</string>)`,
    'g'
  );

  const escapedValue = escapeXmlString(newValue);

  if (!regex.test(content)) {
    return content;
  }

  // Reset regex state and replace
  regex.lastIndex = 0;
  return content.replace(regex, `$1${escapedValue}$3`);
}

/**
 * Apply multiple string replacements to XML content
 *
 * @param content - Original XML content
 * @param replacements - String replacements to apply
 * @returns Modified XML content
 */
export function applyAndroidStringReplacements(
  content: string,
  replacements: AndroidStringReplacements
): string {
  let result = content;

  // Replace app_name
  result = replaceStringResource(
    result,
    STRING_RESOURCE_NAMES.APP_NAME,
    replacements.appName
  );

  // Replace feature_about_app_name if provided
  if (replacements.featureAboutAppName) {
    result = replaceStringResource(
      result,
      STRING_RESOURCE_NAMES.FEATURE_ABOUT_APP_NAME,
      replacements.featureAboutAppName
    );
  } else {
    // Use appName as fallback for about screen
    result = replaceStringResource(
      result,
      STRING_RESOURCE_NAMES.FEATURE_ABOUT_APP_NAME,
      replacements.appName
    );
  }

  // Replace help_line_number if provided
  if (replacements.helpLineNumber) {
    result = replaceStringResource(
      result,
      STRING_RESOURCE_NAMES.HELP_LINE_NUMBER,
      replacements.helpLineNumber
    );
  }

  // Replace contact_email if provided
  if (replacements.contactEmail) {
    result = replaceStringResource(
      result,
      STRING_RESOURCE_NAMES.CONTACT_EMAIL,
      replacements.contactEmail
    );
  }

  // Apply custom string replacements
  if (replacements.customStrings) {
    for (const [name, value] of Object.entries(replacements.customStrings)) {
      result = replaceStringResource(result, name, value);
    }
  }

  return result;
}

/**
 * Generate customized strings.xml content
 *
 * @param originalContent - Original XML file content
 * @param replacements - Values to replace
 * @param path - File path for the generated content
 * @returns Generated file result
 */
export function generateStringsXml(
  originalContent: string,
  replacements: AndroidStringReplacements,
  path: string = ANDROID_STRINGS_PATHS[0]
): GeneratedContent {
  const content = applyAndroidStringReplacements(originalContent, replacements);

  return {
    path,
    content,
    originalContent,
  };
}

/**
 * Validate Android string replacements configuration
 *
 * @param replacements - Replacements to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateAndroidStringReplacements(
  replacements: AndroidStringReplacements
): string[] {
  const errors: string[] = [];

  // Validate appName
  if (!replacements.appName || replacements.appName.trim().length === 0) {
    errors.push('App name is required');
  } else if (replacements.appName.length > 50) {
    errors.push('App name should be 50 characters or less');
  }

  // Validate helpLineNumber format (optional)
  if (replacements.helpLineNumber) {
    // Allow digits, spaces, hyphens, parentheses, and plus sign
    if (!/^[\d\s\-()+ ]+$/.test(replacements.helpLineNumber)) {
      errors.push('Help line number contains invalid characters');
    }
  }

  // Validate contactEmail format (optional)
  if (replacements.contactEmail) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(replacements.contactEmail)) {
      errors.push('Contact email format is invalid');
    }
  }

  return errors;
}

/**
 * Extract current string values from XML content
 *
 * @param content - XML file content
 * @returns Current string values from the file
 */
export function extractStringValues(
  content: string
): Partial<AndroidStringReplacements> {
  const result: Partial<AndroidStringReplacements> = {};

  const extractValue = (name: string): string | undefined => {
    const regex = new RegExp(`<string\\s+name="${name}"[^>]*>([^<]*)</string>`);
    const match = content.match(regex);
    return match ? match[1] : undefined;
  };

  result.appName = extractValue(STRING_RESOURCE_NAMES.APP_NAME);
  result.featureAboutAppName = extractValue(STRING_RESOURCE_NAMES.FEATURE_ABOUT_APP_NAME);
  result.helpLineNumber = extractValue(STRING_RESOURCE_NAMES.HELP_LINE_NUMBER);
  result.contactEmail = extractValue(STRING_RESOURCE_NAMES.CONTACT_EMAIL);

  return result;
}

/**
 * Find all string resources containing a specific text
 * Useful for finding all Mifos-branded strings
 *
 * @param content - XML file content
 * @param searchText - Text to search for (case-insensitive)
 * @returns Map of string name to current value
 */
export function findStringsContaining(
  content: string,
  searchText: string
): Map<string, string> {
  const results = new Map<string, string>();
  const regex = /<string\s+name="([^"]+)"[^>]*>([^<]*)</g;
  const searchLower = searchText.toLowerCase();

  let match;
  while ((match = regex.exec(content)) !== null) {
    const [, name, value] = match;
    if (value.toLowerCase().includes(searchLower)) {
      results.set(name, value);
    }
  }

  return results;
}

/**
 * Replace all occurrences of a text in string values
 * Useful for bulk rebranding (e.g., "Mifos" -> "MyBank")
 *
 * @param content - XML file content
 * @param searchText - Text to search for
 * @param replaceText - Text to replace with
 * @param caseSensitive - Whether to match case
 * @returns Modified XML content
 */
export function replaceTextInAllStrings(
  content: string,
  searchText: string,
  replaceText: string,
  caseSensitive: boolean = false
): string {
  const regex = /(<string\s+name="[^"]+">)([^<]*)(<\/string>)/g;

  return content.replace(regex, (match, opening, value, closing) => {
    let newValue: string;
    if (caseSensitive) {
      newValue = value.split(searchText).join(replaceText);
    } else {
      const searchRegex = new RegExp(escapeRegexString(searchText), 'gi');
      newValue = value.replace(searchRegex, replaceText);
    }
    return opening + newValue + closing;
  });
}

/**
 * Escape special regex characters
 */
function escapeRegexString(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate Android string files
 * Main entry point for Android string generation
 *
 * @param originalContent - Original strings.xml content
 * @param replacements - Values to use for generation
 * @param path - File path for the output
 * @returns Generator result with files and any errors
 */
export function generateAndroidFiles(
  originalContent: string,
  replacements: AndroidStringReplacements,
  path: string = ANDROID_STRINGS_PATHS[0]
): GeneratorResult {
  const result: GeneratorResult = {
    files: [],
    errors: [],
    warnings: [],
  };

  // Validate replacements
  const validationErrors = validateAndroidStringReplacements(replacements);
  if (validationErrors.length > 0) {
    result.errors.push(...validationErrors);
    return result;
  }

  // Extract current values for comparison
  const currentValues = extractStringValues(originalContent);

  // Check if app_name exists in the file
  if (!currentValues.appName) {
    result.warnings.push('No app_name string found in the original file');
  }

  // Generate strings.xml
  try {
    const stringsFile = generateStringsXml(originalContent, replacements, path);
    result.files.push(stringsFile);
  } catch (error) {
    result.errors.push(
      `Failed to generate strings.xml: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Create Android string replacements from wizard state
 * Helper to convert Step 2 and Step 7 form data to Android replacements
 *
 * @param step2 - Step 2 form state
 * @param step7 - Step 7 form state (optional, for support info)
 * @returns Android string replacements configuration
 */
export function createAndroidReplacementsFromWizard(
  step2: {
    displayName: string;
    supportEmail: string;
  },
  step7?: {
    supportPhone?: string;
  }
): AndroidStringReplacements {
  return {
    appName: step2.displayName,
    featureAboutAppName: step2.displayName,
    contactEmail: step2.supportEmail || undefined,
    helpLineNumber: step7?.supportPhone || undefined,
  };
}

/**
 * Preview diff of Android string changes
 * Returns descriptions of changes that will be made
 *
 * @param originalContent - Original XML content
 * @param replacements - Replacements to apply
 * @returns Array of change descriptions
 */
export function previewAndroidStringChanges(
  originalContent: string,
  replacements: AndroidStringReplacements
): string[] {
  const changes: string[] = [];
  const currentValues = extractStringValues(originalContent);

  if (currentValues.appName !== replacements.appName) {
    changes.push(
      `app_name: "${currentValues.appName || ''}" → "${replacements.appName}"`
    );
  }

  const aboutName = replacements.featureAboutAppName || replacements.appName;
  if (currentValues.featureAboutAppName !== aboutName) {
    changes.push(
      `feature_about_app_name: "${currentValues.featureAboutAppName || ''}" → "${aboutName}"`
    );
  }

  if (replacements.helpLineNumber && currentValues.helpLineNumber !== replacements.helpLineNumber) {
    changes.push(
      `help_line_number: "${currentValues.helpLineNumber || ''}" → "${replacements.helpLineNumber}"`
    );
  }

  if (replacements.contactEmail && currentValues.contactEmail !== replacements.contactEmail) {
    changes.push(
      `contact_email: "${currentValues.contactEmail || ''}" → "${replacements.contactEmail}"`
    );
  }

  return changes;
}
