import React from 'react';

export const defaultProps = {
  children: React.createElement('div', {}, 'Test Content'),
  className: 'custom-class',
  direction: 'up' as const,
  delay: 0,
  duration: 1000,
  animationType: 'slide' as const,
  endRotation: 180,
  reducedMotion: false,
  isPageEditing: false,
};

export const propsSlideUp = {
  ...defaultProps,
  direction: 'up' as const,
  animationType: 'slide' as const,
};

export const propsSlideDown = {
  ...defaultProps,
  direction: 'down' as const,
  animationType: 'slide' as const,
};

export const propsSlideLeft = {
  ...defaultProps,
  direction: 'left' as const,
  animationType: 'slide' as const,
};

export const propsSlideRight = {
  ...defaultProps,
  direction: 'right' as const,
  animationType: 'slide' as const,
};

export const propsRotate = {
  ...defaultProps,
  animationType: 'rotate' as const,
  endRotation: 180,
};

export const propsRotate360 = {
  ...defaultProps,
  animationType: 'rotate' as const,
  endRotation: 360,
};

export const propsWithDelay = {
  ...defaultProps,
  delay: 500,
};

export const propsWithCustomDuration = {
  ...defaultProps,
  duration: 2000,
};

export const propsReducedMotion = {
  ...defaultProps,
  reducedMotion: true,
};

export const propsPageEditing = {
  ...defaultProps,
  isPageEditing: true,
};

export const propsMinimal = {
  children: React.createElement('div', {}, 'Minimal Content'),
};

