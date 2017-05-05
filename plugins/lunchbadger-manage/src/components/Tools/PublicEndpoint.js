import React, {Component} from 'react';
import AddPublicEndpoint from '../../actions/CanvasElements/PublicEndpoint/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="publicendpoint tool__context__item" onClick={() => AddPublicEndpoint('PublicEndpoint')}>
      	<IconSVG className="tool__context__svg" svg={entityIcons.PublicEndpoint} />
      	<span className="tool__name">Public</span>
        <span className="tool__context__tooltip">Endpoint</span>
      </div>
    );
  }
}

export default Tool(PrivateEndpoint);
