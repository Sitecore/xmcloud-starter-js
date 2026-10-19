import type { ReactNode } from 'react';

export interface MobileMenuWrapperProps {
  children: ReactNode;
  alwaysVisible?: boolean;
  className?: string;
  label?: string;
  panelClassName?: string;
}