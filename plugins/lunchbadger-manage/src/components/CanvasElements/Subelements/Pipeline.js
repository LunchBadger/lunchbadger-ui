import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
// import {findDOMNode} from 'react-dom';
import Policy from './Policy';
import {addAndConnect as addPublicEndpointAndConnect} from '../../../reduxActions/publicEndpoints';
import {EntityProperty, EntityPropertyLabel, CollapsibleProperties} from '../../../../../lunchbadger-ui/src';
import './Pipeline.scss';

const Port = LunchBadgerCore.components.Port;

// FIXME - handle toggleSubelement

export default class Pipeline extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     opened: false,
  //     proxiedBy: []
  //   };
  //   // this.initializeProxyConnections = () => {
  //   //   const inConnections = Connection.getConnectionsForTarget(this.props.entity.id);
  //   //   const {proxiedBy} = this.state;
  //   //   inConnections.forEach(connection => {
  //   //     if (this.state.proxiedBy.indexOf(connection.fromId) < 0) {
  //   //       proxiedBy.push(connection.fromId);
  //   //     }
  //   //   });
  //   //   this.setState({proxiedBy: proxiedBy});
  //   // };
  //   // this.newConnectionListener = () => {
  //   //   const connection = Connection.getLastConnection();
  //   //   if (connection && connection.toId === this.props.entity.id
  //   //     && this.state.proxiedBy.indexOf(connection.fromId) < 0) {
  //   //     const {proxiedBy} = this.state;
  //   //     if (connection.info.connection.getParameter('existing')) {
  //   //       return;
  //   //     }
  //   //     this._handleReverseProxyConnection(connection);
  //   //     proxiedBy.push(connection.fromId);
  //   //     this.setState({proxiedBy: proxiedBy});
  //   //   }
  //   // };
  //   // this.removeNewConnectionListener = () => {
  //   //   Connection.removeChangeListener(this.newConnectionListener);
  //   //   this.removeNewConnectionListener = null;
  //   // };
  //   // this.appStateReady = () => {
  //   //   this.initializeProxyConnections();
  //   // }
  // }

  // componentDidMount() {
  //   // Connection.addChangeListener(this.newConnectionListener);
  // }
  //
  // componentWillMount() {
  //   // AppState.addInitListener(this.appStateReady);
  // }

  // componentWillReact() {
  //   const {connectionsStore} = this.props;
  //   const {id} = this.props.entity;
  //   const {proxiedBy} = this.state;
  //   const connection = connectionsStore.getLastConnection();
  //   console.log(22, connection);
  //   if (connection && connection.toId === id && !proxiedBy.includes(connection.fromId)) {
  //     if (connection.info.connection.getParameter('existing')) return;
  //     this.context.store.dispatch(addPublicEndpointAndConnect(
  //       connection.fromId,
  //       id,
  //       findDOMNode(this.refs['port-out']),
  //     ));
  //     this.setState({proxiedBy: [...proxiedBy, connection.fromId]});
  //   };
  // }

  // componentWillUnmount() {
  //   // if (typeof this.removeNewConnectionListener === 'function') {
  //   //   this.removeNewConnectionListener();
  //   // }
  // }

  // _handleReverseProxyConnection = (fromId) => {
  //   // const connectionEntity = Private.findEntity(connection.fromId);
  //   // if (!connectionEntity) {
  //   //   return;
  //   // }
  // }

  renderPolicies() {
    return this.props.entity.policies.map((policy, idx) => {
      return (
        <Policy
          key={policy.id}
          index={idx}
          pipelineIndex={this.props.index}
          policy={policy}
        />
      );
    });
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port
          key={`port-${port.portType}-${port.id}`}
          way={port.portType}
          elementId={port.id}
          middle={true}
          scope={port.portGroup}
        />
      );
    });
  }

  toggleCollapsibleProperties = () => {
    this.collapsiblePropertiesDOM.handleToggleCollapse();
  }

  render() {
    const {index, onRemove} = this.props;
    return (
      <div className="Pipeline">
        {this.renderPorts()}
        <CollapsibleProperties
          ref={(r) => {this.collapsiblePropertiesDOM = r;}}
          bar={
            <EntityProperty
              name={`pipelines[${index}][name]`}
              value={this.props.entity.name}
              hiddenInputs={[{name: `pipelines[${index}][id]`, value: this.props.entity.id}]}
              onDelete={onRemove}
              onViewModeClick={this.toggleCollapsibleProperties}
            />
          }
          collapsible={
            <div>
              <EntityPropertyLabel className="Pipeline__policies">Policies</EntityPropertyLabel>
              {this.renderPolicies()}
            </div>
          }
        />
      </div>
    );
  }
}
