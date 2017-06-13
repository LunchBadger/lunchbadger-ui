import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, select} from '@kadira/storybook-addon-knobs';
import {importPath} from '../../constants';
import SystemInformationMessage from '../../../plugins/lunchbadger-ui/src/SystemInformationMessages/SystemInformationMessage';
import './styles.scss';

const types = {
  '': '',
  submit: 'submit',
}

storiesOf('Messaging Framework', module)
  .addDecorator(withKnobs)

  .addWithInfo('SystemInformationMessage', importPath('SystemInformationMessage', 'plugins/lunchbadger-ui/src'), () => (
    <SystemInformationMessage
      onRemove={action('onRemove')}
      message={text('name', '')}
    />
  ), {propTables: [SystemInformationMessage], inline: true});
