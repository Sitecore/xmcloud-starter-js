import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { cn } from '@/lib/utils';

import componentMap from '.sitecore/component-map';
import { AppPlaceholder } from '@sitecore-content-sdk/nextjs';
import {
  Container25252525FlexItemProps,
  Container25252525Props,
} from './container-25252525.props';

export const Default: React.FC<Container25252525Props> = (props) => {
  const { rendering, col1, col2, col3, col4, page } = props;

  const isPageEditing = page.mode.isEditing;

  const col1Placeholder = getContainerPlaceholderProps(
    'container-25-one',
    props.params,
  );
  const col2Placeholder = getContainerPlaceholderProps(
    'container-25-two',
    props.params,
  );
  const col3Placeholder = getContainerPlaceholderProps(
    'container-25-three',
    props.params,
  );
  const col4Placeholder = getContainerPlaceholderProps(
    'container-25-four',
    props.params,
  );

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, col1Placeholder, col1) &&
    isContainerPlaceholderEmpty(rendering, col2Placeholder, col2) &&
    isContainerPlaceholderEmpty(rendering, col3Placeholder, col3) &&
    isContainerPlaceholderEmpty(rendering, col4Placeholder, col4);

  if (isEmptyPlaceholder && !isPageEditing) {
    return null;
  }

  const excludeTopMargin =
    props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--25252525', 'mt-10', {
        'mt-0': excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <div className="w-full mx-auto max-w-[1760px] flex flex-wrap items-stretch">
        <FlexItem>
          <AppPlaceholder
            name={col1Placeholder.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
        <FlexItem>
          <AppPlaceholder
            name={col2Placeholder.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
        <FlexItem>
          <AppPlaceholder
            name={col3Placeholder.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
        <FlexItem>
          <AppPlaceholder
            name={col4Placeholder.dynamicKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </FlexItem>
      </div>
    </section>
  );
};

const FlexItem: React.FC<Container25252525FlexItemProps> = (props) => {
  const { children } = props;
  return (
    <div className="w-full p-4 mb-4 md:w-1/2 lg:w-1/4 flex flex-col items-start justify-start">
      {children}
    </div>
  );
};
