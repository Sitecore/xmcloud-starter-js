import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';
interface SuccessCompactProps {
  successMessage: string;
}

export const SuccessCompact = ({ successMessage }: SuccessCompactProps) => (
  <div className={cn('animate-fade-in w-full opacity-100 transition-all duration-300 ease-in-out')}>
    <div className="flex h-12 items-center space-x-3 rounded-md px-2 group-[.position-center]:justify-center">
      <div className="relative flex-shrink-0">
        <span className="bg-primary-foreground absolute inset-0 inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
        <CheckCircle className="relative z-10 h-8 w-8" />
      </div>
      <p className={cn('animate-fade-in font-medium')}>{successMessage}</p>
    </div>
  </div>
);
