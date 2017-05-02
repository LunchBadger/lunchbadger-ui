import React, {Component} from 'react';
import PrivateEndpoint from './PrivateEndpoint';
import PublicEndpoint from './PublicEndpoint';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Endpoint extends Component {
  render() {
    return (
      <div className="endpoint tool context">
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
