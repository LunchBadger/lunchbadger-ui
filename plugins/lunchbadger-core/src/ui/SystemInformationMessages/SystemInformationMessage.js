import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {IconSVG} from '../';
import icons from '../icons';
import getPlainText from '../utils/getPlainText';
import './SystemInformationMessages.scss';

const {iconDelete} = icons;

const SystemInformationMessage = ({message, onRemove}) => (
  <div className={cs('SystemInformationMessages__item', getPlainText(message))}>
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
