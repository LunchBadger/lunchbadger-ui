import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import ModelNestedProperties from '../CanvasElements/Subelements/ModelNestedProperties';
import updateModel from '../../actions/CanvasElements/Model/update';
import addProperty from '../../actions/CanvasElements/Model/addProperty';
import removeEntity from '../../actions/CanvasElements/Model/remove';
import slug from 'slug';
import addPropertiesToData from '../addPropertiesToData';
import addNestedProperties from '../addNestedProperties';
import './Model.scss';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const ModelProperty = LunchBadgerManage.models.ModelProperty;
const PrivateStore = LunchBadgerManage.stores.Private;
const {defaultEntityNames} = LunchBadgerCore.utils;

class Model extends Component {
  constructor(props) {
    super(props);
    const stateFromStores = (newProps) => {
      const data = {
        properties: newProps.entity.privateModelProperties ? newProps.entity.privateModelProperties.slice() : [],
      };
      if (!newProps.entity.privateModelProperties) {
         addNestedProperties(props.entity, data.properties, newProps.entity.properties.slice(), '');
      }
      return data;
    };
    this.state = {
      ...this.initState(props),
      ...stateFromStores(props),
    };
    this.onStoreUpdate = (props = this.props) => {
      this.setState({...stateFromStores(props)});
    };
  }

  componentDidMount() {
    PrivateStore.addChangeListener(this.onStoreUpdate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity.id !== this.props.entity.id) {
      this.onStoreUpdate(nextProps);
    }
    if (!this.props.editable && nextProps.entity.contextPath !== this.state.contextPath) {
      this.setState(this.initState());
    }
  }

  componentWillUnmount() {
    PrivateStore.removeChangeListener(this.onStoreUpdate);
  }

  initState = (props = this.props) => {
    const {contextPath, name} = props.entity;
    return {
      contextPath,
      contextPathDirty: slug(name, {lower: true}) !== contextPath,
    };
  }

  discardChanges() {
    // revert properties
    this.onStoreUpdate();
    this.setState(this.initState());
  }

  update(model) {
    const data = {
      properties: [],
    };
    addPropertiesToData(model, this.props.entity, data.properties, this.state.properties);
    const validations = this.validate(model);
    if (validations.isValid) {
      updateModel(
        this.context.projectService,
        this.props.entity.id,
        Object.assign(model, data),
      );
    }
    return validations;
  }

  validate = (model) => {
    const validations = {
      isValid: true,
      data: {},
    }
    const messages = {
      empty: 'This field cannot be empty',
    }
    if (model.name === 'Model') validations.data.name = 'Model name cannot be "Model"';
    if ((/\s/g).test(model.name)) validations.data.name = 'Model name cannot have spaces';
    if (model.contextPath === '') validations.data.contextPath = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  getEntityDiffProps = (model) => {
    if (!model) return null;
    const {name, contextPath} = this.props.entity;
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

  updateName(event) {
    if (!this.state.contextPathDirty) {
      this.setState({contextPath: slug(event.target.value, {lower: true})});
    }
  }

  onAddItem = (collection, item) => {
    const items = this.state[collection];
    items.push(item);
    this.setState({
      [collection]: items
    });
  }

  onRemoveItem = (collection, item) => {
    const items = this.state[collection];
    _.remove(items, function (i) {
      if (item.id) {
        return i.id === item.id;
      }
      return i.name === item.name;
    });
    this.setState({
      [collection]: items
    });
  }

  onAddProperty = (parentId) => () => {
    this.onAddItem('properties', ModelProperty.create({
      parentId,
      default_: '',
      type: 'string',
      description: '',
      required: false,
      index: false,
    }));
  }

  onAddRootProperty = () => {
    this.onAddProperty('')();
    setTimeout(() => {
      const input = Array.from(this.refs.properties.querySelectorAll('.EntityProperty__field--input input')).slice(-1)[0];
      input && input.focus();
    });
  }

  onRemoveProperty = (property) => {
    this.onRemoveItem('properties', property);
  }

  onPropertyTypeChange = (id, type) => {
    const properties = [...this.state.properties];
    properties.find(prop => prop.id === id).type = type;
    this.setState({properties});
  }

  updateContextPath = event => this.setState({contextPath: event.target.value, contextPathDirty: true});

  removeEntity() {
    removeEntity(this.context.projectService, this.props.entity);
  }

  renderPorts = () => {
    return this.props.entity.ports.map((port) => (
      <Port
        key={`port-${port.portType}-${port.id}`}
        paper={this.props.paper}
        way={port.portType}
        elementId={this.props.entity.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

  renderProperties = () => {
    return (
      <ModelNestedProperties
        title="Properties"
        path=""
        properties={this.state.properties}
        onAddProperty={this.onAddProperty}
        onRemoveProperty={this.onRemoveProperty}
        onPropertyTypeChange={this.onPropertyTypeChange}
      />
    );
  }

  renderMainProperties = () => {
    const {validations: {data}, entityDevelopment, onResetField} = this.props;
    const {contextPath} = this.state;
    const mainProperties = [
      {
        name: 'contextPath',
        title: 'context path',
        value: contextPath,
        invalid: data.contextPath,
        onChange: this.updateContextPath,
        onBlur: this.handleFieldChange('contextPath')
      }
    ];
    mainProperties[0].isDelta = contextPath !== entityDevelopment.contextPath;
    mainProperties[0].onResetField = onResetField;
    return <EntityProperties properties={mainProperties} />;
  }

  render() {
    return (
      <div>
        {this.renderPorts()}
        {this.renderMainProperties()}
        <EntitySubElements
          title="Properties"
          onAdd={this.onAddRootProperty}
          main
        >
          {this.state.properties.length > 0 && (
            <div ref="properties">
              {this.renderProperties()}
            </div>
          )}
        </EntitySubElements>
      </div>
    );
  }
}

Model.propTypes = {
  entity: PropTypes.object.isRequired,
  paper: PropTypes.object,
};

Model.contextTypes = {
  projectService: PropTypes.object,
};

export default CanvasElement(Model);
