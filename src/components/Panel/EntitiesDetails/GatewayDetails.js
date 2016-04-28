import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import redeployGateway from 'actions/CanvasElements/Gateway/redeploy';

class GatewayDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    redeployGateway(this.props.entity.id, model);
  }

  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(GatewayDetails);

