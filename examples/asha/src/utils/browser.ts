export const isBrowser = typeof window !== 'undefined';
export const hasDocument = typeof document !== 'undefined';

export const hasSessionStorage = (): boolean =>
  isBrowser && typeof window.sessionStorage !== 'undefined';

export const hasNavigator = (): boolean => isBrowser && typeof navigator !== 'undefined';
