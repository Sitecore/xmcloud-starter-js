import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import { ContainerFullWidthProps } from '@/components/container/container-full-width/container-full-width.props';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';

export const Default: React.FC<ContainerFullWidthProps> = (props) => {
  const { rendering, children } = props;

  const { page } = useSitecore();
  const { isEditing } = page.mode;

  const PLACEHOLDER_FRAGMENT = 'container-fullwidth';
  const PLACEHOLDER_NAME = `${PLACEHOLDER_FRAGMENT}-${props.params.DynamicPlaceholderId}`;
  const isEmptyPlaceholder =
    !(
      rendering?.placeholders?.[PLACEHOLDER_NAME] ||
      rendering?.placeholders?.[`${PLACEHOLDER_FRAGMENT}-{*}`]
    ) && !children;

  if (isEmptyPlaceholder && !isEditing) {
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
