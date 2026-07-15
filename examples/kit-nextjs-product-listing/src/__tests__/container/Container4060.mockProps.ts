import { Container4060Props } from '../../components/container/container-4060/container-4060.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer4060Props: Container4060Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container4060',
    dataSource: '',
    placeholders: {
      'container-forty-left': [],
      'container-sixty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container4060WithStyles: Container4060Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container4060',
    dataSource: '',
    placeholders: {
      'container-forty-left': [],
      'container-sixty-right': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container4060NoTopMargin: Container4060Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container4060',
    dataSource: '',
    placeholders: {
      'container-forty-left': [],
      'container-sixty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
  },
  page: mockPage,
};

export const container4060WithContent: Container4060Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container4060',
    dataSource: '',
    placeholders: {
      'container-forty-left': [
        {
          uid: 'left-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-sixty-right': [
        {
          uid: 'right-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container4060EmptyInEditMode: Container4060Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container4060',
    dataSource: '',
    placeholders: {
      'container-forty-left': [],
      'container-sixty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};
