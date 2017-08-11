import React, {Component} from 'react';
import PropTypes from 'prop-types';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class PrivateEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  render() {
    const {entity} = this.props;
    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          <div className="details-panel__fieldset">
            <span className="details-panel__label">URL</span>
            <Input
              className="details-panel__input"
              value={entity.url}
              name="url"
            />
          </div>
        </div>
      </CollapsableDetails>
    )
  }
}

export default BaseDetails(PrivateEndpointDetails);
