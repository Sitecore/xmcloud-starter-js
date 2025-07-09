import { useEffect, useRef, useState } from 'react';

export function useContainerOffsets() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsets, setOffsets] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const updateOffsets = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setOffsets({
          left: rect.left,
          right: document.documentElement.clientWidth - rect.right,
        });
      }
    };

    updateOffsets();

    window.addEventListener('resize', updateOffsets);
    return () => window.removeEventListener('resize', updateOffsets);
  }, []);

  return { containerRef, leftOffset: offsets.left, rightOffset: offsets.right };
}
