import React from 'react';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {withKnobs, select} from '@kadira/storybook-addon-knobs';
import {withStyleSVG} from '../../decorators';
import {IconSVG} from '../../../plugins/lunchbadger-ui/src';
import {iconEdit, iconTrash} from '../../../src/icons';
import './styles.scss';

const classNames = {
  '': '',
  customRed: 'customRed',
  customGreen: 'customGreen',
};

const svgs = {
  [iconEdit]: 'pencil',
  [iconTrash]: 'trash',
}

storiesOf('IconSVG', module)
  .addDecorator(withStyleSVG)
  .addDecorator(withKnobs)

  .addWithInfo('IconSVG', '', () => (
    <IconSVG
      svg={select('icon', svgs, iconEdit)}
      className={select('className', classNames, '')}
    />
  ), {propTables: [IconSVG], inline: true});
