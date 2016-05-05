import React, {Component, PropTypes} from 'react';
import updateDataSource from 'actions/CanvasElements/DataSource/update';

const Input = LBCore.components.Input;
const BaseDetails = LBCore.components.BaseDetails;

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updateDataSource(this.props.entity.id, model);
  }

  render() {
    const {entity} = this.props;
    
    return (
      <div className="details-panel__container details-panel__columns">
        <div className="details-panel__fieldset">
          <span className="details-panel__label">URL</span>
          <Input className="details-panel__input"
                 value={entity.url}
                 name="url"/>
        </div>
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Schema</span>
          <Input className="details-panel__input"
                 value={entity.schema}
                 name="schema"/>
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
                 name="password"/>
        </div>
      </div>
    )
  }
}

export default BaseDetails(DataSourceDetails);

