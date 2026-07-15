require('@testing-library/jest-dom');

const React = require('react');

// ---------------------------
//  Mock Sitecore Components
// ---------------------------
jest.mock('@sitecore-content-sdk/nextjs', () => ({
  Text: ({ field, tag: Tag = 'span' }) => {
    if (!field || !field.value) return null;
    return React.createElement(Tag, {}, field.value);
  },
  RichText: ({ field }) => {
    if (!field || !field.value) return null;
    return React.createElement('div', { dangerouslySetInnerHTML: { __html: field.value } });
  },
  Link: ({ field, children }) => {
    if (!field || !field.value) return React.createElement(React.Fragment, {}, children);
    const linkText = field?.value?.text || children;
    return React.createElement('a', { href: field.value.href }, linkText);
  },
  Placeholder: ({ name, rendering }) => {
    return React.createElement('div', {
      'data-testid': 'sitecore-placeholder',
      'data-placeholder-name': name,
      'data-rendering': rendering ? JSON.stringify(rendering) : undefined,
    }, `Placeholder: ${name}`);
  },
  AppPlaceholder: ({ name, rendering }) => {
    return React.createElement('div', {
      'data-testid': 'sitecore-placeholder',
      'data-placeholder-name': name,
      'data-rendering': rendering ? JSON.stringify(rendering) : undefined,
    }, `Placeholder: ${name}`);
  },
  useSitecore: () => ({
    page: {
      mode: {
        isEditing: false,
        isPreview: false,
        isNormal: true,
      },
      database: 'web',
      language: 'en',
      layoutId: 'mock-layout-id',
    },
    sitecoreContext: {
      language: 'en',
      site: {
        name: 'mock-site',
      },
    },
  }),
}));

// ---------------------------
//  Mock @radix-ui/react-slot
// ---------------------------
jest.mock('@radix-ui/react-slot', () => ({
  Slot: React.forwardRef(({ children, ...props }, ref) => {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...props,
        ...children.props,
        ref,
      });
    }
    return React.createElement('div', { ...props, ref }, children);
  }),
  Slottable: ({ children }) => React.createElement(React.Fragment, {}, children),
  createSlot: (name) => {
    const SlotComponent = React.forwardRef(({ children, ...props }, ref) => {
      if (React.isValidElement(children)) {
        return React.cloneElement(children, {
          ...props,
          ...children.props,
          ref,
        });
      }
      return React.createElement('div', { ...props, ref }, children);
    });
    SlotComponent.displayName = `Slot(${name})`;
    return SlotComponent;
  },
}));

