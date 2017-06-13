import React, {Component} from 'react';
import {connect} from 'react-redux';
import {toggleSystemDefcon1} from '../actions';
import SystemDefcon1Box from './SystemDefcon1Box';
import './SystemDefcon1.scss';

const SystemDefcon1 = ({...props}) => (
  <div className="SystemDefcon1">
    <SystemDefcon1Box {...props} />
  </div>
);

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(toggleSystemDefcon1()),
});

export default connect(null, mapDispatchToProps)(SystemDefcon1);
