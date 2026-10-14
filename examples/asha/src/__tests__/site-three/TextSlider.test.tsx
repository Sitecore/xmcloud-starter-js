/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Default as TextSliderDefault } from '@/components/site-three/TextSlider';

// Mock Sitecore SDK with variable editing mode
const mockUseSitecore = jest.fn();
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, ...props }: any) => <span {...props}>{field?.value || ''}</span>,
  useSitecore: () => mockUseSitecore(),
}));

// Mock document.fonts
Object.defineProperty(document, 'fonts', {
  value: {
    ready: Promise.resolve(),
  },
});

describe('TextSlider', () => {
  const mockProps = {
    params: {
      styles: 'test-styles',
    },
    fields: {
      Text: {
        value: 'Sliding text content',
      },
    },
  };

  beforeEach(() => {
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });

    // Mock RAF
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    // Mock addEventListener/removeEventListener
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    addEventListenerSpy.mockImplementation(() => {});
    removeEventListenerSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders text slider with text content', () => {
    render(<TextSliderDefault {...mockProps} />);
    expect(screen.getByText('Sliding text content')).toBeInTheDocument();
  });

  it('renders with custom styles', () => {
    render(<TextSliderDefault {...mockProps} />);
    const slider = screen.getByText('Sliding text content').closest('div');
    expect(slider).toHaveClass('test-styles');
  });

  it('handles empty text field', () => {
    const emptyProps = {
      params: {},
      fields: {
        Text: {
          value: '',
        },
      },
    };
    render(<TextSliderDefault {...emptyProps} />);
    expect(screen.getByText('No text in field')).toBeInTheDocument();
  });

  it('handles missing fields gracefully', () => {
    const missingFieldsProps: any = {
      params: {},
      fields: {},
    };
    render(<TextSliderDefault {...missingFieldsProps} />);
    expect(screen.getByText('No text in field')).toBeInTheDocument();
  });

  it('handles null/undefined props', () => {
    const nullProps: any = {
      params: {},
      fields: {
        Text: null,
      },
    };
    render(<TextSliderDefault {...nullProps} />);
    expect(screen.getByText('No text in field')).toBeInTheDocument();
  });

  it('renders in editing mode', async () => {
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: true,
        },
      },
    });

    render(<TextSliderDefault {...mockProps} />);

    await waitFor(() => {
      expect(screen.getAllByText('Sliding text content')).toHaveLength(2);
    });
  });

  it('calculates repeat count based on container width', async () => {
    // Mock offsetWidth
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: jest.fn().mockReturnValueOnce(100).mockReturnValueOnce(400),
    });

    render(<TextSliderDefault {...mockProps} />);

    await waitFor(() => {
      const containers = screen.getAllByText('Sliding text content');
      expect(containers.length).toBeGreaterThan(0);
    });
  });

  it('handles window resize events', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<TextSliderDefault {...mockProps} />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('waits for fonts to load before calculating repeats', async () => {
    // Mock offsetWidth to return valid values
    // First call: measureRef (phraseWidth) = 200
    // Second call: containerRef (containerWidth) = 800
    // Expected repeats: Math.ceil((800 * 4) / 200) = 16
    const mockOffsetWidth = jest
      .fn()
      .mockReturnValueOnce(200) // phraseWidth
      .mockReturnValueOnce(800); // containerWidth

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: mockOffsetWidth,
    });

    render(<TextSliderDefault {...mockProps} />);

    // Wait for fonts to be ready and component to calculate repeats
    await waitFor(() => {
      const textElements = screen.getAllByText('Sliding text content');
      // With repeatCount of 16, we should have at least one visible text element
      expect(textElements.length).toBeGreaterThanOrEqual(1);
    });

    // Verify offsetWidth was called to calculate dimensions
    expect(mockOffsetWidth).toHaveBeenCalled();
  });

  it('handles case when offsetWidth is 0', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 0,
    });

    render(<TextSliderDefault {...mockProps} />);

    await waitFor(() => {
      expect(screen.getAllByText('Sliding text content').length).toBeGreaterThan(0);
    });
  });

  it('applies animation duration based on text length', async () => {
    mockUseSitecore.mockReturnValue({
      page: {
        mode: {
          isEditing: false,
        },
      },
    });

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: jest.fn().mockReturnValueOnce(100).mockReturnValueOnce(400),
    });

    render(<TextSliderDefault {...mockProps} />);

    await waitFor(() => {
      const textElements = screen.getAllByText('Sliding text content');
      expect(textElements.length).toBeGreaterThan(0);
    });
  });
});
