import type { ReactNode } from 'react';

export type NavigationMenuToggleProps = {
  isEditing: boolean;
  onToggle: (event?: React.MouseEvent<HTMLElement>, flag?: boolean) => void;
  children: ReactNode;
};