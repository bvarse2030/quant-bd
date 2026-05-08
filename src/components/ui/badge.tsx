/*
|-----------------------------------------
| setting up Badge for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90',
        secondary: 'border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90',
        destructive:
          'border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline: 'text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground',
        garden: 'text-slate-700 hover:text-slate-800 bg-green-400 hover:bg-green-500 border-green-500 hover:border-green-600',
        fire: 'text-slate-700 hover:text-slate-800 bg-rose-400 hover:bg-rose-500 border-rose-500 hover:border-rose-600',
        water: 'text-slate-700 hover:text-slate-800 bg-blue-400 hover:bg-blue-500 border-blue-500 hover:border-blue-600',
        outlineGarden:
          'border-1 border-green-400 shadow-xl bg-green-300/40 shadow-xs hover:bg-green-400 transition-all duration-300  text-green-800 hover:text-green-50',
        outlineFire:
          'border-1 border-rose-400 shadow-xl bg-rose-300/40 shadow-xs hover:bg-rose-400 transition-all duration-300 text-rose-800 hover:text-rose-50',
        outlineWater:
          'border-1 border-blue-400 shadow-xl bg-blue-300/40 shadow-xs hover:bg-blue-400 transition-all duration-300 text-blue-800 hover:text-blue-50',
        outlineDefault:
          'border-1 border-gray-400 shadow-xl bg-gray-300/40 shadow-xs hover:bg-gray-400 transition-all duration-300 text-gray-800 hover:text-gray-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

function Badge({ className, variant, asChild = false, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span';

  return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
