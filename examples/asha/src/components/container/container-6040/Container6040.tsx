import { Container6040Props } from '@/components/container/container-6040/container-6040.props';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';
import componentMap from '.sitecore/component-map';

export const Default: React.FC<Container6040Props> = (props) => {
  const { rendering, left, right, page } = props;

  const isPageEditing = page.mode.isEditing;

  const leftPlaceholders = getContainerPlaceholderProps('container-sixty-left', props.params);
  const rightPlaceholders = getContainerPlaceholderProps('container-forty-right', props.params);

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, leftPlaceholders, left) &&
    isContainerPlaceholderEmpty(rendering, rightPlaceholders, right);

  if (isEmptyPlaceholder && !isPageEditing) {
    return null;
  }

  const excludeTopMargin = props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--6040', 'mt-4', {
        'mt-0': excludeTopMargin,
        [props.params.styles as string]: props?.params?.styles,
      })}
    >
      <Flex wrap="nowrap">
        <FlexItem as="div" basis="6/10">
          <AppPlaceholder
            name={leftPlaceholders.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
        <FlexItem as="div" basis="4/10">
          <AppPlaceholder
            name={rightPlaceholders.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
      </Flex>
    </section>
  );
};
