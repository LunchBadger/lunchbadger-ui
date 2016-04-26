import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updateModel from 'actions/CanvasElements/Model/update';

class ModelDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update() {
    updateModel(this.props.entity.id, {
      name: this.props.name
    });
  }


  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(ModelDetails);

