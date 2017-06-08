import React from 'react';
import PropTypes from 'prop-types';
import MultiEnvironments from './MultiEnvironments/MultiEnvironments';
import './PanelBar.scss';

const PanelBar = ({children, disabledMultiEnvMenu}) => (
  <div className="PanelBar">
    <MultiEnvironments disabled={disabledMultiEnvMenu} />
    {children}
  </div>
);

PanelBar.propTypes = {
  children: PropTypes.node,
  disabledMultiEnvMenu: PropTypes.bool,
};

export default PanelBar;
