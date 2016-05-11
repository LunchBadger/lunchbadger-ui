import React, {Component} from 'react';
import AddPrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/add';

const Tool = LunchBadgerCore.components.Tool;

class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="privateendpoint tool_context_item" onClick={() => AddPrivateEndpoint('Private Endpoint')}>
      	<i className="tool__icon fa fa-compass"/>
      	<span className="tool__name">Private Endpoint</span>
      </div>
    );
  }
}

export default Tool(PrivateEndpoint);
