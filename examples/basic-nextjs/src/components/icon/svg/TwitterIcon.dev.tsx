import { SvgProps, sharedAttributes } from '../Icon';

import { cn } from '@/lib/utils';

import type { JSX } from 'react';

const TwitterIcon = (props: SvgProps): JSX.Element => {
  const { className } = props;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 36 37"
      className={cn('icon--twitter', className)}
      {...sharedAttributes(props)}
    >
      <path
        fill="currentColor"
        d="M7.20005 5.51294c-1.326 0-2.4 1.074-2.4 2.4V29.5129c0 1.326 1.074 2.4 2.4 2.4H28.8c1.326 0 2.4001-1.074 2.4001-2.4V7.91294c0-1.326-1.0741-2.4-2.4001-2.4H7.20005Zm3.17815 5.99996h5.5336l3.2297 4.6172 3.9961-4.6172h1.7414l-4.9547 5.7375 6.0609 8.6625h-5.5336l-3.5836-5.1234-4.425 5.1234h-1.7695l5.407-6.2461-5.7023-8.1539Zm2.6765 1.4204 8.1047 11.5523h2.1469l-8.107-11.5523h-2.1446Z"
      />
    </svg>
  );
};

export default TwitterIcon;
