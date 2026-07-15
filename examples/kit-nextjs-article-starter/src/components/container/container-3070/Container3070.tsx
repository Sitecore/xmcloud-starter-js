import type React from 'react';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';
import componentMap from '.sitecore/component-map';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import { Container3070Props } from './container-3070.props';

export const Default: React.FC<Container3070Props> = (props) => {
  const { rendering, left, right, page } = props;

  const isPageEditing = page.mode.isEditing;

  const leftPlaceholders = getContainerPlaceholderProps(
    'container-thirty-left',
    props.params,
  );
  const rightPlaceholders = getContainerPlaceholderProps(
    'container-seventy-right',
    props.params,
  );

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, leftPlaceholders, left) &&
    isContainerPlaceholderEmpty(rendering, rightPlaceholders, right);

  if (isEmptyPlaceholder && !isPageEditing) {
    return null;
  }

  const excludeTopMargin =
    props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--3070', 'mt-4', {
        'mt-0': excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <Flex wrap="nowrap">
        <FlexItem as="div" basis="3/10">
          <AppPlaceholder
            name={leftPlaceholders.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
        <FlexItem as="div" basis="7/10">
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
