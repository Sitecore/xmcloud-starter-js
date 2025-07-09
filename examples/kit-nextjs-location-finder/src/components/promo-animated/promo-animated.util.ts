import { cva } from 'class-variance-authority';
// ~~~~ Rendering param options ~~~~

// Background extending to left behind image
export const imageBgExtensionRenderingParams = cva(
  ['promo-animated__image-bg-extension', 'absolute', 'bottom-0', 'top-0', 'w-[100vw]'],
  {
    variants: {
      colorScheme: {
        primary: 'bg-primary',
        secondary: 'bg-accent',
      },
    },
    defaultVariants: {
      colorScheme: 'primary',
    },
  }
);

// Animated sprite in front of image
export const animatedSpriteRenderingParams = cva(
  ['promo-animated__sprite', 'h-full', 'w-full', 'rounded-full', 'pointer-events-none'],
  {
    variants: {
      colorScheme: {
        primary: 'bg-accent',
        secondary: 'bg-primary',
      },
    },
    defaultVariants: {
      colorScheme: 'primary',
    },
  }
);
