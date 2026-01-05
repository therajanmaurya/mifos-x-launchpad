/**
 * GitHub API Service
 * Fetch repository contents, create repositories, and manage workflows
 */

import {
  RepoConfig,
  SDKInfo,
  AppType,
  APP_REPOSITORIES,
  GitHubAuthState,
  GitHubRepoOptions,
  RepoCreationResult,
  FileCommitOperation,
  CommitResult,
  WorkflowRunInfo,
  WorkflowRunStatus,
  GitHubArtifact,
} from '@/types/wizard';
import { parseLibsVersionsToml, isValidLibsVersionsToml } from '@/lib/utils/toml-parser';

const GITHUB_API_BASE = 'https://api.github.com';

// ============================================
// Authentication Storage
// ============================================

const AUTH_STORAGE_KEY = 'mifos-launchpad-github-auth';

/**
 * Save GitHub auth state to localStorage (securely)
 * Note: In production, tokens should be stored more securely
 */
export function saveGitHubAuth(auth: GitHubAuthState): void {
  if (typeof window === 'undefined') return;
  try {
    // Don't persist tokens in localStorage for security
    // Only persist non-sensitive info
    const safeAuth = {
      isAuthenticated: auth.isAuthenticated,
      method: auth.method,
      username: auth.username,
      avatarUrl: auth.avatarUrl,
      expiresAt: auth.expiresAt,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeAuth));
  } catch (error) {
    console.warn('Failed to save GitHub auth:', error);
  }
}

/**
 * Load GitHub auth state from localStorage
 */
export function loadGitHubAuth(): Partial<GitHubAuthState> | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load GitHub auth:', error);
  }
  return null;
}

/**
 * Clear GitHub auth from localStorage
 */
export function clearGitHubAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

/**
 * Error thrown when GitHub API request fails
 */
export class GitHubAPIError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: string
  ) {
    super(message);
    this.name = 'GitHubAPIError';
  }
}

/**
 * Fetch raw file contents from a GitHub repository
 * @param config - Repository configuration
 * @param path - File path within the repository
 * @returns Raw file content as string
 */
export async function fetchRepoFile(
  config: RepoConfig,
  path: string
): Promise<string> {
  const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}/contents/${path}?ref=${config.branch}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3.raw',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new GitHubAPIError(
      `Failed to fetch ${path} from ${config.owner}/${config.repo}`,
      response.status,
      errorText
    );
  }

  return response.text();
}

/**
 * Fetch SDK information from a repository's libs.versions.toml
 * @param config - Repository configuration
 * @returns Parsed SDK information
 */
export async function fetchSDKInfoFromRepo(config: RepoConfig): Promise<SDKInfo> {
  const content = await fetchRepoFile(config, config.libsVersionsPath);

  if (!isValidLibsVersionsToml(content)) {
    throw new GitHubAPIError(
      `Invalid libs.versions.toml format in ${config.owner}/${config.repo}`
    );
  }

  return parseLibsVersionsToml(content);
}

/**
 * Fetch SDK information for a specific app type
 * @param appType - The app type to fetch SDK info for
 * @returns Parsed SDK information
 */
export async function fetchSDKInfo(appType: AppType): Promise<SDKInfo> {
  const config = APP_REPOSITORIES[appType];

  if (!config) {
    throw new GitHubAPIError(`Unknown app type: ${appType}`);
  }

  return fetchSDKInfoFromRepo(config);
}

/**
 * Check if a repository exists and is accessible
 * @param config - Repository configuration
 * @returns True if repository is accessible
 */
