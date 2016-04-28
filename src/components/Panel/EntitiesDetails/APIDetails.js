import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updateAPI from 'actions/CanvasElements/API/update';

class APIDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updateAPI(this.props.entity.id, model);
  }

  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(APIDetails);

