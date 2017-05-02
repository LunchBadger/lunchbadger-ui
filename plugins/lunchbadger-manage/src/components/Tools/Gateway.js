import React, {Component} from 'react';
import DeployGateway from '../../actions/CanvasElements/Gateway/deploy';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Gateway extends Component {
  render() {
    return (
      <div className="gateway tool" onClick={() => DeployGateway()}>
      	<IconSVG className="tool__svg" svg={entityIcons.Gateway} />
      	<span className="tool__tooltip">Gateway</span>
      </div>
    );
  }
}

export default Tool(Gateway);
