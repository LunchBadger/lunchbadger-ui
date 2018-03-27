import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Rest from '../../CanvasElements/Subelements/Rest';
import Soap from '../../CanvasElements/Subelements/Soap';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
} from '../../../../../lunchbadger-ui/src';
import './DataSourceDetails.scss';
import './Rest.scss';
import './Soap.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      changed: false,
    };
  }

  handleStateChange = () => this.setState({changed: true}, () => this.props.parent.checkPristine());

  processModel = model => this.props.entity.processModel(model);

  discardChanges = callback => {
    if (this.compRef) {
      this.compRef.onPropsUpdate(() => this.setState({changed: false}, callback));
    } else {
      callback();
    }
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
      privateKeyPath,
      password,
      isWithPort,
      isSoap,
      isEthereum,
      isSalesforce,
      isMongoDB,
      isRedis,
      isTritonObjectStorage,
    } = this.props.entity;
    const fields = [];
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
      fields.push({
        title: 'Private Key Path',
        name: 'privateKeyPath',
        value: privateKeyPath
      });
    }
    return (
      <div>
        {fields.map(item => <EntityProperty key={item.name} {...item} placeholder=" " />)}
      </div>
    );
  };

  renderMainProperties = () => {
    return (
      <CollapsibleProperties
        bar={<EntityPropertyLabel>Properties</EntityPropertyLabel>}
        collapsible={this.renderFields()}
        barToggable
        defaultOpened
      />
    );
  };

  renderContent = () => {
    const {entity} = this.props;
    const {isRest, isSoap} = this.props.entity;
    if (isRest) return <Rest ref={r => this.compRef = r} entity={entity} onStateChange={this.handleStateChange} />;
    if (isSoap) return <Soap ref={r => this.compRef = r} entity={entity} onStateChange={this.handleStateChange} />;
    return this.renderMainProperties();
  }

  render() {
    const {isMemory, connector} = this.props.entity;
    if (isMemory) return null;
    return (
      <div className={cs('panel__details', connector)}>
        {this.renderContent()}
      </div>
    );
  }
}

export default BaseDetails(DataSourceDetails);
