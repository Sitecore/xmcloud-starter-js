import { Image } from '@sitecore-content-sdk/nextjs';
import { cn } from '@/lib/utils';
import { LogoItemProps } from './logo-tabs.props';

interface LogoButtonProps extends LogoItemProps {
  isActive: boolean;
  onClick: () => void;
  id: string;
  controls: string;
}

export const LogoItem: React.FC<LogoButtonProps> = ({
  logo,
  title,
  isActive,
  onClick,
  id,
  controls,
}) => {
  return (
    <button
      onClick={onClick}
      role="tab"
      id={id}
      aria-selected={isActive}
      aria-controls={controls}
      tabIndex={isActive ? 0 : -1}
      className={cn(
        '@md:w-auto flex h-[58px] w-full items-center justify-center rounded-[20px] bg-white px-6 shadow-lg transition-all duration-300',
        isActive
          ? 'origin-center scale-[1.207] opacity-100'
          : 'scale-100 opacity-50 hover:opacity-75'
      )}
    >
      <span className="sr-only">{title.jsonValue.value}</span>
      <Image field={logo?.jsonValue} className="h-6 w-auto" />
    </button>
  );
};
