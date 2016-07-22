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
const PrivateStore = LunchBadgerManage.stores.Private;

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
    };

    this.onStoreUpdate = () => {
      this.setState({
        properties: this.props.entity.properties.slice(),
        relations: this.props.entity.relations.slice(),
        changed: false
      });
    };
  }

  componentDidMount() {
    PrivateStore.addChangeListener(this.onStoreUpdate);
  }

  componentWillUnmount() {
    PrivateStore.removeChangeListener(this.onStoreUpdate);
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
      if (property.propertyKey.trim().length > 0) {
        data.properties.push(ModelProperty.create(property));
      }
    });

    model.relations && model.relations.forEach((relation) => {
      data.relations.push(ModelRelation.create(relation));
    });

    updateModel(this.props.entity.id, Object.assign(model, data));
  }

  onAddItem(collection, itemType, defaults={}) {
    const items = this.state[collection];

    items.push(itemType.create(defaults));

    this.setState({
      [collection]: items
    });

    this.setState({changed: true}, () => {
      this.props.parent.checkPristine();
    });
  }

  onRemoveItem(collection, item) {
    const items = this.state[collection];

    _.remove(items, function (i) {
      return i.id === item.id;
    });

    this.setState({
      [collection]: items
    });

    if (!_.isEqual(items, this.props.entity[collection])) {
      this.setState({changed: true});
    } else {
      this.setState({changed: false});
    }

    setTimeout(() => {
      this.props.parent.checkPristine();
    });
  }

  onAddProperty() {
    this.onAddItem('properties', ModelProperty, {
      propertyIsRequired: false,
      propertyIsIndex: false
    });
  }

  onRemoveProperty(property) {
    this.onRemoveItem('properties', property);
  }

  onAddRelation() {
    this.onAddItem('relations', ModelRelation);
  }

  onRemoveRelation(relation) {
    this.onRemoveItem('relations', relation);
  }

  renderProperties() {
    return this.state.properties.map((property, index) => {
      return (
        <ModelPropertyDetails index={index}
                              addAction={() => this.onAddProperty()}
                              propertiesCount={this.state.properties.length}
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
                <th className="details-panel__table__cell details-panel__table__cell--empty"/>
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
              <th className="details-panel__table__cell details-panel__table__cell--empty"/>
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

