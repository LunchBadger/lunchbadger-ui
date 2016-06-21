import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import ModelProperty from '../CanvasElements/Subelements/ModelProperty';
import updateModel from 'actions/CanvasElements/Model/update';
import addProperty from 'actions/CanvasElements/Model/addProperty';
import slug from 'slug';
import _ from 'lodash';
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

    if (this.validateProperties()) {
      model.properties && model.properties.forEach((property) => {
        data.properties.push(ModelPropertyFactory.create(property));
      });

      updateModel(this.props.entity.id, _.merge(model, data));

      return true;
    }

    return false;
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
                       entity={this.props.entity}/>
      );
    });
  }

  onAddProperty() {
    addProperty(this.props.entity, {
      key: ' ',
      value: ' ',
      type: '',
      isRequired: false,
      isIndex: false,
      notes: ''
    });
  }

  updateContextPath() {
    this.setState({contextPathDirty: true});
  }

  validateProperties() {
    const propertiesForm = findDOMNode(this.refs.properties);

    if (propertiesForm) {
      const formFieldGroups = propertiesForm.querySelectorAll('.model-property');
      const emptyFields = [];

      [].forEach.call(formFieldGroups, (group) => {
        const formFields = group.querySelectorAll('input[type="text"]');

        [].forEach.call(formFields, (formField) => {
          if (formField.value.trim() === '') {
            emptyFields.push(formField);
          }
        });

        if ([].every.call(formFields, (formField) => formField.value.trim() === '')) {
          emptyFields.splice(-2, 2);
          group.remove();
        }
      });

      if (emptyFields.length) {
        emptyFields[0].focus();

        return false;
      }
    }

    return true;
  }

  render() {
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties expanded-only">
          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Context path</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {this.props.entity.contextPath}
                </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.contextPath}
                       name="contextPath"
                       handleChange={this.updateContextPath.bind(this)}/>
              </div>
            </div>
            {
              this.props.entity.properties.length > 0 && (
                <div className="canvas-element__properties__property">
                  <div className="canvas-element__properties__property-title">
                    Properties
                    <i onClick={() => this.onAddProperty()} className="model-property__add fa fa-plus"/>
                  </div>
                  <div ref="properties" className="canvas-element__properties__property-value">
                    {this.renderProperties()}
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(Model);
