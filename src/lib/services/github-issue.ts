/**
 * GitHub Issue-Based Build Service
 *
 * Creates GitHub Issues to trigger the build workflow in MifosLaunchpad.
 * The build workflow monitors for issues with the 'build-request' label
 * and parses the JSON configuration from the issue body.
 */

import { type WizardState } from '@/lib/generators';
import { type OrganizationInfo, type V3AuthType } from '@/types/wizard';

// MifosLaunchpad repository info
const LAUNCHPAD_OWNER = 'openMF';
const LAUNCHPAD_REPO = 'mifos-x-launchpad';
const BUILD_REQUEST_LABEL = 'build-request';

/**
 * Build configuration that gets submitted as an issue
 */
export interface V3BuildConfig {
  id: string;
  version: string;
  createdAt: string;
  auth: {
    type: V3AuthType;
    email: string;
    userId?: string;
  };
  organization: OrganizationInfo;
  baseApp: string;
  project: {
    name: string;
    displayName: string;
    packageName: string;
    description: string;
    version: string;
  };
  branding: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    darkMode: boolean;
  };
  icon: {
    source: string | null; // base64 encoded
    shape: string;
    backgroundColor: string;
    padding: number;
  };
  platforms: {
    android: boolean;
    ios: boolean;
    desktop: {
      enabled: boolean;
      windows: boolean;
      macos: boolean;
      linux: boolean;
    };
    web: boolean;
  };
  serverConfig?: {
    protocol: string;
    host: string;
    port: number;
    apiPath: string;
  };
}

/**
 * Issue creation result
 */
export interface BuildIssueResult {
  success: boolean;
  issueNumber?: number;
  issueUrl?: string;
  htmlUrl?: string;
  error?: string;
}

/**
 * Build status from issue labels
 */
export type BuildStatus =
  | 'pending'      // build-request label, waiting
  | 'building'     // building label added
  | 'complete'     // build-complete label
  | 'failed'       // build-failed label
  | 'unknown';

/**
 * Build info from GitHub issue
 */
export interface BuildInfo {
  issueNumber: number;
  issueUrl: string;
  status: BuildStatus;
  createdAt: string;
  updatedAt: string;
  releaseUrl?: string;
  comments: Array<{
    body: string;
    createdAt: string;
  }>;
}

/**
 * Generate a unique build ID
 */
export function generateBuildId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${random}`;
}

/**
 * Convert wizard state to V3 build config
 */
export function wizardStateToConfig(
  wizardState: WizardState,
  organization: OrganizationInfo,
  authType: V3AuthType,
  email: string,
  userId?: string
): V3BuildConfig {
  const buildId = generateBuildId();

  // Map selected app to base app name
  const baseAppMap: Record<string, string> = {
    'mobile-wallet': 'mobile-wallet',
    'mifos-mobile': 'mifos-mobile',
  };

  const baseApp = baseAppMap[wizardState.step1.selectedApp || ''] || 'mobile-wallet';

  // Get icon as base64 from generated icons
  let iconSource: string | null = null;
  if (wizardState.step4.generatedIcons?.android?.['512']) {
    iconSource = wizardState.step4.generatedIcons.android['512'];
  } else if (wizardState.step4.generatedIcons?.android?.['192']) {
    iconSource = wizardState.step4.generatedIcons.android['192'];
  }

  return {
    id: buildId,
    version: '3.0',
    createdAt: new Date().toISOString(),
    auth: {
      type: authType,
      email,
      userId,
    },
    organization,
    baseApp,
    project: {
      name: wizardState.step2.projectName,
      displayName: wizardState.step2.displayName || wizardState.step2.projectName,
      packageName: wizardState.step2.packageName,
      description: wizardState.step2.description || 'Mobile banking application',
      version: wizardState.step2.versionName,
    },
    branding: {
      primaryColor: wizardState.step3.colors.primary,
      secondaryColor: wizardState.step3.colors.secondary,
      accentColor: wizardState.step3.colors.accent,
      darkMode: wizardState.step3.darkModeEnabled,
    },
    icon: {
      source: iconSource,
      shape: wizardState.step4.iconShape,
      backgroundColor: '#ffffff', // Default white background
      padding: 10, // Default padding
    },
    platforms: {
      android: wizardState.step6.platforms.android.enabled,
      ios: wizardState.step6.platforms.ios.enabled,
      desktop: {
        enabled: wizardState.step6.platforms.desktop.enabled,
        windows: wizardState.step6.platforms.desktop.windows,
        macos: wizardState.step6.platforms.desktop.macos,
        linux: wizardState.step6.platforms.desktop.linux,
      },
      web: wizardState.step6.platforms.web.enabled,
    },
    // Note: Server config is runtime-only, extracted from baseUrl if available
    serverConfig: undefined, // Server config is not persisted in V3
  };
}

/**
 * Format build config as issue body
 */
export function formatIssueBody(config: V3BuildConfig): string {
  return `## Build Request

**Organization**: ${config.organization.name}
**Project**: ${config.project.displayName}
**Package**: \`${config.project.packageName}\`
**Version**: ${config.project.version}
**Base App**: ${config.baseApp}

### Platforms
- Android: ${config.platforms.android ? '✅' : '❌'}
- iOS: ${config.platforms.ios ? '✅' : '❌'}
- Desktop: ${config.platforms.desktop.enabled ? '✅' : '❌'}
- Web: ${config.platforms.web ? '✅' : '❌'}

---

\`\`\`json
${JSON.stringify(config, null, 2)}
\`\`\`

---
*Submitted via [MifosLaunchpad](https://openmf.github.io/mifos-x-launchpad)*
`;
}

