import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {withKnobs, text} from '@kadira/storybook-addon-knobs';
import {importPath} from '../../constants';
import {withProvider} from '../../decorators';
import {MockPageForSystemInformationMessages} from '../../components';
import {SystemInformationMessages} from '../../../plugins/lunchbadger-ui/src';

storiesOf('Messaging Framework', module)
  .addDecorator(withKnobs)
  .addDecorator(withProvider)
  .addWithInfo('SystemInformationMessages',
    importPath('SystemInformationMessages', 'plugins/lunchbadger-ui/src/', true),
    () => (
      <MockPageForSystemInformationMessages>
        <SystemInformationMessages />
      </MockPageForSystemInformationMessages>
    ),
    {propTables: [SystemInformationMessages], inline: true}
  );
