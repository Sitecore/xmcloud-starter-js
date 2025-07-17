import { Placeholder, useSitecore } from '@sitecore-content-sdk/nextjs';
import {
  getContainerPlaceholderProps,
  isContainerPlaceholderEmpty,
} from '@/components/container/container.util';
import { cn } from '@/lib/utils';
import { ComponentProps } from '@/lib/component-props';

import type { JSX } from 'react';

export type Container6321Props = ComponentProps & {
  col1?: JSX.Element;
  col2?: JSX.Element;
  col3?: JSX.Element;
  col4?: JSX.Element;
  col5?: JSX.Element;
  col6?: JSX.Element;
  children: Element;
};

export const Default: React.FC<Container6321Props> = (props) => {
  const { rendering, col1, col2, col3, col4, col5, col6 } = props;

  const { page } = useSitecore();
  const { isEditing } = page.mode;

  const col1Placeholder = getContainerPlaceholderProps('container-sixty-thirty-one', props.params);
  const col2Placeholder = getContainerPlaceholderProps('container-sixty-thirty-two', props.params);
  const col3Placeholder = getContainerPlaceholderProps(
    'container-sixty-thirty-three',
    props.params
  );
  const col4Placeholder = getContainerPlaceholderProps('container-sixty-thirty-four', props.params);
  const col5Placeholder = getContainerPlaceholderProps('container-sixty-thirty-five', props.params);
  const col6Placeholder = getContainerPlaceholderProps('container-sixty-thirty-six', props.params);

  const isEmptyPlaceholder =
    isContainerPlaceholderEmpty(rendering, col1Placeholder, col1) &&
    isContainerPlaceholderEmpty(rendering, col2Placeholder, col2) &&
    isContainerPlaceholderEmpty(rendering, col3Placeholder, col3) &&
    isContainerPlaceholderEmpty(rendering, col4Placeholder, col4) &&
    isContainerPlaceholderEmpty(rendering, col5Placeholder, col5) &&
    isContainerPlaceholderEmpty(rendering, col6Placeholder, col6);

  if (isEmptyPlaceholder && !isEditing) {
    return null;
  }

  const excludeTopMargin = props?.params?.excludeTopMargin === '1' ? true : false;

  return (
    <section
      className={cn('container--6321', 'mt-10 bg-[#f5f5f5]', {
        'mt-0': excludeTopMargin,
        [props.params.styles]: props?.params?.styles,
      })}
    >
      <div className="w-full mx-auto max-w-[1760px] flex flex-wrap">
        <FlexItem>
          <Placeholder name={col1Placeholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem>
          <Placeholder name={col2Placeholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem>
          <Placeholder name={col3Placeholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem>
          <Placeholder name={col4Placeholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem>
          <Placeholder name={col5Placeholder.dynamicKey} rendering={rendering} />
        </FlexItem>
        <FlexItem>
          <Placeholder name={col6Placeholder.dynamicKey} rendering={rendering} />
        </FlexItem>
      </div>
    </section>
  );
};

type FlexItemProps = {
  children: React.ReactNode;
};

const FlexItem: React.FC<FlexItemProps> = (props) => {
  const { children } = props;
  return (
    <div className="w-full p-4 mb-4 md:w-1/2 lg:w-1/3 xl:w-1/6 flex items-start justify-start">
      {children}
    </div>
  );
};
