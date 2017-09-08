import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
} from '../../../../../lunchbadger-ui/src';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

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
    const {
      url,
      host,
      port,
      database,
      username,
      password,
      operations,
      isWithPort,
      isRest,
      isSoap,
      isEthereum,
      isSalesforce,
    } = this.props.entity;
    const fields = [];
    if (isRest) {
      fields.push({
        title: 'Base Url',
        name: 'operations[0].template.url',
        value: operations[0].template.url,
      });
    }
    if (isSoap || isEthereum) {
      fields.push({
        title: `${isSoap ? 'Base ' : ''}Url`,
        name: 'Url',
        value: url,
      });
    }
    if (isWithPort) {
      fields.push({
        title: 'Host',
        name: 'host',
        value: host,
      });
      fields.push({
        title: 'Port',
        name: 'port',
        value: port,
      });
      fields.push({
        title: 'Database',
        name: 'database',
        value: database,
      });
    }
    if (isWithPort || isSalesforce) {
      fields.push({
        title: 'Username',
        name: 'username',
        value: username,
      });
      fields.push({
        title: 'Password',
        name: 'password',
        value: password,
      });
    }
    return (
      <div className="panel__details">
        {fields.map(item => <EntityProperty key={item.name} {...item} placeholder=" " />)}
      </div>
    );
  }

  render() {
    const {connector} = this.props.entity;
    if (connector === 'memory') return null;
    return (
      <CollapsibleProperties
        bar={<EntityPropertyLabel>Properties</EntityPropertyLabel>}
        collapsible={this.renderFields()}
        barToggable
        defaultOpened
      />
    );
  }
}

export default BaseDetails(DataSourceDetails);
