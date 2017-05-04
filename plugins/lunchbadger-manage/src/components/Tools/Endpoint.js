import React, {Component} from 'react';
import cs from 'classnames';
import PrivateEndpoint from './PrivateEndpoint';
import PublicEndpoint from './PublicEndpoint';

const Tool = LunchBadgerCore.components.Tool;

class Endpoint extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name.endsWith('Endpoint');
    return (
      <div className={cs('endpoint', 'tool', 'context', {['tool--selected']: isSelected})}>
        <i className="tool__extend icon-arrowhead"/>
        <i className="tool__icon icon-icon-endpoint"/>
        <ul className="tool__context">
          <li>
            <PrivateEndpoint />
          </li>
          <li>
            <PublicEndpoint />
          </li>
        </ul>
      </div>
    );
  }
}

export default Tool(Endpoint);
