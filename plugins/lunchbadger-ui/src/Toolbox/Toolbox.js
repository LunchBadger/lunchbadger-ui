import React, {PropTypes} from 'react';
import {IconSVG} from '../';
import './Toolbox.scss';

const Toolbox = ({config}) => (
  <div className="Toolbox">
    {config.map(({svg, onClick}, idx) => (
      <div key={idx} className="Toolbox__button" onClick={onClick}>
        <IconSVG className="Toolbox__button__icon" svg={svg} />
      </div>
    ))}
  </div>
);

Toolbox.propTypes = {
  config: PropTypes.array,
}

export default Toolbox;
