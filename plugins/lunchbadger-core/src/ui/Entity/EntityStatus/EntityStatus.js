import React, {PureComponent} from 'react';
import cs from 'classnames';
import {IconSVG, ContextualInformationMessage} from '../../';
import icons from '../../icons';
import './EntityStatus.scss';

const icon = {
  deploying: 'iconRocket',
  crashed: 'iconError',
  deleting: 'iconTrash',
};

const tooltip = {
  deploying: 'is deploying',
  crashed: 'is not running',
  deleting: 'is deleting',
}

export default class EntityStatus extends PureComponent {
  render() {
    const {status, type, onClick} = this.props;
    if (!status) return null;
    return (
      <ContextualInformationMessage
        tooltip={`The ${type.toLowerCase()} ${tooltip[status]}`}
        direction="bottomRight"
      >
        <div className={cs('EntityStatus', status)} onClick={onClick}>
          <IconSVG svg={icons[icon[status]]} />
        </div>
      </ContextualInformationMessage>
    );
  }
}
