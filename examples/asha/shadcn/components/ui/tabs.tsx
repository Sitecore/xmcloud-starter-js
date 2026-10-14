import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';

import { cn } from 'components/lib/utils';

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root data-slot="tabs" className={cn('flex flex-col', className)} {...props} />
  );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn('w-full flex flex-col md:flex-row', className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "flex flex-1 items-center justify-center gap-1.5 border border-b-0 last:border-b md:border-b md:border-e-0 last:border-e md:data-[state=active]:border-b-transparent py-6 px-8 text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        'flex-1 outline-none data-[state=inactive]:hidden border border-t-0 p-12',
        className
      )}
      forceMount
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };

