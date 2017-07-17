import React, {Component} from 'react';
import PropTypes from 'prop-types';
import updateModel from '../../../actions/CanvasElements/Model/update';
import ModelRelationDetails from './ModelRelationDetails';
import ModelUserFieldsDetails from './ModelUserFieldsDetails';
import ModelNestedProperties from './ModelNestedProperties';
import BackendStore from '../../../stores/Backend';
import _ from 'lodash';
import addPropertiesToData from '../../addPropertiesToData';
import addNestedProperties from '../../addNestedProperties';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const InputField = LunchBadgerCore.components.InputField;
const Select = LunchBadgerCore.components.Select;
const SelectField = LunchBadgerCore.components.SelectField;
const CheckboxField = LunchBadgerCore.components.CheckboxField;
const ModelProperty = LunchBadgerManage.models.ModelProperty;
const ModelRelation = LunchBadgerManage.models.ModelRelation;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;
const PrivateStore = LunchBadgerManage.stores.Private;
const ConnectionStore = LunchBadgerCore.stores.Connection;

const baseModelTypes = [
  {label: 'Model', value: 'Model'},
  {label: 'PersistedModel', value: 'PersistedModel'},
];

class ModelDetails extends Component {
  constructor(props) {
    super(props);
    const stateFromStores = (newProps) => {
      const data = {
        properties: newProps.entity.privateModelProperties ? newProps.entity.privateModelProperties.slice() : [],
        relations: newProps.entity.privateModelRelations ? newProps.entity.privateModelRelations.slice() : newProps.entity.relations.slice(),
        userFields: newProps.entity.userFields ? newProps.entity.extendedUserFields.slice() : [],
        changed: false
      };
      if (!newProps.entity.privateModelProperties) {
         addNestedProperties(props.entity, data.properties, newProps.entity.properties.slice(), '');
      }
      return data;
    };
    this.state = Object.assign({}, stateFromStores(props));
    this.onStoreUpdate = (props = this.props) => {
      this.setState(stateFromStores(props));
    }
  }

  _getBackendConnection() {
    const entity = this.props.entity;
    const connections = ConnectionStore.getConnectionsForTarget(entity.id);
    return connections.length ? connections[0] : null;
  }

  _getCurrentBackend() {
    const connection = this._getBackendConnection();
    if (connection) {
      return BackendStore.findEntity(connection.fromId).id;
    } else {
      return 'none';
    }
  }

  componentDidMount() {
    PrivateStore.addChangeListener(this.onStoreUpdate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity.id !== this.props.entity.id) {
      this.onStoreUpdate(nextProps);
    }
  }

  componentWillUnmount() {
    PrivateStore.removeChangeListener(this.onStoreUpdate);
  }

  discardChanges() {
    // revert properties
    this.onStoreUpdate();
  }

  update(model) {
    const data = {
      properties: [],
      relations: [],
    };
    addPropertiesToData(model, this.props.entity, data.properties, this.state.properties);
    model.relations && model.relations.forEach((relation) => {
      let rel = ModelRelation.create(relation);
      rel.attach(this.props.entity);
      data.relations.push(rel);
    });
    model.userFields && model.userFields.forEach(field => {
      const value = field.value;
      let output = value;
      if (field.type === 'object') {
        output = JSON.parse(value);
      } else if (field.type === 'number') {
        output = Number(value);
      }
      data[field.name] = output;
    });
    const currDsConn = this._getBackendConnection();
    const currDsId = currDsConn ? currDsConn.fromId : null;
    const dsId = model.dataSource === 'none' ? null : model.dataSource;
    if (dsId !== currDsId) {
      if (!dsId) {
        LunchBadgerCore.utils.paper.detach(currDsConn.info.connection);
      } else if (currDsConn) {
        LunchBadgerCore.utils.paper.setSource(
          currDsConn.info.connection,
          document.getElementById(`port_out_${dsId}`).querySelector('.port__anchor'),
        );
      }
    }
    const updateData = Object.assign({}, model, data);
    if (!updateData.userFields) {
      updateData.userFields = [];
    }
    const propsToRemove = _.difference(
      Object.keys(this.props.entity.userFields),
      updateData.userFields.map(field => field.name)
    );
    delete updateData.dataSource;
    delete updateData.userFields;
    updateModel(this.context.projectService, this.props.entity.id, updateData, propsToRemove);
  }

