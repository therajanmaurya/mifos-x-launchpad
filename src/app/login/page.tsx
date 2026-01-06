'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Rocket, Github, User, Mail, Shield, Zap, Clock, ArrowRight, Loader2, Key, Eye, EyeOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useV3AuthStore, useV3OnboardingStore, useCanAccessWizard } from '@/store/v3-auth-store';
import { V3_RATE_LIMITS } from '@/types/wizard';
import { validateToken, hasRequiredScopes } from '@/lib/services/github-api';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { authType, setAuthType, setGitHubAuth } = useV3AuthStore();
  const { completed: onboardingCompleted } = useV3OnboardingStore();
  const canAccessWizard = useCanAccessWizard();

  // GitHub token state
  const [showGitHubForm, setShowGitHubForm] = useState(false);
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (canAccessWizard) {
      router.push('/wizard');
    } else if (authType !== null && !onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [canAccessWizard, authType, onboardingCompleted, router]);

  const handleAnonymous = useCallback(() => {
    setAuthType('anonymous');
    router.push('/onboarding');
  }, [setAuthType, router]);

  const handleGitHubTokenSubmit = useCallback(async () => {
    if (!token.trim()) {
      setError('Please enter a personal access token');
      return;
    }

    setIsValidating(true);
    setError(null);

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
        setError(
          `Token is missing required scopes: ${scopeCheck.missingScopes.join(', ')}. Please create a new token with repo and workflow scopes.`
        );
        setIsValidating(false);
        return;
      }

      // Set GitHub auth
      setGitHubAuth({
        token,
        username: userInfo.username,
        avatarUrl: userInfo.avatarUrl,
      });

      setToken(''); // Clear token for security
      router.push('/onboarding');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setIsValidating(false);
    }
  }, [token, setGitHubAuth, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-500/20">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">MifosLaunchpad</h1>
          <p className="text-slate-400 max-w-sm mx-auto">
            Create white-labeled mobile banking apps in minutes
          </p>
        </div>

        {/* Login Options */}
        <div className="space-y-4">
          {/* Anonymous Option */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
            onClick={handleAnonymous}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                  <User className="w-6 h-6 text-slate-300" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Continue as Guest</h3>
                    <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <p className="text-sm text-slate-400">
                    No sign-in required. Start building immediately.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{V3_RATE_LIMITS.anonymous} builds/day</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email required</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500">or sign in for more</span>
            </div>
          </div>

          {/* GitHub Option */}
          {!showGitHubForm ? (
            <Card
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
              onClick={() => setShowGitHubForm(true)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center group-hover:bg-slate-600 transition-colors">
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Sign in with GitHub</h3>
                      <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-sm text-slate-400">
                      Higher rate limits and build history tracking.
                    </p>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-teal-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span>{V3_RATE_LIMITS.github} builds/day</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-teal-400">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Priority queue</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                    <Github className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-base text-white">GitHub Authentication</CardTitle>
                    <CardDescription className="text-slate-400">
                      Enter your personal access token
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="github-token" className="text-slate-300 flex items-center gap-2">
                    <Key className="w-3.5 h-3.5" />
                    Personal Access Token
                  </Label>
                  <div className="relative">
                    <Input
                      id="github-token"
                      type={showToken ? 'text' : 'password'}
                      placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleGitHubTokenSubmit()}
                      className="pr-10 font-mono text-sm bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm text-red-400">
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowGitHubForm(false);
                      setToken('');
                      setError(null);
                    }}
                    className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGitHubTokenSubmit}
                    disabled={isValidating || !token.trim()}
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validating...
                      </>
                    ) : (
                      <>
                        <Github className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-xs text-slate-500 space-y-1">
                  <p><strong>Required scopes:</strong> repo, workflow</p>
                  <a
                    href="https://github.com/settings/tokens/new?scopes=repo,workflow&description=MifosLaunchpad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:underline inline-flex items-center gap-1"
                  >
                    Create a new token on GitHub
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Supabase Option (Coming Soon) */}
          <Card className="bg-slate-800/30 border-slate-700/50 opacity-60 cursor-not-allowed">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-slate-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-slate-400">Sign in with Email</h3>
                    <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    Persistent accounts with build history and team features.
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{V3_RATE_LIMITS.supabase} builds/day</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          By continuing, you agree to our{' '}
          <a href="#" className="text-teal-400 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-teal-400 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}
