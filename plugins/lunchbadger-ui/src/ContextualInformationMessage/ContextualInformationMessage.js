import React from 'react';
import cs from 'classnames';
import './ContextualInformationMessage.scss';

const ContextualInformationMessage = ({children, type}) => (
  <div className={cs('ContextualInformationMessage', type)}>
    {children}
  </div>
);

export default ContextualInformationMessage;
