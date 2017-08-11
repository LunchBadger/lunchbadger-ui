import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import slug from 'slug';
import _ from 'lodash';
import uuid from 'uuid';
import ModelRelationDetails from './ModelRelationDetails';
import ModelUserFieldsDetails from './ModelUserFieldsDetails';
import ModelNestedProperties from './ModelNestedProperties';
// import BackendStore from '../../../stores/Backend';
// import addPropertiesToData from '../../addPropertiesToData';
import addNestedProperties from '../../addNestedProperties';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const InputField = LunchBadgerCore.components.InputField;
const Select = LunchBadgerCore.components.Select;
const SelectField = LunchBadgerCore.components.SelectField;
const CheckboxField = LunchBadgerCore.components.CheckboxField;
const ModelProperty = LunchBadgerManage.models.ModelProperty;
const ModelRelation = LunchBadgerManage.models.ModelRelation;
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;
// const PrivateStore = LunchBadgerManage.stores.Private;
// const ConnectionStore = LunchBadgerCore.stores.Connection;
const {storeUtils} = LunchBadgerCore.utils;

const baseModelTypes = [
  {label: 'Model', value: 'Model'},
  {label: 'PersistedModel', value: 'PersistedModel'},
];

class ModelDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const stateFromStores = (newProps) => {
      const data = {
        properties: [],
        relations: newProps.entity.relations.slice(),
        userFields: newProps.entity.userFields ? newProps.entity.extendedUserFields.slice() : [],
      };
      addNestedProperties(props.entity, data.properties, newProps.entity.properties.slice(), '');
      return data;
    };
    this.state = {
      ...this.initState(props),
      ...stateFromStores(props),
    };
    this.onStoreUpdate = (props = this.props) => {
      this.setState({
        ...this.initState(props),
        ...stateFromStores(props),
      });
    };
  }

  componentWillReceiveProps(nextProps) {
    const {id, properties} = this.props.entity;
    if (nextProps.entity.id !== id || nextProps.entity.properties !== properties) {
      this.onStoreUpdate(nextProps);
    }
  }

  initState = (props = this.props) => {
    const {contextPath, name} = props.entity;
    return {
      changed: false,
      contextPath,
      contextPathDirty: slug(name, {lower: true}) !== contextPath,
    };
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   diff(this.props, nextProps, this.state, nextState);
  //   return true;
  // }

  processModel = model => {
    const {entity} = this.props;
    if (model.hasOwnProperty('dataSource')) {
      const dsId = model.dataSource === 'none' ? null : model.dataSource;
      const {store: {getState}, paper: paperRef} = this.context;
      const paper = paperRef.getInstance();
      const state = getState();
      const currDsConn = storeUtils.filterConnections(state, {toId: entity.id});
      const currDsId = currDsConn.length > 0 ? currDsConn[0].fromId : null;
      if (dsId !== currDsId) {
        if (!dsId) {
          paper.detach(currDsConn[0].info.connection);
        } else if (currDsId) {
          paper.setSource(
            currDsConn[0].info.connection,
            document.getElementById(`port_out_${dsId}`).querySelector('.port__anchor'),
          );
        } else {
          paper.connect({
            source: document.getElementById(`port_out_${dsId}`).querySelector('.port__anchor'),
            target: document.getElementById(`port_in_${entity.id}`).querySelector('.port__anchor'),
            parameters: {
              forceDropped: true,
            }
          }, {
            fireEvent: true,
          });
        }
      }
      delete model.dataSource;
    }
    return entity.processModel(model, this.state.properties);
  }

  discardChanges() {
    // revert properties
    this.onStoreUpdate();
  }

  // update = async (model) => {
  //   const {entity} = this.props;
  //   const {store: {dispatch}} = this.context;
  //   const updatedEntity = await dispatch(entity.update(model));
  //   dispatch(coreActions.setCurrentElement(updatedEntity));
  //   // const data = {
  //   //   properties: [],
  //   //   relations: [],
  //   // };
  //   // addPropertiesToData(model, this.props.entity, data.properties, this.state.properties);
  //   // model.relations && model.relations.forEach((relation) => {
  //   //   let rel = ModelRelation.create(relation);
  //   //   rel.attach(this.props.entity);
  //   //   data.relations.push(rel);
  //   // });
  //   // model.userFields && model.userFields.forEach(field => {
  //   //   const value = field.value;
  //   //   let output = value;
  //   //   if (field.type === 'object') {
  //   //     output = JSON.parse(value);
  //   //   } else if (field.type === 'number') {
  //   //     output = Number(value);
  //   //   }
  //   //   data[field.name] = output;
  //   // });
  //   // const currDsConn = this._getBackendConnection();
  //   // const currDsId = currDsConn ? currDsConn.fromId : null;
  //   // const dsId = model.dataSource === 'none' ? null : model.dataSource;
  //   // if (dsId !== currDsId) {
  //   //   if (!dsId) {
  //   //     LunchBadgerCore.utils.paper.detach(currDsConn.info.connection);
  //   //   } else if (currDsConn) {
  //   //     LunchBadgerCore.utils.paper.setSource(
  //   //       currDsConn.info.connection,
  //   //       document.getElementById(`port_out_${dsId}`).querySelector('.port__anchor'),
  //   //     );
  //   //   }
  //   // }
  //   // const updateData = Object.assign({}, model, data);
  //   // if (!updateData.userFields) {
  //   //   updateData.userFields = [];
  //   // }
  //   // const propsToRemove = _.difference(
  //   //   Object.keys(this.props.entity.userFields),
  //   //   updateData.userFields.map(field => field.name)
  //   // );
  //   // delete updateData.dataSource;
  //   // delete updateData.userFields;
  //   // updateModel(this.props.entity.id, updateData, propsToRemove);
  // }

  onAddItem = (collection, item) => {
    this.setState({
      [collection]: [...this.state[collection], item],
    });
    this.setState({changed: true}, () => this.props.parent.checkPristine());
  }

  onRemoveItem = (collection, item) => {
    const items = [...this.state[collection]];
    _.remove(items, function (i) {
      if (item.id) {
        return i.id === item.id;
      }
      return i.name === item.name;
    });
    this.setState({
      [collection]: items,
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

  onAddProperty = (parentId) => () => {
    const property = ModelProperty.create({
      parentId,
      default_: '',
      type: 'string',
      description: '',
      required: false,
      index: false,
    });
    this.onAddItem('properties', property);
    setTimeout(() => {
      const input = Array.from(document.querySelectorAll(`.details-panel__input.details-key.property-${property.id} input`)).slice(-1)[0];
      input && input.focus();
    });
  }

  onRemoveProperty = (property) => this.onRemoveItem('properties', property);

  onAddRelation = () => this.onAddItem('relations', ModelRelation.create({}));

  onRemoveRelation = relation => this.onRemoveItem('relations', relation);

  onAddUserField = () => this.onAddItem('userFields', {id: uuid.v4(), name: '', type: '', value: ''});

  onRemoveUserField = field => this.onRemoveItem('userFields', field);

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
          addAction={this.onAddUserField}
          fieldsCount={this.state.userFields.length}
          key={field.id}
          onRemove={this.onRemoveUserField}
          field={field}
        />
      );
    });
  }

  render() {
    const {entity, dataSources, currentDsId} = this.props;
    const dataSourceOptions = Object.keys(dataSources)
      .map(key => dataSources[key])
      .map(({name: label, id: value}) => ({label, value}));
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
                value={currentDsId}
                options={[{label: '[None]', value: 'none'}, ...dataSourceOptions]}
              />
            </div>
            <CheckboxField label="Read only" propertyName="readonly" entity={entity} />
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
                <a onClick={this.onAddRelation} className="details-panel__add">
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
                <a onClick={this.onAddUserField} className="details-panel__add">
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

const selector = createSelector(
  state => state.entities.dataSources,
  (_, props) => props.entity.id,
  state => state.connections,
  (dataSources, id, connections) => ({
    dataSources,
    currentDsId: (connections.find(item => item.toId === id) || {fromId: 'none'}).fromId,
  }),
);

export default connect(selector)(BaseDetails(ModelDetails));
