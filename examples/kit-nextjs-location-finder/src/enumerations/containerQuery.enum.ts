import { default as TwScreens } from '@/assets/configs/containers.tailwind';

const containerParse = (container: keyof typeof TwScreens.default.containers): number => {
  const value = TwScreens.default.containers[container] as string;
  if (typeof value === 'string') {
    if (value.includes('rem')) {
      return parseInt(value.replace('rem', ''), 10) * 16;
    }
    return parseInt(value.replace('px', ''), 10);
  }
  return 0; // Default return value
};

export const breakpoints = Object.keys(TwScreens.default.containers).reduce(
  (acc: { [key: string]: number }, container) => {
    acc[container] = containerParse(container as keyof typeof TwScreens.default.containers);
    return acc;
  },
  {}
);

export type Breakpoint = keyof typeof breakpoints;
