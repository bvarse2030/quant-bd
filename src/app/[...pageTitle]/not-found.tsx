/*
|-----------------------------------------
| setting up NotFound for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import { Merriweather } from 'next/font/google';
import { motion, Variants } from 'framer-motion';

const merriweather = Merriweather({
  weight: '400',
  subsets: ['latin'],
  fallback: ['Times New Roman', 'serif'],
});

export default function NotFound() {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#020617] selection:bg-teal-500/30">
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, transparent 0%, #020617 100%), url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z' fill='%23ffffff' fill-opacity='0.02' fill-rule='evenodd'/%3E%3C/svg%3E\")",
          backgroundSize: '40px 40px',
        }}
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 0],
          y: [0, -50, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-teal-500/10 rounded-full blur-[120px] z-0 pointer-events-none"
      />

      <motion.div
        animate={{
          x: [0, -60, 60, 0],
          y: [0, 60, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-indigo-500/10 rounded-full blur-[120px] z-0 pointer-events-none"
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center justify-center text-center"
      >
        <motion.div variants={itemVariants} className="relative inline-block">
          <motion.h1
            className="text-[8rem] sm:text-[10rem] md:text-[14rem] lg:text-[16rem] font-extrabold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-slate-100 via-slate-300 to-slate-800 drop-shadow-2xl"
            animate={{
              textShadow: ['0px 0px 0px rgba(45, 212, 191, 0)', '0px 0px 40px rgba(45, 212, 191, 0.3)', '0px 0px 0px rgba(45, 212, 191, 0)'],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            404
          </motion.h1>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-40 mix-blend-multiply" />
        </motion.div>

        <motion.h2 variants={itemVariants} className={`${merriweather.className} text-2xl pt-4 md:text-4xl text-slate-200/50 mt-2 md:mt-0 mb-4 md:mb-6`}>
          The Page you are looking for is not found.
        </motion.h2>

        <motion.div variants={itemVariants}>
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 text-slate-900 rounded-full font-medium text-sm md:text-base transition-all overflow-hidden shadow-[0_0_40px_rgba(241,245,249,0.1)] hover:shadow-[0_0_60px_rgba(241,245,249,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal-200 via-indigo-200 to-teal-200 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_auto]" />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 transition-transform duration-300 group-hover:-translate-x-1"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="relative z-10">Return Home</span>
            </motion.div>
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
