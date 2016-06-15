import React, {Component, PropTypes} from 'react';
import Policy from './Policy';
import classNames from 'classnames';
import './Pipeline.scss';
import {findDOMNode} from 'react-dom';
import addPublicEndpointAndConnect from 'actions/CanvasElements/PublicEndpoint/addAndConnect';
import PrivateEndpoint from 'models/PrivateEndpoint';
import Model from 'models/Model';
import Private from 'stores/Private';

const Connection = LunchBadgerCore.stores.Connection;
const Port = LunchBadgerCore.components.Port;
const AppState = LunchBadgerCore.stores.AppState;

export default class Pipeline extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    rootPath: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      proxiedBy: []
    };

    this.newConnectionListener = () => {
      const connection = Connection.getLastConnection();

      if (connection && connection.toId === this.props.entity.id
        && this.state.proxiedBy.indexOf(connection.fromId) < 0) {
        const {proxiedBy} = this.state;

        this._handleReverseProxyConnection(connection);

        proxiedBy.push(connection.fromId);
        this.setState({proxiedBy: proxiedBy});
      }
    };

    this.removeNewConnectionListener = () => {
      Connection.removeChangeListener(this.newConnectionListener);
      this.removeNewConnectionListener = null;
    };

    this.appStateUpdate = () => {
    }
  }

  componentDidMount() {
    Connection.addChangeListener(this.newConnectionListener);
  }

  componentWillMount() {
    AppState.addChangeListener(this.appStateUpdate);
  }

  componentWillUnmount() {
    if (typeof this.removeNewConnectionListener === 'function') {
      this.removeNewConnectionListener();
    }

    AppState.removeChangeListener(this.appStateUpdate);
  }

  _handleReverseProxyConnection(connection) {
    const connectionEntity = Private.findEntity(connection.fromId);

    if (!connectionEntity) {
      return;
    }

    if (connectionEntity.constructor.type === Model.type) {
      this._handleElementCreation(connectionEntity, 'Public Model Endpoint');
    } else if (connectionEntity.constructor.type === PrivateEndpoint.type) {
      this._handleElementCreation(connectionEntity, 'Public Endpoint');
    }
  }

  /**
   * @param connectionEntity {Model|PrivateEndpoint}
   * @param name {String}
   * @private
   */
  _handleElementCreation(connectionEntity, name) {
      addPublicEndpointAndConnect(
        name,
        `${this.props.rootPath}/${connectionEntity.contextPath}`,
        this.props.entity.id,
        findDOMNode(this.refs['port-out'])
      );
  }

  renderPolicies() {
    return this.props.entity.policies.map((policy) => {
      return <Policy key={policy.id} policy={policy}/>;
    });
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              ref={`port-${port.portType}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              middle={true}
              scope={port.portGroup}/>
      );
    });
  }

  toggleOpenState() {
    this.setState({opened: !this.state.opened});
  }

  render() {
    const pipelineClass = classNames({
      pipeline: true,
      'pipeline--opened': this.state.opened
    });

    return (
      <div className={pipelineClass}>
        <div className="pipeline__info">
          <div onClick={this.toggleOpenState.bind(this)}>
            <div className="pipeline__toggle"></div>
            <div className="pipeline__icon">
              <i className="fa fa-inbox"/>
            </div>
            <div className="pipeline__name">
              {this.props.entity.name}
            </div>
          </div>

          {this.renderPorts()}
        </div>

        <div className="pipeline__details">
          <div className="pipeline__details__title">Policies</div>
          {this.renderPolicies()}
        </div>
      </div>
    );
  }
}
