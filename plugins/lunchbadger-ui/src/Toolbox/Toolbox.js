import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {IconSVG, ContextualInformationMessage} from '../';
import * as icons from '../../../../src/icons';
import './Toolbox.scss';

const Toolbox = ({config, zoom}) => {
  if (config.length === 0) return null;
  return (
    <div className={cs('Toolbox', {zoom})} style={{width: config.length * 50}}>
      {config.map(({action, icon, onClick, selected, label}, idx) => (
        <ContextualInformationMessage
          key={idx}
          tooltip={label}
          direction="bottom"
        >
          <div
            className={cs('Toolbox__button', `Toolbox__button--${action}`, {selected})}
            onClick={onClick}
          >
            <IconSVG className="Toolbox__button__icon" svg={icons[icon]} />
          </div>
        </ContextualInformationMessage>
      ))}
    </div>
  );
}

Toolbox.propTypes = {
  config: PropTypes.array,
}

export default Toolbox;
