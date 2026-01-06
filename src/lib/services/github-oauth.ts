/**
 * GitHub OAuth Device Flow Implementation
 *
 * This uses GitHub's Device Flow which works without a backend server,
 * making it perfect for static sites like GitHub Pages.
 *
 * Flow:
 * 1. Request device code from GitHub
 * 2. User opens github.com/login/device and enters the code
 * 3. App polls GitHub until user completes authentication
 * 4. Receive access token
 *
 * Setup:
 * 1. Create a GitHub OAuth App at https://github.com/settings/developers
 * 2. Enable "Device Authorization Flow" in the app settings
 * 3. Set NEXT_PUBLIC_GITHUB_CLIENT_ID in your environment
 */

// GitHub OAuth App Client ID (public, safe to expose)
const GITHUB_CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || '';

// Required scopes for MifosLaunchpad
const REQUIRED_SCOPES = 'repo workflow read:user user:email';

// Device flow endpoints
const DEVICE_CODE_URL = 'https://github.com/login/device/code';
const ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const USER_API_URL = 'https://api.github.com/user';
const USER_EMAILS_URL = 'https://api.github.com/user/emails';

/**
 * Device code response from GitHub
 */
export interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

/**
 * Access token response from GitHub
 */
export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

/**
 * GitHub user info
 */
export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string | null;
  email: string | null;
}

/**
 * OAuth error types
 */
export type OAuthErrorType =
  | 'authorization_pending'
  | 'slow_down'
  | 'expired_token'
  | 'access_denied'
  | 'unsupported_grant_type'
  | 'incorrect_client_credentials'
  | 'incorrect_device_code'
  | 'device_flow_disabled';

/**
 * Check if GitHub OAuth is configured
 */
export function isOAuthConfigured(): boolean {
  return !!GITHUB_CLIENT_ID;
}

/**
 * Get the GitHub Client ID
 */
export function getClientId(): string {
  return GITHUB_CLIENT_ID;
}

/**
 * Step 1: Request a device code from GitHub
 * This initiates the device flow authentication
 */
export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('GitHub OAuth is not configured. Set NEXT_PUBLIC_GITHUB_CLIENT_ID environment variable.');
  }

  const response = await fetch(DEVICE_CODE_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      scope: REQUIRED_SCOPES,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to request device code: ${error}`);
  }

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error_description || data.error);
  }

  return data as DeviceCodeResponse;
}

/**
 * Step 2: Poll for access token
 * Call this repeatedly until the user completes authentication
 *
 * @returns Access token response, or null if still pending
 * @throws Error if authentication failed or expired
 */
export async function pollForAccessToken(deviceCode: string): Promise<AccessTokenResponse | null> {
  if (!GITHUB_CLIENT_ID) {
    throw new Error('GitHub OAuth is not configured');
  }

  const response = await fetch(ACCESS_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      device_code: deviceCode,
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to poll for token: ${error}`);
  }

  const data = await response.json();

  // Handle different states
  if (data.error) {
    const errorType = data.error as OAuthErrorType;

    switch (errorType) {
      case 'authorization_pending':
        // User hasn't completed auth yet, keep polling
        return null;

      case 'slow_down':
        // We're polling too fast, caller should increase interval
        return null;

      case 'expired_token':
        throw new Error('Authentication expired. Please try again.');

      case 'access_denied':
        throw new Error('Access denied. User cancelled authentication.');

      default:
        throw new Error(data.error_description || data.error);
    }
  }

  // Success! Return the access token
  return data as AccessTokenResponse;
}

/**
 * Get the authenticated user's information
 */
export async function getGitHubUser(accessToken: string): Promise<GitHubUser> {
  const response = await fetch(USER_API_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user information');
  }

  return response.json();
}

/**
 * Get the authenticated user's primary email
 */
export async function getGitHubUserEmail(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(USER_EMAILS_URL, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      return null;
    }

    const emails = await response.json();

    // Find primary email
    const primary = emails.find((e: { primary: boolean; verified: boolean; email: string }) =>
      e.primary && e.verified
    );

    return primary?.email || emails[0]?.email || null;
  } catch {
    return null;
  }
}

/**
 * Validate that the token has required scopes
 */
export async function validateTokenScopes(accessToken: string): Promise<{
  valid: boolean;
  scopes: string[];
  missingScopes: string[];
}> {
  const response = await fetch(USER_API_URL, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/vnd.github+json',
    },
  });

  const scopeHeader = response.headers.get('X-OAuth-Scopes');
  const scopes = scopeHeader ? scopeHeader.split(',').map(s => s.trim()) : [];

  const requiredScopes = ['repo', 'workflow'];
  const missingScopes = requiredScopes.filter(s => !scopes.includes(s));

  return {
    valid: missingScopes.length === 0,
    scopes,
    missingScopes,
  };
}

/**
 * Complete OAuth flow helper
 * Manages the entire device flow process
 */
export interface OAuthFlowCallbacks {
  onDeviceCode: (data: DeviceCodeResponse) => void;
  onPolling: () => void;
  onSuccess: (token: string, user: GitHubUser, email: string | null) => void;
  onError: (error: Error) => void;
}

export async function startOAuthFlow(callbacks: OAuthFlowCallbacks): Promise<() => void> {
  let cancelled = false;
  let pollTimeout: NodeJS.Timeout | null = null;

  const cleanup = () => {
    cancelled = true;
    if (pollTimeout) {
      clearTimeout(pollTimeout);
    }
  };

  try {
    // Step 1: Get device code
    const deviceCode = await requestDeviceCode();

    if (cancelled) return cleanup;

    callbacks.onDeviceCode(deviceCode);

    // Step 2: Poll for access token
    const pollInterval = (deviceCode.interval || 5) * 1000;
    const expiresAt = Date.now() + deviceCode.expires_in * 1000;

    const poll = async () => {
      if (cancelled) return;

      if (Date.now() > expiresAt) {
        callbacks.onError(new Error('Authentication expired. Please try again.'));
        return;
      }

      callbacks.onPolling();

      try {
        const result = await pollForAccessToken(deviceCode.device_code);

        if (cancelled) return;

        if (result) {
          // Success! Get user info
          const user = await getGitHubUser(result.access_token);
          const email = user.email || await getGitHubUserEmail(result.access_token);

          callbacks.onSuccess(result.access_token, user, email);
        } else {
          // Still pending, poll again
          pollTimeout = setTimeout(poll, pollInterval);
        }
      } catch (error) {
        if (!cancelled) {
          callbacks.onError(error instanceof Error ? error : new Error('Authentication failed'));
        }
      }
    };

    // Start polling
    pollTimeout = setTimeout(poll, pollInterval);

  } catch (error) {
    if (!cancelled) {
      callbacks.onError(error instanceof Error ? error : new Error('Failed to start authentication'));
    }
  }

  return cleanup;
}
