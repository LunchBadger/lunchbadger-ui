import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import ApiEndpointPath from './Subelements/ApiEndpointPath';
import {
  EntityProperties,
  EntitySubElements,
} from '../../../../lunchbadger-ui/src';
import './ApiEndpoint.scss';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Port = LunchBadgerCore.components.Port;

class ApiEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
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

  processModel = model => {
    const {entity} = this.props;
    return entity.processModel(model);
  };

  changeState = obj => this.setState(obj);

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  handlePathTab = idx => {
    const size = this.state.paths.length;
    if (size - 1 === idx) {
      this.addPath();
    }
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
  }

  renderPorts() {
    return this.props.entity.ports.map((port, idx) => (
      <Port
        key={idx}
        way={port.portType}
        elementId={port.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

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
            />
          );
        })}
      </EntitySubElements>
    );
  }

  renderMainProperties = () => {
    const {entity, validations, validationsForced, entityDevelopment, onResetField, nested, index} = this.props;
    const name = nested ? `apiEndpoints[${index}][host]` : 'host';
    const {data} = validationsForced || validations;
    const hiddenInputs = [
      {
        name: nested ? `apiEndpoints[${index}][methods]` : 'methods',
        value: entity.methods,
      },
      {
        name: nested ? `apiEndpoints[${index}][scopes]` : 'scopes',
        value: entity.scopes,
      },
    ];
    const mainProperties = [
      {
        name,
        title: 'URL',
        value: entity.host,
        invalid: data.host,
        onBlur: this.handleFieldChange('host'),
        hiddenInputs,
      },
    ];
    mainProperties[0].isDelta = this.state.host !== entityDevelopment.host;
    mainProperties[0].onResetField = () => onResetField('host');
    return <EntityProperties properties={mainProperties} />;
  }

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

export default CanvasElement(ApiEndpoint);
