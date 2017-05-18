import React from 'react';
import cs from 'classnames';
import {storiesOf, action} from '@kadira/storybook';
import {WithNotes} from '@kadira/storybook-addon-notes';
import {IconSVG} from '../../../plugins/lunchbadger-ui/src';
import {
  iconApi,
  iconDataSource,
  iconEndpoint,
  iconGateway,
  iconMicroservice,
  iconModel,
  iconPortal,

  iconArrow,
  iconDelete,
  iconDetails,
  iconEdit,
  iconPlus,
  iconTrash,
} from '../../../src/icons';
import './styles.scss';

const entityIcons = {
  iconDataSource,
  iconModel,
  iconMicroservice,
  iconEndpoint,
  iconGateway,
  iconApi,
  iconPortal,
};

const utilsIcons = {
  iconArrow,
  iconDelete,
  iconDetails,
  iconEdit,
  iconPlus,
  iconTrash,
}

const kinds = [
  '',
  'menu',
  'menuHover',
  'menuSelected',
  'entity',
  'entityHover',
  'entityHighlighted',
  'entityHighlightedHover',
];

const isFill = ['iconArrow', 'iconDetails'];

const renderIcon = (icons) => () => (
  <div className="entityTypeIcons">
    {Object.keys(icons).map(key => (
      <div key={key}>
        <pre className="entityTypeIcons__title">{key}</pre>
        {kinds.map(item => (
          <div key={item} className={cs('entityTypeIcons__icon', item, {['fill']: isFill.includes(key)})}>
            <IconSVG svg={icons[key]} />
          </div>
        ))}
      </div>
    ))}
  </div>
);

storiesOf('IconSVG', module)
  .addWithInfo('Entity type icons', '', renderIcon(entityIcons))
  .addWithInfo('Utils icons', '', renderIcon(utilsIcons));
