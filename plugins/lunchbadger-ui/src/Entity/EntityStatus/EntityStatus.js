import React, {PureComponent} from 'react';
import cs from 'classnames';
import {IconSVG, ContextualInformationMessage} from '../../';
import * as icons from '../../../../../src/icons';
import './EntityStatus.scss';

const icon = {
  deploying: 'iconRocket',
  crashed: 'iconError',
  deleting: 'iconTrash',
};

const tooltip = {
  deploying: 'The gateway is deploying',
  crashed: 'The gateway is not running',
  deleting: 'The gateway is deleting',
}

export default class EntityStatus extends PureComponent {
  render() {
    const {status} = this.props;
    if (!status) return null;
    return (
      <ContextualInformationMessage
        tooltip={tooltip[status]}
        direction="bottomRight"
      >
        <div className={cs('EntityStatus', status)}>
          <IconSVG svg={icons[icon[status]]} />
        </div>
      </ContextualInformationMessage>
    );
  }
}
