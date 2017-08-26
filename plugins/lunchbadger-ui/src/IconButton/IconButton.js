import React from 'react';
import {IconSVG} from '../';
import * as icons from '../../../../src/icons';
import './IconButton.scss';

export default ({icon, onClick}) => (
  <div className="IconButton" onClick={onClick}>
    <IconSVG svg={icons[icon]} />
  </div>
);
