import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import ModelProperty from '../CanvasElements/Subelements/ModelProperty';
import './CanvasElement.scss';
import updateModel from 'actions/CanvasElements/Model/update';
import addProperty from 'actions/CanvasElements/Model/addProperty';
import slug from 'slug';
import Input from 'components/Generics/Form/Input';

class Model extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      contextPath: props.entity.contextPath,
      contextPathDirty: false,
      properties: this.props.entity.properties
    };
  }

  update(model) {
    updateModel(this.props.entity.id, Object.assign({}, model, {properties: this.state.properties}));
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
    return this.state.properties.map((property) => {
      return (
        <ModelProperty key={`property-${property.id}`}
                       property={property}/>
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

  render() {
    return (
      <div>
        <div>
          <div className="canvas-element__model-endpoint">
            <i className="canvas-element__model-endpoint-icon fa fa-compass"/>
          </div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties expanded-only">
          <div className="canvas-element__properties__title">
            Properties
            <i onClick={() => this.onAddProperty()} className="canvas-element__add fa fa-plus"/>
          </div>

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
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Model properties</div>
              <div className="canvas-element__properties__property-value">
                {this.renderProperties()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(Model);
