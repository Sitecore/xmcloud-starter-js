import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';
import { ComponentProps } from '@/lib/component-props';
import { PlaceholderProps } from '@/types/Placeholder.props';

export type ContainerFullWidthProps = ComponentProps & PlaceholderProps & ContainerFullWidthParams;

export type ContainerFullWidthParams = {
  params?: {
    excludeTopMargin?: string;
  };
};
export const Default: React.FC<ContainerFullWidthProps> = (props) => {
  const { rendering, children } = props;

  const { page } = useSitecore();

  const isPageEditing = page.mode.isEditing;
  const PLACEHOLDER_FRAGMENT = 'container-fullwidth';
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
      className={cn('@container container--full-width group', {
        'mt-0': excludeTopMargin,
        'mt-4': !excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <Flex className="group-[.is-inset]:p-0">
        <FlexItem basis="full">
          <Placeholder name={PLACEHOLDER_NAME} rendering={rendering} />
        </FlexItem>
      </Flex>
    </section>
  );
};
