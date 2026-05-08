/*
|-----------------------------------------
| setting up LinkButton for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import NextLink from 'next/link';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const customLinkVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] cursor-pointer min-w-[80px] no-underline decoration-transparent",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 text-black',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        garden:
          'text-white bg-linear-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02]',
        fire: 'text-white bg-linear-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 shadow-lg shadow-rose-500/30 hover:shadow-xl hover:shadow-rose-500/40 hover:scale-[1.02]',
        water:
          'text-white bg-linear-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:scale-[1.02]',
        outlineGarden:
          'border border-green-400/50 text-green-100 bg-green-400/20 backdrop-blur-md shadow-lg shadow-green-500/20 hover:bg-green-400/30 hover:border-green-400/70 hover:shadow-xl hover:shadow-green-500/30 hover:scale-[1.02]',
        outlineFire:
          'border border-rose-400/50 text-rose-100 bg-rose-400/20 backdrop-blur-md shadow-lg shadow-rose-500/20 hover:bg-rose-400/30 hover:border-rose-400/70 hover:shadow-xl hover:shadow-rose-500/30 hover:scale-[1.02]',
        outlineWater:
          'border border-blue-400/50 text-blue-100 bg-blue-400/20 backdrop-blur-md shadow-lg shadow-blue-500/20 hover:bg-blue-400/30 hover:border-blue-400/70 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02]',
        outlineDefault:
          'border border-gray-400/50 text-gray-100 bg-gray-400/20 backdrop-blur-md shadow-lg shadow-gray-500/20 hover:bg-gray-400/30 hover:border-gray-400/70 hover:shadow-xl hover:shadow-gray-500/30 hover:scale-[1.02]',
        outlineGlassy:
          'bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-white/30 text-white backdrop-blur-xl shadow-lg shadow-blue-500/20 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02]',
        glassyPrimary:
          'bg-white/10 border border-white/20 text-white backdrop-blur-2xl shadow-lg hover:bg-white/20 hover:border-white/30 hover:shadow-xl hover:scale-[1.02]',
        glassySuccess:
          'bg-linear-to-r from-emerald-500/20 to-green-500/20 border border-emerald-400/30 text-emerald-100 backdrop-blur-xl shadow-lg shadow-emerald-500/20 hover:from-emerald-500/30 hover:to-green-500/30 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-[1.02]',
        glassyDanger:
          'bg-linear-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-100 backdrop-blur-xl shadow-lg shadow-red-500/20 hover:from-red-500/30 hover:to-pink-500/30 hover:border-red-400/50 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.02]',
        glassyWarning:
          'bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-100 backdrop-blur-xl shadow-lg shadow-amber-500/20 hover:from-amber-500/30 hover:to-orange-500/30 hover:border-amber-400/50 hover:shadow-xl hover:shadow-amber-500/30 hover:scale-[1.02]',
        glassyInfo:
          'bg-linear-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-100 backdrop-blur-xl shadow-lg shadow-cyan-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-500/30 hover:scale-[1.02]',
        glassyDark:
          'bg-linear-to-r from-slate-800/40 to-slate-900/40 border border-slate-600/30 text-slate-100 backdrop-blur-xl shadow-lg shadow-slate-900/30 hover:from-slate-800/50 hover:to-slate-900/50 hover:border-slate-600/50 hover:shadow-xl hover:shadow-slate-900/40 hover:scale-[1.02]',
        glassyLight:
          'bg-linear-to-r from-white/30 to-gray-100/30 border border-white/40 text-gray-800 backdrop-blur-xl shadow-lg hover:from-white/40 hover:to-gray-100/40 hover:border-white/60 hover:shadow-xl hover:scale-[1.02]',
        neonBlue:
          'bg-blue-500/20 border border-blue-400/50 text-blue-100 backdrop-blur-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] hover:bg-blue-500/30 hover:border-blue-400/70 hover:scale-[1.02]',
        neonPink:
          'bg-pink-500/20 border border-pink-400/50 text-pink-100 backdrop-blur-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] hover:bg-pink-500/30 hover:border-pink-400/70 hover:scale-[1.02]',
        neonGreen:
          'bg-green-500/20 border border-green-400/50 text-green-100 backdrop-blur-xl shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] hover:bg-green-500/30 hover:border-green-400/70 hover:scale-[1.02]',
        neonPurple:
          'bg-purple-500/20 border border-purple-400/50 text-purple-100 backdrop-blur-xl shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] hover:bg-purple-500/30 hover:border-purple-400/70 hover:scale-[1.02]',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        xs: 'h-6 rounded-md gap-1.5 px-3 text-xs has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        xl: 'h-12 rounded-lg px-8 text-base has-[>svg]:px-5',
        icon: 'size-9',
        iconSm: 'size-8',
        iconLg: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

interface CustomLinkProps extends React.ComponentPropsWithoutRef<typeof NextLink>, VariantProps<typeof customLinkVariants> {}

const CustomLink = React.forwardRef<HTMLAnchorElement, CustomLinkProps>(({ className, variant, size, ...props }, ref) => {
  return <NextLink ref={ref} className={cn(customLinkVariants({ variant, size, className }))} {...props} />;
});

CustomLink.displayName = 'CustomLink';

export { CustomLink, customLinkVariants };
