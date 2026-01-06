'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Mail, Globe, Phone, ArrowRight, ArrowLeft, CheckCircle2, Loader2, User, Github } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useV3AuthStore, useV3OnboardingStore, useNeedsLogin, useCanAccessWizard } from '@/store/v3-auth-store';
import { cn } from '@/lib/utils';

// Simple email validation
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Simple URL validation
const isValidUrl = (url: string): boolean => {
  if (!url) return true; // Optional field
  try {
    new URL(url.startsWith('http') ? url : `https://${url}`);
    return true;
  } catch {
    return false;
  }
};

// Simple phone validation
const isValidPhone = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  return /^\+?[\d\s\-()]+$/.test(phone);
};

export default function OnboardingPage() {
  const router = useRouter();
  const needsLogin = useNeedsLogin();
  const canAccessWizard = useCanAccessWizard();

  const { authType, email: authEmail, avatarUrl, userId } = useV3AuthStore();
  const {
    organization,
    termsAccepted,
    setOrganizationField,
    setTermsAccepted,
    completeOnboarding,
  } = useV3OnboardingStore();

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill email from GitHub auth
  useEffect(() => {
    if (authEmail && !organization.email) {
      setOrganizationField('email', authEmail);
    }
  }, [authEmail, organization.email, setOrganizationField]);

  // Redirect if needs login or already completed
  useEffect(() => {
    if (needsLogin) {
      router.push('/login');
    } else if (canAccessWizard) {
      router.push('/wizard');
    }
  }, [needsLogin, canAccessWizard, router]);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    if (!organization.name.trim()) {
      newErrors.name = 'Organization name is required';
    } else if (organization.name.length < 2) {
      newErrors.name = 'Organization name must be at least 2 characters';
    } else if (organization.name.length > 100) {
      newErrors.name = 'Organization name must be less than 100 characters';
    }

    if (!organization.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(organization.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (organization.website && !isValidUrl(organization.website)) {
      newErrors.website = 'Please enter a valid URL';
    }

    if (organization.phone && !isValidPhone(organization.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!termsAccepted) {
      newErrors.terms = 'You must accept the terms of service';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [organization, termsAccepted]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    completeOnboarding();
    router.push('/wizard');
  }, [validateForm, completeOnboarding, router]);

  const handleBack = useCallback(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header with auth info */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {authType === 'github' && userId && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full">
              {avatarUrl ? (
                <img src={avatarUrl} alt={userId} className="w-6 h-6 rounded-full" />
              ) : (
                <Github className="w-4 h-4 text-slate-400" />
              )}
              <span className="text-sm text-slate-300">@{userId}</span>
            </div>
          )}

          {authType === 'anonymous' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-full">
              <User className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-300">Guest</span>
            </div>
          )}
        </div>

        {/* Main Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-4">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Tell us about your organization</CardTitle>
            <CardDescription className="text-slate-400">
              This information will be used in your generated app and for build notifications.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-4">
            {/* Organization Name */}
            <div className="space-y-2">
              <Label htmlFor="org-name" className="text-slate-300 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organization Name <span className="text-red-400">*</span>
              </Label>
              <Input
                id="org-name"
                placeholder="Acme Financial Services"
                value={organization.name}
                onChange={(e) => {
                  setOrganizationField('name', e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className={cn(
                  "bg-slate-900 border-slate-600 text-white placeholder:text-slate-500",
                  errors.name && "border-red-500"
                )}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address <span className="text-red-400">*</span>
                <span className="text-xs text-slate-500">(for build notifications)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@acmefinancial.com"
                value={organization.email}
                onChange={(e) => {
                  setOrganizationField('email', e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className={cn(
                  "bg-slate-900 border-slate-600 text-white placeholder:text-slate-500",
                  errors.email && "border-red-500"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Website */}
            <div className="space-y-2">
              <Label htmlFor="website" className="text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Website <span className="text-xs text-slate-500">(optional)</span>
              </Label>
              <Input
                id="website"
                type="url"
                placeholder="https://acmefinancial.com"
                value={organization.website}
                onChange={(e) => {
                  setOrganizationField('website', e.target.value);
                  if (errors.website) setErrors(prev => ({ ...prev, website: '' }));
                }}
                className={cn(
                  "bg-slate-900 border-slate-600 text-white placeholder:text-slate-500",
                  errors.website && "border-red-500"
                )}
              />
              {errors.website && (
                <p className="text-xs text-red-400">{errors.website}</p>
              )}
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone <span className="text-xs text-slate-500">(optional)</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={organization.phone}
                onChange={(e) => {
                  setOrganizationField('phone', e.target.value);
                  if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                }}
                className={cn(
                  "bg-slate-900 border-slate-600 text-white placeholder:text-slate-500",
                  errors.phone && "border-red-500"
                )}
              />
              {errors.phone && (
                <p className="text-xs text-red-400">{errors.phone}</p>
              )}
            </div>

            {/* Terms */}
            <div className="space-y-2 pt-2">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => {
                    setTermsAccepted(checked as boolean);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="mt-1 border-slate-600 data-[state=checked]:bg-teal-600 data-[state=checked]:border-teal-600"
                />
                <Label htmlFor="terms" className="text-sm text-slate-400 leading-relaxed cursor-pointer">
                  I agree to the{' '}
                  <a href="#" className="text-teal-400 hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-teal-400 hover:underline">Privacy Policy</a>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-xs text-red-400 pl-7">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white h-12 text-base"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Continue to Wizard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex items-center gap-1.5 text-teal-400">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-sm">Authentication</span>
          </div>
          <div className="w-8 h-px bg-teal-400"></div>
          <div className="flex items-center gap-1.5 text-white">
            <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <span className="text-sm font-medium">Organization</span>
          </div>
          <div className="w-8 h-px bg-slate-600"></div>
          <div className="flex items-center gap-1.5 text-slate-500">
            <div className="w-4 h-4 rounded-full border-2 border-slate-600"></div>
            <span className="text-sm">Wizard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
