import React from 'react';
import {IconSVG} from '../../../';
import icons from '../../../icons';
import './User.scss';

const {iconUser} = icons;

export default ({username}) => (
  <div className="User">
    <IconSVG className="User__icon" svg={iconUser} />
    {username}
  </div>
);
