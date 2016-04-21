import React, {Component, PropTypes} from 'react';
import Port from '../Port';
import Policy from './Policy';
import classNames from 'classnames';
import './Pipeline.scss';
import {findDOMNode} from 'react-dom';
import addPublicEndpoint from '../../../actions/CanvasElements/PublicEndpoint/add';
import Model from 'models/Model';
import PrivateEndpoint from 'models/PrivateEndpoint';
import PublicEndpoint from 'models/PublicEndpoint';
import AppState from 'stores/AppState';
import Connection from 'stores/Connection';
import Private from 'stores/Private';

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

      if (connection && connection.toId === this.props.entity.id) {
        this._handleReverseProxyConnection(connection);
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
    addPublicEndpoint(name, `${this.props.rootPath}/${connectionEntity.contextPath}`);
    setTimeout(() => this._createConnectionWithNewlyCreatedElement());
  }

  _createConnectionWithNewlyCreatedElement() {
    const {proxiedBy} = this.state;

    setTimeout(() => {
      const element = findDOMNode(AppState.getStateKey('recentElement'));

      if (element) {
        const targetPort = element.querySelector(`.port-in.port-${PublicEndpoint.type}`);
        const sourcePort = findDOMNode(this.refs['port-out']);

        if (targetPort && sourcePort) {
          proxiedBy.push(sourcePort.id);

          this.props.paper.connect({
            source: sourcePort,
            target: targetPort
          });

          this.setState({proxiedBy});
        }
      }
    });
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
          <div className="pipeline__icon">
            <i className="fa fa-inbox" onClick={this.toggleOpenState.bind(this)}/>
          </div>
          <div className="pipeline__name">
            {this.props.entity.name}
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
