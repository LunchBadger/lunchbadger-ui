import React from 'react';
import '../styles.scss';

export default story => (
  <div className="story__mockPageForAside">
    {story()}
  </div>
);
