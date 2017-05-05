import React, {Component} from 'react';
import {IconSVG} from '../';
import iconDelete from '../../../../src/icons/icon-delete.svg';
import './SystemInformationMessages.scss';

const SystemInformationMessage = ({message}) => (
  <div className="SystemInformationMessages__item">
    <div className="SystemInformationMessages__item__delete">
      <IconSVG svg={iconDelete} />
    </div>
    {message}
  </div>
);

export default SystemInformationMessage;
