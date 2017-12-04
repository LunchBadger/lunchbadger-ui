import React, {PureComponent} from 'react';
import cs from 'classnames';
import {IconSVG} from '../';
import * as icons from '../../../../src/icons';
import getPlainText from '../utils/getPlainText';
import './IconButton.scss';

export default class IconButton extends PureComponent {
  render() {
    const {icon, onClick, name, disabled} = this.props;
    return (
      <div className={cs('IconButton', getPlainText(`button__${name}`), {disabled})} onClick={onClick}>
        <IconSVG svg={icons[icon]} />
      </div>
    );
  }
}
