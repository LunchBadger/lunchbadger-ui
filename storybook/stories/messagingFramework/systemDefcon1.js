import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';
import {importPath, lorem} from '../../constants';
import {MockPage} from '../../components';
import SystemDefcon1Box from '../../../plugins/lunchbadger-ui/src/SystemDefcon1/SystemDefcon1Box';

const errorMock = `Error mock:
  ${lorem(2)}.
  ${lorem(2)}.
  ${lorem(1)}.
  ${lorem(2)}.
  ${lorem(3)}.
  ${lorem(2)}.
`;

storiesOf('Messaging Framework', module)
  .addDecorator(withKnobs)
  .addWithInfo('SystemDefcon1Box', importPath('SystemDefcon1Box', 'plugins/lunchbadger-ui/src/SystemDefcon1/SystemDefcon1Box', false), () => (
    <MockPage>
      <SystemDefcon1Box
        server={boolean('server', false)}
        error={text('error', errorMock)}
      />
    </MockPage>
  ), {propTables: [SystemDefcon1Box], inline: true});
