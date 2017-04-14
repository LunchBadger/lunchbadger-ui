import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import ModelProperty from '../CanvasElements/Subelements/ModelProperty';
import updateModel from '../../actions/CanvasElements/Model/update';
import addProperty from '../../actions/CanvasElements/Model/addProperty';
import removeEntity from '../../actions/CanvasElements/Model/remove';
import slug from 'slug';
import './Model.scss';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;
const ModelPropertyFactory = LunchBadgerManage.models.ModelProperty;

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

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
              scope={port.portGroup}/>
      );
    });
  }

  renderProperties() {
    return this.props.entity.properties.map((property, index) => {
      return (
        <ModelProperty index={index} key={`property-${property.id}`}
                       property={property}
                       propertiesForm={() => this.refs.properties}
                       propertiesCount={this.props.entity.properties.length}
                       addAction={() => this.onAddProperty()}
                       entity={this.props.entity}/>
      );
    });
  }

  onAddProperty() {
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

  updateContextPath() {
    this.setState({contextPathDirty: true});
  }

  removeEntity() {
    removeEntity(this.context.projectService, this.props.entity);
  }

  render() {
    const {validations: {data}} = this.props;
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
            <div className={cs('canvas-element__properties__property', {['invalid']: data.contextPath})}>
              <div className="canvas-element__properties__property-title">Context path</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {this.props.entity.contextPath}
                </span>
                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.contextPath}
                       name="contextPath"
                       placeholder="Enter context path here"
                       handleChange={this.updateContextPath.bind(this)}
                       handleBlur={this.handleFieldChange('contextPath')}
                />
              </div>
              {data.contextPath && (
                <div className="canvas-element__validation__error">
                  {data.contextPath}
                </div>
              )}
            </div>
            <div className="canvas-element__properties__property canvas-element__properties__model">
              <div className="canvas-element__properties__property-title">
                Properties
                <i onClick={() => this.onAddProperty()} className="model-property__add fa fa-plus"/>
              </div>
              {
                this.props.entity.properties.length > 0 && (
                  <div ref="properties" className="canvas-element__properties__property-value">
                    {this.renderProperties()}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(Model);
