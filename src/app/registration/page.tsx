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
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

import { signUp, signIn } from '@/lib/auth-client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ContinueWithGoogleButton from '@/components/common/GoogleButton';

const RegistrationPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await signUp.email(
        {
          email,
          password,
          name,
          callbackURL: `/verify-success`,
        },
        {
          onRequest: () => setLoading(true),
          onResponse: () => setLoading(false),
        },
      );

      if (res?.error) {
        setError(res.error.message || 'Registration failed. Please try again.');
      } else {
        router.push(`/email-conformation?email=${email}`);
      }
    } catch (err: unknown) {
      console.error(err);
      setError('Something went wrong. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const { name, email, password, confirmPassword } = formData;
  const isFormInvalid = !name || !email || !password || !confirmPassword || password !== confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-blue-500 p-4 pt-[65px]">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className=" flex-col md:flex-row backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-5xl border border-white/20"
      >
        <div className="flex-1 hidden md:flex flex-col items-center justify-center text-white p-8 relative">
          <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 6 }} className="text-6xl font-extrabold drop-shadow-md">
            ✨
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Create Your Account
          </motion.h2>

          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm leading-relaxed">
            Join our community and start your learning journey — it only takes a few seconds!
          </p>
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">Sign Up</h2>

          <form onSubmit={handleRegister} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm">
                Full Name
              </label>
              <Input id="name" name="name" type="text" value={name} onChange={handleChange} required placeholder="Enter your name" />
            </div>

            <div>
              <label htmlFor="email" className="block mb-1 text-sm">
                Email Address
              </label>
              <Input id="email" name="email" type="email" value={email} onChange={handleChange} required placeholder="Enter your email" />
            </div>

            <div>
              <label htmlFor="password" className="block mb-1 text-sm">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                />
                <Button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 -right-1 flex items-center min-w-1 bg-transparent"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-1 text-sm">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-white/60 pr-10"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-white/70 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-red-300 bg-red-500/10 border border-red-400/30 rounded-lg p-2 mt-2 text-sm"
              >
                <AlertCircle className="mr-2" size={16} />
                {error}
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
              {!loading && isFormInvalid && (
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
                    Loading...
                  </>
                ) : (
                  'Register'
                )}
              </span>
            </motion.button>
          </form>

          <div className="flex items-center justify-center my-6">
            <div className="w-1/5 border-t border-white/30"></div>
            <span className="mx-3 text-sm text-white/70">OR</span>
            <div className="w-1/5 border-t border-white/30"></div>
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
                } catch {
                  setError('Google signup failed. Please try again.');
                  setLoading(false);
                }
              }}
            />
          </div>

          <p className="text-center text-sm mt-6 text-white/80">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-bold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
