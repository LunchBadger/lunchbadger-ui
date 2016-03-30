import React, {Component} from 'react';
import './tool.scss';
import AddPublicEndpoint from 'actions/AddPublicEndpoint';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="publicendpoint tool__context__item" onClick={() => AddPublicEndpoint()}>
      	<i className="tool__icon fa fa-globe"></i>
      	<span className="tool__name">Public Endpoint</span>
      </div>
    );
  }
}
