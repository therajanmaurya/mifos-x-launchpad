'use client';

import { useState, useCallback } from 'react';
import {
  Github,
  Key,
  CheckCircle2,
  AlertCircle,
  Loader2,
  LogOut,
  ExternalLink,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  type GitHubAuthState,
  gitHubAuthInitialState,
} from '@/types/wizard';
import {
  validateToken,
  hasRequiredScopes,
  saveGitHubAuth,
  clearGitHubAuth,
} from '@/lib/services/github-api';
import { cn } from '@/lib/utils';

interface GitHubAuthProps {
  auth: GitHubAuthState;
  onAuthChange: (auth: GitHubAuthState) => void;
}

export function GitHubAuth({ auth, onAuthChange }: GitHubAuthProps) {
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scopeWarning, setScopeWarning] = useState<string | null>(null);

  const handleTokenSubmit = useCallback(async () => {
    if (!token.trim()) {
      setError('Please enter a personal access token');
      return;
    }

    setIsValidating(true);
    setError(null);
    setScopeWarning(null);

    try {
      // Validate the token
      const userInfo = await validateToken(token);

      if (!userInfo) {
        setError('Invalid token. Please check and try again.');
        setIsValidating(false);
        return;
      }

      // Check required scopes
      const scopeCheck = await hasRequiredScopes(token);

      if (!scopeCheck.hasScopes) {
        setScopeWarning(
          `Token is missing required scopes: ${scopeCheck.missingScopes.join(', ')}. ` +
          'Repository creation and workflow triggers may fail.'
        );
      }

      // Update auth state
      const newAuth: GitHubAuthState = {
        isAuthenticated: true,
        method: 'pat',
        username: userInfo.username,
        avatarUrl: userInfo.avatarUrl,
        accessToken: token,
        expiresAt: null, // PATs don't expire automatically
      };

      onAuthChange(newAuth);
      saveGitHubAuth(newAuth);
      setToken(''); // Clear token from input for security
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsValidating(false);
    }
  }, [token, onAuthChange]);

  const handleLogout = useCallback(() => {
    onAuthChange(gitHubAuthInitialState);
    clearGitHubAuth();
    setError(null);
    setScopeWarning(null);
  }, [onAuthChange]);

  // If already authenticated, show account info
  if (auth.isAuthenticated) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="pt-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {auth.avatarUrl ? (
                <img
                  src={auth.avatarUrl}
                  alt={auth.username || 'GitHub avatar'}
                  className="w-10 h-10 rounded-full border-2 border-green-300"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <Github className="w-5 h-5 text-green-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="font-medium text-green-800">Connected to GitHub</span>
                </div>
                <p className="text-sm text-green-700">@{auth.username}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              Disconnect
            </Button>
          </div>

          {scopeWarning && (
            <div className="mt-3 p-2 bg-yellow-100 border border-yellow-200 rounded text-sm text-yellow-800">
              <Info className="w-4 h-4 inline mr-1" />
              {scopeWarning}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Show authentication form
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Github className="w-4 h-4" />
          Connect GitHub Account
        </CardTitle>
        <CardDescription>
          Connect your GitHub account to create repositories directly
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Personal Access Token Form */}
        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="github-token" className="flex items-center gap-2">
              <Key className="w-3 h-3" />
              Personal Access Token
            </Label>
            <div className="relative">
              <Input
                id="github-token"
                type={showToken ? 'text' : 'password'}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleTokenSubmit()}
                className="pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleTokenSubmit}
            disabled={isValidating || !token.trim()}
            className="w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Github className="w-4 h-4 mr-2" />
                Connect Account
              </>
            )}
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-2">
          <p>
            <strong>Required scopes:</strong> repo, workflow
          </p>
          <a
            href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=MifosLaunchpad"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            Create a new token on GitHub
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================
// Repository Options Form
// ============================================

interface RepoOptionsFormProps {
  options: {
    name: string;
    description: string;
    visibility: 'public' | 'private';
  };
  onOptionsChange: (options: Partial<RepoOptionsFormProps['options']>) => void;
  disabled?: boolean;
}

export function RepoOptionsForm({ options, onOptionsChange, disabled }: RepoOptionsFormProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="repo-name">Repository Name</Label>
        <Input
          id="repo-name"
          placeholder="my-mifos-app"
          value={options.name}
          onChange={(e) => onOptionsChange({ name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
          disabled={disabled}
          className="font-mono"
        />
        <p className="text-xs text-muted-foreground">
          Only lowercase letters, numbers, and hyphens
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="repo-description">Description (optional)</Label>
        <Input
          id="repo-description"
          placeholder="A mobile banking app built with MifosLaunchpad"
          value={options.description}
          onChange={(e) => onOptionsChange({ description: e.target.value })}
          disabled={disabled}
        />
      </div>

      <div className="space-y-2">
        <Label>Visibility</Label>
        <div className="flex gap-4">
          <label className={cn(
            'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors',
            options.visibility === 'private' ? 'border-primary bg-primary/5' : 'border-border',
            disabled && 'opacity-50 cursor-not-allowed'
          )}>
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={options.visibility === 'private'}
              onChange={() => onOptionsChange({ visibility: 'private' })}
              disabled={disabled}
              className="sr-only"
            />
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
              {options.visibility === 'private' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div>
              <p className="font-medium text-sm">Private</p>
              <p className="text-xs text-muted-foreground">Only you can see this repository</p>
            </div>
          </label>

          <label className={cn(
            'flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors',
            options.visibility === 'public' ? 'border-primary bg-primary/5' : 'border-border',
            disabled && 'opacity-50 cursor-not-allowed'
          )}>
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={options.visibility === 'public'}
              onChange={() => onOptionsChange({ visibility: 'public' })}
              disabled={disabled}
              className="sr-only"
            />
            <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center">
              {options.visibility === 'public' && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div>
              <p className="font-medium text-sm">Public</p>
              <p className="text-xs text-muted-foreground">Anyone can see this repository</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
