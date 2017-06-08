import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './ContextualInformationMessage.scss';

const ContextualInformationMessage = ({children, type, direction, width}) => (
  <div
    className={cs('ContextualInformationMessage', type, direction, {withWidth: width !== 'auto'})}
    style={{width}}
  >
    {children}
  </div>
);

ContextualInformationMessage.propTypes = {
  children: PropTypes.node,
  type: PropTypes.string,
  direction: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

ContextualInformationMessage.defaultProps = {
  type: '',
  direction: 'bottom',
  width: 'auto',
};

export default ContextualInformationMessage;
