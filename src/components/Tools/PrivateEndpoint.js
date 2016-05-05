import React, {Component} from 'react';
import './Tool.scss';
import AddPrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/add';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="privateendpoint tool_context_item" onClick={() => AddPrivateEndpoint('Private Endpoint')}>
      	<i className="tool__icon fa fa-compass"/>
      	<span className="tool__name">Private Endpoint</span>
      </div>
    );
  }
}
