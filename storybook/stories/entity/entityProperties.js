import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, object, boolean} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {EntityProperties} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

const properties = [
  {
    name: 'url',
    title: 'URL',
    value: '',
    invalid: '',
  },
  {
    name: 'database',
    title: 'database',
    value: '',
    invalid: '',
  },
  {
    name: 'username',
    title: 'username',
    value: '',
    invalid: '',
  },
  {
    name: 'password',
    title: 'password',
    value: '',
    invalid: '',
    password: true,
  },
];

storiesOf('Entity', module)
  .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('EntityProperties', '', () => (
    <div className={cs('Entity', 'fake', {
      ['highlighted']: boolean('highlighted', true),
      ['editable']: boolean('editable', true),
    })}>
      <EntityProperties
        properties={object('properties', properties)}
      />
    </div>
  ), {propTables: [EntityProperties], inline: true});
