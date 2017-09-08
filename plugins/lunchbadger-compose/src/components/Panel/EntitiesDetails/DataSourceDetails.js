import React, {Component} from 'react';
import PropTypes from 'prop-types';

const Input = LunchBadgerCore.components.Input;
const BaseDetails = LunchBadgerCore.components.BaseDetails;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  renderField = name => (
    <div className="details-panel__fieldset">
      <span className="details-panel__label">{name.toUpperCase()}</span>
      <Input
        className="details-panel__input"
        value={this.props.entity[name].toString()}
        name={name}
      />
    </div>
  );

  render() {
    const {entity} = this.props;
    const {connector, isWithPort} = entity;
    if (connector === 'memory') return null;
    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          {isWithPort && this.renderField('host')}
          {isWithPort && this.renderField('port')}
          {!isWithPort && this.renderField('url')}
          {this.renderField('database')}
          {this.renderField('username')}
          {this.renderField('password')}
        </div>
      </CollapsableDetails>
    )
  }
}

export default BaseDetails(DataSourceDetails);
