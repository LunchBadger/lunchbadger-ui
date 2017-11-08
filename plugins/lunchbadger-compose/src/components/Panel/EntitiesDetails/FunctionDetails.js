import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import slug from 'slug';
import _ from 'lodash';
import uuid from 'uuid';
import brace from 'brace';
import AceEditor from 'react-ace';
import {ResizableBox} from 'react-resizable';
import 'brace/mode/javascript';
import 'brace/mode/java';
import 'brace/mode/python';
import 'brace/mode/csharp';
import 'brace/theme/monokai';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Checkbox,
  Select,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';
import runtimeOptions from '../../../utils/runtimeOptions';
import FunctionTriggers from '../../CanvasElements/Subelements/FunctionTriggers';
import './FunctionDetails.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const {Connections} = LunchBadgerCore.stores;

const baseModelTypes = [
  {label: 'Model', value: 'Model'},
  {label: 'PersistedModel', value: 'PersistedModel'},
];

const editorCodeLanguages = {
  node: 'javascript',
  python: 'python',
  java: 'java',
  'c#': 'csharp',
};

const getEditorCodeLanguage = str => editorCodeLanguages[str.split(' ')[0].toLowerCase()];

const initialEditorCodeWidth = Math.floor(window.innerWidth * 0.75);

// const userFieldsTypeOptions = [
//   {label: 'String', value: 'string'},
//   {label: 'Number', value: 'number'},
//   {label: 'Object', value: 'object'},
// ];
//
// const userFieldsTypeEmptyValues = {
//   string: '',
//   number: '0',
//   object: {},
// };

// const subTypes = ['object', 'array'];
//
// const relationTypeOptions = [
//   {label: 'hasMany', value: 'hasMany'},
//   {label: 'belongsTo', value: 'belongsTo'},
//   {label: 'hasAndBelongsToMany', value: 'hasAndBelongsToMany'},
// ];

class FunctionDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    // const stateFromStores = (newProps) => {
    //   const data = {
    //     properties: [],
    //     relations: newProps.entity.relations.slice(),
    //     userFields: newProps.entity.userFields ? newProps.entity.extendedUserFields.slice() : [],
    //   };
    //   addNestedProperties(newProps.entity, data.properties, newProps.entity.properties.slice(), '');
    //   return data;
    // };
    this.state = {
      ...this.initState(props),
      // ...stateFromStores(props),
    };
    this.onPropsUpdate = (props = this.props, callback) => {
      this.setState({
        ...this.initState(props),
        // ...stateFromStores(props),
      }, callback);
    };
  }

  componentWillReceiveProps(nextProps) {
    const {id} = this.props.entity;
    if (nextProps.entity.id !== id) {
      this.onPropsUpdate(nextProps);
    }
  }

  initState = (props = this.props) => {
    const {contextPath, name, runtime, code} = props.entity;
    return {
      changed: false,
      contextPath,
      contextPathDirty: slug(name, {lower: true}) !== contextPath,
      editorCodeLanguage: getEditorCodeLanguage(runtime),
      code,
      editorCodeWidth: initialEditorCodeWidth,
      editorCodeHeight: 350,
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
      const {paper: paperRef} = this.context;
      const paper = paperRef.getInstance();
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
    model.code = this.state.code;
    return model;
    // return entity.processModel(model, this.state.properties);
  }

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  // handlePropertyToggleCollapse = id => () => {
  //   const properties = [...this.state.properties];
  //   const property = properties.find(item => item.id === id);
  //   property.expanded = !property.expanded;
  //   this.setState({properties});
  // }
  //
  // onAddItem = (collection, item) => {
  //   const newCollection = [...this.state[collection], item];
  //   if (collection === 'properties' && item.parentId !== '') {
  //     const property = newCollection.find(prop => prop.id === item.parentId);
  //     if (property) {
  //       property.expanded = true;
  //     }
  //   }
  //   this.setState({
  //     [collection]: newCollection,
  //     changed: true,
  //   }, () => this.props.parent.checkPristine());
  // }
  //
  // onRemoveItem = (collection, item) => {
  //   const items = [...this.state[collection]];
  //   _.remove(items, (i) => {
  //     if (item.id) return i.id === item.id;
  //     return i.name === item.name;
  //   });
  //   this.setState({[collection]: items});
  //   this.setState({
  //     changed: !_.isEqual(items, this.props.entity[collection]),
  //   }, () => this.props.parent.checkPristine());
  // }

  // onAddProperty = parentId => () => {
  //   const property = ModelProperty.create({
  //     parentId,
  //     default_: '',
  //     type: 'string',
  //     description: '',
  //     required: false,
  //     index: false,
  //   });
  //   this.onAddItem('properties', property);
  //   setTimeout(() => {
  //     const input = document.getElementById(`properties[${property.idx}][name]`);
  //     input && input.focus();
  //   });
  // }
  //
  // onRemoveProperty = property => () => this.onRemoveItem('properties', property);
  //
  // onAddRelation = () => {
  //   this.onAddItem('relations', ModelRelation.create({}));
  //   setTimeout(() => {
  //     const input = document.getElementById(`relations[${this.state.relations.length - 1}][name]`);
  //     input && input.focus();
  //   });
  // }
  //
  // onRemoveRelation = relation => () => this.onRemoveItem('relations', relation);

  // onAddUserField = () => {
  //   this.onAddItem('userFields', {id: uuid.v4(), name: '', type: 'string', value: ''});
  //   setTimeout(() => {
  //     const input = document.getElementById(`userFields[${this.state.userFields.length - 1}][name]`);
  //     input && input.focus();
  //   });
  // }
  //
  // onRemoveUserField = field => () => this.onRemoveItem('userFields', field);
  //
  // handleChangePropertyType = id => (type) => {
  //   const properties = [...this.state.properties];
  //   properties.find(prop => prop.id === id).type = type;
  //   this.setState({properties, changed: true}, () => this.props.parent.checkPristine());
  // }
  //
  // handleChangeUserDefinedFieldType = idx => (type) => {
  //   const userFields = [...this.state.userFields];
  //   userFields[idx] = {...userFields[idx]};
  //   userFields[idx].type = type;
  //   userFields[idx].value = userFieldsTypeEmptyValues[type];
  //   this.setState({userFields});
  // }

  // handleTab = (collection, idx) => (event) => {
  //   if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
  //   const collectionSize = this.state[collection].length;
  //   const addFunc = {
  //     userFields: 'onAddUserField',
  //     relations: 'onAddRelation',
  //   };
  //   if (collectionSize - 1 === idx) {
  //     this[addFunc[collection]]();
  //   }
  // }
  //
  // handleTabProperties = property => (event) => {
  //   if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
  //   const idx = +property.idx.split('/')[1];
  //   const size = this.state.properties.filter(item => item.parentId === property.parentId).length - 1;
  //   if (size === idx) {
  //     this.onAddProperty(property.parentId)();
  //   }
  // }

  handleRuntimeChange = value => this.setState({editorCodeLanguage: getEditorCodeLanguage(value)});

  renderDetailsSection = () => {
    const {entity, dataSources} = this.props;
    // const dataSourceOptions = Object.keys(dataSources)
    //   .map(key => dataSources[key])
    //   .map(({name: label, id: value}) => ({label, value}));
    // const currentDsId = (connectionsStore.find({toId: entity.id}) || {fromId: 'none'}).fromId;
    const fields = [
      {
        title: 'Context Path',
        name: 'http[path]',
        value: entity.contextPath,
      },
      // {
      //   title: 'Plural',
      //   name: 'plural',
      //   value: entity.plural,
      // },
      // {
      //   title: 'Base Model',
      //   name: 'base',
      //   value: entity.base,
      //   options: baseModelTypes,
      // },
      // {
      //   title: 'Data Source',
      //   name: 'dataSource',
      //   value: currentDsId,
      //   options: [{label: '[None]', value: 'none'}, ...dataSourceOptions],
      // },
      {
        title: 'Runtime',
        name: 'runtime',
        value: entity.runtime,
        options: runtimeOptions.map(label => ({label, value: label})),
        onChange: this.handleRuntimeChange,
      },
    ];
    // const checkboxes = [
    //   {
    //     name: 'readonly',
    //     label: 'Read Only',
    //     value: entity.readonly,
    //   },
    //   {
    //     name: 'strict',
    //     label: 'Strict Schema',
    //     value: entity.strict,
    //   },
    //   {
    //     name: 'public',
    //     label: 'Exposed as REST',
    //     value: entity.public,
    //   },
    // ];
    return (
      <div className="panel__details">
        {fields.map(item => <EntityProperty key={item.name} {...item} placeholder=" " />)}
        {/*checkboxes.map(item => (
          <div key={item.name} className="panel__details__checkbox">
            <Checkbox {...item} />
          </div>
        ))*/}
      </div>
    );
  }

  renderTriggersSection() {
    return <FunctionTriggers id={this.props.entity.id} details />
  }

  // getProperties = (properties, parentId, level = 0) => {
  //   let idx = 0;
  //   this.state.properties.forEach((property) => {
  //     if (property.parentId === parentId) {
  //       property.idx = `${parentId}/${idx}`;
  //       property.level = level;
  //       idx += 1;
  //       properties.push(property);
  //       if (property.expanded) {
  //         this.getProperties(properties, property.id, level + 1);
  //       }
  //     };
  //   });
  // };
  //
  // renderPropertiesSection = () => {
  //   const columns = [
  //     <div style={{marginLeft: 10}}>Name</div>,
  //     'Type',
  //     'Default Value',
  //     'Notes',
  //     'Required',
  //     'Is Index',
  //     <IconButton name="add__property" icon="iconPlus" onClick={this.onAddProperty('')} />,
  //   ];
  //   const widths = [300, 120, 200, undefined, 100, 100, 70];
  //   const paddings = [true, true, true, true, false, false, false];
  //   const centers = [false, false, false, false, true, true, false];
  //   const properties = [];
  //   this.getProperties(properties, '');
  //   const data = properties.map((property) => [
  //     <div style={{marginLeft: property.level * 10}}>
  //       <div className={cs('ModelDetails__arrow', {expanded: property.expanded})}>
  //         {subTypes.includes(property.type) && (
  //           <IconButton
  //             onClick={this.handlePropertyToggleCollapse(property.id)}
  //             icon="iconArrow"
  //           />
  //         )}
  //       </div>
  //       <div className="ModelDetails__field">
  //         <Input
  //           name={`properties[${property.idx}][id]`}
  //           value={property.id}
  //           type="hidden"
  //         />
  //         <Input
  //           name={`properties[${property.idx}][name]`}
  //           value={property.name}
  //           underlineStyle={{bottom: 0}}
  //           fullWidth
  //           hideUnderline
  //         />
  //       </div>
  //     </div>,
  //     <Select
  //       name={`properties[${property.idx}][type]`}
  //       value={property.type || 'string'}
  //       options={propertyTypes}
  //       fullWidth
  //       hideUnderline
  //       handleChange={this.handleChangePropertyType(property.id)}
  //     />,
  //     subTypes.includes(property.type) ? null :
  //       <Input
  //         name={`properties[${property.idx}][default_]`}
  //         value={property.default_}
  //         underlineStyle={{bottom: 0}}
  //         fullWidth
  //         hideUnderline
  //       />,
  //     <Input
  //       name={`properties[${property.idx}][description]`}
  //       value={property.description}
  //       underlineStyle={{bottom: 0}}
  //       fullWidth
  //       hideUnderline
  //     />,
  //     <Checkbox
  //       name={`properties[${property.idx}][required]`}
  //       value={property.required}
  //     />,
  //     <Checkbox
  //       name={`properties[${property.idx}][index]`}
  //       value={property.index}
  //       handleKeyDown={this.handleTabProperties(property)}
  //     />,
  //     <div>
  //       <IconButton name={`remove__property${property.idx}`} icon="iconDelete" onClick={this.onRemoveProperty(property)} />
  //       {subTypes.includes(property.type) && <IconButton icon="iconPlus" onClick={this.onAddProperty(property.id)} />}
  //     </div>,
  //   ]);
  //   return <Table
  //     columns={columns}
  //     data={data}
  //     widths={widths}
  //     paddings={paddings}
  //     centers={centers}
  //   />;
  //   // <ModelNestedProperties
  //   //   title="Properties"
  //   //   path=""
  //   //   properties={this.state.properties}
  //   //   onAddProperty={this.onAddProperty}
  //   //   onRemoveProperty={this.onRemoveProperty}
  //   //   onPropertyTypeChange={this.onPropertyTypeChange}
  //   // />
  // };
  //
  // renderRelationsSection = () => {
  //   const {modelOptions} = this.props;
  //   const columns = [
  //     'Name',
  //     'Type',
  //     'Model',
  //     'Foreign Key',
  //     <IconButton name="add__relation" icon="iconPlus" onClick={this.onAddRelation} />,
  //   ];
  //   const widths = [300, 220, 300, undefined, 70];
  //   const paddings = [true, true, true, true, false];
  //   const data = this.state.relations.map((relation, idx) => [
  //     <Input
  //       name={`relations[${idx}][name]`}
  //       value={relation.name}
  //       underlineStyle={{bottom: 0}}
  //       fullWidth
  //       hideUnderline
  //     />,
  //     <Select
  //       name={`relations[${idx}][type]`}
  //       value={relation.type || 'hasMany'}
  //       options={relationTypeOptions}
  //       fullWidth
  //       hideUnderline
  //     />,
  //     <Select
  //       name={`relations[${idx}][model]`}
  //       value={relation.model || modelOptions[0].value}
  //       options={modelOptions}
  //       fullWidth
  //       hideUnderline
  //     />,
  //     <Input
  //       name={`relations[${idx}][foreignKey]`}
  //       value={relation.foreignKey}
  //       underlineStyle={{bottom: 0}}
  //       fullWidth
  //       hideUnderline
  //       handleKeyDown={this.handleTab('relations', idx)}
  //     />,
  //     <IconButton name={`remove__relation${idx}`} icon="iconDelete" onClick={this.onRemoveRelation(relation)} />,
  //   ]);
  //   return <Table
  //     columns={columns}
  //     data={data}
  //     widths={widths}
  //     paddings={paddings}
  //   />;
  // };

  // renderUserDefinedFieldsSection = () => {
  //   const columns = [
  //     'Name',
  //     'Type',
  //     'Value',
  //     <IconButton name="add__udf" icon="iconPlus" onClick={this.onAddUserField} />,
  //   ];
  //   const widths = [300, 120, undefined, 70];
  //   const paddings = [true, true, true, false];
  //   const data = this.state.userFields.map((field, idx) => [
  //     <Input
  //       name={`userFields[${idx}][name]`}
  //       value={field.name}
  //       underlineStyle={{bottom: 0}}
  //       fullWidth
  //       hideUnderline
  //     />,
  //     <Select
  //       name={`userFields[${idx}][type]`}
  //       value={field.type}
  //       options={userFieldsTypeOptions}
  //       fullWidth
  //       hideUnderline
  //       handleChange={this.handleChangeUserDefinedFieldType(idx)}
  //     />,
  //     field.type === 'object'
  //     ? <Input
  //         name={`userFields[${idx}][value]`}
  //         value={JSON.stringify(field.value)}
  //         underlineStyle={{bottom: 0}}
  //         fullWidth
  //         hideUnderline
  //         textarea
  //         handleKeyDown={this.handleTab('userFields', idx)}
  //       />
  //     : <Input
  //         name={`userFields[${idx}][value]`}
  //         value={field.value.toString()}
  //         underlineStyle={{bottom: 0}}
  //         fullWidth
  //         hideUnderline
  //         type={field.type === 'number' ? 'number' : 'text'}
  //         handleKeyDown={this.handleTab('userFields', idx)}
  //       />,
  //     <IconButton name={`remove__udf${idx}`} icon="iconDelete" onClick={this.onRemoveUserField(field)} />,
  //   ]);
  //   return <Table
  //     columns={columns}
  //     data={data}
  //     widths={widths}
  //     paddings={paddings}
  //   />;
  // }

  handleFunctionCodeChange = code => this.setState({code, changed: true}, () => this.props.parent.checkPristine());

  handleFunctionCodeResize = (_, {size: {width: editorCodeWidth, height: editorCodeHeight}}) =>
    this.setState({editorCodeWidth, editorCodeHeight});

  renderFunctionCodeSection() {
    const {editorCodeLanguage, code, editorCodeWidth, editorCodeHeight} = this.state;
    const options = {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
      enableSnippets: true,
      showLineNumbers: true,
      tabSize: 2,
    };
    const maxWidth = window.innerWidth - 170;
    return (
      <ResizableBox
        width={initialEditorCodeWidth}
        height={350}
        minConstraints={[200, 100]}
        maxConstraints={[maxWidth, 2000]}
        onResize={this.handleFunctionCodeResize}
      >
        <AceEditor
          width={`${editorCodeWidth}px`}
          height={`${editorCodeHeight}px`}
          theme="monokai"
          mode={editorCodeLanguage}
          value={code}
          onChange={this.handleFunctionCodeChange}
          setOptions={options}
        />
      </ResizableBox>
    );
  }

  render() {
    const sections = [
      {title: 'Details'},
      {title: 'Triggers'},
      {title: 'Function Code', render: 'FunctionCode'},
      // {title: 'User-defined fields', render: 'UserDefinedFields'},
      // {title: 'Relations'},
      // {title: 'Properties'},
    ];
    return (
      <div className="FunctionDetails">
        {sections.map(({title, render}) => (
          <CollapsibleProperties
            key={title}
            bar={<EntityPropertyLabel>{title}</EntityPropertyLabel>}
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
  // state => state.entities.models,
  // state => state.entities.modelsBundled,
  (
    dataSources,
    // models,
    // modelsBundled,
  ) => ({
    dataSources,
    // modelOptions: Object.keys(models).map(key => models[key].name)
    //   .concat(Object.keys(modelsBundled).map(key => modelsBundled[key].name))
    //   .map(label => ({label, value: label})),
  }),
);

export default connect(selector)(BaseDetails(FunctionDetails));
