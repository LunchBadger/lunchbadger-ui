import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {IconSVG} from '../';
import * as icons from '../../../../src/icons';
import './Toolbox.scss';

const Toolbox = ({config}) => {
  if (config.length === 0) return null;
  return (
    <div className="Toolbox" style={{width: config.length * 50}}>
      {config.map(({action, icon, onClick}, idx) => (
        <div
          key={idx}
          className={cs('Toolbox__button', `Toolbox__button--${action}`)}
          onClick={onClick}
        >
          <IconSVG className="Toolbox__button__icon" svg={icons[icon]} />
        </div>
      ))}
    </div>
  );
}

Toolbox.propTypes = {
  config: PropTypes.array,
}

export default Toolbox;