export async function checkRepoExists(config: RepoConfig): Promise<boolean> {
  const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get repository metadata
 * @param config - Repository configuration
 * @returns Repository metadata or null if not found
 */
export async function getRepoMetadata(config: RepoConfig): Promise<{
  name: string;
  description: string;
  defaultBranch: string;
  stars: number;
  lastUpdated: string;
} | null> {
  const url = `${GITHUB_API_BASE}/repos/${config.owner}/${config.repo}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    return {
      name: data.name,
      description: data.description || '',
      defaultBranch: data.default_branch,
      stars: data.stargazers_count,
      lastUpdated: data.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Fetch multiple files from a repository
 * @param config - Repository configuration
 * @param paths - Array of file paths to fetch
 * @returns Map of path to content
 */
export async function fetchMultipleFiles(
  config: RepoConfig,
  paths: string[]
): Promise<Map<string, string>> {
  const results = new Map<string, string>();

  const fetchPromises = paths.map(async (path) => {
    try {
      const content = await fetchRepoFile(config, path);
      results.set(path, content);
    } catch (error) {
      // Log but don't fail for individual files
      console.warn(`Failed to fetch ${path}:`, error);
    }
  });

  await Promise.all(fetchPromises);

  return results;
}

/**
 * Cache for SDK info to avoid repeated API calls
 */
const sdkInfoCache = new Map<AppType, { info: SDKInfo; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY = 'mifos-launchpad-sdk-cache';

/**
 * SDK cache entry stored in localStorage
 */
interface SDKCacheStorage {
  [appType: string]: {
    info: SDKInfo;
    timestamp: number;
  };
}

/**
 * Load SDK cache from localStorage on initialization
 */
function loadCacheFromStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed: SDKCacheStorage = JSON.parse(stored);
      const now = Date.now();

      // Load valid (non-expired) entries into memory cache
      for (const [appType, entry] of Object.entries(parsed)) {
        if (now - entry.timestamp < CACHE_TTL) {
          sdkInfoCache.set(appType as AppType, entry);
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load SDK cache from localStorage:', error);
  }
}

/**
 * Save SDK cache to localStorage
 */
function saveCacheToStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    const cacheObject: SDKCacheStorage = {};
    sdkInfoCache.forEach((value, key) => {
      cacheObject[key] = value;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cacheObject));
  } catch (error) {
    console.warn('Failed to save SDK cache to localStorage:', error);
  }
}

// Initialize cache from localStorage on module load
if (typeof window !== 'undefined') {
  loadCacheFromStorage();
}

/**
 * Fetch SDK info with caching (in-memory + localStorage persistence)
 * @param appType - The app type to fetch SDK info for
 * @param forceRefresh - Force refresh even if cached
 * @returns Parsed SDK information
 */
export async function fetchSDKInfoCached(
  appType: AppType,
  forceRefresh = false
): Promise<SDKInfo> {
  // Check memory cache first
  const cached = sdkInfoCache.get(appType);

  if (!forceRefresh && cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.info;
  }

  // Fetch fresh data
  const info = await fetchSDKInfo(appType);

  // Update both memory and localStorage cache
  sdkInfoCache.set(appType, {
    info,
    timestamp: Date.now(),
  });
  saveCacheToStorage();

  return info;
}

/**
 * Clear the SDK info cache (both memory and localStorage)
 */
export function clearSDKInfoCache(): void {
  sdkInfoCache.clear();
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Get cached SDK info without fetching (returns null if not cached or expired)
 * @param appType - The app type to check cache for
 * @returns Cached SDK info or null
 */
export function getCachedSDKInfo(appType: AppType): SDKInfo | null {
  const cached = sdkInfoCache.get(appType);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.info;
  }
  return null;
}

/**
 * Check if SDK info is cached and valid for a given app type
 * @param appType - The app type to check
 * @returns True if valid cache exists
 */
export function isSDKInfoCached(appType: AppType): boolean {
  const cached = sdkInfoCache.get(appType);
  return cached !== undefined && Date.now() - cached.timestamp < CACHE_TTL;
}

// ============================================
// Authenticated API Helpers
// ============================================

/**
 * Make an authenticated GitHub API request
 */
async function authenticatedFetch(
  url: string,
  accessToken: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${accessToken}`);
  headers.set('Accept', 'application/vnd.github.v3+json');
  headers.set('X-GitHub-Api-Version', '2022-11-28');

  return fetch(url, {
    ...options,
    headers,
  });
}

// ============================================
// User Authentication
// ============================================

/**
 * Validate a GitHub personal access token and get user info
 * @param token - Personal access token
 * @returns User info if valid, null if invalid
 */
