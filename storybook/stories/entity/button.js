import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, select} from '@kadira/storybook-addon-knobs';
import {Button} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

const types = {
  '': '',
  submit: 'submit',
}

storiesOf('Entity', module)
  .addDecorator(withKnobs)

  .addWithInfo('Button', '', () => (
    <Button
      onClick={action('onClick')}
      type={select('type', types, '')}
      name={text('name', '')}
    >
      {text('label', 'some label')}
    </Button>
  ), {propTables: [Button], inline: true});
