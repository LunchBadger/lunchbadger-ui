import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, select, boolean} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {entityTypes} from '../../constants';
import EntityHeader from '../../../plugins/lunchbadger-ui/src/Entity/EntityHeader/EntityHeader';

storiesOf('Entity', module)
  .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('EntityHeader', '', () => (
    <div className={cs('Entity', 'fake', {
      ['highlighted']: boolean('highlighted', true),
      ['editable']: boolean('editable', true),
    })}>
      <EntityHeader
        type={select('type', entityTypes, 'DataSource')}
        name={text('name', 'Entity name')}
        onToggleExpand={action('onToggleExpand')}
      />
    </div>
  ), {propTables: [EntityHeader], inline: true});
