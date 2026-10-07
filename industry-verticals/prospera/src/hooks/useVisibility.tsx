'use client';

import { useState, useEffect, useRef, MutableRefObject } from 'react';

function useVisibility(delay = 0): [boolean, MutableRefObject<HTMLDivElement | null>] {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        } else {
          setVisible(false);
        }
      });
    });
    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [delay]);

  return [isVisible, domRef];
}

export default useVisibility;
