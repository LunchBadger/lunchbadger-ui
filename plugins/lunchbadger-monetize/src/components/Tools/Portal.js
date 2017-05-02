import React, {Component} from 'react';
import DeployPortal from '../../actions/CanvasElements/Portal/deploy';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Portal extends Component {
  render() {
    return (
      <div className="portal tool" onClick={() => DeployPortal('Portal')}>
        <IconSVG className="tool__svg" svg={entityIcons.Portal} />
        <span className="tool__tooltip">Portal</span>
      </div>
    );
  }
}

export default Tool(Portal);
