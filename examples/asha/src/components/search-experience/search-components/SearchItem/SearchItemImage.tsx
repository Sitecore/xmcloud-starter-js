'use client';
import { HTMLAttributes, useState } from 'react';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { cn } from 'lib/utils';
import { SearchItemFields } from './index';
import { SearchItemVariant } from '../SearchItemCommon';

type SearchItemImageProps = {
  image: SearchItemFields['image'];
  alt?: string;
  variant?: SearchItemVariant;
  width?: number;
  height?: number;
} & HTMLAttributes<HTMLDivElement>;

export const SearchItemImage = ({
  className,
  alt,
  image,
  variant = 'card',
  width = 400,
  height = 250,
  ...props
}: SearchItemImageProps) => {
  const [brokenImage, setBrokenImage] = useState<boolean>(false);
  const isCard = variant === 'card';

  return (
    image && (
      <div
        className={cn('bg-gray-900 relative', isCard ? 'w-full' : 'h-full', className)}
        style={isCard ? { height } : { width }}
        {...props}
      >
        {!brokenImage ? (
          <Image
            fill
            src={image.value}
            alt={alt || 'Product image'}
            onError={() => setBrokenImage(true)}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <FontAwesomeIcon icon={faImage} size="2xl" className="text-gray-300" />
          </div>
        )}
      </div>
    )
  );
};
