import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Policy from './Policy';
// import classNames from 'classnames';
import './Pipeline.scss';
import {findDOMNode} from 'react-dom';
import {addAndConnect as addPublicEndpointAndConnect} from '../../../reduxActions/publicEndpoints';
import {EntityProperty, EntityPropertyLabel, CollapsibleProperties} from '../../../../../lunchbadger-ui/src';
import _ from 'lodash';

const Port = LunchBadgerCore.components.Port;

// FIXME - handle toggleSubelement

class Pipeline extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    index: PropTypes.number.isRequired,
    expanded: PropTypes.bool,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      proxiedBy: []
    };
    // this.initializeProxyConnections = () => {
    //   const inConnections = Connection.getConnectionsForTarget(this.props.entity.id);
    //   const {proxiedBy} = this.state;
    //   inConnections.forEach(connection => {
    //     if (this.state.proxiedBy.indexOf(connection.fromId) < 0) {
    //       proxiedBy.push(connection.fromId);
    //     }
    //   });
    //   this.setState({proxiedBy: proxiedBy});
    // };
    // this.newConnectionListener = () => {
    //   const connection = Connection.getLastConnection();
    //   if (connection && connection.toId === this.props.entity.id
    //     && this.state.proxiedBy.indexOf(connection.fromId) < 0) {
    //     const {proxiedBy} = this.state;
    //     if (connection.info.connection.getParameter('existing')) {
    //       return;
    //     }
    //     this._handleReverseProxyConnection(connection);
    //     proxiedBy.push(connection.fromId);
    //     this.setState({proxiedBy: proxiedBy});
    //   }
    // };
    // this.removeNewConnectionListener = () => {
    //   Connection.removeChangeListener(this.newConnectionListener);
    //   this.removeNewConnectionListener = null;
    // };
    // this.appStateReady = () => {
    //   this.initializeProxyConnections();
    // }
  }

  // componentDidMount() {
  //   // Connection.addChangeListener(this.newConnectionListener);
  // }
  //
  // componentWillMount() {
  //   // AppState.addInitListener(this.appStateReady);
  // }

  componentWillReceiveProps(nextProps) {
    const {connections} = nextProps;
    const {id} = this.props.entity;
    const {proxiedBy} = this.state;
    const newProxiedBy = [];
    const {store: {dispatch}} = this.context;
    connections
      .filter(({fromId, toId}) => toId === id && !proxiedBy.includes(fromId))
      .forEach((conn) => {
        newProxiedBy.push(conn.fromId);
        if (conn.info.connection.getParameter('existing')) return;
        dispatch(addPublicEndpointAndConnect(
          conn.fromId,
          // connectionEntity.name + 'PublicEndpoint',
          // connectionEntity.contextPath,
          id,
          findDOMNode(this.refs['port-out']),
        ));
      });
    if (newProxiedBy.length > 0) {
      this.setState({proxiedBy: [...proxiedBy, ...newProxiedBy]});
    }
  }

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
    return this.props.entity.policies.map((policy, index) => {
      return (
        <Policy
          key={policy.id}
          index={index}
          pipelineIndex={this.props.index}
          policy={policy}
        />
      );
    });
  }

  renderPorts() {
    let pipelinesOffsetTop = 102;
    let stopLoop = false;
    Object.keys(this.props.pipelinesOpened).forEach((key) => {
      if (key === this.props.entity.id) {
        stopLoop = true;
      }
      if (stopLoop) return;
      if (this.props.pipelinesOpened[key]) {
        pipelinesOffsetTop += 171;
      }
    });
    return this.props.entity.ports.map((port, idx) => {
      const key = `port-${port.portType}-${port.id}`;
      return (
        <Port
          key={idx}
          ref={`port-${port.portType}`}
          way={port.portType}
          elementId={port.id}
          middle={true}
          scope={port.portGroup}
          offsetTop={pipelinesOffsetTop + this.props.index * 48}
        />
      );
    });
  }

  toggleOpenState = () => {
    this.setState({opened: !this.state.opened});
    this.props.onToggleOpen(!this.state.opened);
  }

  toggleCollapsibleProperties = () => {
    this.collapsiblePropertiesDOM.handleToggleCollapse();
  }

  render() {
    // const {currentlySelectedSubelements} = this.props;
    // const pipelineClass = classNames({
    //   pipeline: true,
    //   'pipeline--opened': this.state.opened
    // });
    // const pipelineInfoClass = classNames({
    //   pipeline__info: true,
    //   // 'pipeline__info--selected': _.find(currentlySelectedSubelements, {id: this.props.entity.id})
    // });
    const {index, onRemove} = this.props;
    return (
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
            {this.renderPorts()}
          </div>
        }
        onToggleCollapse={this.toggleOpenState}
      />
    );
  }
}

const selector = createSelector(
  state => state.connections,
  connections => ({connections}),
);

export default connect(selector)(Pipeline);