export async function validateToken(token: string): Promise<{
  username: string;
  avatarUrl: string;
  name: string;
} | null> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/user`,
      token
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return {
      username: data.login,
      avatarUrl: data.avatar_url,
      name: data.name || data.login,
    };
  } catch {
    return null;
  }
}

/**
 * Check required scopes for a token
 * @param token - Personal access token
 * @returns List of scopes
 */
export async function getTokenScopes(token: string): Promise<string[]> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/user`,
      token
    );

    const scopes = response.headers.get('x-oauth-scopes');
    if (scopes) {
      return scopes.split(',').map(s => s.trim());
    }
    return [];
  } catch {
    return [];
  }
}

/**
 * Check if token has required scopes for repo creation
 */
export async function hasRequiredScopes(token: string): Promise<{
  hasScopes: boolean;
  missingScopes: string[];
}> {
  const requiredScopes = ['repo', 'workflow'];
  const scopes = await getTokenScopes(token);

  // 'repo' scope includes all repo permissions
  // Check for either exact match or parent scope
  const hasRepo = scopes.includes('repo') || scopes.includes('public_repo');
  const hasWorkflow = scopes.includes('workflow');

  const missing: string[] = [];
  if (!hasRepo) missing.push('repo');
  if (!hasWorkflow) missing.push('workflow');

  return {
    hasScopes: missing.length === 0,
    missingScopes: missing,
  };
}

// ============================================
// Repository Creation
// ============================================

/**
 * Create a new GitHub repository
 * @param accessToken - GitHub access token
 * @param options - Repository creation options
 * @returns Creation result
 */
export async function createRepository(
  accessToken: string,
  options: GitHubRepoOptions
): Promise<RepoCreationResult> {
  try {
    // If using a template, use the template endpoint
    if (options.templateOwner && options.templateRepo) {
      return createFromTemplate(accessToken, options);
    }

    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/user/repos`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          name: options.name,
          description: options.description,
          private: options.visibility === 'private',
          auto_init: options.initReadme,
          license_template: options.license,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        repoUrl: null,
        cloneUrl: null,
        sshUrl: null,
        error: error.message || `Failed to create repository: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      repoUrl: data.html_url,
      cloneUrl: data.clone_url,
      sshUrl: data.ssh_url,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      repoUrl: null,
      cloneUrl: null,
      sshUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Create a repository from a template
 */
async function createFromTemplate(
  accessToken: string,
  options: GitHubRepoOptions
): Promise<RepoCreationResult> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${options.templateOwner}/${options.templateRepo}/generate`,
      accessToken,
      {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github.baptiste-preview+json',
        },
        body: JSON.stringify({
          name: options.name,
          description: options.description,
          private: options.visibility === 'private',
          include_all_branches: false,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        repoUrl: null,
        cloneUrl: null,
        sshUrl: null,
        error: error.message || `Failed to create from template: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      repoUrl: data.html_url,
      cloneUrl: data.clone_url,
      sshUrl: data.ssh_url,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      repoUrl: null,
      cloneUrl: null,
      sshUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Fork an existing repository
 */
export async function forkRepository(
  accessToken: string,
  owner: string,
  repo: string,
  newName?: string
): Promise<RepoCreationResult> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/forks`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          name: newName,
          default_branch_only: true,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        repoUrl: null,
        cloneUrl: null,
        sshUrl: null,
        error: error.message || `Failed to fork repository: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      repoUrl: data.html_url,
      cloneUrl: data.clone_url,
      sshUrl: data.ssh_url,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      repoUrl: null,
      cloneUrl: null,
      sshUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// File Operations
// ============================================

/**
 * Get the SHA of a file in a repository (needed for updates)
 */
async function getFileSha(
  accessToken: string,
  owner: string,
  repo: string,
  path: string,
  branch: string = 'main'
): Promise<string | null> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
      accessToken
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.sha;
  } catch {
    return null;
  }
}

/**
 * Create or update a single file in a repository
 */
