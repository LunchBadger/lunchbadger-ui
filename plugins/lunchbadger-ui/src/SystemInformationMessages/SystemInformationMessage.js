import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {IconSVG} from '../';
import iconDelete from '../../../../src/icons/icon-delete.svg';
import './SystemInformationMessages.scss';

const SystemInformationMessage = ({message, onRemove}) => (
  <div className="SystemInformationMessages__item">
    <div className="SystemInformationMessages__item__delete" onClick={onRemove}>
      <IconSVG svg={iconDelete} />
    </div>
    <span className="SystemInformationMessages__item__message">
      {message}
    </span>
  </div>
);

SystemInformationMessage.propTypes = {
  message: PropTypes.node,
  onRemove: PropTypes.func,
};

export default SystemInformationMessage;
