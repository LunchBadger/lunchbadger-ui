import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs} from '@kadira/storybook-addon-knobs';
import {withContext, withProvider} from '../../decorators';
import {importPath} from '../../constants';
import {MockHeader} from '../../components';
import Breadcrumbs from '../../../plugins/lunchbadger-core/src/components/Breadcrumbs/Breadcrumbs';

storiesOf('Header', module)
  .addDecorator(withKnobs)
  .addDecorator(withProvider)
  .addDecorator(withContext)
  .addWithInfo('Breadcrumbs',
    importPath('Breadcrumbs', 'plugins/lunchbadger-core/src/components/Breadcrumbs/Breadcrumbs', false),
    () => (
      <MockHeader>
        <Breadcrumbs />
      </MockHeader>
    ),
    {propTables: [Breadcrumbs], inline: true}
  );
