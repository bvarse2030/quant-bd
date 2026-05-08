/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ResetPassword />
    </Suspense>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 text-white">
    <Loader2 className="animate-spin mb-4" size={40} />
    <p>Loading...</p>
  </div>
);

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [status, setStatus] = useState<'ready' | 'error' | 'success'>('ready');
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');

    if (!tokenParam) {
      setStatus('error');
      setErrorMessage('Invalid reset link. Please request a new password reset.');
      toast.error('Invalid reset link');
      return;
    }

    setToken(tokenParam);
    setStatus('ready');
  }, [searchParams]);

  useEffect(() => {
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  }, [newPassword, confirmPassword]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!token) {
      toast.error('Invalid reset token');
      return;
    }

    setPasswordError('');
    setLoading(true);

    try {
      const { error } = await authClient.resetPassword({
        newPassword,
        token,
      });

      setLoading(false);

      if (error) {
        console.error('Reset password error:', error);
        toast.error(error.message || 'Failed to reset password. The link may have expired.');
        setStatus('error');
        setErrorMessage(error.message || 'Failed to reset password. Please request a new reset link.');
        return;
      }

      setStatus('success');
      toast.success('Password reset successfully!');

      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error('Reset password exception:', error);
      setLoading(false);
      toast.error('Something went wrong. Please try again.');
      setStatus('error');
      setErrorMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-4">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative flex flex-col backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-md border border-white/20"
      >
        <div className="p-8">
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center py-8"
            >
              <AlertCircle className="text-red-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2 text-white">Invalid Reset Link</h3>
              <p className="text-white/80 mb-6">{errorMessage}</p>
              <Button onClick={() => router.push('/forgot-password')} variant="outlineGlassy">
                Request New Link
              </Button>
            </motion.div>
          )}

          {status === 'ready' && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="flex flex-col items-center mb-6">
                <Lock className="text-white mb-4" size={48} />
                <h2 className="text-3xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-white/80 text-sm text-center">Enter your new password below</p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="text-white font-medium text-sm">
                    New Password
                  </label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                      className={`w-full px-4 py-2 pr-10 bg-white/20 border ${
                        passwordError && newPassword ? 'border-red-400' : 'border-white/30'
                      } text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg`}
                      placeholder="Enter new password"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent min-w-1"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="text-white font-medium text-sm">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      disabled={loading}
                      minLength={8}
                      className={`w-full px-4 py-2 pr-10 bg-white/20 border ${
                        passwordError && confirmPassword ? 'border-red-400' : 'border-white/30'
                      } text-white placeholder:text-white/50 focus:bg-white/25 focus:border-white/50 backdrop-blur-sm rounded-lg`}
                      placeholder="Confirm new password"
                    />
                    <Button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent min-w-1"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                  </div>
                  {passwordError && (
                    <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-300 text-sm flex items-center gap-1">
                      <AlertCircle size={14} />
                      {passwordError}
                    </motion.p>
                  )}
                </div>

                <Button type="submit" disabled={loading || !!passwordError} variant="outlineGlassy" className="w-full border border-slate-100/50">
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Resetting Password...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <CheckCircle className="text-green-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2 text-white">Password Reset Successful!</h3>
              <p className="text-white/80 mb-4">Redirecting to login...</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
