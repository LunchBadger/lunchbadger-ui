import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updatePublicEndpoint from 'actions/CanvasElements/PublicEndpoint/update';

class PublicEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update() {
    updatePublicEndpoint(this.props.entity.id, {
      name: this.props.name
    });
  }


  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(PublicEndpointDetails);

