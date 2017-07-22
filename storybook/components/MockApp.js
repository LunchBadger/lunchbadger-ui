import React from 'react';
import {TooltipWrapper} from '../../plugins/lunchbadger-ui/src';

export default ({children}) => (
  <div>
    {children}
    <TooltipWrapper />
  </div>
);
