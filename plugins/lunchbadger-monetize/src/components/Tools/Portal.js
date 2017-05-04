import React, {Component} from 'react';
import cs from 'classnames';
import DeployPortal from '../../actions/CanvasElements/Portal/deploy';

const Tool = LunchBadgerCore.components.Tool;

class Portal extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Portal';
    return (
      <div className={cs('portal', 'tool', {['tool--selected']: isSelected})} onClick={() => DeployPortal('Portal')}>
        <i className="tool__icon icon-icon-portal"/>
        <span className="tool__tooltip">Portal</span>
      </div>
    );
  }
}

export default Tool(Portal);
