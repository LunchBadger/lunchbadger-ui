import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import _ from 'lodash';
import cs from 'classnames';
import {
  EntityProperty,
  IconButton,
  IconMenu,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
} from '../../../../../../lunchbadger-ui/src';
import GatewayProxyServiceEndpoint from './GatewayProxyServiceEndpoint';
import {determineType, getDefaultValueByType} from '../../../../utils';
import './GatewayPolicyAction.scss';

const customPropertyTypes = [
  'string',
  'boolean',
  'integer',
  'number',
  'array',
  'object',
];

const handledPropertyTypes = customPropertyTypes.concat(['jscode', 'fake']);

const propertyDefaultValue = (property) => {
  const {schemas = {}, value} = property;
  if (schemas.hasOwnProperty('default') && _.isEqual(value, schemas.default)) {
    return 'default';
  }
  if (schemas.hasOwnProperty('example') && _.isEqual(value, schemas.example)) {
    return 'example';
  }
  return false;
};

export default class GatewayPolicyAction extends PureComponent {
  static propTypes = {
    action: PropTypes.object,
    schemas: PropTypes.object,
    prefix: PropTypes.string,
    onChangeState: PropTypes.func,
    horizontal: PropTypes.bool,
    collapsibleTitle: PropTypes.string,
    validations: PropTypes.object,
  };

