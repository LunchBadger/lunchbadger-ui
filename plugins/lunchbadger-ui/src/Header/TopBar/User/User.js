import React from 'react';
import {IconSVG} from '../../../';
import {iconUser} from '../../../../../../src/icons';
import './User.scss';

export default ({username}) => (
  <div className="User">
    <IconSVG className="User__icon" svg={iconUser} />
    {username}
  </div>
);
