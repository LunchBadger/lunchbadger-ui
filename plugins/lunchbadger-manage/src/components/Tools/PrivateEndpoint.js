import React, {Component} from 'react';
import AddPrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="privateendpoint tool__context__item" onClick={() => AddPrivateEndpoint('PrivateEndpoint')}>
      	<IconSVG className="tool__context__svg" svg={entityIcons.PrivateEndpoint} />
      	<span className="tool__name">Private</span>
        <span className="tool__context__tooltip">Endpoint</span>
      </div>
    );
  }
}

export default Tool(PrivateEndpoint);
