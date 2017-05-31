import React from 'react';
import PropTypes from 'prop-types';
import MultiEnvironments from './MultiEnvironments/MultiEnvironments';
import './PanelBar.scss';

const PanelBar = ({children}) => (
  <div className="PanelBar">
    <MultiEnvironments />
    {children}
  </div>
);

PanelBar.propTypes = {
  children: PropTypes.node,
};

export default PanelBar;
