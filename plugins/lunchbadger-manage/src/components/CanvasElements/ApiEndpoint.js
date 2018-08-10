import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import _ from 'lodash';
import {inject, observer} from 'mobx-react';
import ApiEndpointPath from './Subelements/ApiEndpointPath';
import {
  EntityProperties,
  EntitySubElements,
  blockedEscapingKeys,
} from '../../../../lunchbadger-ui/src';
import './ApiEndpoint.scss';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Port = LunchBadgerCore.components.Port;
const {storeUtils} = LunchBadgerCore.utils;

@inject('connectionsStore') @observer
class ApiEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {...this.stateFromStores(props)};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  stateFromStores = props => ({
    paths: props.entity.paths.slice(),
  });

  onPropsUpdate = (props = this.props, callback) =>
    this.setState({...this.stateFromStores(props)}, () => callback && callback());

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  changeState = obj => this.setState(obj);

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  handlePathTab = idx => {
    if (blockedEscapingKeys[0]) return;
    const size = this.state.paths.length;
    if (size - 1 === idx) {
      this.addPath();
    }
  };

  handlePathChange = (idx, value) => {
    const paths = _.cloneDeep(this.state.paths);
    paths[idx] = value;
    this.changeState({paths});
  };

  addPath = () => {
    const paths = _.cloneDeep(this.state.paths);
    paths.push('');
    this.changeState({paths});
    setTimeout(() => {
      const idx = paths.length - 1;
      const input = document.getElementById(`paths[${idx}]`);
      input && input.focus();
    });
  }

  removePath = idx => {
    const paths = _.cloneDeep(this.state.paths);
    paths.splice(idx, 1);
    this.changeState({paths});
  };

  getGatewayRootUrl = () => {
    const {entity, connectionsStore} = this.props;
    const {id} = entity;
    const conn = connectionsStore.find({toId: id});
    if (!conn) return '';
    return storeUtils
      .findGatewayByPipelineId(this.context.store.getState(), conn.fromId)
      .rootUrl;
  };

  renderPorts = () => {
    const {entity} = this.props;
    return entity.ports.map((port, idx) => (
      <Port
        key={idx}
        way={port.portType}
        elementId={port.id}
        className={`port-${entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
        gaType={entity.gaType}
      />
    ));
  };

  renderPaths = () => {
    const {paths} = this.state;
    const {nested, index} = this.props;
    return (
      <EntitySubElements
        title="PATHS"
        onAdd={this.addPath}
        main
      >
        {paths.map((path, idx) => {
          const name = nested ? `apiEndpoints[${index}][paths][${idx}]` : `paths[${idx}]`;
          return (
            <ApiEndpointPath
              key={idx}
              idx={idx}
              name={name}
              path={path}
              onRemovePath={this.removePath}
              onPathTab={this.handlePathTab}
              onPathChange={this.handlePathChange}
            />
          );
        })}
      </EntitySubElements>
    );
  };

  renderMainProperties = () => {
    const {entity, validations, validationsForced, entityDevelopment, onResetField, nested, index} = this.props;
    const {data} = validationsForced || validations;
    const hiddenInputs = [
      {
        name: nested ? `apiEndpoints[${index}][host]` : 'host',
        value: entity.host,
      },
      {
        name: nested ? `apiEndpoints[${index}][methods]` : 'methods',
        value: entity.methods,
      },
      {
        name: nested ? `apiEndpoints[${index}][scopes]` : 'scopes',
        value: entity.scopes,
      },
    ];
    const rootUrl = this.getGatewayRootUrl();
    const accessUrl = {
      name: 'accessUrl',
      title: 'Root URL',
      value: <i>&nbsp;</i>,
      fake: true,
      hiddenInputs,
    };
    if (rootUrl) {
      Object.assign(accessUrl, {
        value: rootUrl,
        link: true,
      });
    }
    const mainProperties = [accessUrl];
    mainProperties[0].isDelta = this.state.host !== entityDevelopment.host;
    mainProperties[0].onResetField = () => onResetField('host');
    return <EntityProperties properties={mainProperties} />;
  };

  render() {
    const {nested} = this.props;
    return (
      <div className={cs('ApiEndpoint', {nested})}>
        {!nested && this.renderPorts()}
        {this.renderMainProperties()}
        {this.renderPaths()}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.entities.gateways,
  gateways => ({gateways}),
);

export default connect(selector, null, null, {withRef: true})(CanvasElement(ApiEndpoint));
