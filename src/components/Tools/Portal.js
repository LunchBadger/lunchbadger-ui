import React, {Component} from 'react';
import DeployPortal from 'actions/CanvasElements/Portal/deploy';

const Tool = LunchBadgerCore.components.Tool;

class Portal extends Component {
  render() {
    return (
      <div className="portal tool" onClick={() => DeployPortal('Portal')}>
        <i className="tool__icon icon-icon-portal"/>
        <span className="tool__tooltip">Portal</span>
      </div>
    );
  }
}

export default Tool(Portal);
