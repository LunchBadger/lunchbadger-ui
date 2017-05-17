import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {IconSVG} from '../';
import './Toolbox.scss';

const Toolbox = ({config}) => (
  <div className="Toolbox">
    {config.map(({action, svg, onClick}, idx) => (
      <div
        key={idx}
        className={cs('Toolbox__button', `Toolbox__button--${action}`)}
        onClick={onClick}
      >
        <IconSVG className="Toolbox__button__icon" svg={svg} />
      </div>
    ))}
  </div>
);

Toolbox.propTypes = {
  config: PropTypes.array,
}

export default Toolbox;
