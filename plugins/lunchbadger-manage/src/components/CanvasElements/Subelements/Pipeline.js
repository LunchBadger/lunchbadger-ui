import React, {Component, PropTypes} from 'react';
import Policy from './Policy';
import classNames from 'classnames';
import './Pipeline.scss';
import {findDOMNode} from 'react-dom';
import addPublicEndpointAndConnect from 'actions/CanvasElements/PublicEndpoint/addAndConnect';
import PrivateEndpoint from 'models/PrivateEndpoint';
import Model from 'models/Model';
import Private from 'stores/Private';
import _ from 'lodash';

const toggleSubelement = LunchBadgerCore.actions.toggleSubelement;
const Connection = LunchBadgerCore.stores.Connection;
const Port = LunchBadgerCore.components.Port;
const AppState = LunchBadgerCore.stores.AppState;
const Input = LunchBadgerCore.components.Input;

export default class Pipeline extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    rootPath: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      proxiedBy: []
    };

    this.initializeProxyConnections = () => {
      const inConnections = Connection.getConnectionsForTarget(this.props.entity.id);
      const {proxiedBy} = this.state;

      inConnections.forEach(connection => {
        if (this.state.proxiedBy.indexOf(connection.fromId) < 0) {
          proxiedBy.push(connection.fromId);
        }
      });

      this.setState({proxiedBy: proxiedBy});
    };

    this.newConnectionListener = () => {
      const connection = Connection.getLastConnection();

      if (connection && connection.toId === this.props.entity.id
        && this.state.proxiedBy.indexOf(connection.fromId) < 0) {
        const {proxiedBy} = this.state;

        if (connection.info.connection.getParameter('existing')) {
          return;
        }

        this._handleReverseProxyConnection(connection);

        proxiedBy.push(connection.fromId);
        this.setState({proxiedBy: proxiedBy});
      }
    };

    this.removeNewConnectionListener = () => {
      Connection.removeChangeListener(this.newConnectionListener);
      this.removeNewConnectionListener = null;
    };

    this.appStateReady = () => {
      this.initializeProxyConnections();
    }
  }

  componentDidMount() {
    Connection.addChangeListener(this.newConnectionListener);
  }

  componentWillMount() {
    AppState.addInitListener(this.appStateReady);
  }

  componentWillUnmount() {
    if (typeof this.removeNewConnectionListener === 'function') {
      this.removeNewConnectionListener();
    }
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
    return this.props.entity.policies.map((policy, index) => {
      return <Policy key={policy.id} index={index} pipelineIndex={this.props.index} policy={policy}/>;
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
    const selectedElements = this.props.appState.getStateKey('currentlySelectedSubelements');

    const pipelineClass = classNames({
      pipeline: true,
      'pipeline--opened': this.state.opened
    });
    const pipelineInfoClass = classNames({
      pipeline__info: true,
      'pipeline__info--selected': _.find(selectedElements, {id: this.props.entity.id})
    });
    const {index} = this.props;

    return (
      <div className={pipelineClass}>
        <div className={pipelineInfoClass}>
          <span className="pipeline__action" onClick={this.toggleOpenState.bind(this)}>
            <span className="pipeline__toggle"/>
            <span className="pipeline__icon">
              <i className="fa fa-inbox"/>
            </span>
          </span>

          <div className="pipeline__name" onClick={() => toggleSubelement(this.props.parent, this.props.entity)}>
            <span className="hide-while-edit">{this.props.entity.name}</span>

            <Input value={this.props.entity.id}
                   type="hidden"
                   name={`pipelines[${index}][id]`}/>
            <span onClick={event => event.stopPropagation()}>
              <Input className="canvas-element__input canvas-element__input--property editable-only"
                     value={this.props.entity.name}
                     name={`pipelines[${index}][name]`}/>
            </span>
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
