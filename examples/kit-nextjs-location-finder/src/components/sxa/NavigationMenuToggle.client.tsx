'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';

type NavigationMenuToggleProps = {
  isEditing: boolean;
  onToggle: (event?: React.MouseEvent<HTMLElement>, flag?: boolean) => void;
  children: ReactNode;
};

/**
 * Client component for handling navigation menu toggle state (mobile hamburger).
 */
export const NavigationMenuToggle = ({
  isEditing,
  onToggle,
  children,
}: NavigationMenuToggleProps) => {
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  const handleToggleMenu = (event?: React.MouseEvent<HTMLElement>, flag?: boolean): void => {
    if (event && isEditing) {
      event.preventDefault();
    }

    if (flag !== undefined) {
      setIsOpenMenu(flag);
      onToggle(event, flag);
      return;
    }

    setIsOpenMenu(!isOpenMenu);
    onToggle(event);
  };

  return (
    <>
      <input
        type="checkbox"
        className="menu-mobile-navigate"
        checked={isOpenMenu}
        onChange={() => handleToggleMenu()}
      />
      {children}
    </>
  );
};
