/*
|-----------------------------------------
| setting up Tabs for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, April, 2026
|-----------------------------------------
*/

'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from '@/lib/utils';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col gap-2', className)} {...props} />;
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('inline-flex h-10 items-center justify-center rounded-lg p-1 gap-2', className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'h-8 px-3 rounded-md flex items-center justify-center gap-1.5 text-sm font-medium text-white transition-all duration-300 cursor-pointer whitespace-nowrap',
        'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/30 backdrop-blur-xl shadow-lg shadow-blue-500/20',
        'opacity-40', // Dimmed when inactive

        'hover:from-blue-500/30 hover:to-purple-500/30 hover:border-white/50 hover:shadow-xl hover:shadow-purple-500/30 hover:scale-[1.02] hover:opacity-100',

        'data-[state=active]:opacity-100 data-[state=active]:shadow-purple-500/40 data-[state=active]:border-white/60',

        "has-[svg]:px-2.5 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",

        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 disabled:pointer-events-none disabled:opacity-20',

        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return <TabsPrimitive.Content data-slot="tabs-content" className={cn('flex-1 outline-none mt-2', className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