// ---------------------------
//  Mock IntersectionObserver
// ---------------------------
global.IntersectionObserver = class {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ---------------------------
//  Mock lucide-react Icons (Comprehensive)
// ---------------------------
jest.mock('lucide-react', () => {
  // Create a generic mock icon component with display name
  const createMockIcon = (name) => {
    const MockIcon = ({ className, size, strokeWidth, absoluteStrokeWidth, ...props }) => 
      React.createElement('span', {
        'data-testid': `${name.toLowerCase()}-icon`,
        className,
        'data-size': size?.toString(),
        'data-stroke-width': strokeWidth?.toString(),
        'data-absolute-stroke-width': absoluteStrokeWidth?.toString(),
        ...props,
      }, name.charAt(0));
    MockIcon.displayName = `Mock${name}`;
    return MockIcon;
  };

  return {
    // Common icons used across components
    Facebook: createMockIcon('Facebook'),
    Linkedin: createMockIcon('Linkedin'),
    Twitter: createMockIcon('Twitter'),
    Link: createMockIcon('Link'),
    Check: createMockIcon('Check'),
    Mail: createMockIcon('Mail'),
    Sun: createMockIcon('Sun'),
    Moon: createMockIcon('Moon'),
    X: createMockIcon('X'),
    ArrowLeft: createMockIcon('ArrowLeft'),
    ArrowRight: createMockIcon('ArrowRight'),
    Search: createMockIcon('Search'),
    Menu: createMockIcon('Menu'),
    Home: createMockIcon('Home'),
    User: createMockIcon('User'),
    Settings: createMockIcon('Settings'),
    Bell: createMockIcon('Bell'),
    Heart: createMockIcon('Heart'),
    Star: createMockIcon('Star'),
    Download: createMockIcon('Download'),
    Upload: createMockIcon('Upload'),
    Edit: createMockIcon('Edit'),
    Delete: createMockIcon('Delete'),
    Plus: createMockIcon('Plus'),
    Minus: createMockIcon('Minus'),
    // Carousel and navigation icons
    ChevronLeft: createMockIcon('ChevronLeft'),
    ChevronRight: createMockIcon('ChevronRight'),
    Pause: createMockIcon('Pause'),
    Play: createMockIcon('Play'),
    // Modal and map icons
    MapPin: createMockIcon('MapPin'),
    // Accordion and expand icons
    ChevronDown: createMockIcon('ChevronDown'),
    ChevronUp: createMockIcon('ChevronUp'),
    // Additional common icons
    Eye: createMockIcon('Eye'),
    EyeOff: createMockIcon('EyeOff'),
    Calendar: createMockIcon('Calendar'),
    Clock: createMockIcon('Clock'),
    Globe: createMockIcon('Globe'),
    Phone: createMockIcon('Phone'),
    // Add more icons as needed by your components
  };
});

// ---------------------------
//  Browser-only mocks (skip in Node env e.g. geo endpoint tests)
// ---------------------------
if (typeof window !== 'undefined') {
  // Mock window.matchMedia
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

// ---------------------------
//  Mock Clipboard API
// ---------------------------
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// ---------------------------
//  Mock window.open
// ---------------------------
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

// ---------------------------
//  Mock HTMLMediaElement for video/audio testing
// ---------------------------
Object.defineProperty(HTMLMediaElement.prototype, 'play', {
  writable: true,
  value: jest.fn().mockImplementation(() => Promise.resolve()),
});

Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
  writable: true,
  value: jest.fn(),
});

// ---------------------------
//  Mock Geolocation API
// ---------------------------
Object.defineProperty(navigator, 'geolocation', {
  writable: true,
  value: {
    getCurrentPosition: jest.fn((success) => 
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.0060,
          accuracy: 10,
        },
      })
    ),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
});

// ---------------------------
//  Global Timer Utilities
// ---------------------------
global.setupTimers = () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });
};

// ---------------------------
//  Mock ResizeObserver
// ---------------------------
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// ---------------------------
//  Mock localStorage and sessionStorage
// ---------------------------
const createStorageMock = () => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index) => Object.keys(store)[index] || null,
  };
};

Object.defineProperty(window, 'localStorage', { value: createStorageMock() });
Object.defineProperty(window, 'sessionStorage', { value: createStorageMock() });

// ---------------------------
//  Mock fetch API
// ---------------------------
global.fetch = jest.fn((url) => {
  // Default mock response for geocoding API
  if (typeof url === 'string' && url.includes('geocode')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'OK',
        results: [
          {
            geometry: {
              location: {
                lat: 33.749,
                lng: -84.388,
              },
            },
          },
        ],
      }),
    });
  }
  // Default mock response for distance matrix API
  if (typeof url === 'string' && url.includes('distancematrix')) {
    return Promise.resolve({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'OK',
        rows: [
          {
            elements: [
              {
                status: 'OK',
                distance: {
                  value: 8368, // meters (approximately 5.2 miles)
                },
              },
            ],
          },
        ],
      }),
    });
  }
  // Default fallback
  return Promise.resolve({
    ok: true,
    status: 200,
    json: async () => ({}),
  });
});

// ---------------------------
//  Mock Common UI Components
// ---------------------------
jest.mock('@/components/ui/avatar', () => {
  const Avatar = ({ children }) => React.createElement('div', { 'data-testid': 'avatar' }, children);
  Avatar.displayName = 'MockAvatar';
  const AvatarImage = ({ src, alt }) => React.createElement('img', { 
    'data-testid': 'avatar-img', 
    src, 
    alt 
  });
  AvatarImage.displayName = 'MockAvatarImage';
  const AvatarFallback = ({ children }) => React.createElement('div', { 
    'data-testid': 'avatar-fallback' 
  }, children);
  AvatarFallback.displayName = 'MockAvatarFallback';
  return { Avatar, AvatarImage, AvatarFallback };
});

