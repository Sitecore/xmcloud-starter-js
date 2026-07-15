import { ContainerFullBleedProps } from '../../components/container/container-full-bleed/container-full-bleed.props';
import { BackgroundColor } from '../../enumerations/BackgroundColor.enum';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainerFullBleedProps: ContainerFullBleedProps = {
  rendering: {
    uid: 'test-uid',
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-1': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '1',
  },
  page: mockPage,
};

export const containerFullBleedWithStyles: ContainerFullBleedProps = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-2': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '2',
  },
  page: mockPage,
};

export const containerFullBleedNoTopMargin: ContainerFullBleedProps = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-3': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
    DynamicPlaceholderId: '3',
  },
  page: mockPage,
};

export const containerFullBleedWithBackground: ContainerFullBleedProps = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-4': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '4',
    backgroundImagePath: '/images/background.jpg',
    backgroundColor: BackgroundColor.PRIMARY,
  },
  page: mockPage,
};

export const containerFullBleedWithInset: ContainerFullBleedProps = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-5': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '5',
    backgroundColor: BackgroundColor.SECONDARY,
    inset: '1',
  },
  page: mockPage,
};

export const containerFullBleedTransparent: ContainerFullBleedProps = {
  rendering: {
    uid: 'test-uid-6',
    componentName: 'ContainerFullBleed',
    dataSource: '',
    placeholders: {
      'container-fullbleed-6': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
    DynamicPlaceholderId: '6',
    backgroundColor: BackgroundColor.TRANSPARENT,
  },
  page: mockPage,
};
