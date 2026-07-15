import type React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type PromoAnimatedEmptyImageEditingProps = {
  className?: string;
};

export const PromoAnimatedEmptyImageEditing: React.FC<PromoAnimatedEmptyImageEditingProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        'relative h-full w-full overflow-hidden rounded-full bg-muted text-muted-foreground',
        className
      )}
    >
      <ImageIcon
        className="pointer-events-none absolute left-[30%] top-1/2 h-[20%] w-[20%] -translate-x-1/2 -translate-y-1/2"
        strokeWidth={1.75}
        aria-hidden
      />
    </div>
  );
};
