import { Container25252525Props } from '../../components/container/container-25252525/Container25252525';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer25252525Props: Container25252525Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one': [],
      'container-25-two': [],
      'container-25-three': [],
      'container-25-four': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  children: {} as Element,
  page: mockPage,
};

export const container25252525WithStyles: Container25252525Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one': [],
      'container-25-two': [],
      'container-25-three': [],
      'container-25-four': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
  },
  children: {} as Element,
  page: mockPage,
};

export const container25252525NoTopMargin: Container25252525Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one': [],
      'container-25-two': [],
      'container-25-three': [],
      'container-25-four': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
  },
  children: {} as Element,
  page: mockPage,
};

export const container25252525WithContent: Container25252525Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one': [
        {
          uid: 'col1-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-25-two': [
        {
          uid: 'col2-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-25-three': [
        {
          uid: 'col3-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-25-four': [
        {
          uid: 'col4-component',
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
  children: {} as Element,
  page: mockPage,
};

export const container25252525EmptyInEditMode: Container25252525Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container25252525',
    dataSource: '',
    placeholders: {
      'container-25-one': [],
      'container-25-two': [],
      'container-25-three': [],
      'container-25-four': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  children: {} as Element,
  page: mockPage,
};
