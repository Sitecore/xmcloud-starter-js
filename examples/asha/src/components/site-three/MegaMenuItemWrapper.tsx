'use client';

import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import { createContext, useContext } from 'react';
import type {
  MegaMenuBackButtonProps,
  MegaMenuContentProps,
  MegaMenuContextType,
  MegaMenuToggleProps,
} from './mega-menu-item-wrapper.props';

const MegaMenuContext = createContext<MegaMenuContextType | null>(null);

const useMegaMenu = (menuId: string) => {
  const context = useContext(MegaMenuContext);
  if (!context) {
    throw new Error(`MegaMenu components must be used within MegaMenuToggle (${menuId})`);
  }
  return context;
};

export const MegaMenuToggle = ({ className, trigger, children }: MegaMenuToggleProps) => {
  const { isVisible, setIsVisible, ref: menuRef } = useToggleWithClickOutside<HTMLLIElement>(false);

  return (
    <MegaMenuContext.Provider value={{ isVisible, setIsVisible }}>
      <li ref={menuRef} className={className} data-class-change>
        <span
          className="inline-block p-4 font-[inherit] whitespace-nowrap cursor-pointer"
          onClick={() => setIsVisible(!isVisible)}
        >
          {trigger}
        </span>
        {children}
      </li>
    </MegaMenuContext.Provider>
  );
};

export const MegaMenuContent = ({ menuId, children }: MegaMenuContentProps) => {
  const { isVisible } = useMegaMenu(menuId);

  return (
    <div
      className={`fixed lg:absolute top-14 left-0 right-0 lg:top-full lg:left-0 lg:right-0
        h-[calc(100vh-3.5rem)] lg:h-auto overflow-auto
        ${
          isVisible
            ? 'opacity-100 translate-x-0 lg:translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-x-full lg:translate-x-0 lg:translate-y-2 pointer-events-none'
        }
        bg-background transition-all duration-300 ease-in-out
        [.partial-editing-mode_&]:!static [.partial-editing-mode_&]:!opacity-100 [.partial-editing-mode_&]:!translate-0 [.partial-editing-mode_&]:!pointer-events-auto`}
    >
      {children}
    </div>
  );
};

export const MegaMenuBackButton = ({ menuId, children }: MegaMenuBackButtonProps) => {
  const { setIsVisible } = useMegaMenu(menuId);

  return (
    <div
      className="lg:hidden flex gap-4 items-center text-sm text-secondary-foreground **:font-(family-name:--font-heading) uppercase cursor-pointer"
      onClick={() => setIsVisible(false)}
    >
      {children}
    </div>
  );
};
