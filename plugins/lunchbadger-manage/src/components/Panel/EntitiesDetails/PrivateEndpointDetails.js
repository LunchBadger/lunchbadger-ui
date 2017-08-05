import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const Input = LunchBadgerCore.components.Input;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class PrivateEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  update = async (model) => {
    const {entity} = this.props;
    const {store: {dispatch, getState}} = this.context;
    const plugins = getState().plugins;
    const onUpdate = plugins.onUpdate.PrivateEndpoint;
    const updatedEntity = await dispatch(onUpdate(_.merge({}, entity, model)));
    const {coreActions} = LunchBadgerCore.utils;
    dispatch(coreActions.setCurrentElement(updatedEntity));
  }

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
