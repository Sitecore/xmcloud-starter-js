import { Container303030Props } from '../../components/container/container-303030/container-303030.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer303030Props: Container303030Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container303030',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-thirty-center': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container303030WithStyles: Container303030Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container303030',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-thirty-center': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container303030NoTopMargin: Container303030Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container303030',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-thirty-center': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
  },
  page: mockPage,
};

export const container303030WithContent: Container303030Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container303030',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [
        {
          uid: 'left-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-thirty-center': [
        {
          uid: 'center-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-thirty-right': [
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

export const container303030EmptyInEditMode: Container303030Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container303030',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-thirty-center': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};
