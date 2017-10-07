import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
} from '../../../../../lunchbadger-ui/src';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  renderFields = () => {
    const {
      url,
      host,
      port,
      database,
      username,
      user,
      subuser,
      keyId,
      password,
      operations,
      isWithPort,
      isRest,
      isSoap,
      isEthereum,
      isSalesforce,
      isMongoDB,
      isRedis,
      isTritonObjectStorage,
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
      let title = 'Database';
      if (isMongoDB) {
        title = 'Collection';
      }
      if (isRedis) {
        title = 'Namespace';
      }
      fields.push({
        title,
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
        password: true,
      });
    }
    if (isTritonObjectStorage) {
      fields.push({
        title: 'Url',
        name: 'url',
        value: url,
      });
      fields.push({
        title: 'User',
        name: 'user',
        value: user,
      });
      fields.push({
        title: 'SubUser',
        name: 'subuser',
        value: subuser,
      });
      fields.push({
        title: 'Key Id',
        name: 'keyId',
        value: keyId,
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
