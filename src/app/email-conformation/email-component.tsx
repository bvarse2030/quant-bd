/*
|-----------------------------------------
| setting up EmailComponent for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import { motion } from 'framer-motion';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';

const EmailConfirmationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [resendLoading] = useState(false);
  const [resendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (resendSuccess && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendSuccess, countdown]);

  const handleBackToLogin = () => {
    router.push('/login');
  };
  const handleRedirectToContact = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-indigo-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-cyan-400/30 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-pink-400/30 to-transparent rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl overflow-hidden w-full max-w-2xl border border-white/20 p-8 md:p-12"
      >
        <div className="flex flex-col items-center text-center text-white space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            className="relative"
          >
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full blur-2xl opacity-60"
            />
            <div className="relative bg-linear-to-br from-blue-500 to-purple-600 rounded-full p-8 shadow-2xl">
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Mail className="w-16 h-16 text-white" strokeWidth={1.5} />
              </motion.div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
                className="absolute -top-2 -right-2"
              >
                <CheckCircle className="w-10 h-10 text-green-400 fill-green-400" />
              </motion.div>
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute -bottom-1 -left-1"
              >
                <Sparkles className="w-8 h-8 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }} className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
              Check Your Email
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-md mx-auto leading-relaxed">We&apos;ve sent a confirmation link to</p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3 inline-block"
            >
              <p className="text-lg font-semibold text-white break-all">{email || 'your@email.com'}</p>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="space-y-4 w-full max-w-md"
          >
            <div className="bg-blue-500/20 backdrop-blur-sm border border-blue-400/30 rounded-xl p-4 text-sm text-white/90">
              <p className="leading-relaxed">
                Please click the confirmation link in the email to verify your account. If you don&apos;t see it, check your spam folder.
              </p>
            </div>

            {resendSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 rounded-xl p-4 flex items-center gap-3 text-sm text-white"
              >
                <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
                <span>Email resent successfully! You can resend again in {countdown}s</span>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4"
          >
            <motion.button
              onClick={handleBackToLogin}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative flex-1 py-3 px-6 rounded-xl font-semibold flex justify-center items-center gap-2 transition-all duration-300 overflow-hidden bg-linear-to-r from-blue-500 via-purple-500 to-indigo-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] shadow-lg"
            >
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
              <span className="relative z-10 flex items-center gap-2">
                Back to Login
                <ArrowRight size={18} />
              </span>
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1, duration: 0.6 }} className="pt-6 text-sm text-white/70">
            <p>
              Need help?{' '}
              <button
                onClick={handleRedirectToContact}
                disabled={resendLoading || (resendSuccess && countdown > 0)}
                className="text-blue-300 cursor-pointer hover:text-blue-200 font-semibold transition-colors underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Contact us
              </button>
            </p>
          </motion.div>
        </div>

        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute top-10 right-10 opacity-20"
        >
          <Sparkles className="w-16 h-16 text-white" />
        </motion.div>

        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-10 left-10 opacity-20"
        >
          <Mail className="w-20 h-20 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const EmailConfirmationPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-indigo-500">
          <div className="text-white text-xl">Loading...</div>
        </div>
      }
    >
      <EmailConfirmationContent />
    </Suspense>
  );
};

export default EmailConfirmationPage;
