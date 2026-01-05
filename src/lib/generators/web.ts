/**
 * Web Generator
 * Customizes cmp-web HTML files for project generation
 */

import {
  type WebStringReplacements,
  type GeneratedContent,
  type GeneratorResult,
} from '@/types/wizard';

/**
 * Default paths for web HTML files
 */
export const WEB_HTML_PATHS = {
  /** JS Main index.html (full meta tags) */
  JS_MAIN: 'cmp-web/src/jsMain/resources/index.html',
  /** WASM JS Main index.html (minimal) */
  WASM_JS_MAIN: 'cmp-web/src/wasmJsMain/resources/index.html',
} as const;

/**
 * Default meta tag values in the original mifos-mobile project
 */
const ORIGINAL_VALUES = {
  DISPLAY_NAME: 'Mifos Mobile',
  PROJECT_NAME: 'mifos-mobile',
  DESCRIPTION: 'A Kotlin Multiplatform application based on top of Fineract.',
  ORGANIZATION: 'Mifos Initiative',
  KEYWORDS: 'mifos, mobile, mobile-pay, Mobile, mifos Mobile',
} as const;

/**
 * Escape special HTML characters in a string
 *
 * @param value - String to escape
 * @returns Escaped string safe for HTML
 */
export function escapeHtmlString(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Replace the <title> tag content
 *
 * @param content - Original HTML content
 * @param newTitle - New title value
 * @returns Modified HTML content
 */
export function replaceTitle(content: string, newTitle: string): string {
  const escapedTitle = escapeHtmlString(newTitle);
  return content.replace(/<title>([^<]*)<\/title>/g, `<title>${escapedTitle}</title>`);
}

/**
 * Replace a meta tag content by name attribute
 *
 * @param content - Original HTML content
 * @param name - Meta tag name attribute
 * @param newValue - New content value
 * @returns Modified HTML content
 */
export function replaceMetaByName(
  content: string,
  name: string,
  newValue: string
): string {
  const escapedValue = escapeHtmlString(newValue);
  // Match meta tags with name="name" or name='name'
  const regex = new RegExp(
    `(<meta\\s+name=['"]${name}['"]\\s+content=['"])([^'"]*)(["'][^>]*>)`,
    'gi'
  );

  if (!regex.test(content)) {
    return content;
  }

  regex.lastIndex = 0;
  return content.replace(regex, `$1${escapedValue}$3`);
}

/**
 * Replace a meta tag content by property attribute (Open Graph)
 *
 * @param content - Original HTML content
 * @param property - Meta tag property attribute
 * @param newValue - New content value
 * @returns Modified HTML content
 */
export function replaceMetaByProperty(
  content: string,
  property: string,
  newValue: string
): string {
  const escapedValue = escapeHtmlString(newValue);
  // Match meta tags with property="property" or property='property'
  const regex = new RegExp(
    `(<meta\\s+property=['"]${property}['"]\\s+content=['"])([^'"]*)(["'][^>]*>)`,
    'gi'
  );

  if (!regex.test(content)) {
    return content;
  }

  regex.lastIndex = 0;
  return content.replace(regex, `$1${escapedValue}$3`);
}

/**
 * Replace all occurrences of text in HTML content
 * Used for bulk rebranding (e.g., "Mifos Mobile" -> "MyBank App")
 *
 * @param content - HTML content
 * @param searchText - Text to search for
 * @param replaceText - Text to replace with
 * @param caseSensitive - Whether to match case
 * @returns Modified HTML content
 */
export function replaceTextInHtml(
  content: string,
  searchText: string,
  replaceText: string,
  caseSensitive: boolean = false
): string {
  if (caseSensitive) {
    return content.split(searchText).join(replaceText);
  }

  const escapedSearch = searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedSearch, 'gi');
  return content.replace(regex, replaceText);
}

/**
 * Apply all web string replacements to HTML content
 *
 * @param content - Original HTML content
 * @param replacements - Web string replacements
 * @returns Modified HTML content
 */
