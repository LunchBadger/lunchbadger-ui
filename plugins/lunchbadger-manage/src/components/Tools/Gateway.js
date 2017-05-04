import React, {Component} from 'react';
import cs from 'classnames';
import DeployGateway from '../../actions/CanvasElements/Gateway/deploy';

const Tool = LunchBadgerCore.components.Tool;

class Gateway extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Gateway';
    return (
      <div className={cs('gateway', 'tool', {['tool--selected']: isSelected})} onClick={() => DeployGateway()}>
      	<i className="tool__icon icon-icon-gateway"/>
      	<span className="tool__tooltip">Gateway</span>
      </div>
    );
  }
}

export default Tool(Gateway);
