import React, {Component} from 'react';
import DeployGateway from '../../actions/CanvasElements/Gateway/deploy';

const Tool = LunchBadgerCore.components.Tool;

class Gateway extends Component {
  render() {
    return (
      <div className="gateway tool" onClick={() => DeployGateway()}>
      	<i className="tool__icon icon-icon-gateway"/>
      	<span className="tool__tooltip">Gateway</span>
      </div>
    );
  }
}

export default Tool(Gateway);
