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

export default class Pipeline extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      opened: false,
      proxiedByModel: false,
      proxiedByEndpoint: false
    };

    this.newConnectionListener = (info) => {
      this._handleReverseProxyConnection(info);
    };

    this.removeNewConnectionListener = () => {
      this.props.paper.unbind('connection', this.newConnectionListener);
      this.removeNewConnectionListener = null;
    };
  }

  componentDidMount() {
    this.props.paper.bind('connection', this.newConnectionListener);
  }

  componentDidUpdate() {
    if (this.state.proxiedByEndpoint && this.state.proxiedByModel && this.removeNewConnectionListener) {
      this.removeNewConnectionListener();
    }
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

    if (sourceClassList.contains(`port-${Model.type}`) && !this.state.proxiedByModel) {
      addPublicEndpoint('Public Model Endpoint');
      this.setState({proxiedByModel: true});
    } else if (sourceClassList.contains(`port-${PrivateEndpoint.type}`) && !this.state.proxiedByEndpoint) {
      addPublicEndpoint('Public Endpoint');
      this.setState({proxiedByEndpoint: true});
    }
  }

  _handleActionIfSourceTaken() {
    this.setState({
      proxiedByModel: true,
      proxiedByEndpoint: true
    });

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
