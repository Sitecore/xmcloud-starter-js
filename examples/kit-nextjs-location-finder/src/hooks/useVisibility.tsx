import { useState, useEffect, useRef, MutableRefObject } from 'react';

function useVisibility(delay = 0): [boolean, MutableRefObject<HTMLDivElement | null>] {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setVisible(true);
          }, delay);

          if (domRef.current) {
            observer.unobserve(domRef.current);
          }
        }
      });
    });

    const currentRef = domRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay]);

  return [isVisible, domRef];
}

export default useVisibility;
