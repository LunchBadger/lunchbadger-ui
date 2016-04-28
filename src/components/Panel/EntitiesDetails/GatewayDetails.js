import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updateGateway from 'actions/CanvasElements/Gateway/update';

class GatewayDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updateGateway(this.props.entity.id, model);
  }

  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(GatewayDetails);

