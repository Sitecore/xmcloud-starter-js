import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Container303030Props } from '@/components/container/container-303030/container-303030.props';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { cn } from '@/lib/utils';
import { FlexItemProps } from 'components/flex/Flex.dev';

export const Default: React.FC<Container303030Props> = (props) => {
  const { rendering, left, center, right } = props;

  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;

  const leftPlaceholder = getContainerPlaceholderProps('container-thirty-left', props.params);
  const centerPlaceholder = getContainerPlaceholderProps('container-thirty-center', props.params);
  const rightPlaceholder = getContainerPlaceholderProps('container-thirty-right', props.params);

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, leftPlaceholder, left) &&
    isContainerPlaceholderEmpty(rendering, centerPlaceholder, center) &&
    isContainerPlaceholderEmpty(rendering, rightPlaceholder, right);

  if (isEmptyPlaceholder && !isPageEditing) {
    return null;
  }

  const excludeTopMargin = props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--303030', 'mt-4', {
        'mt-0': excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <div className="w-full mx-auto max-w-[1760px] flex flex-wrap items-stretch">
        <FlexItem as="div" basis="1/3">
          <Placeholder name={leftPlaceholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem as="div" basis="1/3">
          <Placeholder name={centerPlaceholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem as="div" basis="1/3">
          <Placeholder name={rightPlaceholder.dynamicKey} rendering={rendering} />
        </FlexItem>
      </div>
    </section>
  );
};

const FlexItem: React.FC<FlexItemProps> = (props) => {
  const { children } = props;
  return (
    <div className="w-full p-4 mb-4 md:w-1/2 lg:w-1/3 flex flex-col items-start justify-start">
      {children}
    </div>
  );
};
