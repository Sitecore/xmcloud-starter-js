import { Container6321Props } from '../../components/container/container-6321/Container6321';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer6321Props: Container6321Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container6321',
    dataSource: '',
    placeholders: {
      'container-sixty-thirty-one': [],
      'container-sixty-thirty-two': [],
      'container-sixty-thirty-three': [],
      'container-sixty-thirty-four': [],
      'container-sixty-thirty-five': [],
      'container-sixty-thirty-six': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '1',
  },
  children: {} as Element,
  page: mockPage,
};

export const container6321WithStyles: Container6321Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container6321',
    dataSource: '',
    placeholders: {
      'container-sixty-thirty-one': [],
      'container-sixty-thirty-two': [],
      'container-sixty-thirty-three': [],
      'container-sixty-thirty-four': [],
      'container-sixty-thirty-five': [],
      'container-sixty-thirty-six': [],
    },
  },
  params: {
    styles: 'custom-grid-class',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '2',
  },
  children: {} as Element,
  page: mockPage,
};

export const container6321NoTopMargin: Container6321Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container6321',
    dataSource: '',
    placeholders: {
      'container-sixty-thirty-one': [],
      'container-sixty-thirty-two': [],
      'container-sixty-thirty-three': [],
      'container-sixty-thirty-four': [],
      'container-sixty-thirty-five': [],
      'container-sixty-thirty-six': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
    DynamicPlaceholderId: '3',
  },
  children: {} as Element,
  page: mockPage,
};

export const container6321WithContent: Container6321Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container6321',
    dataSource: '',
    placeholders: {
      'container-sixty-thirty-one': [
        {
          uid: 'col1-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-sixty-thirty-two': [
        {
          uid: 'col2-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-sixty-thirty-three': [
        {
          uid: 'col3-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-sixty-thirty-four': [
        {
          uid: 'col4-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-sixty-thirty-five': [
        {
          uid: 'col5-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-sixty-thirty-six': [
        {
          uid: 'col6-component',
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
  children: {} as Element,
  page: mockPage,
};

export const container6321EmptyInEditMode: Container6321Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container6321',
    dataSource: '',
    placeholders: {},
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '5',
  },
  children: {} as Element,
  page: mockPage,
};
