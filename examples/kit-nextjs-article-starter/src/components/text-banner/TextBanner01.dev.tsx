import { TextBannerProps } from './text-banner.props';
import { cn } from '@/lib/utils';

import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { Text } from '@sitecore-content-sdk/nextjs';
import { cva } from 'class-variance-authority';
import { ButtonBase as Button } from '@/components/button-component/ButtonComponent';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<TextBannerProps> = (props) => {
  const { fields, params } = props;

  const { heading, description, link, link2, image } = fields ?? {};
  const { excludeTopMargin, theme } = params ?? {};

  const componentTheme = cva('p-5 mt-4', {
    variants: {
      theme: {
        dark: 'bg-dark text-dark-foreground',
        light: 'bg-gray-100 text-black',
        primary: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        muted: 'bg-muted text-muted-foreground',
        accent: 'bg-accent text-accent-foreground',
      },
      background: {
        image: 'bg-cover bg-center',
        color: '',
      },
    },
    compoundVariants: [
      {
        theme: 'primary',
        background: 'image',
        className: 'bg-img-primary text-primary-foreground',
      },
      {
        theme: 'secondary',
        background: 'image',
        className: 'bg-img-secondary text-secondary-foreground',
      },
      {
        theme: 'muted',
        background: 'image',
        className: 'bg-img-muted text-muted-foreground',
      },
      {
        theme: 'light',
        background: 'image',
        className: 'bg-img-light text-light-foreground',
      },
      {
        theme: 'dark',
        background: 'image',
        className: 'bg-img-dark text-dark-foreground',
      },
      {
        theme: 'accent',
        background: 'image',
        className: 'bg-img-accent text-accent-foreground',
      },
    ],
    defaultVariants: {
      theme: 'primary',
      background: 'color',
    },
  });

  const backgroundImageStyle = image?.value?.src ? { '--bg-img': `url(${image?.value.src})` } : {};
  type BackgroundType = 'image' | 'color';
  const backgroundType: BackgroundType = image?.value?.src ? 'image' : 'color';
  if (fields) {
    return (
      <section
        className={cn(
          componentTheme({
            background: backgroundType,
            theme: theme,
            className: 'relative content-center overflow-hidden rounded',
          }),
          {
            'mt-0': excludeTopMargin,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        style={backgroundImageStyle as React.CSSProperties}
      >
        <Flex wrap="wrap" as="div" gap="3" className="px-4 py-6">
          <FlexItem basis="full">
            <Text tag="h2" field={heading} />
          </FlexItem>
          <FlexItem basis="auto" className="w-full">
            <Text tag="p" field={description} />
          </FlexItem>
          <FlexItem basis="auto" grow="1" className="w-full">
            <div className="align-end flex flex-row justify-end gap-4">
              {link && <Button buttonLink={link} />}
              {link2 && <Button buttonLink={link2} variant="secondary" />}
            </div>
          </FlexItem>
        </Flex>
      </section>
    );
  }
  return <NoDataFallback componentName="Text Banner: 01" />;
};
