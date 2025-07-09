import { Text } from '@sitecore-content-sdk/nextjs';
import { Default as ImageWrapper } from '@/components/image/ImageWrapper.dev';
import { ImageProps } from '@/components/image/image.props';
import { cn } from '@/lib/utils';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<ImageProps> = (props) => {
  console.debug('ImageBlock', props);
  const fields = props.fields ?? props.rendering.fields;
  console.debug('ImageBlock fields', fields);
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
