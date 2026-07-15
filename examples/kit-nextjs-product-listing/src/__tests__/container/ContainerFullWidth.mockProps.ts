import { ContainerFullWidthProps } from '../../components/container/container-full-width/container-full-width.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainerFullWidthProps: ContainerFullWidthProps = {
  rendering: {
    uid: 'test-uid',
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-1': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '1',
  },
  page: mockPage,
};

export const containerFullWidthWithStyles: ContainerFullWidthProps = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-2': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '2',
  },
  page: mockPage,
};

export const containerFullWidthNoTopMargin: ContainerFullWidthProps = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-3': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
    DynamicPlaceholderId: '3',
  },
  page: mockPage,
};

export const containerFullWidthWithContent: ContainerFullWidthProps = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'ContainerFullWidth',
    dataSource: '',
    placeholders: {
      'container-fullwidth-4': [
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

export const containerFullWidthEmptyInEditMode: ContainerFullWidthProps = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'ContainerFullWidth',
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
