'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Rocket,
  Github,
  User,
  Mail,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  Loader2,
  ExternalLink,
  Copy,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useV3AuthStore, useV3OnboardingStore, useCanAccessWizard } from '@/store/v3-auth-store';
import { V3_RATE_LIMITS } from '@/types/wizard';
import {
  isOAuthConfigured,
  startOAuthFlow,
  type DeviceCodeResponse,
} from '@/lib/services/github-oauth';
import { cn } from '@/lib/utils';

type OAuthState = 'idle' | 'loading' | 'awaiting_code' | 'polling' | 'success' | 'error';

export default function HomePage() {
  const router = useRouter();
  const { authType, setAuthType, setGitHubAuth } = useV3AuthStore();
  const { completed: onboardingCompleted } = useV3OnboardingStore();
  const canAccessWizard = useCanAccessWizard();

  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // OAuth state
  const [oauthState, setOAuthState] = useState<OAuthState>('idle');
  const [deviceCode, setDeviceCode] = useState<DeviceCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const cancelOAuthRef = useRef<(() => void) | null>(null);

  // Check if OAuth is configured
  const oauthConfigured = isOAuthConfigured();

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Redirect if already authenticated (after hydration)
  useEffect(() => {
    if (!isHydrated) return;

    if (canAccessWizard) {
      router.push('/wizard');
    } else if (authType !== null && !onboardingCompleted) {
      router.push('/onboarding');
    }
  }, [isHydrated, canAccessWizard, authType, onboardingCompleted, router]);

  // Cleanup OAuth on unmount
  useEffect(() => {
    return () => {
      if (cancelOAuthRef.current) {
        cancelOAuthRef.current();
      }
    };
  }, []);

  const handleAnonymous = useCallback(() => {
    setAuthType('anonymous');
    router.push('/onboarding');
  }, [setAuthType, router]);

  const handleGitHubOAuth = useCallback(async () => {
    if (!oauthConfigured) {
      setError('GitHub OAuth is not configured. Please set up a GitHub OAuth App.');
      return;
    }

    setOAuthState('loading');
    setError(null);
    setDeviceCode(null);

    const cleanup = await startOAuthFlow({
      onDeviceCode: (data) => {
        setDeviceCode(data);
        setOAuthState('awaiting_code');
      },
      onPolling: () => {
        setOAuthState('polling');
      },
      onSuccess: (token, user, email) => {
        setOAuthState('success');
        setGitHubAuth({
          token,
          username: user.login,
          email: email || undefined,
          avatarUrl: user.avatar_url,
        });

        // Short delay to show success state
        setTimeout(() => {
          router.push('/onboarding');
        }, 1000);
      },
      onError: (err) => {
        setOAuthState('error');
        setError(err.message);
      },
    });

    cancelOAuthRef.current = cleanup;
  }, [oauthConfigured, setGitHubAuth, router]);

  const handleCancelOAuth = useCallback(() => {
    if (cancelOAuthRef.current) {
      cancelOAuthRef.current();
      cancelOAuthRef.current = null;
    }
    setOAuthState('idle');
    setDeviceCode(null);
    setError(null);
  }, []);

  const handleCopyCode = useCallback(async () => {
    if (deviceCode?.user_code) {
      await navigator.clipboard.writeText(deviceCode.user_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [deviceCode]);

  const handleOpenGitHub = useCallback(() => {
    if (deviceCode?.verification_uri) {
      window.open(deviceCode.verification_uri, '_blank');
    }
  }, [deviceCode]);

  // Show loading state during hydration or redirect
  if (!isHydrated || canAccessWizard || (authType !== null && !onboardingCompleted)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-teal-400 mx-auto" />
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Render OAuth flow UI
  const renderOAuthFlow = () => {
    if (oauthState === 'idle') return null;

    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-base text-white">GitHub Authentication</CardTitle>
                <CardDescription className="text-slate-400">
                  {oauthState === 'loading' && 'Initializing...'}
                  {oauthState === 'awaiting_code' && 'Enter code on GitHub'}
                  {oauthState === 'polling' && 'Waiting for authorization...'}
                  {oauthState === 'success' && 'Authentication successful!'}
                  {oauthState === 'error' && 'Authentication failed'}
                </CardDescription>
              </div>
            </div>
            {(oauthState === 'awaiting_code' || oauthState === 'polling') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancelOAuth}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Loading state */}
          {oauthState === 'loading' && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
            </div>
          )}

          {/* Device code entry */}
          {(oauthState === 'awaiting_code' || oauthState === 'polling') && deviceCode && (
            <div className="space-y-4">
              {/* User code display */}
              <div className="p-4 bg-slate-900 rounded-lg border border-slate-600">
                <p className="text-sm text-slate-400 mb-2">Enter this code on GitHub:</p>
                <div className="flex items-center gap-3">
                  <code className="text-3xl font-mono font-bold text-white tracking-widest">
                    {deviceCode.user_code}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  1. Click the button below to open GitHub
                </p>
                <p className="text-sm text-slate-400">
                  2. Enter the code above when prompted
                </p>
                <p className="text-sm text-slate-400">
                  3. Authorize MifosLaunchpad
                </p>
              </div>

              {/* Open GitHub button */}
              <Button
                onClick={handleOpenGitHub}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open GitHub to Authorize
              </Button>

              {/* Polling indicator */}
              {oauthState === 'polling' && (
                <div className="flex items-center justify-center gap-2 text-sm text-teal-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Waiting for you to authorize on GitHub...</span>
                </div>
              )}

              {/* Expiry warning */}
              <p className="text-xs text-slate-500 text-center">
                Code expires in {Math.floor(deviceCode.expires_in / 60)} minutes
              </p>
            </div>
          )}

          {/* Success state */}
          {oauthState === 'success' && (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-lg font-medium text-white">Successfully authenticated!</p>
              <p className="text-sm text-slate-400">Redirecting to onboarding...</p>
            </div>
          )}

          {/* Error state */}
          {oauthState === 'error' && error && (
            <div className="space-y-4">
              <div className="p-4 bg-red-900/30 border border-red-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400">Authentication failed</p>
                    <p className="text-sm text-red-300 mt-1">{error}</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCancelOAuth}
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

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

        {/* OAuth flow (when active) */}
        {oauthState !== 'idle' ? (
          renderOAuthFlow()
        ) : (
          /* Login Options */
          <div className="space-y-4">
            {/* Anonymous Option */}
            <Card
              className="bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors cursor-pointer group"
              onClick={handleAnonymous}
            >
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

            {/* GitHub OAuth Option */}
            <Card
              className={cn(
                "bg-slate-800/50 border-slate-700 transition-colors",
                oauthConfigured
                  ? "hover:border-slate-600 cursor-pointer group"
                  : "opacity-60 cursor-not-allowed"
              )}
              onClick={oauthConfigured ? handleGitHubOAuth : undefined}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center transition-colors",
                    oauthConfigured && "group-hover:bg-slate-600"
                  )}>
                    <Github className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Sign in with GitHub</h3>
                      {oauthConfigured ? (
                        <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                      ) : (
                        <span className="px-2 py-0.5 bg-yellow-900/50 border border-yellow-700 rounded text-xs text-yellow-400">
                          Not Configured
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400">
                      {oauthConfigured
                        ? "Higher rate limits and build history tracking."
                        : "OAuth App needs to be configured."}
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

            {/* OAuth not configured hint */}
            {!oauthConfigured && (
              <p className="text-xs text-slate-500 text-center px-4">
                To enable GitHub login, create a{' '}
                <a
                  href="https://github.com/settings/developers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-400 hover:underline"
                >
                  GitHub OAuth App
                </a>
                {' '}and set the <code className="px-1 py-0.5 bg-slate-800 rounded text-slate-300">NEXT_PUBLIC_GITHUB_CLIENT_ID</code> environment variable.
              </p>
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
        )}

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
