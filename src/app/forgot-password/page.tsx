/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import React, { useState } from 'react';
import { Loader2, MailCheck } from 'lucide-react';

import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);
    if (data) {
      setSent(data.status);
    }
    if (error) {
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } else {
      toast.success('Password reset email sent! Check your inbox for further instructions.');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-indigo-500 p-4 pt-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-2xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20"
      >
        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-lg"
          >
            🔐
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Forgot Your Password?
          </motion.h2>

          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm">
            No worries — we’ll send you a password reset link to your email so you can safely get back in.
          </p>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 h-28 w-28 bg-white/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-6">Reset Password</h2>

          {!sent ? (
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 text-white">
              <div>
                <label htmlFor="email" className="block mb-1 text-sm">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <Button type="submit" disabled={loading} variant="outlineGlassy" className="w-full border border-slate-100/50">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center text-white"
            >
              <MailCheck className="text-green-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2">Reset Link Sent! 📬</h3>
              <p className="text-white/80 mb-4">Please check your email for the reset link.</p>
            </motion.div>
          )}

          {!sent && (
            <p className="text-center text-sm mt-6 text-white/80">
              Remember your password?{' '}
              <Link href="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ForgetPassword;
