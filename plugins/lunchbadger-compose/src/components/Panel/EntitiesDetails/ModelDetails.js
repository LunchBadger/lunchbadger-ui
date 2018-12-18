import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import _ from 'lodash';
import uuid from 'uuid';
import addNestedProperties from '../../addNestedProperties';
import ModelProperty from '../../../models/ModelProperty';
import ModelRelation from '../../../models/ModelRelation';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Checkbox,
  Select,
  Table,
  IconButton,
  FilesEditor,
  DocsLink,
  getDefaultValueByType,
  scrollToElement,
} from '../../../../../lunchbadger-ui/src';
import schemas from '../../../utils/modelSchemas';
import ModelDefaultValue from './ModelDefaultValue';
import './ModelDetails.scss';

const {
  components: {BaseDetails},
  stores: {Connections},
  utils: {propertyTypes},
} = LunchBadgerCore;
const {components: {GatewayPolicyAction}} = LunchBadgerManage;

const baseModelTypes = [
  {label: 'Model', value: 'Model'},
  {label: 'PersistedModel', value: 'PersistedModel'},
];

const userFieldsTypeOptions = [
  {label: 'String', value: 'string'},
  {label: 'Number', value: 'number'},
  {label: 'Object', value: 'object'},
];

const userFieldsTypeEmptyValues = {
  string: '',
  number: '0',
  object: {},
};

const subTypes = ['object', 'array'];

const relationTypeOptions = [
  {label: 'hasMany', value: 'hasMany'},
  {label: 'belongsTo', value: 'belongsTo'},
  {label: 'hasAndBelongsToMany', value: 'hasAndBelongsToMany'},
];

const editorCodeLanguage = 'javascript';
const defaultSelect = 'model.js';

