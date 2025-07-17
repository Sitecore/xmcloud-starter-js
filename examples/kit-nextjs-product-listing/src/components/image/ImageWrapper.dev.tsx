import { useContext } from 'react';
import { cn } from '@/lib/utils';
import { ImageField, Image as ContentSdkImage, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ImageOptimizationContext } from '@/components/image/image-optimization.context';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import NextImage, { ImageProps } from 'next/image';
import placeholderImageLoader from '@/utils/placeholderImageLoader';

type ImageWrapperProps = {
  image?: ImageField;
  className?: string;
  priority?: boolean;
  sizes?: string;
  blurDataURL?: string;
  alt?: string;
  wrapperClass?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export const Default: React.FC<ImageWrapperProps> = (props) => {
  const { image, className, wrapperClass, sizes, ...rest } = props;
  const { page } = useSitecore();
  const { isEditing, isPreview } = page.mode;

  const { unoptimized } = useContext(ImageOptimizationContext);
  const ref = useRef(null);
  const inView = useInView(ref);

  if (!isEditing && !image?.value?.src) {
    console.debug('image not found', image);
    return <></>;
  }

  const imageSrc = image?.value?.src ? image?.value?.src : '';
  const isSvg = imageSrc.includes('.svg');
  // if  unoptimized || svg || external
  const isUnoptimized =
    unoptimized ||
    isSvg ||
    (imageSrc.startsWith('https://') &&
      (typeof window !== 'undefined' ? !imageSrc.includes(window.location.hostname) : false));

  const isPicsumImage = imageSrc.includes('picsum.photos');

  return (
    <div className={cn('image-container', wrapperClass)}>
      {isEditing || isPreview || isSvg ? (
        <ContentSdkImage field={image} className={className} />
      ) : (
        <NextImage
          key={image?.value?.src}
          loader={isPicsumImage ? placeholderImageLoader : undefined}
          {...(image?.value as ImageProps)}
          className={className}
          unoptimized={isUnoptimized}
          priority={inView ? true : false}
          sizes={isSvg ? sizes : undefined}
          blurDataURL={image?.value?.src}
          placeholder="blur"
          //if image is an svg and no width is provide, set a default to avoid error, this will be overwritten by css
          {...(!image?.value?.width && isSvg ? { width: 16, height: 16 } : {})}
          {...rest}
        />
      )}
    </div>
  );
};
