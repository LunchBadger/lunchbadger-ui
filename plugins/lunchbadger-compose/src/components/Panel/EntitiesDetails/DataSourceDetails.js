import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Input = LunchBadgerCore.components.Input;
const BaseDetails = LunchBadgerCore.components.BaseDetails;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  render() {
    const {entity} = this.props;
    const {connector} = entity;
    if (connector === 'memory') return null;
    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          <div className="details-panel__fieldset">
            <span className="details-panel__label">URL</span>
            <Input className="details-panel__input"
                   value={entity.url}
                   name="url"/>
          </div>
          <div className="details-panel__fieldset">
            <span className="details-panel__label">Database</span>
            <Input className="details-panel__input"
                   value={entity.database}
                   name="database"/>
          </div>
          <div className="details-panel__fieldset">
            <span className="details-panel__label">Username</span>
            <Input className="details-panel__input"
                   value={entity.username}
                   name="username"/>
          </div>
          <div className="details-panel__fieldset">
            <span className="details-panel__label">Password</span>
            <Input className="details-panel__input"
                   value={entity.password}
                   type="password"
                   name="password"/>
          </div>
        </div>
      </CollapsableDetails>
    )
  }
}

export default BaseDetails(DataSourceDetails);
