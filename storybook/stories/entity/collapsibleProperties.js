import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {CollapsibleProperties} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

const types = {
  '': '',
  submit: 'submit',
}

storiesOf('Entity', module)
  .addDecorator(withKnobs)

  .addWithInfo('CollapsibleProperties', '', () => (
    <CollapsibleProperties
      bar={text('bar content', 'bar')}
      collapsible={text('collapsible content', 'collapsible content')}
      onToggleCollapse={action('onToggleCollapse')}
    />
  ), {propTables: [CollapsibleProperties], inline: true});
