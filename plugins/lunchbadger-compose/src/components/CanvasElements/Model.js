import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import ModelProperty from '../CanvasElements/Subelements/ModelProperty';
import updateModel from '../../actions/CanvasElements/Model/update';
import addProperty from '../../actions/CanvasElements/Model/addProperty';
import removeEntity from '../../actions/CanvasElements/Model/remove';
import slug from 'slug';
import './Model.scss';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const ModelPropertyFactory = LunchBadgerManage.models.ModelProperty;
const {defaultEntityNames} = LunchBadgerCore.utils;

class Model extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      contextPath: props.entity.contextPath,
      contextPathDirty: false
    };
  }

  update(model) {
    let data = {
      properties: []
    };
    model.properties && model.properties.forEach((property) => {
      if (property.name.trim().length > 0) {
        let prop = ModelPropertyFactory.create(property);
        prop.attach(this.props.entity);
        data.properties.push(prop);
      }
    });
    const validations = this.validate(model);
    if (validations.isValid) {
      updateModel(this.context.projectService, this.props.entity.id,
        Object.assign(model, data));
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

  onAddProperty = () => {
    addProperty(this.props.entity, {
      key: '',
      value: '',
      type: '',
      isRequired: false,
      isIndex: false,
      notes: ''
    });
    setTimeout(() => this._focusLastInput());
  }

  _focusLastInput() {
    const input = Array.from(this.refs.properties.querySelectorAll('input.model-property__input')).slice(-1)[0];
    input && input.focus();
  }

  updateContextPath = () => this.setState({contextPathDirty: true});

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
    return this.props.entity.properties.map((property, index) => (
      <ModelProperty
        index={index}
        key={`property-${property.id}`}
        property={property}
        propertiesForm={() => this.refs.properties}
        propertiesCount={this.props.entity.properties.length}
        addAction={this.onAddProperty}
        entity={this.props.entity}
      />
    ));
  }

  renderMainProperties = () => {
    const {validations: {data}} = this.props;
    const mainProperties = [
      {
        name: 'contextPath',
        title: 'context path',
        value: this.state.contextPath,
        invalid: data.contextPath,
        onChange: this.updateContextPath,
        onBlur: this.handleFieldChange('contextPath')
      }
    ];
    return <EntityProperties properties={mainProperties} />;
  }

  render() {
    return (
      <div>
        {this.renderPorts()}
        {this.renderMainProperties()}
        <EntitySubElements
          title="Properties"
          onAdd={this.onAddProperty}
          main
        >
          {this.props.entity.properties.length > 0 && (
            <div ref="properties">
              {this.renderProperties()}
            </div>
          )}
        </EntitySubElements>
      </div>
    );
  }
}

export default CanvasElement(Model);
