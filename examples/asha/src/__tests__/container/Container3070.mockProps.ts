import { Container3070Props } from '../../components/container/container-3070/container-3070.props';
import { mockPage } from '../test-utils/mockPage';

export const defaultContainer3070Props: Container3070Props = {
  rendering: {
    uid: 'test-uid',
    componentName: 'Container3070',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-seventy-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container3070WithStyles: Container3070Props = {
  rendering: {
    uid: 'test-uid-2',
    componentName: 'Container3070',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-seventy-right': [],
    },
  },
  params: {
    styles: 'custom-container-class',
    excludeTopMargin: '0',
  },
  page: mockPage,
};

export const container3070NoTopMargin: Container3070Props = {
  rendering: {
    uid: 'test-uid-3',
    componentName: 'Container3070',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-seventy-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '1',
  },
  page: mockPage,
};

export const container3070WithContent: Container3070Props = {
  rendering: {
    uid: 'test-uid-4',
    componentName: 'Container3070',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [
        {
          uid: 'left-component',
          componentName: 'TestComponent',
          dataSource: '',
        },
      ],
      'container-seventy-right': [
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

export const container3070EmptyInEditMode: Container3070Props = {
  rendering: {
    uid: 'test-uid-5',
    componentName: 'Container3070',
    dataSource: '',
    placeholders: {
      'container-thirty-left': [],
      'container-seventy-right': [],
    },
  },
  params: {
    styles: '',
    excludeTopMargin: '0',
  },
  page: mockPage,
};
