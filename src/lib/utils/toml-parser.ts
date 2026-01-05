/**
 * TOML Parser for libs.versions.toml
 * Extracts SDK and project configuration from Gradle version catalog
 */

import { SDKInfo } from '@/types/wizard';

/**
 * Parse libs.versions.toml content to extract SDK information
 * @param content - Raw TOML file content
 * @returns Parsed SDK information
 */
export function parseLibsVersionsToml(content: string): SDKInfo {
  const values = parseTomlValues(content);

  return {
    // Kotlin & Compose versions
    kotlin: values['kotlin'] || 'unknown',
    compose: values['compose-plugin'] || values['jetbrainsCompose'] || values['composePlugin'] || 'unknown',
    androidGradlePlugin: values['androidGradlePlugin'] || values['agp'] || 'unknown',

    // Android SDK versions
    minAndroidSdk: parseIntSafe(values['minSdk'] || values['androidMinSdk'], 24),
    targetAndroidSdk: parseIntSafe(
      values['targetSdk'] || values['compileSdk'] || values['androidCompileSdk'],
      34
    ),

    // iOS version
    minIosVersion: values['iosDeploymentTarget'] || values['iosMinVersion'] || '15.0',

    // Package information
    packageName: values['packageName'] || '',
    packageNamespace: values['packageNamespace'] || values['androidPackageNamespace'] || '',
    packageVersion: values['packageVersion'] || values['appVersion'] || '1.0.0',
  };
}

/**
 * Parse TOML content into key-value pairs
 * Handles [sections] and key = "value" format
 */
function parseTomlValues(content: string): Record<string, string> {
  const values: Record<string, string> = {};
  const lines = content.split('\n');

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    // Check for section headers like [versions]
    const sectionMatch = trimmed.match(/^\[([^\]]+)\]$/);
    if (sectionMatch) {
      currentSection = sectionMatch[1];
      continue;
    }

    // Parse key = "value" or key = value
    const keyValueMatch = trimmed.match(/^([a-zA-Z0-9_-]+)\s*=\s*(.+)$/);
    if (keyValueMatch) {
      const key = keyValueMatch[1];
      let value = keyValueMatch[2].trim();

      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }

      // Store with and without section prefix for flexible lookup
      values[key] = value;
      if (currentSection) {
        values[`${currentSection}.${key}`] = value;
      }
    }
  }

  return values;
}

/**
 * Safely parse integer with fallback
 */
function parseIntSafe(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

/**
 * Extract specific version from TOML content
 * @param content - Raw TOML content
 * @param key - Version key to extract
 * @returns Version string or null
 */
export function extractVersion(content: string, key: string): string | null {
  const values = parseTomlValues(content);
  return values[key] || values[`versions.${key}`] || null;
}

/**
 * Validate if content looks like a valid libs.versions.toml
 */
export function isValidLibsVersionsToml(content: string): boolean {
  // Check for common markers
  const hasVersionsSection = content.includes('[versions]');
  const hasKotlinVersion = /kotlin\s*=/.test(content);

  return hasVersionsSection || hasKotlinVersion;
}