export function applyWebStringReplacements(
  content: string,
  replacements: WebStringReplacements
): string {
  let result = content;

  // Replace title
  result = replaceTitle(result, replacements.displayName);

  // Replace display name in all occurrences
  result = replaceTextInHtml(result, ORIGINAL_VALUES.DISPLAY_NAME, replacements.displayName);

  // Replace project name in all occurrences (lowercase)
  if (replacements.projectName.toLowerCase() !== ORIGINAL_VALUES.PROJECT_NAME.toLowerCase()) {
    result = replaceTextInHtml(result, ORIGINAL_VALUES.PROJECT_NAME, replacements.projectName.toLowerCase());
  }

  // Replace description if provided
  if (replacements.description) {
    result = replaceMetaByName(result, 'description', replacements.description);
    result = replaceMetaByProperty(result, 'og:description', replacements.description);
    result = replaceMetaByName(result, 'twitter:description', replacements.description);
  }

  // Replace organization/author if provided
  if (replacements.organizationName) {
    result = replaceMetaByName(result, 'author', replacements.organizationName);
    result = replaceMetaByName(result, 'copyright', replacements.copyright || replacements.organizationName);
    result = replaceTextInHtml(result, ORIGINAL_VALUES.ORGANIZATION, replacements.organizationName);
  }

  // Replace keywords if provided
  if (replacements.keywords && replacements.keywords.length > 0) {
    result = replaceMetaByName(result, 'keywords', replacements.keywords.join(', '));
  }

  // Replace Open Graph URL if provided
  if (replacements.ogUrl) {
    result = replaceMetaByProperty(result, 'og:url', replacements.ogUrl);
  }

  // Replace Open Graph image if provided
  if (replacements.ogImage) {
    result = replaceMetaByProperty(result, 'og:image', replacements.ogImage);
    result = replaceMetaByName(result, 'twitter:image', replacements.ogImage);
  }

  // Replace Open Graph site name with display name
  result = replaceMetaByProperty(result, 'og:site_name', replacements.displayName);

  // Replace Twitter title
  result = replaceMetaByName(result, 'twitter:title', replacements.displayName);

  // Replace apple-mobile-web-app-title
  result = replaceMetaByName(result, 'apple-mobile-web-app-title', replacements.displayName);

  // Replace subject
  result = replaceMetaByName(result, 'subject', replacements.displayName);

  // Apply custom meta tags
  if (replacements.customMeta) {
    for (const [name, value] of Object.entries(replacements.customMeta)) {
      result = replaceMetaByName(result, name, value);
    }
  }

  return result;
}

/**
 * Generate customized HTML content for JS Main index.html
 *
 * @param originalContent - Original HTML file content
 * @param replacements - Values to replace
 * @param path - File path for the generated content
 * @returns Generated file result
 */
export function generateJsMainHtml(
  originalContent: string,
  replacements: WebStringReplacements,
  path: string = WEB_HTML_PATHS.JS_MAIN
): GeneratedContent {
  const content = applyWebStringReplacements(originalContent, replacements);

  return {
    path,
    content,
    originalContent,
  };
}

/**
 * Generate customized HTML content for WASM JS Main index.html
 * This file has fewer meta tags
 *
 * @param originalContent - Original HTML file content
 * @param replacements - Values to replace
 * @param path - File path for the generated content
 * @returns Generated file result
 */
export function generateWasmJsMainHtml(
  originalContent: string,
  replacements: WebStringReplacements,
  path: string = WEB_HTML_PATHS.WASM_JS_MAIN
): GeneratedContent {
  // WASM main only has title tag
  let content = replaceTitle(originalContent, replacements.displayName);

  // Also replace any text occurrences
  content = replaceTextInHtml(content, ORIGINAL_VALUES.DISPLAY_NAME, replacements.displayName);

  return {
    path,
    content,
    originalContent,
  };
}

/**
 * Validate web string replacements configuration
 *
 * @param replacements - Replacements to validate
 * @returns Array of validation errors (empty if valid)
 */
export function validateWebStringReplacements(
  replacements: WebStringReplacements
): string[] {
  const errors: string[] = [];

  // Validate projectName
  if (!replacements.projectName || replacements.projectName.trim().length === 0) {
    errors.push('Project name is required');
  } else if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(replacements.projectName)) {
    errors.push('Project name must start with a letter and contain only letters, numbers, hyphens, or underscores');
  }

  // Validate displayName
  if (!replacements.displayName || replacements.displayName.trim().length === 0) {
    errors.push('Display name is required');
  } else if (replacements.displayName.length > 50) {
    errors.push('Display name should be 50 characters or less');
  }

  // Validate ogUrl if provided
  if (replacements.ogUrl) {
    try {
      new URL(replacements.ogUrl);
    } catch {
      errors.push('Open Graph URL must be a valid URL');
    }
  }

  // Validate ogImage if provided
  if (replacements.ogImage) {
    try {
      new URL(replacements.ogImage);
    } catch {
      errors.push('Open Graph image URL must be a valid URL');
    }
  }

  return errors;
}

/**
 * Extract current values from HTML content
 *
 * @param content - HTML file content
 * @returns Current values from the file
 */
