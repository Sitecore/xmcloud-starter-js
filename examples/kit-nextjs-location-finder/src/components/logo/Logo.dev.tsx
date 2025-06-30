import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { cn } from '@/lib/utils';
import { ImageField } from '@sitecore-content-sdk/nextjs';

type LogoProps = {
  logo?: ImageField;
  className?: string;
};
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