jest.mock('@/components/ui/button', () => {
  const Button = ({ children, variant, size, onClick, asChild, className, ...props }) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        'data-testid': 'ui-button',
        'data-variant': variant,
        'data-size': size,
        className,
        ...props,
      });
    }
    return React.createElement('button', {
      'data-testid': 'ui-button',
      'data-variant': variant,
      'data-size': size,
      onClick,
      className,
      ...props
    }, children);
  };
  Button.displayName = 'MockButton';
  return { Button };
});

jest.mock('@/components/ui/badge', () => {
  const Badge = ({ children, className }) => React.createElement('span', {
    'data-testid': 'badge',
    className
  }, children);
  Badge.displayName = 'MockBadge';
  return { Badge };
});

jest.mock('@/components/ui/toaster', () => {
  const Toaster = () => React.createElement('div', { 'data-testid': 'toaster' });
  Toaster.displayName = 'MockToaster';
  return { Toaster };
});

// Accordion components mock
jest.mock('@/components/ui/accordion', () => {
  const Accordion = ({ children, className, type, value, onValueChange }) => 
    React.createElement('div', {
      'data-testid': 'accordion',
      'data-type': type,
      'data-value': value?.join?.(','),
      className
    }, children);
  Accordion.displayName = 'MockAccordion';

  const AccordionItem = ({ children, value, className }) => 
    React.createElement('div', {
      'data-testid': 'accordion-item',
      'data-value': value,
      className
    }, children);
  AccordionItem.displayName = 'MockAccordionItem';

  const AccordionTrigger = ({ children, className, onClick }) => 
    React.createElement('button', {
      'data-testid': 'accordion-trigger',
      className,
      onClick
    }, children);
  AccordionTrigger.displayName = 'MockAccordionTrigger';

  const AccordionContent = ({ children }) => 
    React.createElement('div', {
      'data-testid': 'accordion-content'
    }, children);
  AccordionContent.displayName = 'MockAccordionContent';

  return { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
});

// Dialog components mock
jest.mock('@/components/ui/dialog', () => {
  const Dialog = ({ children, open, onOpenChange }) => 
    React.createElement('div', {
      'data-testid': 'dialog-mock',
      className: open ? 'block' : 'hidden'
    }, [
      React.createElement('button', {
        key: 'close',
        onClick: () => onOpenChange?.(false),
        'data-testid': 'dialog-close-button'
      }, 'Close'),
      children
    ]);
  Dialog.displayName = 'MockDialog';

  const DialogContent = ({ children, className }) => 
    React.createElement('div', {
      'data-testid': 'dialog-content',
      className
    }, children);
  DialogContent.displayName = 'MockDialogContent';

  const DialogHeader = ({ children }) => 
    React.createElement('div', {
      'data-testid': 'dialog-header'
    }, children);
  DialogHeader.displayName = 'MockDialogHeader';

  const DialogTitle = ({ children }) => 
    React.createElement('h2', {
      'data-testid': 'dialog-title'
    }, children);
  DialogTitle.displayName = 'MockDialogTitle';

  const DialogDescription = ({ children }) => 
    React.createElement('p', {
      'data-testid': 'dialog-description'
    }, children);
  DialogDescription.displayName = 'MockDialogDescription';

  const DialogFooter = ({ children, className }) => 
    React.createElement('div', {
      'data-testid': 'dialog-footer',
      className
    }, children);
  DialogFooter.displayName = 'MockDialogFooter';

  return { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter };
});

// Input component mock
jest.mock('@/components/ui/input', () => {
  const Input = (props) => React.createElement('input', {
    'data-testid': 'ui-input',
    ...props
  });
  Input.displayName = 'MockInput';
  return { Input };
});

// Form components mock
jest.mock('@/components/ui/form', () => {
  const Form = ({ children }) => 
    React.createElement('div', {
      'data-testid': 'form-mock'
    }, children);
  Form.displayName = 'MockForm';

  const FormField = ({ render }) => {
    const mockField = {
      value: '',
      onChange: jest.fn(),
      onBlur: jest.fn(),
      name: 'mock-field',
    };
    return React.createElement('div', {
      'data-testid': 'form-field'
    }, render({ field: mockField }));
  };
  FormField.displayName = 'MockFormField';

  const FormItem = ({ children }) => 
    React.createElement('div', {
      'data-testid': 'form-item'
    }, children);
  FormItem.displayName = 'MockFormItem';

  const FormControl = ({ children }) => 
    React.createElement('div', {
      'data-testid': 'form-control'
    }, children);
  FormControl.displayName = 'MockFormControl';

  const FormMessage = ({ className }) => 
    React.createElement('div', {
      'data-testid': 'form-message',
      className
    });
  FormMessage.displayName = 'MockFormMessage';

  return { Form, FormField, FormItem, FormControl, FormMessage };
});

// Carousel components mock
jest.mock('@/components/ui/carousel', () => {
  const mockCarouselApi = {
    canScrollPrev: jest.fn(() => false),
    canScrollNext: jest.fn(() => true),
    scrollPrev: jest.fn(),
    scrollNext: jest.fn(),
    selectedScrollSnap: jest.fn(() => 0),
    on: jest.fn(),
    off: jest.fn(),
    scrollTo: jest.fn(),
  };

  const Carousel = ({ children, setApi, opts, className }) => {
    React.useEffect(() => {
      if (setApi) {
        setApi(mockCarouselApi);
      }
    }, [setApi]);
    return React.createElement('div', {
      'data-testid': 'carousel',
      className
    }, children);
  };
  Carousel.displayName = 'MockCarousel';

  const CarouselContent = ({ children, className }) => 
    React.createElement('div', {
      'data-testid': 'carousel-content',
      className
    }, children);
  CarouselContent.displayName = 'MockCarouselContent';

  const CarouselItem = ({ children, className }) => 
    React.createElement('div', {
      'data-testid': 'carousel-item',
      className
    }, children);
  CarouselItem.displayName = 'MockCarouselItem';

  return { Carousel, CarouselContent, CarouselItem };
});

// ---------------------------
//  Mock Utility Functions
// ---------------------------
jest.mock('@/lib/utils', () => ({
  cn: (...classes) => {
    return classes
      .map(cls => {
        if (typeof cls === 'string') return cls;
        if (typeof cls === 'object' && cls !== null) {
          return Object.entries(cls)
            .filter(([, value]) => Boolean(value))
            .map(([key]) => key)
            .join(' ');
        }
        return '';
      })
      .filter(Boolean)
      .join(' ');
  },
  getBaseUrl: () => 'https://test.example.com',
  getFullUrl: (path, host) => `https://test.example.com${path || ''}`,
}));

// Mock class-variance-authority
jest.mock('class-variance-authority', () => ({
  cva: (base, config) => {
    return (variants) => {
      let className = Array.isArray(base) ? base.join(' ') : base;
      if (variants && config?.variants) {
        Object.entries(variants).forEach(([key, value]) => {
          if (config.variants[key] && config.variants[key][value]) {
            const variantClass = config.variants[key][value];
            if (Array.isArray(variantClass)) {
              className += ' ' + variantClass.join(' ');
            } else if (variantClass) {
              className += ' ' + variantClass;
            }
          }
        });
      }
      return className;
    };
  },
}));

jest.mock('@/utils/NoDataFallback', () => {
  const NoDataFallback = ({ componentName }) => React.createElement('div', {
    'data-testid': 'no-data-fallback'
  }, `No data for ${componentName}`);
  NoDataFallback.displayName = 'MockNoDataFallback';
  return { NoDataFallback };
});

// Mock container utility functions
jest.mock('@/components/container/container.util', () => ({
  getContainerPlaceholderProps: (fragment, params) => ({
    dynamicKey: `${fragment}-${params.DynamicPlaceholderId}`,
    genericKey: `${fragment}-{*}`,
    fragment: fragment,
  }),
  isContainerPlaceholderEmpty: (rendering, placeholderProps, children) => {
    return !(
      rendering?.placeholders?.[placeholderProps.dynamicKey] ||
      rendering?.placeholders?.[placeholderProps.genericKey]
    ) && !children;
  },
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// ---------------------------
//  Mock Additional Hooks
// ---------------------------
jest.mock('@/hooks/use-media-query', () => ({
  useMediaQuery: jest.fn(() => false),
}));

jest.mock('@/hooks/useIntersectionObserver', () => ({
  useIntersectionObserver: jest.fn(() => ({
    isIntersecting: false,
    ref: { current: null },
  })),
}));

// ---------------------------
//  Mock External Libraries
// ---------------------------
// Mock framer-motion (m is alias for motion; support any HTML element type)
jest.mock('framer-motion', () => {
  const createMotionComponent = (tag) =>
    ({ children, initial, animate, exit, transition, custom, variants, style, ...props }) =>
      React.createElement(tag, { ...props, style }, children);
  const motion = new Proxy(
    {
      div: createMotionComponent('div'),
      span: createMotionComponent('span'),
      button: createMotionComponent('button'),
      header: createMotionComponent('header'),
      section: createMotionComponent('section'),
      a: createMotionComponent('a'),
    },
    {
      get(target, prop) {
        return target[prop] || createMotionComponent(prop);
      },
    }
  );
  return {
    motion,
    m: motion,
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, {}, children),
    useMotionValue: (initial) => ({ get: () => initial, set: jest.fn() }),
    useSpring: (value) => value,
    useTransform: () => ({ get: () => 0 }),
    LazyMotion: ({ children }) => React.createElement(React.Fragment, {}, children),
    domAnimation: {},
  };
});

// Mock react-hook-form
jest.mock('react-hook-form', () => ({
  useForm: () => ({
    control: {},
    handleSubmit: (fn) => (e) => {
      e?.preventDefault?.();
      fn({ email: 'test@example.com' });
    },
    reset: jest.fn(),
    formState: { errors: {} },
  }),
}));

// Mock Next.js Head
jest.mock('next/head', () => {
  const MockHead = ({ children }) => {
    const processChildren = (child) => {
      if (typeof child === 'string') return child;
      if (typeof child === 'number') return child.toString();
      if (!child) return '';
      if (React.isValidElement(child)) {
        const { type, props } = child;
        const tagName = typeof type === 'string' ? type : 'div';
        if (['meta', 'link'].includes(tagName)) {
          const attrs = Object.entries(props)
            .filter(([key]) => key !== 'children')
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
          return `<${tagName} ${attrs} />`;
        }
        const content = props.children ? processChildren(props.children) : '';
        return `<${tagName}>${content}</${tagName}>`;
      }
      if (Array.isArray(child)) {
        return child.map(processChildren).join('');
      }
      return '';
    };
    const htmlContent = Array.isArray(children)
      ? children.map(processChildren).join('')
      : processChildren(children);
    return React.createElement('div', {
      'data-testid': 'head-mock',
      dangerouslySetInnerHTML: { __html: htmlContent },
    });
  };
  MockHead.displayName = 'MockHead';
  return MockHead;
});

// Mock Next.js Link
jest.mock('next/link', () => {
  const MockLink = ({ children, href, className, prefetch, ...props }) => 
    React.createElement('a', {
      href,
      className,
      'data-prefetch': prefetch?.toString(),
      ...props
    }, children);
  MockLink.displayName = 'MockNextLink';
  return MockLink;
});

// ---------------------------
//  Suppress noisy React warnings globally
// ---------------------------
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn((message, ...args) => {
    if (
      typeof message === 'string' &&
      (
        message.includes('Each child in a list should have a unique "key" prop') ||
        message.includes('Warning: ReactDOM.render') ||
        message.includes('Warning:') ||
        message.includes('Received `false` for a non-boolean attribute') ||
        message.includes('Maximum update depth exceeded')
      )
    ) {
      return;
    }
    originalConsoleError(message, ...args);
  });

  console.warn = jest.fn((message, ...args) => {
    if (
      typeof message === 'string' &&
      (
        message.includes('React does not recognize the') ||
        message.includes('componentWillReceiveProps') ||
        message.includes('deprecated') ||
        message.includes('Warning:')
      )
    ) {
      return;
    }
    originalConsoleWarn(message, ...args);
  });
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});
}
