import React, {Component, PropTypes} from 'react';
import BaseDetails from './BaseDetails.js'
import updateModel from 'actions/CanvasElements/Model/update';
import ModelPropertyDetails from './ModelPropertyDetails';
import ModelProperty from 'models/ModelProperty';
import _ from 'lodash';
import Input from 'components/Generics/Form/Input';

class ModelDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      properties: props.entity.properties.slice(),
      changed: false
    }
  }

  discardChanges() {
    // revert properties
    this.setState({properties: this.props.entity.properties.slice()});
  }

  update(model) {
    let data = {
      properties: []
    };

    model.properties && model.properties.forEach((property) => {
      data.properties.push(ModelProperty.create(property));
    });

    updateModel(this.props.entity.id, _.merge(model, data));
  }

  onAddProperty() {
    const {properties} = this.state;

    properties.push(
      ModelProperty.create({
        propertyIsRequired: false,
        propertyIsIndex: false
      })
    );

    this.setState({
      properties: properties
    });

    this.setState({changed: true}, () => {
      this.props.parent.checkPristine();
    });
  }

  onRemoveProperty(property) {
    const {properties} = this.state;

    _.remove(properties, function (prop) {
      return prop.id === property.id;
    });

    this.setState({
      properties: properties
    });

    if (!_.isEqual(properties, this.props.entity.properties)) {
      this.setState({changed: true});
    } else {
      this.setState({changed: false});
    }

    setTimeout(() => {
      this.props.parent.checkPristine();
    });
  }

  renderProperties() {
    return this.state.properties.map((property, index) => {
      return (
        <ModelPropertyDetails index={index}
                              key={`property-${property.id}`}
                              onRemove={this.onRemoveProperty.bind(this)}
                              property={property}/>
      );
    });
  }

  render() {
    const {entity} = this.props;

    return (
      <div className="details-panel__container details-panel__columns">
        <div className="details-panel__fieldset">
          <span className="details-panel__label">Context path</span>
          <Input className="details-panel__input"
                 value={entity.contextPath}
                 name="contextPath"/>
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
              <a onClick={() => this.onAddProperty()} className="details-panel__add">
                <i className="fa fa-plus"/>
                Add property
              </a>
            </th>
            <th></th>
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

