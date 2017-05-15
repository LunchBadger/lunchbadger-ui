import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {EntitySubElements} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

storiesOf('Entity', module)
  .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('EntitySubElements', '', () => (
    <div className={cs('Entity', 'fake', {
      ['highlighted']: boolean('highlighted', false),
    })}>
      <EntitySubElements
        title={text('title', 'title')}
        main={boolean('main', false)}
        onAdd={action('onAdd')}
      >
        {text('content', 'some content')}
      </EntitySubElements>
    </div>
  ), {propTables: [EntitySubElements], inline: true});
