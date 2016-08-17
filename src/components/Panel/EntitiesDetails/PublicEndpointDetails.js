import React, {Component, PropTypes} from 'react';
import updatePublicEndpoint from 'actions/CanvasElements/PublicEndpoint/update';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class PublicEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updatePublicEndpoint(this.props.entity.id, model);
  }

  render() {
    const {entity} = this.props;

    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          <div className="details-panel__fieldset">
            <span className="details-panel__label">Path</span>
            <Input className="details-panel__input"
                   value={entity.path}
                   name="path"/>
          </div>
        </div>
      </CollapsableDetails>
    )
  }
}

export default BaseDetails(PublicEndpointDetails);

