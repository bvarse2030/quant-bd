/*
|-----------------------------------------
| setting up Page for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const VerifyAccount = () => {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setVerified(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    }, 1500);
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    setResending(true);

    setTimeout(() => {
      setResending(false);
      setResendDone(true);
      setTimeout(() => {
        setShowModal(false);
        setResendDone(false);
        setEmail('');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-500 p-4">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col md:flex-row backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl border border-white/20"
      >
        <div className="flex-1 flex flex-col items-center justify-center text-white p-8 relative overflow-hidden">
          <motion.div
            animate={{ rotate: [0, 8, -8, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="text-6xl font-extrabold tracking-tight drop-shadow-md"
          >
            ✉️
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-3xl md:text-4xl font-semibold mt-4 text-center"
          >
            Verify Your Account
          </motion.h2>

          <p className="text-sm md:text-base mt-3 text-white/80 text-center max-w-sm">
            We’ve sent a verification code to your email. Enter it below to activate your account.
          </p>

          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2 h-28 w-28 bg-white/20 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>

        <div className="flex-1 bg-white/10 backdrop-blur-lg p-8 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-white mb-6">Account Verification</h2>

          {!verified ? (
            <form onSubmit={handleVerify} className="flex flex-col space-y-4 text-white">
              <div>
                <label htmlFor="code" className="block mb-1 text-sm">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-2 text-center tracking-widest text-lg rounded-lg bg-white/20 border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder-white/60"
                  placeholder="Enter 6-digit code"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 mt-4 bg-linear-to-r from-indigo-500 to-blue-500 hover:opacity-90 rounded-lg font-medium flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Verifying...
                  </>
                ) : (
                  'Verify Account'
                )}
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center text-white"
            >
              <CheckCircle className="text-green-400 mb-4" size={64} />
              <h3 className="text-xl font-semibold mb-2">Account Verified!</h3>
              <p className="text-white/80 mb-4">Redirecting you to your dashboard...</p>
            </motion.div>
          )}

          {!verified && (
            <p className="text-center text-sm mt-6 text-white/80">
              Didn’t receive the code?{' '}
              <button type="button" onClick={() => setShowModal(true)} className="text-blue-300 hover:underline">
                Resend Code
              </button>
            </p>
          )}
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative bg-white/10 backdrop-blur-2xl p-6 rounded-xl shadow-xl border border-white/20 w-[90%] max-w-md text-white"
            >
              <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-white/80 hover:text-white">
                <X size={20} />
              </button>

              <h3 className="text-xl font-semibold mb-4 text-center">Resend Verification Code</h3>

              {!resendDone ? (
                <form onSubmit={handleResend} className="flex flex-col space-y-4">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />

                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-2 bg-linear-to-r from-indigo-500 to-blue-500 rounded-lg font-medium flex justify-center items-center gap-2"
                  >
                    {resending ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        Sending...
                      </>
                    ) : (
                      'Send Code'
                    )}
                  </button>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col items-center justify-center text-center text-white"
                >
                  <CheckCircle className="text-green-400 mb-3" size={48} />
                  <p>Verification code sent successfully!</p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerifyAccount;
