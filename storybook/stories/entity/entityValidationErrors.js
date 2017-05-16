import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, boolean} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {importPath} from '../../constants';
import {EntityValidationErrors} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

const getValidations = isValid => ({
  isValid,
  data: {
    fieldOne: 'Error for field one',
    fieldTwo: 'Error for field two',
  },
});

storiesOf('Entity', module)
  .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('EntityValidationErrors', importPath('EntityValidationErrors', 'plugins/lunchbadger-ui/src'), () => (
    <EntityValidationErrors
      validations={getValidations(boolean('is Valid', false))}
      onFieldClick={action('onFieldClick')}
    />
  ), {propTables: [EntityValidationErrors], inline: true});
