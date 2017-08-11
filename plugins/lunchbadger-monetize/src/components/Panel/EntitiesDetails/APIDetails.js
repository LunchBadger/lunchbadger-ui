import React, {Component} from 'react';
import PropTypes from 'prop-types';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class APIDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  render() {
    return <div />;
  }
}

export default BaseDetails(APIDetails);
