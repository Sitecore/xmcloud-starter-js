import { TextBannerProps } from './text-banner.props';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Flex, FlexItem } from '@/components/flex/Flex.dev';
import { Link } from '@sitecore-content-sdk/nextjs';
import { Text } from '@sitecore-content-sdk/nextjs';
import { NoDataFallback } from '@/utils/NoDataFallback';

export const Default: React.FC<TextBannerProps> = (props) => {
  const { fields, params } = props;

  const { heading, description, link, image } = fields ?? {};
  const { excludeTopMargin } = params ?? {};
  const inline = image?.value?.src ? { '--bg-img': `url(${image?.value.src})` } : {};
  if (fields) {
    return (
      <section
        className={cn(
          'p-5',
          'mt-4',
          'bg-cover',
          'bg-center',
          'bg-img-primary',
          'text-primary-foreground',
          {
            'mt-0': excludeTopMargin,
            [props?.params?.styles]: props?.params?.styles,
          }
        )}
        style={inline as React.CSSProperties}
      >
        <Flex wrap="wrap" align="center" as="div" gap="3" className="px-4 py-6">
          <FlexItem basis="full">
            <h3>
              <Text field={heading} />
            </h3>
          </FlexItem>
          <FlexItem basis="auto">
            <p>
              <Text field={description} />
            </p>
          </FlexItem>
          <FlexItem basis="auto" grow="1">
            {link && (
              <Flex justify="end">
                <Button asChild>
                  <Link field={link} />
                </Button>
              </Flex>
            )}
          </FlexItem>
        </Flex>
      </section>
    );
  }
  return <NoDataFallback componentName="Text Banner" />;
};
