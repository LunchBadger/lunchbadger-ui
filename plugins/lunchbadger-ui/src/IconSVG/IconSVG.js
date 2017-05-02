import React from 'react';

const IconSVG = ({svg, className}) => (
  <span className={className} dangerouslySetInnerHTML={{__html: svg}} />
);

export default IconSVG;
