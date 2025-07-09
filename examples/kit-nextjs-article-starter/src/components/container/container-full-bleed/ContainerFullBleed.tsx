import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { cva } from 'class-variance-authority';
import { PlaceholderProps } from '@/types/Placeholder.props';
import { ComponentProps } from '@/lib/component-props';
import { BackgroundColor } from '@/enumerations/BackgroundColor.enum';

/**
 * Model used for Sitecore Component integration
 */
type ContainerFullBleedProps = ComponentProps & PlaceholderProps & ContainerFullBleedParams;

type ContainerFullBleedParams = {
  params?: {
    backgroundColor?: BackgroundColor;
    backgroundImagePath?: string;
    excludeTopMargin?: string;
    inset?: string;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};

export const Default: React.FC<ContainerFullBleedProps> = (props) => {
  const { rendering } = props;

  const PLACEHOLDER_NAME = `container-fullbleed-${props.params.DynamicPlaceholderId}`;

  const backgroundImage = props?.params?.backgroundImagePath
    ? props?.params?.backgroundImagePath
    : '';

  const backgroundColor = props?.params?.backgroundColor;
  const inset =
    backgroundColor === 'transparent' ? false : props?.params?.inset === '1' ? true : false;
  const padding =
    inset === true || backgroundColor === 'transparent' || backgroundColor === undefined
      ? 'noPadding'
      : 'backgroundPadding';

  const margin = props?.params?.excludeTopMargin === '1' ? 'excludeMargin' : 'defaultMargin';

  // Variants
  const containerVariants = cva(['group @container container--full-bleed', props?.params?.styles], {
    variants: {
      backgroundColor: {
        primary: ['has-bg bg-primary text-primary-foreground'],
        secondary: ['has-bg bg-secondary text-secondary-foreground'],
        tertiary: ['has-bg bg-tertiary text-tertiary-foreground'],
        transparent: 'bg-transparent',
      },
      inset: {
        false: null,
        true: [
          'is-inset px-4 sm:px-8 md:px-16 2xl:px-24 mx-4 overflow-hidden rounded-3xl min-[1440px]:mx-auto max-w-[1408px]',
        ],
      },
      margin: {
        defaultMargin: 'my-8 sm:my-16',
        excludeMargin: 'mt-0 mb-0',
      },
      padding: {
        backgroundPadding: 'py-4 sm:py-16',
        noPadding: 'py-0',
      },
    },
    defaultVariants: {
      backgroundColor: 'transparent',
      inset: false,
      margin: 'defaultMargin',
      padding: 'noPadding',
    },
  });

  return (
    <section
      className={containerVariants({ backgroundColor, inset, margin, padding })}
      style={{
        ...(backgroundImage && {
          backgroundImage: `url('${backgroundImage}')`,
          backgroundSize: 'cover',
        }),
      }}
    >
      <Flex fullBleed={true} className="group-[.is-inset]:p-0">
        <FlexItem basis="full">
          <Placeholder name={PLACEHOLDER_NAME} rendering={rendering} />
        </FlexItem>
      </Flex>
    </section>
  );
};