  onAddItem(collection, item) {
    const items = this.state[collection];
    items.push(item);
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
      if (item.id) {
        return i.id === item.id;
      }
      return i.name === item.name;
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

  _focusLastDetailsRowInput() {
    // FIXME
    // const input = Array.from(this.refs.properties.querySelectorAll('input.details-key')).slice(-1)[0];
    //
    // input && input.focus();
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
    setTimeout(() => this._focusLastDetailsRowInput());
  }

  onRemoveProperty = (property) => {
    this.onRemoveItem('properties', property);
  }

  onAddRelation() {
    this.onAddItem('relations', ModelRelation.create({}));
  }

  onRemoveRelation = (relation) => {
    this.onRemoveItem('relations', relation);
  }

  onAddUserField() {
    this.onAddItem('userFields', {name: '', type: '', value: ''});
  }

  onRemoveUserField(field) {
    this.onRemoveItem('userFields', field);
  }

  onPropertyTypeChange = (id, type) => {
    const properties = [...this.state.properties];
    properties.find(prop => prop.id === id).type = type;
    this.setState({properties});
  }

  renderRelations() {
    return this.state.relations.map((relation, index) => {
      return (
        <ModelRelationDetails
          index={index}
          key={`relation-${relation.id}`}
          onRemove={this.onRemoveRelation}
          relation={relation}
        />
      );
    });
  }

  renderUserFields() {
    return this.state.userFields.map((field, index) => {
      return (
        <ModelUserFieldsDetails
          index={index}
          addAction={() => this.onAddUserField()}
          fieldsCount={this.state.userFields.length}
          key={`user-field-${index}`}
          onRemove={(userField) => this.onRemoveUserField(userField)}
          field={field}
        />
      );
    });
  }

  render() {
    const {entity} = this.props;
    const dataSources = BackendStore.getData().map((item, idx) => ({label: item.name, value: item.id}));
    return (
      <div>
        <CollapsableDetails title="Details">
          <div className="details-panel__container details-panel__columns">
            <InputField label="Context path" propertyName="contextPath" entity={entity}/>
            <InputField label="Plural" propertyName="plural" entity={entity}/>
            <SelectField
              label="Base model"
              propertyName="base"
              entity={entity}
              options={baseModelTypes}
            />
            <div className="details-panel__fieldset">
              <label
                className="details-panel__label"
                htmlFor="dataSource"
              >
                Data source
              </label>
              <Select
                className="details-panel__input"
                name="dataSource"
                value={this._getCurrentBackend()}
                options={[{label: '[None]', value: 'none'}, ...dataSources]}
              />
            </div>
            <CheckboxField label="Read only" propertyName="readOnly" entity={entity} />
            <CheckboxField label="Strict schema" propertyName="strict" entity={entity} />
            <CheckboxField label="Exposed as REST" propertyName="public" entity={entity} />
          </div>
        </CollapsableDetails>
        <CollapsableDetails title="Relations">
          <table className="details-panel__table">
            <thead>
            <tr>
              <th>Name</th>
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
        <ModelNestedProperties
          title="Properties"
          path=""
          properties={this.state.properties}
          onAddProperty={this.onAddProperty}
          onRemoveProperty={this.onRemoveProperty}
          onPropertyTypeChange={this.onPropertyTypeChange}
        />
        <div className="panel__title panel__title--custom">Custom Fields</div>
        <CollapsableDetails title="User Defined Fields">
          <table className="details-panel__table" ref="user-fields">
            <thead>
            <tr>
              <th>Name</th>
              <th>Data type</th>
              <th>
                Value
                <a onClick={() => this.onAddUserField()} className="details-panel__add">
                  <i className="fa fa-plus"/>
                  Add field
                </a>
              </th>
              <th className="details-panel__table__cell details-panel__table__cell--empty"/>
            </tr>
            </thead>
            <tbody>
              {this.renderUserFields()}
            </tbody>
          </table>
        </CollapsableDetails>
      </div>
    )
  }
}

ModelDetails.propTypes = {
  entity: PropTypes.object.isRequired,
};

ModelDetails.contextTypes = {
  projectService: PropTypes.object,
};

export default BaseDetails(ModelDetails);
