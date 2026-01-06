'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  Mail,
  Globe,
  Phone,
  LogOut,
  Zap,
  ChevronDown,
  Github,
  UserCircle,
  Shield,
  Edit2,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useV3AuthStore, useV3OnboardingStore, useAuthInfo } from '@/store/v3-auth-store';
import { cn } from '@/lib/utils';

export function UserProfile() {
  const auth = useV3AuthStore();
  const onboarding = useV3OnboardingStore();
  const authInfo = useAuthInfo();

  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedOrg, setEditedOrg] = useState(onboarding.organization);

  // If not authenticated, don't show
  if (!auth.isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    auth.clearAuth();
    onboarding.resetOnboarding();
    window.location.href = '/login';
  };

  const handleSaveOrg = () => {
    onboarding.setOrganization(editedOrg);
    setShowEditDialog(false);
  };

  const handleOpenEdit = () => {
    setEditedOrg(onboarding.organization);
    setShowEditDialog(true);
  };

  // Get auth type display info
  const getAuthTypeInfo = () => {
    switch (auth.authType) {
      case 'github':
        return {
          icon: Github,
          label: 'GitHub',
          color: 'bg-gray-900 text-white',
        };
      case 'supabase':
        return {
          icon: Shield,
          label: 'Premium',
          color: 'bg-purple-600 text-white',
        };
      default:
        return {
          icon: UserCircle,
          label: 'Anonymous',
          color: 'bg-gray-100 text-gray-700',
        };
    }
  };

  const authTypeInfo = getAuthTypeInfo();
  const AuthIcon = authTypeInfo.icon;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            {auth.avatarUrl ? (
              <img
                src={auth.avatarUrl}
                alt="Avatar"
                className="w-7 h-7 rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium leading-none">
                {auth.userId || onboarding.organization.name || 'User'}
              </p>
              <p className="text-xs text-muted-foreground">
                {authInfo.remainingBuilds}/{auth.maxBuildsPerDay} builds
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-72">
          {/* User Info Header */}
          <div className="px-3 py-3 border-b">
            <div className="flex items-center gap-3">
              {auth.avatarUrl ? (
                <img
                  src={auth.avatarUrl}
                  alt="Avatar"
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {auth.userId || 'Anonymous User'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {authInfo.email || 'No email'}
                </p>
              </div>
              <Badge className={cn('shrink-0', authTypeInfo.color)}>
                <AuthIcon className="w-3 h-3 mr-1" />
                {authTypeInfo.label}
              </Badge>
            </div>
          </div>

          {/* Rate Limit Info */}
          <div className="px-3 py-2 border-b bg-muted/30">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Zap className="w-4 h-4" />
                Builds Today
              </span>
              <span className="font-medium">
                {authInfo.remainingBuilds} / {auth.maxBuildsPerDay} remaining
              </span>
            </div>
          </div>

          {/* Organization Info */}
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Organization
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2"
              onClick={(e) => {
                e.preventDefault();
                handleOpenEdit();
              }}
            >
              <Edit2 className="w-3 h-3 mr-1" />
              Edit
            </Button>
          </DropdownMenuLabel>

          <div className="px-3 py-2 space-y-1.5 text-sm">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="truncate">
                {onboarding.organization.name || 'Not set'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="truncate">
                {onboarding.organization.email || 'Not set'}
              </span>
            </div>
            {onboarding.organization.website && (
              <div className="flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate">{onboarding.organization.website}</span>
              </div>
            )}
            {onboarding.organization.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="truncate">{onboarding.organization.phone}</span>
              </div>
            )}
          </div>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Organization Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization Details</DialogTitle>
            <DialogDescription>
              Update your organization information. This will be used for build notifications and app metadata.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">
                Organization Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-name"
                value={editedOrg.name}
                onChange={(e) => setEditedOrg({ ...editedOrg, name: e.target.value })}
                placeholder="Acme Financial Services"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-email">
                Contact Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="org-email"
                type="email"
                value={editedOrg.email}
                onChange={(e) => setEditedOrg({ ...editedOrg, email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-website">Website (optional)</Label>
              <Input
                id="org-website"
                type="url"
                value={editedOrg.website}
                onChange={(e) => setEditedOrg({ ...editedOrg, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="org-phone">Phone (optional)</Label>
              <Input
                id="org-phone"
                type="tel"
                value={editedOrg.phone}
                onChange={(e) => setEditedOrg({ ...editedOrg, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleSaveOrg}
              disabled={!editedOrg.name || !editedOrg.email}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
