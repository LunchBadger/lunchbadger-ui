import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
} from '../../../../../lunchbadger-ui/src';

// const Input = LunchBadgerCore.components.Input;
const BaseDetails = LunchBadgerCore.components.BaseDetails;
// const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

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
    // const {isWithPort, isRest, isSoap, isEthereum, isSalesforce} = this.props.entity;
    // if (isRest) {
    //   return (
    //     <div className="details-panel__fieldset">
    //       <span className="details-panel__label">BASE URL</span>
    //       <Input
    //         className="details-panel__input"
    //         value={this.props.entity.operations[0].template.url.toString()}
    //         name='operations[0].template.url'
    //       />
    //     </div>
    //   );
    // }
    // if (isSoap || isEthereum) {
    //   return (
    //     <div className="details-panel__fieldset">
    //       <span className="details-panel__label">{`${isSoap ? 'BASE ' : ''}URL`}</span>
    //       <Input
    //         className="details-panel__input"
    //         value={this.props.entity.url.toString()}
    //         name='url'
    //       />
    //     </div>
    //   );
    // }
    // if (isSalesforce) {
    //   return (
    //     <div>
    //       {this.renderField('username')}
    //       {this.renderField('password')}
    //     </div>
    //   );
    // }
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
    // return (
    //   <div>
    //     {isWithPort && this.renderField('host')}
    //     {isWithPort && this.renderField('port')}
    //     {!isWithPort && this.renderField('url')}
    //     {this.renderField('database')}
    //     {this.renderField('username')}
    //     {this.renderField('password')}
    //   </div>
    // );
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
