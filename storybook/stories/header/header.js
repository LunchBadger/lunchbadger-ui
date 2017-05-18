import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs} from '@kadira/storybook-addon-knobs';
import {withContext, withProvider} from '../../decorators';
import {importPath} from '../../constants';
import {MockHeader} from '../../components';
import Header from '../../../plugins/lunchbadger-core/src/components/Header/Header';
import {iconEdit, iconTrash} from '../../../src/icons';

const mockAppState = {
  getStateKey: () => {},
}

const mockPlugins = {
  getPanelButtons: () => ([]),
}

storiesOf('Header', module)
  .addDecorator(withKnobs)
  .addDecorator(withProvider)
  .addDecorator(withContext)
  .addWithInfo('Header',
    importPath('Header', 'plugins/lunchbadger-core/src/components/Header/Header', false),
    () => (
      <MockHeader>
        <Header
          appState={mockAppState}
          plugins={mockPlugins}
          clearServer={action('mockClearServer')}
          saveToServer={action('saveToServer')}
        />
      </MockHeader>
    ),
    {propTables: [Header], inline: true}
  );
