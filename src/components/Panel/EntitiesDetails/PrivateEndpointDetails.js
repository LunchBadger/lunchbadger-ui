import React, {Component, PropTypes} from 'react';
import BaseDetails from 'components/Panel/EntitiesDetails/BaseDetails'
import updatePrivateEndpoint from 'actions/CanvasElements/PrivateEndpoint/update';

class PrivateEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);


  }

  update() {
    updatePrivateEndpoint(this.props.entity.id, {
      name: this.props.name
    });
  }


  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(PrivateEndpointDetails);

