import { Container7030Props } from '../../components/container/container-7030/container-7030.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer7030Props: Container7030Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '1',
  },
  page: mockPage,
};

export const container7030WithStyles: Container7030Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '2',
  },
  page: mockPage,
};

export const container7030NoTopMargin: Container7030Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left': [],
      'container-thirty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
    DynamicPlaceholderId: '3',
  },
  page: mockPage,
};

export const container7030WithContent: Container7030Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container7030',
    dataSource: '',
    placeholders: {
      'container-seventy-left': [
        {
          uid: 'left-component',
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
    DynamicPlaceholderId: '4',
  },
  page: mockPage,
};

export const container7030EmptyInEditMode: Container7030Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container7030',
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
