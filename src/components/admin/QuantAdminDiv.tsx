/*
|-----------------------------------------
| setting up QuantAdminDiv for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Quant BD, May, 2026
|-----------------------------------------
*/

import { motion } from 'framer-motion';
import { BarChart3, ShieldCheck } from 'lucide-react';

const QuantAdminDiv = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">System Admin</h1>
          <p className="text-indigo-400 font-medium">Global Operations Control</p>
        </div>
        <div className="flex gap-2">
          <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-emerald-400 font-mono">SYSTEMS NOMINAL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">The title</div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 h-80 flex items-center justify-center text-slate-500">
          <BarChart3 size={48} className="opacity-20" />
          <span className="ml-4 font-medium italic">Infrastructure Analytics Feed</span>
        </div>
        <div className="bg-white/5 rounded-3xl p-8 border border-white/10 h-80 flex items-center justify-center text-slate-500">
          <ShieldCheck size={48} className="opacity-20" />
          <span className="ml-4 font-medium italic">Security Log Stream</span>
        </div>
      </div>
    </motion.div>
  );
};
export default QuantAdminDiv;
