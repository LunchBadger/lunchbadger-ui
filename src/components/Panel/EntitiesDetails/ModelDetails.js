import React, {Component, PropTypes} from 'react';
import updateModel from 'actions/CanvasElements/Model/update';
import ModelPropertyDetails from './ModelPropertyDetails';
import ModelRelationDetails from './ModelRelationDetails';
import _ from 'lodash';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const InputField = LunchBadgerCore.components.InputField;
const CheckboxField = LunchBadgerCore.components.CheckboxField;
const ModelProperty = LunchBadgerManage.models.ModelProperty;
const ModelRelation = LunchBadgerManage.models.ModelRelation;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class ModelDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      properties: props.entity.properties.slice(),
      relations: props.entity.relations.slice(),
      changed: false
    }
  }

  discardChanges() {
    // revert properties
    this.setState({
      properties: this.props.entity.properties.slice(),
      relations: this.props.entity.relations.slice()
    });
  }

  update(model) {
    let data = {
      properties: [],
      relations: []
    };

    model.properties && model.properties.forEach((property) => {
      data.properties.push(ModelProperty.create(property));
    });

    model.relations && model.relations.forEach((relation) => {
      data.relations.push(ModelRelation.create(relation));
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

  onAddRelation() {
    const {relations} = this.state;

    relations.push(new ModelRelation());

    this.setState({
      relations: relations
    });

    this.setState({changed: true}, () => {
      this.props.parent.checkPristine();
    });
  }

  onRemoveRelation(relation) {
    const {relations} = this.state;

    _.remove(relations, function (rel) {
      return rel.id === relation.id;
    });

    this.setState({
      relations: relations
    });

    if (!_.isEqual(relations, this.props.entity.relations)) {
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

  renderRelations() {
    return this.state.relations.map((relation, index) => {
      return (
        <ModelRelationDetails index={index}
                              key={`relation-${relation.id}`}
                              onRemove={this.onRemoveRelation.bind(this)}
                              relation={relation}/>
      );
    });
  }

  render() {
    const {entity} = this.props;

    return (
      <div>
        <CollapsableDetails title="Details">
          <div className="details-panel__container details-panel__columns">
            <InputField label="Context path" propertyName="contextPath" entity={entity}/>
            <InputField label="Plural" propertyName="plural" entity={entity}/>
            <InputField label="Base model" propertyName="base" entity={entity}/>
            <InputField label="Data source" propertyName="dataSource" entity={entity}/>
            <CheckboxField label="Read only" propertyName="readOnly" entity={entity}/>
            <CheckboxField label="Strict schema" propertyName="strict" entity={entity}/>
            <CheckboxField label="Exposed as REST" propertyName="public" entity={entity}/>
          </div>
        </CollapsableDetails>
        <CollapsableDetails title="Relations">
          <table className="details-panel__table">
            <thead>
              <tr>
              <th>Model</th>
              <th>Type</th>
              <th>
                Foreign Key
                <a onClick={() => this.onAddRelation()} className="details-panel__add">
                  <i className="fa fa-plus"/>
                  Add relation
                </a>
              </th>
              <th></th>
              </tr>
            </thead>
            <tbody>
            {this.renderRelations()}
            </tbody>
          </table>
        </CollapsableDetails>
        <CollapsableDetails title="Properties">
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
        </CollapsableDetails>
      </div>
    )
  }
}

export default BaseDetails(ModelDetails);

