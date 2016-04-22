import React, {Component, PropTypes} from 'react';
import BaseDetails from 'components/Panel/EntitiesDetails/BaseDetails'

class PublicEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
  }


  render() {
    return (
      <h2>{this.props.entity.name}</h2>
    )
  }
}

export default BaseDetails(PublicEndpointDetails);

