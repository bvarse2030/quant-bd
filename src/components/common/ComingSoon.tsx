/*
|-----------------------------------------
| setting up ComingSoon for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import React, { useState, useEffect } from 'react';
import { BsDribbble, BsGithub, BsTwitter } from 'react-icons/bs';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function ComingSoon() {
  const [countdown, setCountdown] = useState<CountdownState>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [email, setEmail] = useState('');

  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 265);

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = targetDate.getTime() - now;

      if (remaining <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((remaining / (1000 * 60)) % 60);
      const seconds = Math.floor((remaining / 1000) % 60);

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  const CountdownBox = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg transform rotate-45 transition-transform group-hover:rotate-50" />
        <div className="relative bg-black/40 backdrop-blur-md border border-white/20 rounded-lg transform rotate-45 w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center transition-all group-hover:border-white/40">
          <div className="transform -rotate-45 flex flex-col items-center">
            <div className="text-4xl sm:text-6xl font-bold text-white">{String(value).padStart(2, '0')}</div>
            <span className="text-xs sm:text-sm text-white/80 uppercase tracking-wider mt-1">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden pt-[115px]">
      <div className="absolute inset-0 z-0">
        <Image src="https://i.ibb.co.com/KpGnqS3D/nature.jpg" alt="Background" fill className="object-cover" priority quality={90} />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-12">
        <div className="text-center space-y-12 max-w-5xl w-full">
          <div className="space-y-6">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white tracking-tight">We are coming soon!!!</h1>
            <p className="text-lg sm:text-xl text-white/90 font-light">Stay tuned for something amazing</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 py-8">
            <CountdownBox value={countdown.days} label="days" />
            <CountdownBox value={countdown.hours} label="hrs" />
            <CountdownBox value={countdown.minutes} label="min" />
            <CountdownBox value={countdown.seconds} label="sec" />
          </div>

          <div className="space-y-6 max-w-2xl mx-auto">
            <p className="text-white/90 text-sm sm:text-base">Get subscribe to our mailing list for latest updates. keep rocking!</p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email ID"
                required
                className="flex-1 px-6 py-3 bg-transparent border border-white/30 rounded text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors max-w-md"
              />
              <button
                type="submit"
                className="px-8 cursor-pointer py-3 bg-transparent border border-white/30 rounded hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white font-medium"
              >
                <Mail className="w-5 h-5" />
              </button>
            </form>
          </div>

          <div className="flex items-center justify-center gap-6">
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Twitter">
              <BsTwitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Facebook">
              <FaFacebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Dribbble">
              <BsDribbble className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="Slack">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
              </svg>
            </Link>
            <Link href="#" className="text-white/70 hover:text-white transition-colors" aria-label="GitHub">
              <BsGithub className="w-5 h-5" />
            </Link>
          </div>

          <div className="text-white/60 text-xs sm:text-sm pt-8">Copyright {new Date().getFullYear()} | All Rights Reserved - Template by Tec Verse</div>
        </div>
      </div>
    </div>
  );
}