  static defaultProps = {
    onChangeState: () => {},
    horizontal: true,
    collapsibleTitle: '',
    validations: {data: {}},
  };

  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
    this.tmpPrefix = props.prefix.replace('pipelines', 'tmp[pipelines]');
  }

  componentWillReceiveProps(nextProps) {
    const {entry} = this.props;
    if (entry && entry !== nextProps.entry) {
      this.onPropsUpdate(nextProps);
    }
  }

  discardChanges = () => {
    this.onPropsUpdate(this.props);
    this.policyConditionRef && this.policyConditionRef.discardChanges();
  };

  getState = (props) => {
    const {action, schemas = {properties: {}, required: []}} = props;
    const {properties = {}, required = []} = schemas;
    const parameters = {};
    required.forEach((name) => {
      const {
        description,
        type,
        types,
        default: def,
        enum: enum_,
        postfix,
        title,
        example,
      } = properties[name];
      parameters[name] = {
        id: uuid.v4(),
        name,
        title,
        type,
        types,
        value: action[name],
        description,
        enum: enum_ || [],
        postfix,
        schemas: properties[name],
      };
      if (action[name] === undefined) {
        parameters[name].value = def || example || getDefaultValueByType(type);
      }
    });
    const notRequired = [
      ...Object.keys(properties).filter(name => properties[name].hasOwnProperty('default')),
      ...Object.keys(action),
    ];
    notRequired.forEach((name) => {
      if (parameters[name]) return;
      const {
        description,
        type,
        types,
        default: def,
        enum: enum_,
        postfix,
        title,
      } = (properties[name] || {
        description: '',
        types: customPropertyTypes,
        value: action[name],
        default: getDefaultValueByType(determineType(action[name])),
        enum: [],
      });
      let value = action[name];
      if (typeof value === 'undefined') {
        value = def || getDefaultValueByType(type);
      }
      parameters[name] = {
        id: uuid.v4(),
        name,
        title,
        type: determineType(value),
        value,
        description,
        enum: enum_ || [],
        custom: !properties[name],
        types,
        postfix,
        schemas: properties[name],
        implicite: !action.hasOwnProperty(name),
      };
      if (type === 'fake') {
        parameters[name].type = type;
      }
    });
    return {parameters: Object.values(parameters)};
  };

  stateFromProps = props => this.getState(props);

  onPropsUpdate = (props = this.props) => this.setState(this.stateFromProps(props));

  changeState = (obj, cb) => this.setState(obj, () => this.props.onChangeState(obj, cb));

  handleAddParameter = (name) => {
    const state = _.cloneDeep(this.state);
    const id = uuid.v4();
    const custom = customPropertyTypes.includes(name);
    if (custom) {
      state.parameters.push({
        id,
        name: '',
        type: name,
        types: customPropertyTypes,
        value: getDefaultValueByType(name),
        custom,
        enum: [],
      });
    } else {
      const schemas = this.props.schemas.properties[name];
      const {
        description,
        type,
        types,
        default: def,
        enum: enum_,
        postfix,
        example,
      } = schemas;
      state.parameters.push({
        id,
        name,
        type,
        types,
        value: def || example || getDefaultValueByType(type),
        custom,
        enum: enum_ || [],
        description,
        postfix,
        schemas,
      });
    }
    this.changeState(state, () => setTimeout(() => {
      const elementId = custom ? `${this.tmpPrefix}[${id}][name]` : `${this.props.prefix}[${name}]`;
      const input = document.getElementById(elementId);
      input && input.focus();
    }), 200);
  };

  handlePropertyValueChange = (id, inputName) => ({target: {
    value,
    checked,
    selectionStart,
  }}) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    property.implicite = false;
    if (property.type === 'boolean') {
      property.value = checked;
    } else if (property.type === 'integer' || property.type === 'number') {
      property.value = +value;
    } else {
      property.value = value;
    }
    this.changeState(state, () => {
      if (!inputName) return;
      const inputNameArr = inputName.split(']');
      if (!inputNameArr[4].includes('fake')) return;
      inputNameArr[4] = '[0'; // replacing name's implicite part with pair 0
      const input = document.getElementById(inputNameArr.join(']'));
      if (input && selectionStart) {
        input.focus();
        input.selectionStart = selectionStart;
      }
    });
  };

  handleCustomParameterNameChange = id => ({target: {value}}) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    property.name = value;
    this.changeState(state);
  };

  handleTypeChange = id => (type) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    if (property.type === type) return;
    Object.assign(property, {
      type,
      value: getDefaultValueByType(type),
      implicite: false,
    });
    this.changeState(state);
  };

  handleParameterRemove = param => () => {
    const state = _.cloneDeep(this.state);
    const {id, schemas = {}} = param;
    if (schemas.hasOwnProperty('default')) {
      Object.assign(state.parameters.find(item => item.id === id), {
        implicite: true,
        value: schemas.default,
        type: determineType(schemas.default),
      });
    } else {
      state.parameters = state.parameters.filter(item => item.id !== id);
    }
    this.changeState(state);
  };

  handleArrayChange = id => (values, cb) => {
    const state = _.cloneDeep(this.state);
    Object.assign(state.parameters.find(item => item.id === id), {
      value: values,
      implicite: false,
    });
    this.changeState(state, cb);
  };

  handleNameChange = ({target: {value: name}}) => this.changeState(this.getState(name, {}));

  renderProperty = (item) => {
    const {
      id,
      name,
      value,
      type,
      types,
      description,
      title,
      width,
      custom,
      postfix,
      implicite,
      schemas = {},
    } = item;
    const {prefix, validations} = this.props;
    let titleRemark;
    const propDefValue = propertyDefaultValue(item);
    if (propDefValue) {
      titleRemark = `(${propDefValue} value is used)`;
    }
    if (types) {
      let customFitWidth = 220;
      if (['number', 'integer', 'array'].includes(type)) {
        customFitWidth = 190;
      }
      if (type === 'object') {
        customFitWidth = 170;
      }
      const defaultType = schemas.hasOwnProperty('default') && typeof value === typeof schemas.default;
      return (
        <div key={id} className={cs('GatewayPolicyAction', {defaultType})}>
          {custom && (
            <EntityProperty
              title="Parameter Name"
              name={`${this.tmpPrefix}[${id}][name]`}
              value={name}
              onChange={this.handleCustomParameterNameChange(id)}
              width={150}
              placeholder=" "
              classes={`${this.tmpPrefix}[name][type][${type}]`}
            />
          )}
          {!custom && (
            <EntityProperty
              title="Type"
              name={`${this.tmpPrefix}[${id}][type]`}
              value={type}
              onChange={this.handleTypeChange(id)}
              placeholder=" "
              options={types.map(label => ({label, value: label}))}
              classes={`${this.tmpPrefix}[type][${name}]`}
              type="types"
            />
          )}
          {this.renderProperty({
            id,
            type,
            name,
            value,
            label: custom ? 'Parameter Value' : (title || name),
            width: `calc(100% - ${custom ? customFitWidth : 190}px)`,
            enum: item.enum,
            custom,
            schemas,
          })}
        </div>
      );
    }
    if (item.schemas && item.schemas.lbType === 'serviceEndpoint') return (
      <GatewayProxyServiceEndpoint
        name={`${prefix}[${name}]`}
        value={value}
        description={description}
        onChange={this.handlePropertyValueChange(id)}
      />
    );
    if (handledPropertyTypes.includes(type)) {
      const inputName = `${prefix}[${name}]`;
      const props = {
        key: id,
        title: title || name,
        titleRemark,
        name: `${implicite ? 'implicite' : ''}${inputName}`,
        value,
        onChange: this.handlePropertyValueChange(id, inputName),
        width: width || 'calc(100% - 20px)',
        description,
        placeholder: ' ',
        type,
        invalid: validations.data[`${prefix}[${name}]`],
      };
      if (type === 'fake') {
        Object.assign(props, {
          type: 'string',
          fake: true,
        });
      }
      if (type === 'boolean') {
        Object.assign(props, {
          onBlur: undefined,
          onChange: this.handlePropertyValueChange(id),
          bool: true,
        });
      }
      if (type === 'integer' || type === 'number') {
        Object.assign(props, {
          number: true,
          alignRight: true,
          postfix,
        });
      }
      if ((type === 'string' && custom) || (item.schemas && item.schemas.lbType === 'jscode')) {
        Object.assign(props, {
          codeEditor: true,
          width: width || 'calc(100% - 50px)',
        });
      }
      if (type === 'string' && item.enum.length) {
        Object.assign(props, {
          options: item.enum.map(label => ({label, value: label})),
          autocomplete: true,
          onChange: undefined,
          onBlur: this.handlePropertyValueChange(id, inputName),
        });
      }
      if (type === 'array') {
        const options = item.enum
          ? item.enum.map(label => ({label, value: label}))
          : undefined;
        const autocomplete = !!item.enum;
        Object.assign(props, {
          chips: true,
          onBlur: undefined,
          onChange: this.handleArrayChange(id),
          options,
          autocomplete,
        });
      }
      if (type === 'object') {
        Object.assign(props, {
          object: true,
          onBlur: undefined,
          onChange: this.handleArrayChange(id),
          tmpPrefix: this.tmpPrefix,
        });
        if (item.schemas) {
          const {prefix, horizontal, validations, onChangeState} = this.props;
          return (
            <div className="GatewayPolicyAction__object">
              <EntityPropertyLabel>{name}</EntityPropertyLabel>
              <GatewayPolicyAction
                action={value}
                schemas={item.schemas}
                prefix={`${prefix}[${name}]`}
                onChangeState={onChangeState}
                horizontal={horizontal}
                validations={validations}
              />
            </div>
          );
        }
      }
      return <EntityProperty {...props} />;
    }
    return null;
  };

  isDeletePropertyButton = (item) => {
    const {schemas = {}} = this.props;
    const required = schemas.required || [];
    return !required.includes(item.name) && item.type !== 'fake';
  };

  reorderParameters = (parameters) => {
    const params = {
      fake: [],
      notFake: [],
    };
    parameters.forEach((item) => {
      params[item.type === 'fake' ? 'fake' : 'notFake'].push(item);
    })
    return params.notFake.concat(params.fake);
  }

  render() {
    const {schemas = {}, prefix, collapsibleTitle} = this.props;
    const {parameters} = this.state;
    const currParameters = parameters.map(({name}) => name);
    const properties = schemas.properties || {};
    const availableParameters = _.difference(
      Object.keys(properties).filter(key => properties[key].type !== 'fake'),
      currParameters,
    );
    const addButton = (
      <div className="GatewayPolicyAction__button add menu">
        <IconMenu
          name={`add__${prefix}Parameter`}
          options={availableParameters}
          secondaryOptions={customPropertyTypes}
          onClick={this.handleAddParameter}
        />
      </div>
    );
    const reorderedParameters = this.reorderParameters(parameters);
    if (collapsibleTitle !== '') {
      const collapsible = (
        <div className="GatewayPolicyAction">
          {reorderedParameters.map((item, idx) => (
            <div key={item.id} className={cs('GatewayPolicyAction__parameter', {defaultValue: propertyDefaultValue(item)})}>
              {this.renderProperty(item)}
              {this.isDeletePropertyButton(item) && (
                <div className={cs('GatewayPolicyAction__button', {object: item.type === 'object'})}>
                  <IconButton
                    icon="iconDelete"
                    name={`remove__${prefix}Parameter${idx}`}
                    onClick={this.handleParameterRemove(item)}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      );
      const button = (
        <IconMenu
          name={`add__${prefix}Parameter`}
          options={availableParameters}
          secondaryOptions={customPropertyTypes}
          onClick={this.handleAddParameter}
        />
      );
      return (
        <CollapsibleProperties
          bar={<EntityPropertyLabel>{collapsibleTitle}</EntityPropertyLabel>}
          collapsible={collapsible}
          barToggable
          defaultOpened
          button={button}
        />
      );
    }
    return (
      <div className="GatewayPolicyAction">
        <div id={prefix} />
        {addButton}
        {reorderedParameters.map((item, idx) => (
          <div key={item.id} className={cs('GatewayPolicyAction__parameter', {
            defaultValue: propertyDefaultValue(item),
            implicite: item.implicite,
          })}>
            {this.renderProperty(item)}
            {this.isDeletePropertyButton(item) && (
              <div className={cs('GatewayPolicyAction__button', {object: item.type === 'object'})}>
                <IconButton
                  icon="iconDelete"
                  name={`remove__${prefix}Parameter${idx}`}
                  onClick={this.handleParameterRemove(item)}
                />
              </div>
            )}
          </div>
        ))}
        <Input
          type="hidden"
          name={`${prefix}[fake]`}
        />
      </div>
    );
  }
}
