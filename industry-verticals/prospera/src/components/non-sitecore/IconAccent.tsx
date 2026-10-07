'use client';

import { ImageField, NextImage } from '@sitecore-content-sdk/nextjs';
import { JSX } from 'react';

export const IconAccent = ({
  image,
  inverted,
}: {
  image: ImageField;
  inverted?: boolean;
}): JSX.Element => {
  return (
    <div className={`icon-accent ${inverted ? 'inverted' : ''}`}>
      <NextImage field={image} width={32} height={32} />
    </div>
  );
};
