import React from 'react';
import cs from 'classnames';
import {IconSVG} from '../';
import * as icons from '../../../../src/icons';
import getPlainText from '../utils/getPlainText';
import './IconButton.scss';

export default ({icon, onClick, name, disabled}) => (
  <div className={cs('IconButton', getPlainText(`button__${name}`), {disabled})} onClick={onClick}>
    <IconSVG svg={icons[icon]} />
  </div>
);
