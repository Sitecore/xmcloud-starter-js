import type React from 'react';
import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';
import { PlaceholderProps } from '@/types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';

/**
 * Model used for Sitecore Component integration
 */
type Container70Props = ComponentProps & PlaceholderProps & Container70Params;

type Container70Params = {
  params?: {
    excludeTopMargin?: string;
  };
};

export const Default: React.FC<Container70Props> = (props) => {
  const { rendering, children } = props;

  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;

  const PLACEHOLDER_FRAGMENT = 'container-seventy';
  const PLACEHOLDER_NAME = `${PLACEHOLDER_FRAGMENT}-${props.params.DynamicPlaceholderId}`;
  const isEmptyPlaceholder =
    !(
      rendering?.placeholders?.[PLACEHOLDER_NAME] ||
      rendering?.placeholders?.[`${PLACEHOLDER_FRAGMENT}-{*}`]
    ) && !children;

  if (isEmptyPlaceholder && !isPageEditing) {
    return null;
  }

  const excludeTopMargin = props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      data-component="Container70"
      data-class-change
      className={cn({
        'mt-4': !excludeTopMargin,
        'mt-0': excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <Flex className="group-[.is-inset]:p-0">
        <FlexItem basis="full">
          <div className="mx-auto md:max-w-[70%]">
            <Placeholder name={PLACEHOLDER_NAME} rendering={rendering} />
          </div>
        </FlexItem>
      </Flex>
    </section>
  );
};
