import type React from 'react';
import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';
import { PlaceholderProps } from 'types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';
import type { JSX } from 'react';

/**
 * Model used for Sitecore Component integration
 */
type Container3070Props = ComponentProps &
  PlaceholderProps & {
    left?: JSX.Element;
    right?: JSX.Element;
  };
export const Default: React.FC<Container3070Props> = (props) => {
  const { rendering, left, right } = props;

  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;

  const leftPlaceholders = getContainerPlaceholderProps('container-thirty-left', props.params);
  const rightPlaceholders = getContainerPlaceholderProps('container-seventy-right', props.params);

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, leftPlaceholders, left) &&
    isContainerPlaceholderEmpty(rendering, rightPlaceholders, right);

  if (isEmptyPlaceholder && !isPageEditing) {
    return null;
  }

  const excludeTopMargin = props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--3070', 'mt-4', {
        'mt-0': excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <Flex wrap="nowrap">
        <FlexItem as="div" basis="3/10">
          <Placeholder name={leftPlaceholders.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem as="div" basis="7/10">
          <Placeholder name={rightPlaceholders.dynamicKey} rendering={rendering} />
        </FlexItem>
      </Flex>
    </section>
  );
};
