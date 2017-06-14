import React from 'react';
import PropTypes from 'prop-types';
import './ToolGroup.scss';

const ToolGroup = ({children}) => (
  <div className="ToolGroup">
    {children}
  </div>
);

ToolGroup.propTypes = {
  children: PropTypes.node,
};

export default ToolGroup;
