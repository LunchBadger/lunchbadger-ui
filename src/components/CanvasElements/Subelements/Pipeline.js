import React, {Component, PropTypes} from 'react';
import Port from '../Port';
import Policy from './Policy';
import portGroups from 'constants/portGroups';
import classNames from 'classnames';
import './Pipeline.scss';
import {findDOMNode} from 'react-dom';
import addPublicEndpoint from 'actions/PublicEndpoint/add';
import Model from 'models/Model';
import PrivateEndpoint from 'models/PrivateEndpoint';
import PublicEndpoint from 'models/PublicEndpoint';
import AppState from 'stores/AppState';

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

    this.newConnectionListener = (info) => {
      this._handleReverseProxyConnection(info);
    };

    this.removeNewConnectionListener = () => {
      this.props.paper.unbind('connection', this.newConnectionListener);
      this.removeNewConnectionListener = null;
    };

    this.appStateUpdate = () => {
    }
  }

  componentDidMount() {
    this.props.paper.bind('connection', this.newConnectionListener);
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

  _handleReverseProxyConnection(info) {
    const {connection} = info;

    if (connection.scope === portGroups.GATEWAYS || connection.scope === portGroups.PUBLIC) {
      this._checkConnectionTargetAndSource(connection.target, connection.source);
    }
  }

  _checkConnectionTargetAndSource(target, source) {
    const {ports} = this.props.entity;

    ports.forEach((port) => {
      const portDOMNode = findDOMNode(this.refs[`port-${port.portType}`]);

      if (portDOMNode === target) {
        this._handleActionIfTargetTaken(source);
      } else if (portDOMNode === source) {
        this._handleActionIfSourceTaken();
      }
    });
  }

  _handleActionIfTargetTaken(source) {
    const sourceClassList = source.classList;

    if (sourceClassList.contains(`port-${Model.type}`) && this.state.proxiedBy.indexOf(source.id) < 0) {
      this._handleActionIfTargetIsModel();
    } else if (sourceClassList.contains(`port-${PrivateEndpoint.type}`) && this.state.proxiedBy.indexOf(source.id) < 0) {
      this._handleActionIfTargetIsPrivateEndpoint();
    }
  }

  _handleActionIfTargetIsModel() {
    addPublicEndpoint('Public Model Endpoint', `${this.props.rootPath}/`);
    this._createConnectionWithNewlyCreatedElement();
  }

  _handleActionIfTargetIsPrivateEndpoint() {
    addPublicEndpoint('Public Endpoint', `${this.props.rootPath}/`);
    this._createConnectionWithNewlyCreatedElement();
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

  _handleActionIfSourceTaken() {
    this.removeNewConnectionListener();
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
