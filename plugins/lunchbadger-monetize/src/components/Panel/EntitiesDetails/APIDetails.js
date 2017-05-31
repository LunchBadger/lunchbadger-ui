import React, {Component} from 'react';
import PropTypes from 'prop-types';
import updateAPI from '../../../actions/CanvasElements/API/update';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

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

