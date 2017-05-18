import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withForm} from '../../decorators';
import {importPath} from '../../constants';
import EntityActionButtons from '../../../plugins/lunchbadger-ui/src/Entity/EntityActionButtons/EntityActionButtons';
import './styles.scss';

storiesOf('Entity', module)

  .addWithInfo('EntityActionButtons', importPath('EntityActionButtons', 'plugins/lunchbadger-ui/src/Entity/EntityActionButtons/EntityActionButtons', false), () => (
    <EntityActionButtons
      onCancel={action('onCancel')}
    />
  ), {propTables: [EntityActionButtons], inline: true});
