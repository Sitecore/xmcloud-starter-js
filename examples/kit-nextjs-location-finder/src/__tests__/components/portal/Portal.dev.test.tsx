import React from 'react';
import { render, act, cleanup } from '@testing-library/react';
import { Portal } from '@/components/portal/portal.dev';
import { createPortal } from 'react-dom';

// Mock createPortal
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: jest.fn((element) => element),
}));

describe('Portal component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cleanup();
    document.body.innerHTML = '';
  });

  it('should not render children before mounting (pre-useEffect)', () => {
    // Temporarily mock useEffect so it doesn't run immediately
    const originalUseEffect = React.useEffect;
    jest.spyOn(React, 'useEffect').mockImplementationOnce(() => {});

    const { container } = render(
      <Portal>
        <div>Child content</div>
      </Portal>
    );

    expect(container.firstChild).toBeNull();

    // Restore useEffect for other tests
    (React.useEffect as jest.Mock).mockImplementation(originalUseEffect);
  });

  it('should render children into document.body after mount', () => {
    render(
      <Portal>
        <div data-testid="portal-child">Child</div>
      </Portal>
    );

    // After mount, createPortal should have been called
    expect(createPortal).toHaveBeenCalledTimes(1);
    expect(createPortal).toHaveBeenCalledWith(expect.anything(), document.body);
  });

  it('should unmount cleanly without errors', () => {
    const { unmount } = render(
      <Portal>
        <div>Unmount test</div>
      </Portal>
    );
    act(() => {
      unmount();
    });
    expect(() => unmount()).not.toThrow();
  });
});
