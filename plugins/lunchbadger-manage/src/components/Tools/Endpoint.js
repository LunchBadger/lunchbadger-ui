import React, {Component} from 'react';
import PrivateEndpoint from './PrivateEndpoint';
import PublicEndpoint from './PublicEndpoint';

const Tool = LunchBadgerCore.components.Tool;

class Endpoint extends Component {
  render() {
    return (
      <div className="endpoint tool context">
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
