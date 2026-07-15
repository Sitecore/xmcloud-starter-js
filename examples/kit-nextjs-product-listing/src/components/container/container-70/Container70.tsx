import { Container70Props } from '@/components/container/container-70/container-70.props';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { cn } from '@/lib/utils';
import componentMap from '.sitecore/component-map';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';

export const Default: React.FC<Container70Props> = (props) => {
  const { rendering, children, page } = props;

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
        [props.params?.styles as string]: props?.params?.styles,
      })}
    >
      <Flex className="group-[.is-inset]:p-0">
        <FlexItem basis="full">
          <div className="mx-auto md:max-w-[70%]">
            <AppPlaceholder
              name={PLACEHOLDER_NAME}
              rendering={rendering}
              page={page}
              componentMap={componentMap}
            />
          </div>
        </FlexItem>
      </Flex>
    </section>
  );
};
