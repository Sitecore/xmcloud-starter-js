'use client';

import type React from 'react';

import { cn } from '@/lib/utils';
import { Share2, X } from 'lucide-react';
import {
  AnimatePresence,
  type MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  forceCollapse = false,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  desktopClassName?: string;
  mobileClassName?: string;
  forceCollapse?: boolean;
}) => {
  return (
    <>
      {!forceCollapse && <FloatingDockDesktop items={items} className={desktopClassName} />}
      <FloatingDockMobile items={items} className={mobileClassName} forceCollapse={forceCollapse} />
    </>
  );
};

const Backdrop = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
      onClick={onClick}
      style={{ backdropFilter: 'blur(8px)' }}
    />
  );
};

const FloatingDockMobile = ({
  items,
  className,
  forceCollapse = false,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  className?: string;
  forceCollapse?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const lastItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const closeMenu = useCallback(() => setOpen(false), []);

  // Focus management
  useEffect(() => {
    if (open && firstItemRef.current) {
      // Focus the first menu item when opened
      firstItemRef.current.focus();
    }
  }, [open]);

  // Handle escape key to close menu and other keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          e.preventDefault();
          closeMenu();
          triggerRef.current?.focus();
          break;
        case 'Tab':
          if (!e.shiftKey && document.activeElement === lastItemRef.current) {
            e.preventDefault();
            firstItemRef.current?.focus();
          } else if (e.shiftKey && document.activeElement === firstItemRef.current) {
            e.preventDefault();
            lastItemRef.current?.focus();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (document.activeElement === lastItemRef.current) {
            firstItemRef.current?.focus();
          } else {
            const currentIndex = items.findIndex(
              (_, i) => document.activeElement === menuRef.current?.querySelectorAll('button')[i]
            );
            if (currentIndex !== -1 && currentIndex < items.length - 1) {
              const nextButton = menuRef.current?.querySelectorAll('button')[currentIndex + 1];
              (nextButton as HTMLButtonElement)?.focus();
            }
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (document.activeElement === firstItemRef.current) {
            lastItemRef.current?.focus();
          } else {
            const currentIndex = items.findIndex(
              (_, i) => document.activeElement === menuRef.current?.querySelectorAll('button')[i]
            );
            if (currentIndex !== -1 && currentIndex > 0) {
              const prevButton = menuRef.current?.querySelectorAll('button')[currentIndex - 1];
              (prevButton as HTMLButtonElement)?.focus();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, items, closeMenu]);

  return (
    <div
      className={cn('relative z-50 block md:hidden', className, { 'md:block': forceCollapse })}
      role="region"
      aria-label="Share menu"
    >
      <AnimatePresence>
        {open && isMounted && createPortal(<Backdrop onClick={closeMenu} />, document.body)}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 bg-black/30 backdrop-blur-sm"
              onClick={() => {
                closeMenu();
                triggerRef.current?.focus();
              }}
            />
            <motion.div
              layoutId="nav"
              className="absolute inset-x-0 bottom-full z-50 mb-2 flex flex-col gap-2"
              ref={menuRef}
              role="menu"
            >
              {items.map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                    y: 10,
                    transition: {
                      delay: idx * 0.05,
                    },
                  }}
                  transition={{ delay: (items.length - 1 - idx) * 0.05 }}
                >
                  <button
                    ref={idx === 0 ? firstItemRef : idx === items.length - 1 ? lastItemRef : null}
                    onClick={() => {
                      item.onClick?.();
                      setTimeout(() => closeMenu(), 2000);
                      triggerRef.current?.focus();
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
                    aria-label={item.title}
                    role="menuitem"
                    tabIndex={open ? 0 : -1}
                  >
                    <div className="h-4 w-4">{item.icon}</div>
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full hover:bg-white/30 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={open ? 'Close share menu' : 'Open share menu'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-5 w-5"
            >
              <X className="h-5 w-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="share"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-5 w-5"
            >
              <Share2 className="h-5 w-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: {
    title: string;
    icon: React.ReactNode;
    href: string;
    onClick?: () => void;
  }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageY)} // Changed from pageX to pageY for vertical orientation
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        'mx-auto hidden h-auto w-16 flex-col items-center gap-4 rounded-2xl py-4 md:flex',
        className
      )}
      role="region"
      aria-label="Share options"
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} tabIndex={0} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  onClick,
  tabIndex = 0,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
  onClick?: () => void;
  tabIndex?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    // Changed to use y and height for vertical orientation
    return val - bounds.y - bounds.height / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  return (
    <button
      onClick={onClick}
      tabIndex={tabIndex}
      aria-label={title}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="focus:outline-none"
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full focus-within:ring-2 focus-within:ring-white focus-within:ring-offset-2 focus-within:ring-offset-transparent hover:bg-white/30"
      >
        <AnimatePresence>
          {(hovered || focused) && (
            <motion.div
              initial={{ opacity: 0, x: 10, y: '-50%' }}
              animate={{ opacity: 1, x: 0, y: '-50%' }}
              exit={{ opacity: 0, x: 2, y: '-50%' }}
              className="absolute -left-24 top-1/2 w-fit -translate-y-1/2 whitespace-pre rounded-md bg-black px-2 py-0.5 text-xs text-white dark:bg-white dark:text-black"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </button>
  );
}
