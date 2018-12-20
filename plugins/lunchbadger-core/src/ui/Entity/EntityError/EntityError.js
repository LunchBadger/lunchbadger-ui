import React from 'react';
import {ContextualInformationMessage} from '../../';
import './EntityError.scss';

export default ({onClick}) => (
  <ContextualInformationMessage
    tooltip="Entity error"
    direction="bottom"
  >
    <div
      className="EntityError"
      onClick={onClick}
    />
  </ContextualInformationMessage>
);
