import React, {Component} from 'react';
import {connect} from 'react-redux';
import {showSystemDefcon1} from '../actions';
import SystemDefcon1Box from './SystemDefcon1Box';
import './SystemDefcon1.scss';

const SystemDefcon1 = ({onClose, ...props}) => (
  <div className="SystemDefcon1">
    <SystemDefcon1Box onClose={onClose} {...props} />
  </div>
);

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(showSystemDefcon1('')),
});

export default connect(null, mapDispatchToProps)(SystemDefcon1);
