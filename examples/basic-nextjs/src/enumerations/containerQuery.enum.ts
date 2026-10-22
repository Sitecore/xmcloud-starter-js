const TwScreens = {
  containers: {
    xs: '400px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
    '3xl': '1920px',
  },
};

const containerParse = (container: keyof typeof TwScreens.containers): number => {
  const value = TwScreens.containers[container] as string;
  if (typeof value === 'string') {
    if (value.includes('rem')) {
      return parseInt(value.replace('rem', ''), 10) * 16;
    }
    return parseInt(value.replace('px', ''), 10);
  }
  return 0; //.return value
};

export const breakpoints = Object.keys(TwScreens.containers).reduce(
  (acc: { [key: string]: number }, container) => {
    acc[container] = containerParse(container as keyof typeof TwScreens.containers);
    return acc;
  },
  {}
);

export type Breakpoint = keyof typeof breakpoints;
