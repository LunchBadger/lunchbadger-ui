import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, boolean, select, object, array} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {entityTypes} from '../../constants';
import {Entity, EntityProperties} from '../../../plugins/lunchbadger-ui/src';
import {iconEdit, iconTrash} from '../../../src/icons';

const validationMessage = 'This field cannot be empty';

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

const invalidProperties = properties.map(item => ({...item, invalid: validationMessage}));

const validations = {
  isValid: false,
  data: {
    url: validationMessage,
    database: validationMessage,
    username: validationMessage,
    password: validationMessage,
  },
};

const toolboxConfig = [
  {
    svg: iconTrash,
  },
  {
    svg: iconEdit,
  }
]

storiesOf('Entity', module)
  // .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('Entity', '', () => (
    <Entity
      type={select('type', entityTypes, 'DataSource')}
      name={text('name', 'Entity name')}
      editable={boolean('editable', false)}
      expanded={boolean('expanded', true)}
      collapsed={boolean('collapsed', false)}
      highlighted={boolean('highlighted', false)}
      dragging={boolean('dragging', false)}
      wip={boolean('wip', false)}
      invalid={boolean('invalid', false)}
      toolboxConfig={toolboxConfig}
      onToggleExpand={action('onToggleExpand')}
      onNameChange={action('onNameChange')}
      validations={{isValid: true, data:{}}}
      onFieldClick={action('onFieldClick')}
      onCancel={action('onCancel')}
      onValidSubmit={action('onValidSubmit')}
      onClick={action('onClick')}
      onDoubleClick={action('onDoubleClick')}
      connectDropTarget={item => item}
      connectDragSource={item => item}
    >
      <EntityProperties properties={object('entity properties', properties)} />
    </Entity>
  ), {propTables: [Entity], inline: true})

  .addWithInfo('Entity (validation errors)', '', () => (
    <Entity
      type={select('type', entityTypes, 'DataSource')}
      name={text('name', 'Entity name')}
      editable={boolean('editable', false)}
      expanded={boolean('expanded', true)}
      collapsed={boolean('collapsed', false)}
      highlighted={boolean('highlighted', false)}
      dragging={boolean('dragging', false)}
      wip={boolean('wip', false)}
      invalid={boolean('invalid', false)}
      toolboxConfig={toolboxConfig}
      onToggleExpand={action('onToggleExpand')}
      onNameChange={action('onNameChange')}
      validations={validations}
      onFieldClick={action('onFieldClick')}
      onCancel={action('onCancel')}
      onValidSubmit={action('onValidSubmit')}
      onClick={action('onClick')}
      onDoubleClick={action('onDoubleClick')}
      connectDropTarget={item => item}
      connectDragSource={item => item}
    >
      <EntityProperties properties={object('entity properties', invalidProperties)} />
    </Entity>
  ), {propTables: [Entity], inline: true});
