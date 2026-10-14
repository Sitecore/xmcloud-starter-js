import { Container5050Props } from '../../components/container/container-5050/container-5050.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer5050Props: Container5050Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left': [],
      'container-fifty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container5050WithStyles: Container5050Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left': [],
      'container-fifty-right': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container5050NoTopMargin: Container5050Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left': [],
      'container-fifty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
  },
  page: mockPage,
};

export const container5050WithContent: Container5050Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container5050',
    dataSource: '',
    placeholders: {
      'container-fifty-left': [
        {
          uid: 'left-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-fifty-right': [
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
