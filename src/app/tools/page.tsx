'use client';

import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Image as ImageIcon, LayoutTemplate, LayoutDashboard, ArrowRight } from 'lucide-react';

const TOOLS = [
  {
    title: 'Images',
    description: 'Process, optimize, and manage your visual assets with our advanced image manipulation engine.',
    path: '/tools/images',
    icon: ImageIcon,
    shadow: 'shadow-blue-500/20',
  },
  {
    title: 'Template Generator',
    description: 'Instantly create boilerplate code and structure for your next big idea using intelligent presets.',
    path: '/tools/template-generator',
    icon: LayoutTemplate,
    shadow: 'shadow-purple-500/20',
  },
  {
    title: 'Dashboard Builder',
    description: 'Construct interactive, data-rich dashboards via a seamless drag-and-drop interface.',
    path: '/tools/dashboard-builder',
    icon: LayoutDashboard,
    shadow: 'shadow-emerald-500/20',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-6rem)] px-4 py-12 md:py-24 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center max-w-3xl mb-16 md:mb-24"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
          Select Your Workspace
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-light">
          Choose a tool below to begin crafting your next project. Our integrated suite is designed for maximum efficiency.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl"
      >
        {TOOLS.map(tool => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.path} variants={itemVariants} className="h-full">
              <Link href={tool.path} className="block h-full outline-none group">
                <div
                  className={`relative h-full overflow-hidden rounded-3xl border border-white/10 bg-black/20 p-8 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-white/20 hover:bg-white/[0.02] hover:shadow-2xl ${tool.shadow}`}
                >
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at center, white 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-500 ease-out">
                      <div className={`absolute inset-0 bg-gradient-to-br opacity-20 rounded-2xl blur-md`} />
                      <div className={`absolute inset-0 bg-gradient-to-br opacity-10 rounded-2xl`} />
                      <Icon className="w-6 h-6 text-white relative z-10" />
                    </div>

                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">{tool.title}</h2>

                    <p className="mb-8 text-sm text-slate-400 leading-relaxed flex-grow group-hover:text-slate-300 transition-colors">{tool.description}</p>

                    <div className="mt-auto flex items-center text-sm font-semibold tracking-wide text-white/50 group-hover:text-white transition-colors duration-300">
                      <span>Launch Tool</span>
                      <ArrowRight className="ml-2 h-4 w-4 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
