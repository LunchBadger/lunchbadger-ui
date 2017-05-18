import React from 'react';
import '../styles.scss';
import '../../plugins/lunchbadger-core/src/components/Header/Header.scss';

export default ({children}) => (
  <div className="story__mockHeader">
    <div className="header">
      {children}
    </div>
  </div>
);