@inject('connectionsStore') @observer
class ModelDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const stateFromStores = (newProps) => {
      const data = {
        properties: [],
        relations: newProps.entity.relations.slice(),
        userFields: newProps.entity.userFields ? newProps.entity.extendedUserFields.slice() : [],
        methods: newProps.entity.methods.slice(),
      };
      addNestedProperties(newProps.entity, data.properties, newProps.entity.properties.slice(), '');
      return data;
    };
    this.state = {
      ...this.initState(props),
      ...stateFromStores(props),
    };
    this.onPropsUpdate = (props = this.props, callback) => {
      this.setState({
        ...this.initState(props),
        ...stateFromStores(props),
      }, callback);
    };
  }

  componentWillReceiveProps(nextProps) {
    const {id, properties} = this.props.entity;
    if (nextProps.entity.id !== id || nextProps.entity.properties !== properties) {
      this.onPropsUpdate(nextProps);
    }
  }

  initState = (props = this.props) => {
    const {
      name,
      base,
      http_path,
      plural,
      contextPathFallback,
    } = props.entity;
    return {
      changed: false,
      name,
      base,
      http_path,
      plural,
      contextPath: contextPathFallback({http_path, plural, name}),
    };
  };

  changeState = (obj = {}, cb) => this.setState({...obj, changed: true}, () => {
    this.props.parent.checkPristine();
    cb && cb();
  });

  updateName = event => {
    const name = event.target.value;
    const {pluralized, contextPathFallback} = this.props.entity;
    const {http_path, plural} = this.state;
    const state = {http_path, name};
    const pluralDirty = plural !== pluralized(this.state.name);
    state.plural = pluralDirty ? plural : pluralized(name);
    state.contextPath = contextPathFallback(state);
    this.setState(state);
  };

  processModel = model => {
    delete model.dataSource;
    return this.props.entity.processModel(model, this.state.properties);
  };

  postProcessModel = model => {
    const {entity} = this.props;
    const {paper: paperRef} = this.context;
    const paper = paperRef.getInstance();
    if (entity.base === 'PersistedModel' && model.base === 'Model') {
      [
        ...Connections.search({'fromId': entity.id}),
        ...Connections.search({'toId': entity.id}),
      ].forEach(conn => {
        conn.info.source.classList.add('discardAutoSave');
        paper.detach(conn.info.connection);
      });
    }
    if (model.hasOwnProperty('dataSource')) {
      const dsId = model.dataSource === 'none' ? null : model.dataSource;
      const currDsConn = Connections.find({toId: entity.id});
      const currDsId = currDsConn ? currDsConn.fromId : null;
      if (dsId !== currDsId) {
        if (!dsId) {
          paper.detach(currDsConn.info.connection);
        } else if (currDsId) {
          paper.setSource(
            currDsConn.info.connection,
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
  };

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  handlePropertyToggleCollapse = id => () => {
    const properties = [...this.state.properties];
    const property = properties.find(item => item.id === id);
    property.expanded = !property.expanded;
    this.setState({properties});
  };

  onAddItem = (collection, item) => {
    const newCollection = [...this.state[collection], item];
    if (collection === 'properties' && item.parentId !== '') {
      const property = newCollection.find(prop => prop.id === item.parentId);
      if (property) {
        property.expanded = true;
      }
    }
    this.setState({
      [collection]: newCollection,
      changed: true,
    }, () => this.props.parent.checkPristine());
  };

  onRemoveItem = (collection, item) => {
    const items = [...this.state[collection]];
    _.remove(items, (i) => {
      if (item.id) return i.id === item.id;
      return i.name === item.name;
    });
    this.setState({[collection]: items});
    this.setState({
      changed: !_.isEqual(items, this.props.entity[collection]),
    }, () => this.props.parent.checkPristine());
  };

  onAddProperty = parentId => () => {
    const itemOrder = 1 + Math.max(-1, ...this.state.properties
      .filter(p => p.parentId === parentId)
      .map(p => p.itemOrder));
    const property = ModelProperty.create({
      parentId,
      default_: undefined,
      type: 'string',
      description: '',
      required: false,
      index: false,
      itemOrder,
    });
    this.onAddItem('properties', property);
    setTimeout(() => {
      const input = document.getElementById(`properties[${property.idx}][name]`);
      input && input.focus();
    });
  };

  onRemoveProperty = property => () => this.onRemoveItem('properties', property);

  onAddRelation = () => {
    this.onAddItem('relations', ModelRelation.create({}));
    setTimeout(() => {
      const input = document.getElementById(`relations[${this.state.relations.length - 1}][name]`);
      input && input.focus();
    });
  };

  onRemoveRelation = relation => () => this.onRemoveItem('relations', relation);

  onAddUserField = () => {
    this.onAddItem('userFields', {id: uuid.v4(), name: '', type: 'string', value: ''});
    setTimeout(() => {
      const input = document.getElementById(`userFields[${this.state.userFields.length - 1}][name]`);
      input && input.focus();
    });
  };

  onRemoveUserField = field => () => this.onRemoveItem('userFields', field);

  handleFilesEditorChange = () =>
    this.setState({changed: true}, () => this.props.parent.checkPristine());

  handleChangePropertyType = id => (type) => {
    const properties = [...this.state.properties];
    const prop = properties.find(prop => prop.id === id);
    const newProps = {type};
    if (prop.withDefault) {
      newProps.default_ = getDefaultValueByType(type);
    }
    Object.assign(prop, newProps);
    this.setState({properties, changed: true}, () => this.props.parent.checkPristine());
  };

  handleDefaultChange = id => ({target: {checked}}) => {
    const properties = [...this.state.properties];
    properties.find(prop => prop.id === id).withDefault = checked;
    this.setState({properties, changed: true}, () => this.props.parent.checkPristine());
  };

  handleChangeUserDefinedFieldType = idx => (type) => {
    const userFields = [...this.state.userFields];
    userFields[idx] = {...userFields[idx]};
    userFields[idx].type = type;
    userFields[idx].value = userFieldsTypeEmptyValues[type];
    this.setState({userFields});
  };

  handleTab = (collection, idx) => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const collectionSize = this.state[collection].length;
    const addFunc = {
      userFields: 'onAddUserField',
      relations: 'onAddRelation',
    };
    if (collectionSize - 1 === idx) {
      this[addFunc[collection]]();
    }
  };

  handleTabProperties = property => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const idx = +property.idx.split('/')[1];
    const size = this.state.properties.filter(item => item.parentId === property.parentId).length - 1;
    if (size === idx) {
      this.onAddProperty(property.parentId)();
    }
  };

  handleUpdateField = field => event => {
    const value = event.target ? event.target.value : event;
    const {entity, parent} = this.props;
    const {http_path, plural, name, base} = this.state;
    const state = {http_path, plural, name, base};
    Object.assign(state, {
      [field]: value,
      changed: true,
    });
    state.contextPath = entity.contextPathFallback(state);
    this.setState(state, () => parent.checkPristine());
  }

  renderDetailsSection = () => {
    const {entity, dataSources, connectionsStore} = this.props;
    const {contextPath, http_path, plural, base} = this.state;
    // const dataSourceOptions = Object.keys(dataSources)
    //   .map(key => dataSources[key])
    //   .map(({name: label, id: value}) => ({label, value}));
    // const currentDsId = (connectionsStore.find({toId: entity.id}) || {fromId: 'none'}).fromId;
    const fields = [
      {
        title: 'HTTP Path',
        name: 'http[path]',
        value: http_path,
        onChange: this.handleUpdateField('http_path'),
      },
      {
        title: 'Plural',
        name: 'plural',
        value: plural,
        onChange: this.handleUpdateField('plural'),
      },
      {
        title: 'Base Model',
        name: 'base',
        value: base,
        options: baseModelTypes,
        width: 190,
        onChange: this.handleUpdateField('base'),
      },
    ];
    // if (base === 'PersistedModel') {
    //   fields.push({
    //     title: 'Model Connector',
    //     name: 'dataSource',
    //     value: currentDsId,
    //     options: [{label: '[None]', value: 'none'}, ...dataSourceOptions],
    //   });
    // }
    const checkboxes = [
      {
        name: 'readonly',
        label: 'Read Only',
        value: entity.readonly,
      },
      {
        name: 'strict',
        label: 'Strict Schema',
        value: entity.strict,
      },
      {
        name: 'public',
        label: 'Exposed as REST',
        value: entity.public,
      },
    ];
    return (
      <div>
        <div className="panel__details">
          <EntityProperty
            title="Context Path"
            name="tmp[contextPath]"
            value={contextPath}
            fake
            placeholder=" "
          />
        </div>
        <div className="panel__details">
          <div>
            {fields.map(item => <EntityProperty key={item.name} {...item} placeholder=" " />)}
          </div>
          <div>
            {checkboxes.map(item => (
              <div key={item.name} className="panel__details__checkbox">
                <Checkbox {...item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  handleReorder = parentId => ({oldIndex, newIndex}) => {
    const {entity, parent} = this.props;
    const properties = entity.reorderProperties(this.state.properties, oldIndex, newIndex, parentId);
    if (properties) {
      this.setState({properties, changed: true}, () => parent.checkPristine());
    }
  };

  getProperties = (properties, parentId, level = 0) => {
    let idx = 0;
    this.state.properties.forEach((property) => {
      if (property.parentId === parentId) {
        property.idx = `${parentId}/${idx}`;
        property.level = level;
        idx += 1;
        properties.push(property);
        if (property.expanded) {
          this.getProperties(properties, property.id, level + 1);
        }
      };
    });
  };

  renderPropertyDefaultValue = ({type, default_, idx}) => {
    if (type === 'boolean') return (
      <div className="ModelDetails__default--checkbox">
        <Checkbox
          name={`properties[${idx}][default_]`}
          value={default_ || false}
        />
      </div>
    );
    let defaultValue = default_ || getDefaultValueByType(type);
    if ([...subTypes, 'geopoint'].includes(type)) {
      defaultValue = JSON.stringify(defaultValue);
    }
    let inputType = 'string';
    if (type === 'number') {
      inputType = 'number';
    }
    if (type === 'date') {
      inputType = 'datetime-local';
    }
    return (
      <ModelDefaultValue
        name={`properties[${idx}][default_]`}
        value={defaultValue}
        type={type}
        textarea={subTypes.includes(type)}
        inputType={inputType}
      />
    );
  }

  renderPropertiesSection = (parentId = '') => {
    const isNested = parentId !== '';
    const columns = [
      <div style={{marginLeft: 10}}>Name</div>,
      'Type',
      'Default Value',
      'Description',
      'Required',
      'Is Index',
      <IconButton name="add__property" icon="iconPlus" onClick={this.onAddProperty('')} />,
    ];
    const paddings = [true, true, true, true, true, true, true];
    const centers = [false, false, false, false, true, true, false];
    const properties = [];
    this.getProperties(properties, '');
    const filteredProperties = properties
      .filter(prop => prop.parentId === parentId)
      .sort(this.props.entity.sortByItemOrder);
    const {level} = filteredProperties[0] || {level: 0};
    const nameWidth = 300 - level * 20;
    const widths = [nameWidth, 120, 200, undefined, 100, 100, 70];
    const data = filteredProperties.map((property) => [
      <div>
        <div className={cs('ModelDetails__arrow', {expanded: property.expanded})}>
          {subTypes.includes(property.type) && (
            <IconButton
              onClick={this.handlePropertyToggleCollapse(property.id)}
              icon="iconArrow"
            />
          )}
        </div>
        <div className="TableInput ModelDetails__field">
          <Input
            name={`properties[${property.idx}][id]`}
            value={property.id}
            type="hidden"
          />
          <Input
            name={`properties[${property.idx}][itemOrder]`}
            value={property.itemOrder}
            type="hidden"
          />
          <Input
            name={`properties[${property.idx}][name]`}
            value={property.name}
            underlineStyle={{bottom: 0}}
            fullWidth
            hideUnderline
          />
        </div>
      </div>,
      <Select
        name={`properties[${property.idx}][type]`}
        value={property.type || 'string'}
        options={propertyTypes}
        fullWidth
        hideUnderline
        handleChange={this.handleChangePropertyType(property.id)}
      />,
      property.type === 'buffer'
        ? null
        : <div className="ModelDetails__default">
          <div className="ModelDetails__default--chbx">
            <Checkbox
              name={`properties[${property.idx}][withDefault]`}
              value={property.withDefault}
              handleChange={this.handleDefaultChange(property.id)}
            />
          </div>
          <div className="ModelDetails__default--input">
            {property.withDefault && this.renderPropertyDefaultValue(property)}
          </div>
        </div>,
      <div className="TableInput">
        <Input
          name={`properties[${property.idx}][description]`}
          value={property.description}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
        />
      </div>,
      <Checkbox
        name={`properties[${property.idx}][required]`}
        value={property.required}
      />,
      <Checkbox
        name={`properties[${property.idx}][index]`}
        value={property.index}
        handleKeyDown={this.handleTabProperties(property)}
      />,
      <div style={{marginTop: 15}}>
        <IconButton name={`remove__property${property.idx}`} icon="iconDelete" onClick={this.onRemoveProperty(property)} />
        {subTypes.includes(property.type) && <IconButton icon="iconPlus" onClick={this.onAddProperty(property.id)} />}
      </div>,
    ]);
    if (isNested && data.length === 0) return null;
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
      sortable
      onReorder={this.handleReorder(parentId)}
      noHeader={isNested}
      renderRowAfter={filteredProperties.map(prop => this.renderPropertiesSection(prop.id))}
      verticalAlign="top"
    />;
  };

  renderRelationsSection = () => {
    const {modelOptions} = this.props;
    const columns = [
      'Name',
      'Type',
      'Model',
      'Foreign Key',
      <IconButton name="add__relation" icon="iconPlus" onClick={this.onAddRelation} />,
    ];
    const widths = [300, 220, 300, undefined, 70];
    const paddings = [true, true, true, true, false];
    const data = this.state.relations.map((relation, idx) => [
      <div className="TableInput">
        <Input
          value={relation.id}
          type="hidden"
          name={`relations[${idx}][lunchbadgerId]`}
        />
        <Input
          name={`relations[${idx}][name]`}
          value={relation.name}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
        />
      </div>,
      <Select
        name={`relations[${idx}][type]`}
        value={relation.type || 'hasMany'}
        options={relationTypeOptions}
        fullWidth
        hideUnderline
      />,
      <Select
        name={`relations[${idx}][model]`}
        value={relation.model || modelOptions[0].value}
        options={modelOptions}
        fullWidth
        hideUnderline
      />,
      <div className="TableInput">
        <Input
          name={`relations[${idx}][foreignKey]`}
          value={relation.foreignKey}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
          handleKeyDown={this.handleTab('relations', idx)}
        />
      </div>,
      <IconButton name={`remove__relation${idx}`} icon="iconDelete" onClick={this.onRemoveRelation(relation)} />,
    ]);
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      verticalAlign="top"
    />;
  };

  renderUserDefinedFieldsSection = () => {
    const columns = [
      'Name',
      'Type',
      'Value',
      <IconButton name="add__udf" icon="iconPlus" onClick={this.onAddUserField} />,
    ];
    const widths = [300, 120, undefined, 70];
    const paddings = [true, true, true, false];
    const centers = [false, false, true, false];
    const data = this.state.userFields.map((field, idx) => [
      <div className="TableInput">
        <Input
          name={`userFields[${idx}][name]`}
          value={field.name}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
        />
      </div>,
      <Select
        name={`userFields[${idx}][type]`}
        value={field.type}
        options={userFieldsTypeOptions}
        fullWidth
        hideUnderline
        handleChange={this.handleChangeUserDefinedFieldType(idx)}
      />,
      field.type === 'object'
      ? <Input
          name={`userFields[${idx}][value]`}
          value={JSON.stringify(field.value)}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
          textarea
          handleKeyDown={this.handleTab('userFields', idx)}
        />
      : <div className="TableInput">
          <Input
            name={`userFields[${idx}][value]`}
            value={field.value.toString()}
            underlineStyle={{bottom: 0}}
            fullWidth
            hideUnderline
            type={field.type === 'number' ? 'number' : 'text'}
            handleKeyDown={this.handleTab('userFields', idx)}
          />
        </div>,
      <IconButton name={`remove__udf${idx}`} icon="iconDelete" onClick={this.onRemoveUserField(field)} />,
    ]);
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
      verticalAlign="top"
    />;
  };

  renderModelCodeSection = () => {
    const {entity, workspaceFiles} = this.props;
    if (!workspaceFiles.files) return <div />;
    const modelJs = workspaceFiles.files.server.models[entity.modelJsName];
    const packageJson = workspaceFiles.files['package.json'];
    const files = {
      'model.js': modelJs,
      'package.json': packageJson,
    };
    return (
      <div className="ModelDetails__codeEditor">
        <FilesEditor
          lang={editorCodeLanguage}
          files={files}
          onChange={this.handleFilesEditorChange}
          defaultSelect={defaultSelect}
          entityId={entity.id}
        />
      </div>
    );
  };

  handleAddRemoteMethod = () => {
    const methods = [...this.state.methods];
    methods.push({
      id: uuid.v4(),
      name: '',
      data: {},
    });
    this.setState({methods, changed: true}, () => this.props.parent.checkPristine());
    const inputSelector = `.DetailsPanel .input__methods${methods.length - 1}name input`;
    setTimeout(() => {
      const element = document.querySelector(inputSelector)
      // scrollToElement(element.closest('.CollapsibleProperties'));
      element && setTimeout(() => element.focus(), 0);
    });
  };

  handleRemoveRemoteMethod = method => () => this.onRemoveItem('methods', method);

  remoteMethodAddButton = () => (
    <IconButton
      name="add_remoteMethod"
      icon="iconPlus"
      onClick={this.handleAddRemoteMethod}
    />
  );

  renderRemoteMethod = (method, idx) => {
    const {id, name, data} = method;
    const {entity} = this.props;
    const functionNameInput = (
      <div className="ModelDetails__method">
        <EntityProperty
          name={`methods[${idx}][name]`}
          value={name}
          placeholder="Enter remote method name here..."
          width={400}
        />
        <div className="ModelDetails__method__remove">
          <IconButton
            icon="iconDelete"
            name={`remove__method${idx}`}
            onClick={this.handleRemoveRemoteMethod(method)}
          />
        </div>
      </div>
    );
    return (
      <GatewayPolicyAction
        key={id}
        action={data}
        schemas={schemas.methods}
        prefix={`methods[${idx}][data]`}
        tmpPrefix="LunchBadger"
        onChangeState={this.changeState}
        horizontal
        collapsibleTitle={functionNameInput}
        collapsibleBarToggable={false}
        collapsibleSpace="0"
        entry={entity}
      />
    );
  };

  renderRemoteMethodsSection = () => {
    const {methods} = this.state;
    return (
      <div>
        {methods.map((method, idx) => this.renderRemoteMethod(method, idx))}
        {methods.length === 0 && (
          <div className="ModelDetails__blank">
            No remote methods defined.
          </div>
        )}
      </div>
    );
  };

  render() {
    const sections = [
      {title: 'Details', docs: 'MODEL_DETAILS'},
      {title: 'User-defined fields', render: 'UserDefinedFields', docs: 'MODEL_USER_DEFINED_FIELDS'},
      {title: 'Relations', docs: 'MODEL_RELATIONS'},
      {title: 'Properties', docs: 'MODEL_PROPERTIES'},
      {
        title: 'Remote methods',
        render: 'RemoteMethods',
        docs: 'MODEL_REMOTE_METHODS',
        button: this.remoteMethodAddButton(),
      },
      {title: 'Model.js', render: 'ModelCode', docs: 'MODEL_CODE'},
    ];
    return (
      <div className="panel__details ModelDetails">
        {sections.map(({title, render, docs, button}) => (
          <CollapsibleProperties
            name={render || title}
            id={`${this.props.entity.id}/${docs}`}
            key={title}
            bar={
              <EntityPropertyLabel>
                {title}
                <DocsLink item={docs} />
              </EntityPropertyLabel>
            }
            button={button}
            collapsible={this[`render${render || title}Section`]()}
            barToggable
            defaultOpened
          />
        ))}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.entities.dataSources,
  state => state.entities.models,
  state => state.entities.modelsBundled,
  state => state.entities.workspaceFiles,
  (
    dataSources,
    models,
    modelsBundled,
    workspaceFiles,
  ) => ({
    dataSources,
    modelOptions: Object.keys(models).map(key => models[key].name)
      .concat(Object.keys(modelsBundled).map(key => modelsBundled[key].name))
      .map(label => ({label, value: label})),
    workspaceFiles,
  }),
);

export default connect(selector, null, null, {withRef: true})(BaseDetails(ModelDetails));
