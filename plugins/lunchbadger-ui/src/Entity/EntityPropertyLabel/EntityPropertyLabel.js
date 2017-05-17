import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './EntityPropertyLabel.scss';

const EntityPropertyLabel = ({children, className}) => (
  <div className={cs('EntityPropertyLabel', className)}>
    {children}
  </div>
);

EntityPropertyLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default EntityPropertyLabel;
