'use client';

import { useToggleWithClickOutside } from '@/hooks/useToggleWithClickOutside';
import type { MobileMenuWrapperProps } from './mobile-menu-wrapper.props';

export const MobileMenuWrapper = ({ children }: MobileMenuWrapperProps) => {
  const {
    isVisible: isMobileMenuVisible,
    setIsVisible: setIsMobileMenuVisible,
    ref,
  } = useToggleWithClickOutside<HTMLLIElement>(false);

  return (
    <li
      ref={ref}
      className="lg:hidden flex justify-center items-center p-4 cursor-pointer relative"
    >
      {/* Mobile Menu Toggle Button */}
      <button
        className="relative w-5 h-4 flex items-center justify-center"
        onClick={() => setIsMobileMenuVisible(!isMobileMenuVisible)}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuVisible}
      >
        <span className="relative w-5 h-4">
          <span
            className={`absolute left-0 top-0 w-full h-0.5 bg-current origin-top-right transition-transform duration-300 ease-in-out ${
              isMobileMenuVisible ? '-rotate-47' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
              isMobileMenuVisible ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`absolute left-0 bottom-0 w-full h-0.5 bg-current origin-bottom-right transition-transform duration-300 ease-in-out ${
              isMobileMenuVisible ? 'rotate-47' : ''
            }`}
          />
        </span>
      </button>

      {/* Mobile Menu Content */}
      <div
        className={`${
          isMobileMenuVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }
          fixed top-14 left-0 right-0
          flex flex-col items-center justify-center
          h-[calc(100vh-3.5rem)] p-4
          overflow-auto bg-background transition-all duration-300 ease-in-out z-50`}
      >
        {children}
      </div>
    </li>
  );
};
