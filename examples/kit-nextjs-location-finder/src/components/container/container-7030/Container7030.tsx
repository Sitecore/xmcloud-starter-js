import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { Container7030Props } from '@/components/container/container-7030/container-7030.props';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';

export const Default: React.FC<Container7030Props> = (props) => {
  const { rendering, left, right, page, componentMap } = props;

  const { isEditing } = page.mode;

  const leftPlaceholders = getContainerPlaceholderProps('container-seventy-left', props.params);
  const rightPlaceholders = getContainerPlaceholderProps('container-thirty-right', props.params);

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, leftPlaceholders, left) &&
    isContainerPlaceholderEmpty(rendering, rightPlaceholders, right);

  if (isEmptyPlaceholder && !isEditing) {
    return null;
  }

  const excludeTopMargin = props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--7030', 'mt-4', {
        'mt-0': excludeTopMargin,
        [props.params.styles as string]: props?.params?.styles,
      })}
    >
      <Flex wrap="nowrap">
        <FlexItem as="div" basis="7/10">
          <AppPlaceholder page={page} componentMap={componentMap} name={leftPlaceholders.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem as="div" basis="3/10">
          <AppPlaceholder page={page} componentMap={componentMap} name={rightPlaceholders.dynamicKey} rendering={rendering} />
        </FlexItem>
      </Flex>
    </section>
  );
};
