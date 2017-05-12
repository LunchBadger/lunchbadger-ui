import {action} from '@kadira/storybook';
import {
  iconEdit,
  iconTrash,
  iconApi,
  iconDataSource,
  iconEndpoint,
  iconGateway,
  iconMicroservice,
  iconModel,
  iconPlus,
  iconPortal,
} from '../src/icons';

const loremArr = [
  'Lorem ipsum dolor sit amet',
  'Consectetur adipiscing elit',
  'Vestibulum in felis congue',
  'Porta dolor sit amet',
  'Efficitur erat',
  'Quisque sed molestie est',
  'Morbi condimentum ante nulla',
  'Sit amet maximus tortor iaculis sit amet',
  'Aliquam porttitor venenatis ante sit amet dictum',
  'Curabitur ultricies eros a nulla congue',
  'Nec eleifend ante fermentum',
  'Donec metus sem',
  'Dornare sit amet pharetra sit amet',
  'Alesuada at enim',
  'Pellentesque aliquam elit in sapien dictum',
  'Sit amet elementum mauris vehicula',
  'Maecenas non leo sit amet justo blandit',
  'Vestibulum sed non tortor',
  'Praesent a lectus ullamcorper',
  'Pcelerisque mauris ac',
  'Pellentesque ligula',
  'Pellentesque ut congue augue',
  'Curabitur quis vestibulum ipsum',
  'Maecenas varius eros quis enim',
  'Faucibus a tempor ligula feugiat',
]

export const lorem = (size = 1) => {
  const result = [];
  for (let i = 0; i < size; i += 1) {
    result.push(loremArr[Math.floor(Math.random() * loremArr.length)]);
  }
  return result.join('. ');
}

export const toolboxConfig = {
  deleteEdit: [
    {
      action: 'delete',
      svg: iconTrash,
      onClick: action('delete click'),
    },
    {
      action: 'edit',
      svg: iconEdit,
      onClick: action('edit click'),
    },
  ],
  entities: [
    {
      action: 'dataSource',
      svg: iconDataSource,
      onClick: action('dataSource'),
    },
    {
      action: 'model',
      svg: iconModel,
      onClick: action('model'),
    },
    {
      action: 'microservice',
      svg: iconMicroservice,
      onClick: action('microservice'),
    },
    {
      action: 'endpoint',
      svg: iconEndpoint,
      onClick: action('endpoint'),
    },
    {
      action: 'gateway',
      svg: iconGateway,
      onClick: action('gateway'),
    },
    {
      action: 'api',
      svg: iconApi,
      onClick: action('api'),
    },
    {
      action: 'portal',
      svg: iconPortal,
      onClick: action('portal'),
    },
  ],
  one: [
    {
      action: 'one',
      svg: iconPlus,
      onClick: action('one'),
    },
  ],
};

export const colors = [
  {
    name: 'Main',
    value: '#047C99',
  },
  {
    name: 'Active',
    value: '#4190CE',
  },
  {
    name: 'Default text',
    value: '#4b4b4b',
  },
  {
    name: 'Error',
    value: '#f44336',
  },
]
