import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Rest from '../../CanvasElements/Subelements/Rest';
import Soap from '../../CanvasElements/Subelements/Soap';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  DocsLink,
} from '../../../../../lunchbadger-ui/src';
import './DataSourceDetails.scss';
import './Rest.scss';
import './Soap.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      changed: false,
    };
  }

  handleStateChange = () => this.setState({changed: true}, () => this.props.parent.checkPristine());

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

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
      authSource,
      allowExtendedOperators,
      enableGeoIndexing,
      lazyConnect,
      disableDefaultSort,
      reconnect,
      reconnectTries,
      reconnectInterval,
      emitError,
      size,
      keepAlive,
      keepAliveInitialDelay,
      noDelay,
      connectionTimeout,
      socketTimeout,
      singleBufferSerializtion,
      ssl,
      rejectUnauthorized,
      promoteLongs,
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
        description: 'Database host name',
      });
      fields.push({
        title: 'Port',
        name: 'port',
        value: port,
        description: 'Database TCP port',
      });
      fields.push({
        title: 'Database',
        name: 'database',
        value: database,
        description: 'Database name',
      });
    }
    if (isWithPort || isSalesforce) {
      fields.push({
        title: 'Username',
        name: 'username',
        value: username,
        description: 'Username to connect to database',
      });
      fields.push({
        title: 'Password',
        name: 'password',
        value: password,
        password: true,
        description: 'Password to connect to database',
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
    if (isMongoDB) {
      fields.push({
        title: 'Auth Source',
        name: 'authSource',
        value: authSource,
        description: (
          <div>
            Authentification database name. The default value is usually <code>admin</code>, like in the official docker image.
          </div>
        ),
      });
      fields.push({
        title: 'Allow Extended Operators',
        name: 'allowExtendedOperators',
        value: allowExtendedOperators,
        bool: true,
        description: (
          <div>
            Enable using MongoDB operators such as <code>$currentDate</code>, <code>$inc</code>, <code>$max</code>, <code>$min</code>, <code>$mul</code>, <code>$rename</code>, <code>$setOnInsert</code>, <code>$set</code>, <code>$unset</code>, <code>$addToSet</code>, <code>$pop</code>, <code>$pullAll</code>, <code>$pull</code>, <code>$pushAll</code>, <code>$push</code>, and <code>$bit</code>.
          </div>
        ),
      });
      fields.push({
        title: 'Enable Geo Indexing',
        name: 'enableGeoIndexing',
        value: enableGeoIndexing,
        bool: true,
        description: (
          <div>
            Enable 2dsphere indexing for model properties of type <code>GeoPoint</code>.
            This allows for indexed <code>near</code> queries.
          </div>
        ),
      });
      fields.push({
        title: 'Lazy Connect',
        name: 'lazyConnect',
        value: lazyConnect,
        bool: true,
        description: 'Enable, so the database instance will not be attached to the datasource and the connection is deferred. It will try to establish the connection automatically once users hit the endpoint. If the mongodb server is offline, the app will start, however, the endpoints will not work.',
      });
      fields.push({
        title: 'Disable Default Sort',
        name: 'disableDefaultSort',
        value: disableDefaultSort,
        bool: true,
        description: (
          <div>
            Disable the default sorting behavior on <code>id</code> column, this will help performance using indexed columns available in mongodb.
          </div>
        ),
      });
      fields.push({
        title: 'Reconnect',
        name: 'reconnect',
        value: reconnect,
        bool: true,
        description: 'Server will attempt to reconnect on loss of connection.',
      });
      fields.push({
        title: 'Reconnect Tries',
        name: 'reconnectTries',
        value: reconnectTries,
        number: true,
        description: <div>Server attempt to reconnect <code>#</code> times.</div>,
      });
      fields.push({
        title: 'Reconnect Interval',
        name: 'reconnectInterval',
        value: reconnectInterval,
        number: true,
        description: <div>Server will wait <code>#</code> milliseconds between retries.</div>,
      });
      fields.push({
        title: 'Emit Error',
        name: 'emitError',
        value: emitError,
        bool: true,
        description: 'Server will emit errors events.',
      });
      fields.push({
        title: 'Size',
        name: 'size',
        value: size,
        number: true,
        description: 'Server connection pool size.',
      });
      fields.push({
        title: 'Keep Alive',
        name: 'keepAlive',
        value: keepAlive,
        bool: true,
        description: 'TCP Connection keep alive enabled.',
      });
      fields.push({
        title: 'Keep Alive Initial Delay',
        name: 'keepAliveInitialDelay',
        value: keepAliveInitialDelay,
        number: true,
        description: 'Initial delay before TCP keep alive enabled.',
      });
      fields.push({
        title: 'No Delay',
        name: 'noDelay',
        value: noDelay,
        bool: true,
        description: 'TCP Connection no delay.',
      });
      fields.push({
        title: 'Connection Timeout',
        name: 'connectionTimeout',
        value: connectionTimeout,
        number: true,
        description: 'TCP Connection timeout setting.',
      });
      fields.push({
        title: 'Socket Timeout',
        name: 'socketTimeout',
        value: socketTimeout,
        number: true,
        description: 'TCP Socket timeout setting.',
      });fields.push({
        title: 'Single Buffer Serializtion',
        name: 'singleBufferSerializtion',
        value: singleBufferSerializtion,
        bool: true,
        description: 'Serialize into single buffer, trade of peak memory for serialization speed.',
      });
      fields.push({
        title: 'SSL',
        name: 'ssl',
        value: ssl,
        bool: true,
        description: 'Use SSL for connection.',
      });
      fields.push({
        title: 'Reject Unauthorized',
        name: 'rejectUnauthorized',
        value: rejectUnauthorized,
        bool: true,
        description: 'Reject unauthorized server certificates.',
      });
      fields.push({
        title: 'Promote Longs',
        name: 'promoteLongs',
        value: promoteLongs,
        bool: true,
        description: 'Convert Long values from the db into Numbers if they fit into 53 bits.',
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
        bar={
          <EntityPropertyLabel>
            Properties
            <DocsLink item={`DATASOURCE_${this.props.entity.connector.toUpperCase()}_PROPERTIES`} />
          </EntityPropertyLabel>
        }
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