export async function createOrUpdateFile(
  accessToken: string,
  owner: string,
  repo: string,
  path: string,
  content: string,
  message: string,
  branch: string = 'main'
): Promise<CommitResult> {
  try {
    // Check if file exists to get SHA for update
    const existingSha = await getFileSha(accessToken, owner, repo, path, branch);

    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/contents/${path}`,
      accessToken,
      {
        method: 'PUT',
        body: JSON.stringify({
          message,
          content: btoa(unescape(encodeURIComponent(content))), // Base64 encode with UTF-8 support
          branch,
          ...(existingSha && { sha: existingSha }),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        sha: null,
        htmlUrl: null,
        error: error.message || `Failed to create file: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      sha: data.commit.sha,
      htmlUrl: data.commit.html_url,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      sha: null,
      htmlUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Commit multiple files to a repository using the Git Data API
 * This creates a single commit with all files
 */
export async function commitMultipleFiles(
  accessToken: string,
  owner: string,
  repo: string,
  files: FileCommitOperation[],
  commitMessage: string,
  branch: string = 'main'
): Promise<CommitResult> {
  try {
    // Step 1: Get the reference for the branch
    const refResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      accessToken
    );

    if (!refResponse.ok) {
      return {
        success: false,
        sha: null,
        htmlUrl: null,
        error: `Branch '${branch}' not found`,
      };
    }

    const refData = await refResponse.json();
    const latestCommitSha = refData.object.sha;

    // Step 2: Get the tree SHA from the latest commit
    const commitResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      accessToken
    );

    if (!commitResponse.ok) {
      return {
        success: false,
        sha: null,
        htmlUrl: null,
        error: 'Failed to get latest commit',
      };
    }

    const commitData = await commitResponse.json();
    const baseTreeSha = commitData.tree.sha;

    // Step 3: Create blobs for each file
    const treeItems = await Promise.all(
      files.map(async (file) => {
        const blobResponse = await authenticatedFetch(
          `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs`,
          accessToken,
          {
            method: 'POST',
            body: JSON.stringify({
              content: file.content,
              encoding: 'utf-8',
            }),
          }
        );

        if (!blobResponse.ok) {
          throw new Error(`Failed to create blob for ${file.path}`);
        }

        const blobData = await blobResponse.json();
        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blobData.sha,
        };
      })
    );

    // Step 4: Create a new tree
    const treeResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          base_tree: baseTreeSha,
          tree: treeItems,
        }),
      }
    );

    if (!treeResponse.ok) {
      return {
        success: false,
        sha: null,
        htmlUrl: null,
        error: 'Failed to create tree',
      };
    }

    const treeData = await treeResponse.json();

    // Step 5: Create a new commit
    const newCommitResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          message: commitMessage,
          tree: treeData.sha,
          parents: [latestCommitSha],
        }),
      }
    );

    if (!newCommitResponse.ok) {
      return {
        success: false,
        sha: null,
        htmlUrl: null,
        error: 'Failed to create commit',
      };
    }

    const newCommitData = await newCommitResponse.json();

    // Step 6: Update the reference to point to the new commit
    const updateRefResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      accessToken,
      {
        method: 'PATCH',
        body: JSON.stringify({
          sha: newCommitData.sha,
        }),
      }
    );

    if (!updateRefResponse.ok) {
      return {
        success: false,
        sha: null,
        htmlUrl: null,
        error: 'Failed to update branch reference',
      };
    }

    return {
      success: true,
      sha: newCommitData.sha,
      htmlUrl: `https://github.com/${owner}/${repo}/commit/${newCommitData.sha}`,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      sha: null,
      htmlUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// Workflow Management
// ============================================

/**
 * Trigger a workflow dispatch event
 */
export async function triggerWorkflow(
  accessToken: string,
  owner: string,
  repo: string,
  workflowId: string | number,
  ref: string = 'main',
  inputs?: Record<string, string>
): Promise<{ success: boolean; error: string | null }> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/workflows/${workflowId}/dispatches`,
      accessToken,
      {
        method: 'POST',
        body: JSON.stringify({
          ref,
          inputs: inputs || {},
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || `Failed to trigger workflow: ${response.status}`,
      };
    }

    return { success: true, error: null };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * List workflow runs for a repository
 */
export async function listWorkflowRuns(
  accessToken: string,
  owner: string,
  repo: string,
  workflowId?: string | number,
  perPage: number = 10
): Promise<WorkflowRunInfo[]> {
  try {
    const path = workflowId
      ? `/repos/${owner}/${repo}/actions/workflows/${workflowId}/runs`
      : `/repos/${owner}/${repo}/actions/runs`;

    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}${path}?per_page=${perPage}`,
      accessToken
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.workflow_runs.map((run: Record<string, unknown>) => ({
      id: run.id,
      name: run.name,
      status: run.status as WorkflowRunStatus,
      conclusion: run.conclusion,
      htmlUrl: run.html_url,
      createdAt: run.created_at,
      updatedAt: run.updated_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Get a specific workflow run
 */
export async function getWorkflowRun(
  accessToken: string,
  owner: string,
  repo: string,
  runId: number
): Promise<WorkflowRunInfo | null> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/runs/${runId}`,
      accessToken
    );

    if (!response.ok) {
      return null;
    }

    const run = await response.json();
    return {
      id: run.id,
      name: run.name,
      status: run.status as WorkflowRunStatus,
      conclusion: run.conclusion,
      htmlUrl: run.html_url,
      createdAt: run.created_at,
      updatedAt: run.updated_at,
    };
  } catch {
    return null;
  }
}

/**
 * Wait for a workflow run to complete (with polling)
 */
export async function waitForWorkflowCompletion(
  accessToken: string,
  owner: string,
  repo: string,
  runId: number,
  pollIntervalMs: number = 10000,
  maxWaitMs: number = 600000,
  onStatusChange?: (run: WorkflowRunInfo) => void
): Promise<WorkflowRunInfo | null> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const run = await getWorkflowRun(accessToken, owner, repo, runId);

    if (!run) {
      return null;
    }

    onStatusChange?.(run);

    if (run.status === 'completed') {
      return run;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  return null;
}

// ============================================
// Artifacts
// ============================================

/**
 * List artifacts for a workflow run
 */
export async function listArtifacts(
  accessToken: string,
  owner: string,
  repo: string,
  runId: number
): Promise<GitHubArtifact[]> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/runs/${runId}/artifacts`,
      accessToken
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.artifacts.map((artifact: Record<string, unknown>) => ({
      id: artifact.id,
      name: artifact.name,
      sizeInBytes: artifact.size_in_bytes,
      archiveDownloadUrl: artifact.archive_download_url,
      expired: artifact.expired,
      expiresAt: artifact.expires_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Download an artifact
 * Returns a blob URL for the downloaded artifact
 */
export async function downloadArtifact(
  accessToken: string,
  owner: string,
  repo: string,
  artifactId: number
): Promise<{ success: boolean; blobUrl: string | null; error: string | null }> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/artifacts/${artifactId}/zip`,
      accessToken
    );

    if (!response.ok) {
      return {
        success: false,
        blobUrl: null,
        error: `Failed to download artifact: ${response.status}`,
      };
    }

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    return {
      success: true,
      blobUrl,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      blobUrl: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ============================================
// Repository Utilities
// ============================================

/**
 * Check if a repository name is available for the authenticated user
 */
export async function isRepoNameAvailable(
  accessToken: string,
  repoName: string
): Promise<boolean> {
  try {
    // Get the authenticated user's login
    const userResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/user`,
      accessToken
    );

    if (!userResponse.ok) {
      return false;
    }

    const userData = await userResponse.json();
    const username = userData.login;

    // Check if repo exists
    const repoResponse = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${username}/${repoName}`,
      accessToken
    );

    // If 404, the name is available
    return repoResponse.status === 404;
  } catch {
    return false;
  }
}

/**
 * Get the default branch for a repository
 */
export async function getDefaultBranch(
  accessToken: string,
  owner: string,
  repo: string
): Promise<string | null> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      accessToken
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.default_branch;
  } catch {
    return null;
  }
}

/**
 * List available workflows for a repository
 */
export async function listWorkflows(
  accessToken: string,
  owner: string,
  repo: string
): Promise<Array<{ id: number; name: string; path: string; state: string }>> {
  try {
    const response = await authenticatedFetch(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/actions/workflows`,
      accessToken
    );

    if (!response.ok) {
      return [];
    }

    const data = await response.json();
    return data.workflows.map((wf: Record<string, unknown>) => ({
      id: wf.id,
      name: wf.name,
      path: wf.path,
      state: wf.state,
    }));
  } catch {
    return [];
  }
}
