import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';
import {importPath} from '../../constants';
import {MockContextualInformationWrapper} from '../../components';
import {ContextualInformationMessage} from '../../../plugins/lunchbadger-ui/src';

storiesOf('Messaging Framework', module)
  .addDecorator(withKnobs)
  .addWithInfo('ContextualInformationMessage', importPath('ContextualInformationMessage', 'plugins/lunchbadger-ui/src'), () => (
    <MockContextualInformationWrapper>
      <ContextualInformationMessage>
        {text('children', 'Contextual information message mock')}
      </ContextualInformationMessage>
    </MockContextualInformationWrapper>
  ), {propTables: [ContextualInformationMessage], inline: true});
