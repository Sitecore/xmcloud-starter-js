import { cva } from 'class-variance-authority';
import { Text, Link } from '@sitecore-content-sdk/nextjs';
import { CtaBannerProps } from './cta-banner.props';
import { Button } from '@/components/ui/button';
import { Default as AnimatedSection } from '@/components/animated-section/AnimatedSection.dev';
import { NoDataFallback } from '@/utils/NoDataFallback';

const ctaBannerVariants = cva('w-full mx-auto px-6 py-16 md:py-24 text-center', {
  variants: {
    colorScheme: {
      default: '',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
    },
  },
});

const ctaTitleVariants = cva(
  'mb-6 text-pretty text-4xl font-normal leading-[1.1333] tracking-tighter antialiased md:text-7xl',
  {
    variants: {
      colorScheme: {
        default: '',
        primary: 'text-primary-foreground',
        secondary: 'text-primary',
      },
    },
  }
);

const ctaButtonVariants = cva('text-sm font-heading font-medium', {
  variants: {
    colorScheme: {
      default: '',
      primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
      secondary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    },
  },
});

export const Default: React.FC<CtaBannerProps> = (props) => {
  const { page } = props;
  const isPageEditing = page.mode.isEditing;
  const { fields, params } = props;

  if (fields) {
    const { titleRequired, descriptionOptional, linkOptional } = fields || {};
    const colorScheme = params.colorScheme ?? undefined;

    return (
      <section className={ctaBannerVariants({ colorScheme })}>
        <div className="mx-auto w-full max-w-4xl">
          {/* Use Text component with fallback for heading */}
          <AnimatedSection direction="up" isPageEditing={isPageEditing}>
            <Text tag="h2" className={ctaTitleVariants({ colorScheme })} field={titleRequired} />
            <Text
              tag="p"
              className="mx-auto mb-16 max-w-xl text-lg antialiased"
              field={descriptionOptional}
            />

            {/* Render button with link */}
            {linkOptional && (
              <Button className={ctaButtonVariants({ colorScheme })} asChild>
                <Link field={linkOptional} editable={isPageEditing} />
              </Button>
            )}
          </AnimatedSection>
          {/* Use Text component with fallback for subheading */}
        </div>
      </section>
    );
  }

  return <NoDataFallback componentName="CTA Banner" />;
};
