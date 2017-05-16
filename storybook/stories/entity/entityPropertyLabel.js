import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, text, select, boolean} from '@kadira/storybook-addon-knobs';
import {withForm} from '../../decorators';
import {entityTypes, importPath} from '../../constants';
import {EntityPropertyLabel} from '../../../plugins/lunchbadger-ui/src';
import './styles.scss';

const classNames = {
  '': 'none',
  customRed: 'customRed',
  customGreen: 'customGreen',
}

storiesOf('Entity', module)
  .addDecorator(withForm)
  .addDecorator(withKnobs)

  .addWithInfo('EntityPropertyLabel', importPath('EntityPropertyLabel', 'plugins/lunchbadger-ui/src'), () => (
    <div className={cs('Entity', 'fake', {
      ['highlighted']: boolean('highlighted', false),
    })}>
      <EntityPropertyLabel
        className={select('className', classNames, '')}
      >
        {text('label', 'some label')}
      </EntityPropertyLabel>
    </div>
  ), {propTables: [EntityPropertyLabel], inline: true});
