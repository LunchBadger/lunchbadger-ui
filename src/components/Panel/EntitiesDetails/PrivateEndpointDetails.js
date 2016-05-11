import React, {Component, PropTypes} from 'react';
import updatePrivateEndpoint from 'actions/CanvasElements/PrivateEndpoint/update';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;

class PrivateEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updatePrivateEndpoint(this.props.entity.id, model);
  }

  render() {
    const {entity} = this.props;

    return (
      <div className="details-panel__container details-panel__columns">
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Context path</span>
          <Input className="details-panel__input"
                 value={entity.contextPath}
                 name="contextPath"/>
        </div>
      </div>
    )
  }
}

export default BaseDetails(PrivateEndpointDetails);

