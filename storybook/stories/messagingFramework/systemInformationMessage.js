import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {importPath} from '../../constants';
import SystemInformationMessage from '../../../plugins/lunchbadger-ui/src/SystemInformationMessages/SystemInformationMessage';

const types = {
  '': '',
  submit: 'submit',
}

storiesOf('Messaging Framework', module)
  .addDecorator(withKnobs)
  .addWithInfo('SystemInformationMessage',
    importPath('SystemInformationMessage', 'plugins/lunchbadger-ui/src/SystemInformationMessages/SystemInformationMessage', false),
    () => (
      <SystemInformationMessage
        onRemove={action('onRemove')}
        message={text('name', 'System information message')}
      />
    ),
    {propTables: [SystemInformationMessage], inline: true}
  );
