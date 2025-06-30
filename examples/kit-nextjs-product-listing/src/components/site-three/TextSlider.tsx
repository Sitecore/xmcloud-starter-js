import { Text as JssText, Field } from '@sitecore-content-sdk/nextjs';
import { useEffect, useMemo, useRef, useState } from 'react';

interface Fields {
  Text: Field<string>;
}

type TextSliderProps = {
  params: { [key: string]: string };
  fields: Fields;
};

export const Default = (props: TextSliderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [repeatCount, setRepeatCount] = useState(1);
  const [ready, setReady] = useState(false);

  const phrase = useMemo(() => {
    return props.fields.Text?.value || 'No text in field';
  }, [props.fields.Text?.value]);

  useEffect(() => {
    const calculateRepeats = () => {
      if (!measureRef.current || !containerRef.current) return;

      const phraseWidth = measureRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;

      if (phraseWidth === 0 || containerWidth === 0) return;

      const minTotalWidth = containerWidth * 4;
      const neededRepeats = Math.ceil(minTotalWidth / phraseWidth);
      setRepeatCount(neededRepeats);
      setReady(true);
    };

    const waitForFontsAndLayout = async () => {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      requestAnimationFrame(() => {
        calculateRepeats();
      });
    };

    waitForFontsAndLayout();
    window.addEventListener('resize', calculateRepeats);

    return () => window.removeEventListener('resize', calculateRepeats);
  }, [phrase]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-18 lg:h-34 whitespace-nowrap overflow-hidden ${props.params.styles}`}
      data-class-change
    >
      {/* hidden div - used to calculate repeats */}
      <h2
        ref={measureRef}
        className="absolute top-0 invisible whitespace-nowrap uppercase text-3xl lg:text-7xl"
      >
        {phrase}
      </h2>

      {ready && (
        <div
          className="flex absolute top-1/2 -translate-y-1/2 animate-marquee will-change-transform whitespace-nowrap uppercase"
          style={{
            animationDuration: `${(Array(repeatCount).fill(phrase).join('').length / 5).toFixed(
              2
            )}s`,
          }}
        >
          <h2 className="text-3xl lg:text-7xl">
            {Array(repeatCount)
              .fill('')
              .map((_el, i) => (
                <span
                  key={i}
                  className="font-[inherit] [.bg-gradient-secondary_&:nth-child(4n-3)]:text-white [.bg-gradient-secondary_&:nth-child(4n-2)]:text-white"
                >
                  {i === 0 ? <JssText field={props.fields.Text} /> : phrase}
                  <span className="font-[inherit] text-primary">. </span>
                </span>
              ))}
          </h2>
        </div>
      )}
    </div>
  );
};
