import React, {Component} from 'react';
import './Tool.scss';
import AddPrivateEndpoint from 'actions/AddPrivateEndpoint';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="privateendpoint tool" onClick={() => AddPrivateEndpoint()}>
      	<i className="tool__icon fa fa-github"></i>
      	<span className="tool__tooltip">Private Endpoint</span>
      </div>
    );
  }
}
