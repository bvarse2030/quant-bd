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
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Eye, EyeOff, AlertCircle, Sparkles } from 'lucide-react';

import { signIn } from '@/lib/auth-client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ContinueWithGoogleButton from '@/components/common/GoogleButton';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await signIn.email(
        { email, password },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
        },
      );

      if (res?.error) {
        setError(res.error.message || 'Invalid email or password.');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      setError('Something went wrong. Please try again later.' + err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-indigo-500 p-4 relative overflow-hidden pt-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-pink-400/20 to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20 relative z-10"
      >
        <div className="flex-1 flex flex-col items-center justify-center text-white py-4 md:py-8 p-8 relative">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-md relative"
          >
            🔐
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles className="w-8 h-8 text-yellow-300" />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl hidden md:flex md:text-4xl font-semibold mt-4 text-center bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
          >
            Welcome Back
          </motion.h2>
          <p className="text-sm hidden md:flex md:text-base mt-3 text-white/80 text-center max-w-sm leading-relaxed">
            Securely access your account and manage your data effortlessly.
          </p>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Login to Your Account</h2>

          <form onSubmit={handleLogin} className="flex flex-col space-y-6">
            <div className="relative">
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address
              </label>
              <motion.div
                animate={{
                  scale: emailFocused ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  required
                  placeholder="Enter your email"
                />
                {emailFocused && (
                  <motion.div
                    layoutId="inputGlow"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-blue-400/30 to-purple-400/30 blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            </div>

            <div className="relative">
              <label htmlFor="password" className="block mb-2 text-sm font-medium">
                Password
              </label>
              <motion.div
                animate={{
                  scale: passwordFocused ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required
                  placeholder="Enter your password"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 -right-1 flex items-center min-w-1 bg-transparent"
                  aria-label="Toggle password visibility"
                >
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </motion.div>
                </Button>
                {passwordFocused && (
                  <motion.div
                    layoutId="inputGlow"
                    className="absolute inset-0 rounded-xl bg-linear-to-r from-purple-400/30 to-pink-400/30 blur-xl -z-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            </div>

            <Link href="/forgot-password" className="w-full text-right text-xs hover:underline -mt-3.5 ">
              Forgot Password?
            </Link>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-100 bg-red-500/20 border border-red-400/50 rounded-xl p-3 text-sm backdrop-blur-sm"
              >
                <AlertCircle className="mr-2 shrink-0" size={16} />
                <span>{error}</span>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={loading || !email || !password}
              whileHover={{ scale: loading || !email || !password ? 1 : 1.02 }}
              whileTap={{ scale: loading || !email || !password ? 1 : 0.98 }}
              className={`relative cursor-pointer w-full py-3 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 overflow-hidden ${
                loading || !email || !password
                  ? 'bg-gray-500/50 cursor-not-allowed'
                  : 'bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] shadow-lg'
              }`}
            >
              {!loading && !(!email || !password) && (
                <>
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                      x: ['-100%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0"
                    animate={{
                      background: [
                        'radial-linear(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        'radial-linear(circle at 100% 100%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                        'radial-linear(circle at 0% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </>
              )}
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </span>
            </motion.button>
          </form>

          <div className="flex items-center justify-center my-6">
            <div className="flex-1 border-t border-white/30" />
            <span className="mx-4 text-sm text-white/70 font-medium">OR</span>
            <div className="flex-1 border-t border-white/30" />
          </div>

          <div className="flex justify-center">
            <ContinueWithGoogleButton
              onClick={async () => {
                setError(null);
                try {
                  await signIn.social(
                    {
                      provider: 'google',
                      callbackURL: '/dashboard',
                    },
                    {
                      onRequest: () => setLoading(true),
                      onResponse: () => setLoading(false),
                    },
                  );
                } catch (err) {
                  setError('Google login failed. Please try again.' + err);
                  setLoading(false);
                }
              }}
            />
          </div>

          <p className="text-center text-sm mt-6 text-white/80">
            Don&apos;t have an account?{' '}
            <motion.a href="/registration" whileHover={{ scale: 1.05 }} className="text-blue-600 hover:underline font-semibold transition-colors">
              Sign Up
            </motion.a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
