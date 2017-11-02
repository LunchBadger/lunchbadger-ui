import React, {Component} from 'react';
import PropTypes from 'prop-types';
import slug from 'slug';
import cs from 'classnames';
import _ from 'lodash';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import runtimeOptions from '../../utils/runtimeOptions';
import FunctionTriggers from './Subelements/FunctionTriggers';
import './Function.scss';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;

class Function extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.onPropsUpdate = (props = this.props, callback) => this.setState(this.initState(props), callback);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.props.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  initState = (props = this.props) => {
    const {contextPath, name} = props.entity;
    return {
      contextPath,
      contextPathDirty: slug(name, {lower: true}) !== contextPath,
    };
  }

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  getEntityDiffProps = (model) => {
    if (!model) return null;
    const {name, contextPath} = this.props.entity.data;
    if (name === model.name && contextPath === model.contextPath) return null;
    return {
      ...model,
      name,
      contextPath,
    };
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  updateName = event => {
    if (!this.state.contextPathDirty) {
      this.setState({contextPath: slug(event.target.value, {lower: true})});
    }
  }

  updateContextPath = event => this.setState({contextPath: event.target.value, contextPathDirty: true});

  renderPorts = () => {
    return this.props.entity.ports.map((port) => (
      <Port
        key={`port-${port.portType}-${port.id}`}
        way={port.portType}
        elementId={port.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

  renderMainProperties = () => {
    const {validations, validationsForced, entity, entityDevelopment, onResetField, nested, index} = this.props;
    const {contextPath} = this.state;
    const {data} = validationsForced || validations;
    const mainProperties = [
      {
        name: 'http[path]',
        modelName: 'contextPath',
        title: 'context path',
        value: contextPath,
        invalid: data.contextPath,
        onChange: this.updateContextPath,
        onBlur: this.handleFieldChange('contextPath'),
      },
      {
        name: 'runtime',
        title: 'Runtime',
        value: entity.runtime,
        options: runtimeOptions.map(label => ({label, value: label})),
      },
    ];
    mainProperties[0].isDelta = entity.contextPath !== entityDevelopment.contextPath;
    mainProperties[0].onResetField = onResetField;
    return <EntityProperties properties={mainProperties} />;
  }

  render() {
    const {multiEnvIndex, nested, entity: {id}} = this.props;
    return (
      <div className={cs('Function', {nested, 'multi': multiEnvIndex > 0})}>
        {!nested && this.renderPorts()}
        {this.renderMainProperties()}
        <EntitySubElements
          title="Triggers"
          onAdd={this.onAddRootProperty}
          main
        >
          <FunctionTriggers id={id} />
        </EntitySubElements>
      </div>
    );
  }
}

export default CanvasElement(Function);
