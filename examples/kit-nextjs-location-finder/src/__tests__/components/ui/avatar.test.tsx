import React from 'react';
import { render, screen } from '@testing-library/react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...classes: unknown[]) => classes.filter(Boolean).join(' '),
}));

// Mock Radix UI Avatar
jest.mock('@radix-ui/react-avatar', () => {
  const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<{ className?: string }>>(
    ({ children, className, ...props }, ref) => (
      <div ref={ref} className={className} data-testid="avatar" {...props}>
        {children as React.ReactNode}
      </div>
    )
  );
  Root.displayName = 'AvatarRoot';

  const Image = React.forwardRef<
    HTMLImageElement,
    { src?: string; alt?: string; className?: string }
  >(({ src, alt, className }, ref) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={src} alt={alt} className={className} data-testid="avatar-img" />
  ));
  Image.displayName = 'AvatarImage';

  const Fallback = React.forwardRef<
    HTMLDivElement,
    React.PropsWithChildren<{ className?: string }>
  >(({ children, className }, ref) => (
    <div ref={ref} className={className} data-testid="avatar-fallback">
      {children as React.ReactNode}
    </div>
  ));
  Fallback.displayName = 'AvatarFallback';

  return { Root, Image, Fallback };
});

describe('Avatar', () => {
  it('renders avatar with image', () => {
    render(
      <Avatar>
        <AvatarImage src="/avatar.jpg" alt="User avatar" />
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId('avatar')).toBeInTheDocument();
    expect(screen.getByTestId('avatar-img')).toBeInTheDocument();
  });

  it('renders avatar with fallback', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByTestId('avatar-fallback')).toBeInTheDocument();
    expect(screen.getByText(/ab/i)).toBeInTheDocument();
  });

  it('renders avatar with custom props', () => {
    render(
      <Avatar className="custom-avatar">
        <AvatarImage src="/test.jpg" alt="Test" />
      </Avatar>
    );

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toBeInTheDocument();
    expect(screen.getByTestId('avatar-img')).toHaveAttribute('src', '/test.jpg');
  });
});
