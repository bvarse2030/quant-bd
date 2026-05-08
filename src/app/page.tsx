'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, LogIn, ShieldCheck, TrendingUp, Microscope, Zap, Activity, PieChart, LineChart } from 'lucide-react';
import Link from 'next/link';

import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { useGetAccessManagementsQuery } from '@/redux/features/accessManagements/accessManagementsSlice';
import QuantAdminDiv from '@/components/admin/QuantAdminDiv';

const LoginRequired = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="mx-auto w-20 h-20 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20">
            <Lock className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Authentication Required</h2>
          <p className="text-slate-400 mb-8 leading-relaxed">Please log in to your account to access the Quant Dashboard and your personalized tools.</p>
          <Link href="/login">
            <Button
              size="lg"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/25"
            >
              <LogIn className="mr-2 w-5 h-5" />
              Sign In to Quant
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DashboardCard = ({ title, value, icon: Icon, color }: { title: string; value: string; icon: any; color: string }) => (
  <motion.div whileHover={{ y: -5 }} className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 text-${color}-400`}>
        <Icon size={24} />
      </div>
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live</span>
    </div>
    <h3 className="text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
  </motion.div>
);

const QuantResearcherDiv = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    <div className="flex items-center gap-4">
      <div className="p-4 bg-emerald-500/20 rounded-3xl border border-emerald-500/20">
        <Microscope className="w-8 h-8 text-emerald-400" />
      </div>
      <div>
        <h1 className="text-4xl font-black text-white tracking-tight">Strategy Research</h1>
        <p className="text-emerald-400 font-medium">Advanced Quantitative Modeling</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DashboardCard title="Backtest Accuracy" value="94.2%" icon={LineChart} color="emerald" />
      <DashboardCard title="Data Points" value="8.4B" icon={PieChart} color="cyan" />
      <DashboardCard title="Alpha Models" value="12 Active" icon={TrendingUp} color="teal" />
    </div>

    <div className="bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent border border-emerald-500/10 rounded-3xl p-10 min-h-[400px]">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">Model Performance Summary</h2>
        <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
          Run Backtest
        </Button>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">M{i}</div>
              <div>
                <p className="text-white font-medium">Neural Arbitrage v4.{i}</p>
                <p className="text-slate-500 text-xs">Updated 2h ago</p>
              </div>
            </div>
            <div className="text-right text-emerald-400 font-mono font-bold">+{(Math.random() * 2).toFixed(2)}%</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const QuantTraderDiv = () => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-rose-500/20 rounded-3xl border border-rose-500/20">
          <Zap className="w-8 h-8 text-rose-400" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Trading Desk</h1>
          <p className="text-rose-400 font-medium">High-Frequency Execution</p>
        </div>
      </div>
      <div className="hidden md:block px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
        <span className="text-xs text-slate-500 block uppercase font-bold mb-1">Account Equity</span>
        <span className="text-xl font-bold text-white">$142,840.50</span>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DashboardCard title="Daily P&L" value="+$12,450" icon={TrendingUp} color="rose" />
      <DashboardCard title="Active Trades" value="8" icon={Activity} color="orange" />
      <DashboardCard title="Win Rate" value="68.2%" icon={PieChart} color="amber" />
      <DashboardCard title="Latency" value="1.2ms" icon={Zap} color="red" />
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      <div className="xl:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">Live Execution Stream</h2>
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-rose-500/20 text-rose-400 text-[10px] font-black rounded-full uppercase tracking-tighter">Market Open</div>
          </div>
        </div>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between py-2 border-b border-white/5 text-rose-400/80">
            <span>BTC/USDT</span>
            <span>SELL</span>
            <span>$64,240.21</span>
            <span>0.421 BTC</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5 text-emerald-400/80">
            <span>ETH/USDT</span>
            <span>BUY</span>
            <span>$3,420.15</span>
            <span>12.45 ETH</span>
          </div>
          <div className="flex justify-between py-2 border-b border-white/5 text-emerald-400/80">
            <span>SOL/USDT</span>
            <span>BUY</span>
            <span>$142.90</span>
            <span>120.00 SOL</span>
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-b from-rose-500/20 to-transparent border border-rose-500/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
        <Activity className="w-12 h-12 text-rose-400 mb-4 opacity-50" />
        <h3 className="text-white font-bold mb-2">Market Pulse</h3>
        <p className="text-slate-400 text-sm">Volatility is currently 14% above baseline. Exercise caution with high leverage positions.</p>
      </div>
    </div>
  </motion.div>
);

const Page = () => {
  const session = useSession();
  const isPending = session?.isPending;
  const isAuthenticated = !!session?.data?.session;
  const email = session?.data?.user?.email || '';

  const { data: accessData, isLoading: isAccessLoading } = useGetAccessManagementsQuery({ user_email: email, page: 1, limit: 10 }, { skip: !email });

  const roles = useMemo(() => {
    return accessData?.data?.accessManagements?.[0]?.assign_role || [];
  }, [accessData]);

  if (isPending || (isAuthenticated && isAccessLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginRequired />;
  }

  const isQuantAdmin = roles.includes('Admin');
  const isQuantResearcher = roles.includes('Researcher');
  const isQuantTrader = roles.includes('Trader');

  return (
    <main className="min-h-screen p-4 md:p-10 lg:p-16 max-w-7xl mx-auto">
      <AnimatePresence mode="wait">
        {isQuantAdmin && <QuantAdminDiv />}
        {isQuantResearcher && <QuantResearcherDiv key="researcher" />}
        {isQuantTrader && <QuantTraderDiv key="trader" />}

        {!isQuantAdmin && !isQuantResearcher && !isQuantTrader && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
              <ShieldCheck className="w-12 h-12 text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Permissions Pending</h2>
            <p className="text-slate-400 mt-2 max-w-sm">
              Your account is active, but you have not been assigned a primary Quant role yet. Please contact the administrator.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default Page;
