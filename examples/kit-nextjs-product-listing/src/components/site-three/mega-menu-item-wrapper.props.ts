import type { ReactNode } from 'react';

export interface MegaMenuContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
}

export interface MegaMenuToggleProps {
  menuId: string;
  className?: string;
  trigger: ReactNode;
  children: ReactNode;
}

export interface MegaMenuContentProps {
  menuId: string;
  children: ReactNode;
}

export interface MegaMenuBackButtonProps {
  menuId: string;
  children: ReactNode;
}