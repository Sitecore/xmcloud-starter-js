import { Container70Props } from '../../components/container/container-70/container-70.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer70Props: Container70Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container70',
    dataSource: '',
    placeholders: {
      'container-seventy-1': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '1',
  },
  page: mockPage,
};

export const container70WithStyles: Container70Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container70',
    dataSource: '',
    placeholders: {
      'container-seventy-2': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '2',
  },
  page: mockPage,
};

export const container70NoTopMargin: Container70Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container70',
    dataSource: '',
    placeholders: {
      'container-seventy-3': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
    DynamicPlaceholderId: '3',
  },
  page: mockPage,
};

export const container70WithContent: Container70Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container70',
    dataSource: '',
    placeholders: {
      'container-seventy-4': [
        {
          uid: 'content-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '4',
  },
  page: mockPage,
};

export const container70EmptyInEditMode: Container70Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container70',
    dataSource: '',
    placeholders: {},
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '5',
  },
  page: mockPage,
};
