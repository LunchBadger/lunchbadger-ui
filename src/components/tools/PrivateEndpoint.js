import React, {Component} from 'react';
import './tool.scss';
import AddPrivateEndpoint from 'actions/AddPrivateEndpoint';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="privateendpoint tool_context_item" onClick={() => AddPrivateEndpoint()}>
      	<i className="tool__icon fa fa-compass"></i>
      	<span className="tool__name">Private Endpoint</span>
      </div>
    );
  }
}
