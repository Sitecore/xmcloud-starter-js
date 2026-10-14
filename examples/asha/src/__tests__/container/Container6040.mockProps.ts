import { Container6040Props } from '../../components/container/container-6040/container-6040.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer6040Props: Container6040Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container6040',
    dataSource: '',
    placeholders: {
      'container-sixty-left': [],
      'container-forty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '1',
  },
  page: mockPage,
};

export const container6040WithStyles: Container6040Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container6040',
    dataSource: '',
    placeholders: {
      'container-sixty-left': [],
      'container-forty-right': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '2',
  },
  page: mockPage,
};

export const container6040NoTopMargin: Container6040Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container6040',
    dataSource: '',
    placeholders: {
      'container-sixty-left': [],
      'container-forty-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
    DynamicPlaceholderId: '3',
  },
  page: mockPage,
};

export const container6040WithContent: Container6040Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container6040',
    dataSource: '',
    placeholders: {
      'container-sixty-left': [
        {
          uid: 'left-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-forty-right': [
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

export const container6040EmptyInEditMode: Container6040Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container6040',
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
