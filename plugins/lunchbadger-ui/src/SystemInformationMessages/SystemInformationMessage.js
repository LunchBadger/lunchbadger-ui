import React, {Component} from 'react';
import {IconSVG} from '../';
import iconDelete from '../../../../src/icons/icon-delete.svg';
import './SystemInformationMessages.scss';

const SystemInformationMessage = ({message, onRemove}) => (
  <div className="SystemInformationMessages__item">
    <div className="SystemInformationMessages__item__delete" onClick={onRemove}>
      <IconSVG svg={iconDelete} />
    </div>
    {message}
  </div>
);

export default SystemInformationMessage;
