import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updateModel from 'actions/CanvasElements/Model/update';
import ModelPropertyDetails from './ModelPropertyDetails';
import addProperty from 'actions/CanvasElements/Model/addProperty';
import ModelProperty from 'models/ModelProperty';

class ModelDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      properties: _.cloneDeep(this.props.entity.properties),
      contextPath: this.props.entity.contextPath
    }
  }

  componentWillReceiveProps(props) {
    this.setState({
      properties: props.entity.properties,
      contextPath: props.entity.contextPath
    });
  }

  discardChanges() {
    this.setState({
      properties: this.props.entity.properties,
      contextPath: this.props.entity.contextPath
    });
  }

  update() {
    updateModel(this.props.entity.id, {
      name: this.props.name,
      properties: this.state.properties,
      contextPath: this.state.contextPath
    });
  }

  onAddProperty() {
    const properties = this.state.properties;
    properties.push(ModelProperty.create({
      propertyKey: '',
      propertyValue: '',
      propertyType: '',
      propertyIsRequired: false,
      propertyIsIndex: false,
      propertyNotes: ''
    }));
    this.setState({properties: properties});
  }

  updateContextPath(evt) {
    this.setState({
      contextPath: evt.target.value
    });
  }

  renderProperties() {
    return this.state.properties.map((property) => {
      return (
        <ModelPropertyDetails key={`property-${property.id}`}
                       property={property}/>
      );
    });
  }


  render() {
    return (
      <div className="details-panel__container details-panel__columns">
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Context path</span>
          <input className="details-panel__input"
                 value={this.state.contextPath}
                 type="text"
                 onChange={(event) => this.updateContextPath(event)}/>
        </div>
        <table className="details-panel__table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Data type</th>
              <th>Default Value</th>
              <th>Required</th>
              <th>Is index</th>
              <th>
                Notes
                <a  onClick={() => this.onAddProperty()} className="details-panel__add">
                  <i className="fa fa-plus"/>
                  Add property
                </a>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.renderProperties()}
          </tbody>
        </table>
      </div>
    )
  }
}

export default BaseDetails(ModelDetails);

