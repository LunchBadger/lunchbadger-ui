import React, {Component} from 'react';
import './tool.scss';
import AddPublicEndpoint from 'actions/AddPublicEndpoint';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="publicendpoint tool" onClick={() => AddPublicEndpoint()}>
      	<i className="tool__icon fa fa-github"></i>
      	<span className="tool__tooltip">Public Endpoint</span>
      </div>
    );
  }
}
