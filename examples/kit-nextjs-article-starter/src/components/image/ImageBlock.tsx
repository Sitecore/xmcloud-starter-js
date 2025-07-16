import type React from 'react';
import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageProps } from '@/components/image/image.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<ImageProps> = (props) => {
  const { fields } = props;
  const { image, caption } = fields ?? {};

  if (fields !== undefined) {
    return (
      <div className={cn('component', props.params.styles)}>
        <ImageWrapper image={image} className="mb-[24px] h-full w-full object-cover" />
        <p>
          <Text field={caption} />
        </p>
      </div>
    );
  }
  return <NoDataFallback componentName="Image" />;
};
