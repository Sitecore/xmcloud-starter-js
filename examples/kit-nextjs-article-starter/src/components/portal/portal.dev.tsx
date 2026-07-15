'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { PortalProps } from './portal.props';

export function Portal({ children }: PortalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Only render on client-side
  if (!mounted) return null;

  // Create a portal to the document body
  return createPortal(children, document.body);
}
