import React, {Component} from 'react';
import cs from 'classnames';
import DeployGateway from '../../actions/CanvasElements/Gateway/deploy';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Gateway extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Gateway';
    return (
      <div className={cs('gateway', 'tool', {['tool--selected']: isSelected})} onClick={() => DeployGateway()}>
      	<IconSVG className="tool__svg" svg={entityIcons.Gateway} />
      	<span className="tool__tooltip">Gateway</span>
      </div>
    );
  }
}

export default Tool(Gateway);
