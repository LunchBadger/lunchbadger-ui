import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {importPath} from '../../constants';
import {CollapsibleProperties} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

const types = {
  '': '',
  submit: 'submit',
}

storiesOf('Entity', module)
  .addDecorator(withKnobs)

  .addWithInfo('CollapsibleProperties', importPath('CollapsibleProperties', 'plugins/lunchbadger-ui/src'), () => (
    <CollapsibleProperties
      bar={text('bar content', 'bar')}
      collapsible={text('collapsible content', 'collapsible content')}
      onToggleCollapse={action('onToggleCollapse')}
    />
  ), {propTables: [CollapsibleProperties], inline: true});
