'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Card, PageHeader, Button, Input } from '@/components/ui';
import {
  RiUserLine, RiShieldLine, RiTeamLine,
  RiSaveLine, RiIdCardLine, RiAlertLine,
  RiEyeLine, RiEyeOffLine, RiLockLine
} from 'react-icons/ri';
import { authApi } from '@/lib/authApi';
import toast from 'react-hot-toast';

const roleColors: Record<string, string> = {
  BUYER: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  VENDOR: 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  ADMIN: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
};

const roleIcons: Record<string, React.ElementType> = {
  BUYER: RiUserLine,
  VENDOR: RiTeamLine,
  ADMIN: RiShieldLine,
};

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!user) return null;

  const RoleIcon = roleIcons[user.role] || RiUserLine;

  const nameChanged = name.trim() !== user.name;
  const emailChanged = email.trim() !== user.email;
  const passwordChanged = newPassword.trim().length > 0;
  const hasChanges = nameChanged || emailChanged || passwordChanged;

  const isValidEmail = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

const getPasswordStrength = (pwd: string) => {
  if (!pwd) return null;
  if (pwd.length < 5) return { label: 'Weak', color: 'bg-red-500', width: '50%' };
  return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
};
  const passwordStrength = getPasswordStrength(newPassword);

  const handleSave = async () => {
    if (!name.trim()) return toast.error('Name cannot be empty');
    if (!email.trim()) return toast.error('Email cannot be empty');
    if (!isValidEmail(email.trim())) return toast.error('Please enter a valid email address');
    if (!hasChanges) return toast.error('No changes to save');

    // Password validations
    if (passwordChanged) {
     if (newPassword.length < 5) return toast.error('Password must be at least 5 characters'); // ✅ was 6
      if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    }

    setSaving(true);
    try {
      await authApi.updateProfile(
        user.id,
        name.trim(),
        email.trim(),
        passwordChanged ? newPassword : undefined
      );
      updateUser({ ...user, name: name.trim(), email: email.trim() });

      if (emailChanged || passwordChanged) {
        toast.success(
          passwordChanged && emailChanged
            ? 'Email & password updated! Please log in again.'
            : emailChanged
            ? 'Email updated! Please log in again.'
            : 'Password updated! Please log in again.'
        );
        setTimeout(() => {
          logout();
          router.push('/auth/login');
        }, 1500);
      } else {
        toast.success('Profile updated successfully!');
        setSaving(false);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update profile');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="My Profile"
        subtitle="View and manage your account information"
      />

      <div className="max-w-2xl space-y-6">

        {/* Avatar + Role Banner */}
        <Card className="p-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-brand-700 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-700/30">
              <span className="text-2xl font-bold text-white">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                {user.name}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border mt-2 ${roleColors[user.role]}`}>
                <RoleIcon className="text-xs" />
                {user.role}
              </span>
            </div>
          </div>
        </Card>

        {/* Edit Details */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}>
            Edit Details
          </h3>
          <div className="space-y-4">

            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />

            {emailChanged && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <RiAlertLine className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Changing your email will log you out. You'll need to sign in again with your new email address.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Role
              </label>
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-400 border"
                style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                <RiShieldLine className="flex-shrink-0" />
                {user.role}
              </div>
              <p className="text-xs text-slate-500 mt-1">Role is fixed</p>
            </div>
          </div>
        </Card>

        {/* Change Password */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-1 text-sm uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}>
            Change Password
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Leave blank if you don't want to change your password
          </p>

          <div className="space-y-4">

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <RiLockLine />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none border transition-colors"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: 'var(--border)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--brand-500)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showNewPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>

              {/* Password strength bar */}
              {newPassword && passwordStrength && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Strength</span>
                        <span className={
                        passwordStrength.label === 'Strong' ? 'text-emerald-400' : 'text-red-400'
                        }>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: passwordStrength.width }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <RiLockLine />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none border transition-colors"
                  style={{
                    background: 'var(--bg-elevated)',
                    borderColor: confirmPassword && confirmPassword !== newPassword
                      ? '#ef4444'
                      : confirmPassword && confirmPassword === newPassword
                      ? '#10b981'
                      : 'var(--border)',
                  }}
                  onFocus={(e) => {
                    if (!confirmPassword) e.target.style.borderColor = 'var(--brand-500)';
                  }}
                  onBlur={(e) => {
                    if (!confirmPassword) e.target.style.borderColor = 'var(--border)';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                </button>
              </div>

              {/* Match indicator */}
              {confirmPassword && (
                <p className={`text-xs mt-1.5 ${confirmPassword === newPassword ? 'text-emerald-400' : 'text-red-400'}`}>
                  {confirmPassword === newPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Warning if password is being changed */}
            {passwordChanged && (
              <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <RiAlertLine className="text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Changing your password will log you out. You'll need to sign in again with your new password.
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Save Button */}
        <div className="pb-6">
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={!hasChanges}
            size="lg"
          >
            <RiSaveLine /> Save Changes
          </Button>
        </div>

        {/* Account Info */}
        <Card className="p-6">
          <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider"
            style={{ fontFamily: 'var(--font-display)' }}>
            Account Info
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b"
              style={{ borderColor: 'var(--border)' }}>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <RiIdCardLine /> User ID
              </div>
              <span className="text-xs text-slate-300 font-mono">{user.id}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <RiShieldLine /> Account Type
              </div>
              <span className={`text-xs font-semibold ${roleColors[user.role].split(' ')[0]}`}>
                {user.role}
              </span>
            </div>
          </div>
        </Card>

      </div>
    </DashboardLayout>
  );
}