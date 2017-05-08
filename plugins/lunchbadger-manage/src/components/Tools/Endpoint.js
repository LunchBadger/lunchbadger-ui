import React, {Component} from 'react';
import cs from 'classnames';
import PrivateEndpoint from './PrivateEndpoint';
import PublicEndpoint from './PublicEndpoint';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Endpoint extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name.endsWith('Endpoint');
    return (
      <div className={cs('endpoint', 'tool', 'context', {['tool--selected']: isSelected})}>
        <i className="tool__extend icon-arrowhead"/>
        <IconSVG className="tool__svg" svg={entityIcons.PrivateEndpoint} />
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
