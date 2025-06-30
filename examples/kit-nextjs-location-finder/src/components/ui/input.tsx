import * as React from 'react';

import { cn } from '@/lib/utils';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input bg-foreground ring-offset-background text-background file:text-background placeholder:text-muted-foreground focus-visible:ring-ring rounded-default font-heading flex h-10 w-full border px-3 py-2 text-base font-normal leading-none file:border-0 file:bg-transparent file:text-sm file:font-normal focus:placeholder-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