/**
 * Create a build request issue in the MifosLaunchpad repository
 *
 * This requires a GitHub token with repo scope for private repos
 * or public_repo scope for public repos.
 */
export async function createBuildIssue(
  accessToken: string,
  config: V3BuildConfig
): Promise<BuildIssueResult> {
  const issueTitle = `Build Request - ${config.project.displayName} - ${config.id}`;
  const issueBody = formatIssueBody(config);

  try {
    const response = await fetch(
      `https://api.github.com/repos/${LAUNCHPAD_OWNER}/${LAUNCHPAD_REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: [BUILD_REQUEST_LABEL],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.message || `Failed to create issue: ${response.status}`,
      };
    }

    const data = await response.json();

    return {
      success: true,
      issueNumber: data.number,
      issueUrl: data.url,
      htmlUrl: data.html_url,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create build issue',
    };
  }
}

/**
 * Get build status from issue
 */
export async function getBuildStatus(
  accessToken: string,
  issueNumber: number
): Promise<BuildInfo | null> {
  try {
    // Fetch issue details
    const issueResponse = await fetch(
      `https://api.github.com/repos/${LAUNCHPAD_OWNER}/${LAUNCHPAD_REPO}/issues/${issueNumber}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!issueResponse.ok) {
      return null;
    }

    const issue = await issueResponse.json();

    // Determine status from labels
    const labels = issue.labels.map((l: { name: string }) => l.name);
    let status: BuildStatus = 'pending';

    if (labels.includes('build-complete')) {
      status = 'complete';
    } else if (labels.includes('build-failed')) {
      status = 'failed';
    } else if (labels.includes('building')) {
      status = 'building';
    } else if (labels.includes('build-request')) {
      status = 'pending';
    } else {
      status = 'unknown';
    }

    // Fetch comments to find release URL
    const commentsResponse = await fetch(
      `https://api.github.com/repos/${LAUNCHPAD_OWNER}/${LAUNCHPAD_REPO}/issues/${issueNumber}/comments`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    let comments: Array<{ body: string; createdAt: string }> = [];
    let releaseUrl: string | undefined;

    if (commentsResponse.ok) {
      const commentsData = await commentsResponse.json();
      comments = commentsData.map((c: { body: string; created_at: string }) => ({
        body: c.body,
        createdAt: c.created_at,
      }));

      // Look for release URL in comments
      for (const comment of commentsData) {
        const releaseMatch = comment.body.match(/\[(?:View )?Release\]\((https:\/\/github\.com\/[^)]+\/releases\/[^)]+)\)/);
        if (releaseMatch) {
          releaseUrl = releaseMatch[1];
          break;
        }
      }
    }

    return {
      issueNumber: issue.number,
      issueUrl: issue.html_url,
      status,
      createdAt: issue.created_at,
      updatedAt: issue.updated_at,
      releaseUrl,
      comments,
    };
  } catch {
    return null;
  }
}

/**
 * Poll for build completion
 */
export async function pollBuildStatus(
  accessToken: string,
  issueNumber: number,
  onStatusChange: (info: BuildInfo) => void,
  options: {
    interval?: number;  // ms between polls
    timeout?: number;   // max time to poll
  } = {}
): Promise<BuildInfo | null> {
  const { interval = 15000, timeout = 600000 } = options; // Default: 15s interval, 10min timeout
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    const info = await getBuildStatus(accessToken, issueNumber);

    if (info) {
      onStatusChange(info);

      if (info.status === 'complete' || info.status === 'failed') {
        return info;
      }
    }

    await new Promise(resolve => setTimeout(resolve, interval));
  }

  return null;
}

/**
 * Check if user can create issues (has appropriate permissions)
 */
export async function canCreateIssues(accessToken: string): Promise<boolean> {
  try {
    // Check if user has permission to create issues by checking repo permissions
    const response = await fetch(
      `https://api.github.com/repos/${LAUNCHPAD_OWNER}/${LAUNCHPAD_REPO}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      return false;
    }

    const repo = await response.json();

    // Public repos allow anyone to create issues
    // For private repos, check permissions
    return !repo.private || repo.permissions?.push || repo.permissions?.admin;
  } catch {
    return false;
  }
}

/**
 * Get user's recent build issues
 */
export async function getUserBuildIssues(
  accessToken: string,
  email: string,
  limit: number = 10
): Promise<BuildInfo[]> {
  try {
    // Search for issues created by this user's email
    const response = await fetch(
      `https://api.github.com/repos/${LAUNCHPAD_OWNER}/${LAUNCHPAD_REPO}/issues?labels=${BUILD_REQUEST_LABEL}&state=all&per_page=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    );

    if (!response.ok) {
      return [];
    }

    const issues = await response.json();

    // Filter to issues matching the email (from issue body)
    const userIssues = issues.filter((issue: { body: string }) => {
      try {
        const jsonMatch = issue.body.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
          const config = JSON.parse(jsonMatch[1]) as V3BuildConfig;
          return config.auth.email === email;
        }
      } catch {
        // Ignore parse errors
      }
      return false;
    });

    // Map to BuildInfo
    return userIssues.map((issue: {
      number: number;
      html_url: string;
      created_at: string;
      updated_at: string;
      labels: Array<{ name: string }>;
    }) => {
      const labels = issue.labels.map((l) => l.name);
      let status: BuildStatus = 'pending';

      if (labels.includes('build-complete')) {
        status = 'complete';
      } else if (labels.includes('build-failed')) {
        status = 'failed';
      } else if (labels.includes('building')) {
        status = 'building';
      }

      return {
        issueNumber: issue.number,
        issueUrl: issue.html_url,
        status,
        createdAt: issue.created_at,
        updatedAt: issue.updated_at,
        comments: [],
      };
    });
  } catch {
    return [];
  }
}
