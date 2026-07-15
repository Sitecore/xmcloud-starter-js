import React from 'react';

export const mockFloatingDockItems = [
  {
    title: 'Facebook',
    icon: React.createElement('span', { 'data-testid': 'facebook-icon' }, 'FB'),
    href: 'https://facebook.com/share',
    onClick: jest.fn(),
  },
  {
    title: 'Twitter',
    icon: React.createElement('span', { 'data-testid': 'twitter-icon' }, 'TW'),
    href: 'https://twitter.com/share',
    onClick: jest.fn(),
  },
  {
    title: 'LinkedIn',
    icon: React.createElement('span', { 'data-testid': 'linkedin-icon' }, 'LI'),
    href: 'https://linkedin.com/share',
    onClick: jest.fn(),
  },
  {
    title: 'Email',
    icon: React.createElement('span', { 'data-testid': 'email-icon' }, 'EM'),
    href: 'mailto:?subject=Check this out',
    onClick: jest.fn(),
  },
];

export const mockFloatingDockProps = {
  items: mockFloatingDockItems,
  desktopClassName: 'test-desktop-class',
  mobileClassName: 'test-mobile-class',
  forceCollapse: false,
};

export const mockFloatingDockPropsForceCollapse = {
  items: mockFloatingDockItems,
  desktopClassName: 'test-desktop-class',
  mobileClassName: 'test-mobile-class',
  forceCollapse: true,
};

export const mockMinimalFloatingDockProps = {
  items: [
    {
      title: 'Share',
      icon: React.createElement('span', null, 'S'),
      href: 'https://example.com',
    },
  ],
};
