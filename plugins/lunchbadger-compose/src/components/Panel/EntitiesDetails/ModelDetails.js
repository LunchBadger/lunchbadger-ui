import React, {Component, PropTypes} from 'react';
import updateModel from '../../../actions/CanvasElements/Model/update';
import ModelPropertyDetails from './ModelPropertyDetails';
import ModelRelationDetails from './ModelRelationDetails';
import BackendStore from '../../../stores/Backend';
import _ from 'lodash';

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

class ModelDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor(props) {
    super(props);

    const stateFromStores = (newProps) => {
      return {
        properties: newProps.entity.privateModelProperties ? newProps.entity.privateModelProperties.slice() : newProps.entity.properties.slice(),
        relations: newProps.entity.privateModelRelations ? newProps.entity.privateModelRelations.slice() : newProps.entity.relations.slice(),
        changed: false
      };
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
    let data = {
      properties: [],
      relations: []
    };

    model.properties && model.properties.forEach((property) => {
      if (property.name.trim().length > 0) {
        let prop = ModelProperty.create(property);
        prop.attach(this.props.entity);
        data.properties.push(prop);
      }
    });

    model.relations && model.relations.forEach((relation) => {
      let rel = ModelRelation.create(relation);
      rel.attach(this.props.entity);
      data.relations.push(rel);
    });

    const currDsConn = this._getBackendConnection();
    const currDsId = currDsConn ? currDsConn.fromId : null;
    const dsId = model.dataSource === 'none' ? null : model.dataSource;

    if (dsId !== currDsId) {
      if (!dsId) {
        LunchBadgerCore.utils.paper.detach(currDsConn.info.connection);
      } else if (currDsConn) {
        LunchBadgerCore.utils.paper.setSource(currDsConn.info.connection,
          document.getElementById(`port_out_${dsId}`).querySelector('.port__anchor'));
      }
    }

    let updateData = Object.assign({}, model, data);
    delete updateData.dataSource;
    updateModel(this.context.projectService, this.props.entity.id, updateData);
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

    setTimeout(() => this._focusLastDetailsRowInput());
  }

  _focusLastDetailsRowInput() {
    const input = Array.from(this.refs.properties.querySelectorAll('input.details-key')).slice(-1)[0];

    input && input.focus();
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
    const dataSources = BackendStore.getData().map((ds, index) => {
      return <option key={`${ds.id}-${index}`} value={ds.id}>{ds.name}</option>
    });

    return (
      <div>
        <CollapsableDetails title="Details">
          <div className="details-panel__container details-panel__columns">
            <InputField label="Context path" propertyName="contextPath" entity={entity}/>
            <InputField label="Plural" propertyName="plural" entity={entity}/>
            <SelectField label="Base model" propertyName="base" entity={entity}>
              <option value="Model">Model</option>
              <option value="PersistedModel">PersistedModel</option>
            </SelectField>
            <div className="details-panel__fieldset">
              <label className="details-panel__label"
                     htmlFor="dataSource">Data source</label>
              <Select className="details-panel__input"
                      name="dataSource"
                      value={this._getCurrentBackend()}>
                <option value="none">[None]</option>
                {dataSources}
              </Select>
            </div>
            <CheckboxField label="Read only" propertyName="readOnly" entity={entity}/>
            <CheckboxField label="Strict schema" propertyName="strict" entity={entity}/>
            <CheckboxField label="Exposed as REST" propertyName="public" entity={entity}/>
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
        <CollapsableDetails title="Properties">
          <table className="details-panel__table" ref="properties">
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

