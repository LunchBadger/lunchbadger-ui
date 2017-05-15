import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, boolean} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {EntityProperty} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

storiesOf('Entity', module)
  .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('EntityProperty', '', () => (
    <div className={cs('Entity', 'fake', {
      ['highlighted']: boolean('highlighted', true),
      ['editable']: boolean('editable', true),
    })}>
      <EntityProperty
        name={text('name', 'name')}
        value={text('value', 'some value')}
        title={text('title', 'some title')}
        placeholder={text('placeholder', 'Some placeholder')}
        invalid={text('invalid', '')}
        fake={boolean('fake', false)}
        editableOnly={boolean('editableOnly', false)}
        password={boolean('password', false)}
        hiddenInputs={[]}
        onChange={action('onChange')}
        onDelete={action('onDelete')}
        onBlue={action('onBlur')}
      />
    </div>
  ), {propTables: [EntityProperty], inline: true});
