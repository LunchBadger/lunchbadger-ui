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

  renderFields = () => {
    const {isWithPort, isRest, isSoap} = this.props.entity;
    if (isRest) {
      return (
        <div className="details-panel__fieldset">
          <span className="details-panel__label">BASE URL</span>
          <Input
            className="details-panel__input"
            value={this.props.entity.operations[0].template.url.toString()}
            name='operations[0].template.url'
          />
        </div>
      );
    }
    if (isSoap) {
      return (
        <div className="details-panel__fieldset">
          <span className="details-panel__label">BASE URL</span>
          <Input
            className="details-panel__input"
            value={this.props.entity.url.toString()}
            name='url'
          />
        </div>
      );
    }
    return (
      <div>
        {isWithPort && this.renderField('host')}
        {isWithPort && this.renderField('port')}
        {!isWithPort && this.renderField('url')}
        {this.renderField('database')}
        {this.renderField('username')}
        {this.renderField('password')}
      </div>
    );
  }

  render() {
    const {connector} = this.props.entity;
    if (connector === 'memory') return null;
    return (
      <CollapsableDetails title="Properties">
        <div className="details-panel__container details-panel__columns">
          {this.renderFields()}
        </div>
      </CollapsableDetails>
    )
  }
}

export default BaseDetails(DataSourceDetails);
