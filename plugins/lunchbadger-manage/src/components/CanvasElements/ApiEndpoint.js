import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import _ from 'lodash';
import ApiEndpointPath from './Subelements/ApiEndpointPath';
import {
  EntityProperties,
  EntityProperty,
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

  // onPathChange = event => this.setState({path: event.target.value});

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
    // const {entity: {url}, validations: {data}, entityDevelopment, onResetField} = this.props;
    // const mainProperties = [
    //   {
    //     name: 'url',
    //     title: 'URL',
    //     value: url,
    //     invalid: data.url,
    //     onBlur: this.handleFieldChange('url'),
    //   },
    // ];
    // mainProperties.forEach((item, idx) => {
    //   mainProperties[idx].isDelta = item.value !== entityDevelopment[item.name];
    //   mainProperties[idx].onResetField = onResetField;
    // });
    // return <EntityProperties properties={mainProperties} />;
  }

  renderMainProperties = () => {
    const {entity, validations, validationsForced, entityDevelopment, onResetField, nested, index} = this.props;
    const name = nested ? `apiEndpoints[${index}][host]` : 'host';
    const {data} = validationsForced || validations;
    const mainProperties = [
      {
        name,
        title: 'host',
        value: entity.host,
        invalid: data.host,
        onBlur: this.handleFieldChange('host'),
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