export function extractHtmlValues(
  content: string
): Partial<WebStringReplacements> {
  const result: Partial<WebStringReplacements> = {};

  // Extract title
  const titleMatch = content.match(/<title>([^<]*)<\/title>/);
  if (titleMatch) {
    result.displayName = titleMatch[1];
  }

  // Extract description
  const descMatch = content.match(/<meta\s+name=['"]description['"]\s+content=['"]([^'"]*)['"]/);
  if (descMatch) {
    result.description = descMatch[1];
  }

  // Extract author/organization
  const authorMatch = content.match(/<meta\s+name=['"]author['"]\s+content=['"]([^'"]*)['"]/);
  if (authorMatch) {
    result.organizationName = authorMatch[1];
  }

  // Extract keywords
  const keywordsMatch = content.match(/<meta\s+name=['"]keywords['"]\s+content=['"]([^'"]*)['"]/);
  if (keywordsMatch) {
    result.keywords = keywordsMatch[1].split(',').map(k => k.trim());
  }

  // Extract og:url
  const ogUrlMatch = content.match(/<meta\s+property=['"]og:url['"]\s+content=['"]([^'"]*)['"]/);
  if (ogUrlMatch) {
    result.ogUrl = ogUrlMatch[1];
  }

  // Extract og:image
  const ogImageMatch = content.match(/<meta\s+property=['"]og:image['"]\s+content=['"]([^'"]*)['"]/);
  if (ogImageMatch) {
    result.ogImage = ogImageMatch[1];
  }

  return result;
}

/**
 * Generate web HTML files
 * Main entry point for web HTML generation
 *
 * @param jsMainContent - Original JS Main index.html content
 * @param wasmJsMainContent - Original WASM JS Main index.html content
 * @param replacements - Values to use for generation
 * @returns Generator result with files and any errors
 */
export function generateWebFiles(
  jsMainContent: string,
  wasmJsMainContent: string,
  replacements: WebStringReplacements
): GeneratorResult {
  const result: GeneratorResult = {
    files: [],
    errors: [],
    warnings: [],
  };

  // Validate replacements
  const validationErrors = validateWebStringReplacements(replacements);
  if (validationErrors.length > 0) {
    result.errors.push(...validationErrors);
    return result;
  }

  // Generate JS Main index.html
  try {
    const jsMainFile = generateJsMainHtml(jsMainContent, replacements);
    result.files.push(jsMainFile);
  } catch (error) {
    result.errors.push(
      `Failed to generate JS Main index.html: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  // Generate WASM JS Main index.html
  try {
    const wasmJsMainFile = generateWasmJsMainHtml(wasmJsMainContent, replacements);
    result.files.push(wasmJsMainFile);
  } catch (error) {
    result.errors.push(
      `Failed to generate WASM JS Main index.html: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }

  return result;
}

/**
 * Create web string replacements from wizard state
 * Helper to convert Step 2 form data to web replacements
 *
 * @param step2 - Step 2 form state
 * @returns Web string replacements configuration
 */
export function createWebReplacementsFromWizard(
  step2: {
    projectName: string;
    displayName: string;
    description?: string;
    organizationName?: string;
    organizationWebsite?: string;
  }
): WebStringReplacements {
  return {
    projectName: step2.projectName,
    displayName: step2.displayName,
    description: step2.description,
    organizationName: step2.organizationName,
    ogUrl: step2.organizationWebsite,
  };
}

/**
 * Preview diff of web HTML changes
 * Returns descriptions of changes that will be made
 *
 * @param originalContent - Original HTML content
 * @param replacements - Replacements to apply
 * @returns Array of change descriptions
 */
export function previewWebHtmlChanges(
  originalContent: string,
  replacements: WebStringReplacements
): string[] {
  const changes: string[] = [];
  const currentValues = extractHtmlValues(originalContent);

  if (currentValues.displayName !== replacements.displayName) {
    changes.push(
      `title: "${currentValues.displayName || ''}" -> "${replacements.displayName}"`
    );
  }

  if (replacements.description && currentValues.description !== replacements.description) {
    changes.push(
      `description: "${currentValues.description || ''}" -> "${replacements.description}"`
    );
  }

  if (replacements.organizationName && currentValues.organizationName !== replacements.organizationName) {
    changes.push(
      `author: "${currentValues.organizationName || ''}" -> "${replacements.organizationName}"`
    );
  }

  if (replacements.ogUrl && currentValues.ogUrl !== replacements.ogUrl) {
    changes.push(
      `og:url: "${currentValues.ogUrl || ''}" -> "${replacements.ogUrl}"`
    );
  }

  if (replacements.ogImage && currentValues.ogImage !== replacements.ogImage) {
    changes.push(
      `og:image: "${currentValues.ogImage || ''}" -> "${replacements.ogImage}"`
    );
  }

  return changes;
}
