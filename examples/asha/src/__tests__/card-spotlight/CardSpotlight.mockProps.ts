import React from 'react';

// Mock children content
export const mockChildren = React.createElement(
  'div',
  { 'data-testid': 'spotlight-content' },
  'Test Spotlight Content'
);

// Default card spotlight props
export const defaultCardSpotlightProps = {
  children: mockChildren,
  radius: 350,
  color: 'rgba(255, 255, 255, 0.1)',
  prefersReducedMotion: false,
};

// Card spotlight with custom radius
export const cardSpotlightCustomRadius = {
  children: mockChildren,
  radius: 500,
  color: 'rgba(255, 255, 255, 0.1)',
  prefersReducedMotion: false,
};

// Card spotlight with custom color
export const cardSpotlightCustomColor = {
  children: mockChildren,
  radius: 350,
  color: 'rgba(0, 255, 0, 0.2)',
  prefersReducedMotion: false,
};

// Card spotlight with reduced motion
export const cardSpotlightReducedMotion = {
  children: mockChildren,
  radius: 350,
  color: 'rgba(255, 255, 255, 0.1)',
  prefersReducedMotion: true,
};

// Card spotlight with custom className
export const cardSpotlightWithClassName = {
  children: mockChildren,
  radius: 350,
  color: 'rgba(255, 255, 255, 0.1)',
  prefersReducedMotion: false,
  className: 'custom-spotlight-class',
};

// Card spotlight with additional HTML attributes
export const cardSpotlightWithAttributes = {
  children: mockChildren,
  radius: 350,
  color: 'rgba(255, 255, 255, 0.1)',
  prefersReducedMotion: false,
  'data-custom': 'test-value',
  'aria-label': 'Custom spotlight card',
};
