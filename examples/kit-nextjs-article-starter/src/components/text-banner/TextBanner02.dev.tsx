import { TextBannerProps } from './text-banner.props';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Flex } from '@/components/flex/Flex.dev';
import { Link } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import { cva } from 'class-variance-authority';
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
        <div className="mx-auto flex max-w-lg flex-col items-center space-y-4 px-4 text-center md:px-6">
          <h2>
            <Text field={heading} />
          </h2>
          <p className="text-balance text-base font-medium">
            <Text field={description} />
          </p>
          <div className="flex flex-wrap gap-4">
            {link && (
              <Flex justify="end">
                <Button asChild size="sm">
                  <Link field={link} />
                </Button>
              </Flex>
            )}
            {link2 && (
              <Flex justify="end">
                <Button asChild variant="secondary" size="sm">
                  <Link field={link2} />
                </Button>
              </Flex>
            )}
          </div>
        </div>
      </section>
    );
  }
  return <NoDataFallback componentName="Text Banner: 02" />;
};
