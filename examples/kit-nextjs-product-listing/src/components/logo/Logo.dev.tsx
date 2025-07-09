import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { LogoProps } from './logo.props';
import { cn } from '@/lib/utils';
export const Default: React.FC<LogoProps> = (props) => {
  const { logo, className = '' } = props;

  if (!logo?.value?.src) return <></>;

  return (
    <ImageWrapper
      image={logo}
      className={cn('w-full object-contain', className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      alt="Home"
    />
  );
};
