import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import _ from 'lodash';
import cs from 'classnames';
import GatewayProxyServiceEndpoint from './GatewayProxyServiceEndpoint';
import {determineType} from '../../../../utils';
import './GatewayPolicyAction.scss';

const {
  UI: {
    EntityProperty,
    IconButton,
    IconMenu,
    EntityPropertyLabel,
    CollapsibleProperties,
    Input,
    getDefaultValueByType,
    DocsLink,
  },
} = LunchBadgerCore;

const customPropertyTypes = [
  'string',
  'boolean',
  'integer',
  'number',
  'array',
  'object',
];

const customArrayTypes = [
  'string',
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
    collapsibleTitle: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    collapsibleBarToggable: PropTypes.bool,
    validations: PropTypes.object,
    visibleParameters: PropTypes.array,
    tmpPrefix: PropTypes.string,
    withPlaceholders: PropTypes.bool,
    collapsibleDocsLink: PropTypes.string,
  };

  static defaultProps = {
    onChangeState: (_, cb) => cb && cb(),
    horizontal: true,
    collapsibleTitle: '',
    collapsibleBarToggable: true,
    validations: {data: {}},
    visibleParameters: [],
    tmpPrefix: 'pipelines',
    withPlaceholders: false,
    collapsibleDocsLink: '',
  };

  constructor(props) {
    super(props);
    this.state = this.stateFromProps(props);
    const {tmpPrefix} = props;
    this.tmpPrefix = props.prefix.replace(new RegExp(tmpPrefix), `tmp[${tmpPrefix}]`);
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
        items = {types: customArrayTypes},
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
        items: items.type ? [items.type] : items.types,
        arrayItem: items && items[0],
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
        items = {types: customArrayTypes},
      } = (properties[name] || {
        description: '',
        types: customPropertyTypes,
        value: action[name],
        default: getDefaultValueByType(determineType(action[name])),
        enum: [],
        items: {types: customArrayTypes},
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
        implicit: !action.hasOwnProperty(name),
        items: items.type ? [items.type] : items.types,
      };
      if (type === 'fake') {
        parameters[name].type = type;
      }
      parameters[name].arrayItem = customArrayTypes[0];
      if (Array.isArray(value) && value.length > 0) {
        parameters[name].arrayItem = determineType(value[0]);
      } else if (parameters[name].items && parameters[name].items.length === 1) {
        parameters[name].arrayItem = parameters[name].items[0];
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
        items: customArrayTypes,
        arrayItem: customArrayTypes[0],
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
        items = {types: []},
      } = schemas;
      const param = {
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
        items: items.type ? [items.type] : items.types,
      };
      param.arrayItem = (Array.isArray(param.value) && param.value.length > 0)
        ? determineType(param.value[0])
        : param.items[0];
      state.parameters.push(param);
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
    // selectionStart, // relict since #1007
  }}) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    property.implicit = false;
    if (property.type === 'boolean') {
      property.value = checked;
    } else if (property.type === 'integer' || property.type === 'number') {
      property.value = +value;
    } else {
      property.value = value;
    }
    this.changeState(state); //, () => { /* relict since #1007 */
    //   if (!inputName) return;
    //   const inputNameArr = inputName.split(']');
    //   if (inputNameArr[4] && inputNameArr[4].includes('fake')) {
    //     inputNameArr[4] = '[0'; // replacing name's implicit part with pair 0
    //   }
    //   const input = document.getElementById(inputNameArr.join(']'));
    //   if (input) { // && selectionStart) { // #1007
    //     input.focus();
    //     // input.selectionStart = selectionStart; // #1007
    //   }
    // });
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
      implicit: false,
    });
    this.changeState(state);
  };

  handleArrayTypeChange = id => (arrayItem) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    if (property.arrayItem === arrayItem) return;
    Object.assign(property, {
      arrayItem,
      value: [],
      implicit: false,
    });
    this.changeState(state);
  };

  handleParameterRemove = param => () => {
    const state = _.cloneDeep(this.state);
    const {id, schemas = {}} = param;
    if (schemas.hasOwnProperty('default')) {
      Object.assign(state.parameters.find(item => item.id === id), {
        implicit: true,
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
      implicit: false,
    });
    this.changeState(state, cb);
  };

  handleNameChange = ({target: {value: name}}) => this.changeState(this.getState(name, {}));

  handleParameterRemoveArrayItem = (id, index) => () => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    property.value = property.value.filter((_, idx) => idx !== index);
    this.changeState(state);
  };

  handleParameterAddArrayItem = id => () => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    property.value = [...property.value, {}];
    this.changeState(state);
  };

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
      implicit,
      items,
      arrayItem,
      schemas = {},
    } = item;
    const textarea = !!schemas.multiline;
    const contextual = schemas.contextual;
    const {
      prefix,
      validations,
      withPlaceholders,
      tmpPrefix,
      horizontal,
      onChangeState,
    } = this.props;
    let titleRemark;
    const propDefValue = propertyDefaultValue(item);
    if (propDefValue) {
      titleRemark = `(${propDefValue} value is used)`;
      if (implicit) {
        titleRemark = `(implicit with ${propDefValue} value)`;
      }
    }
    const placeholder = withPlaceholders ? `Enter ${name} here` : ' ';
    if (types) {
      const defaultType = schemas.hasOwnProperty('default') && typeof value === typeof schemas.default;
      return (
        <div key={id} className={cs('GatewayPolicyAction', {defaultType})}>
          {!custom && (
            <div className="GatewayPolicyAction__arrayLabel">
              <EntityPropertyLabel
                description={description}
              >
                {name}
                {!!titleRemark && (
                  <span className="EntityProperty__titleRemark">
                    {titleRemark}
                  </span>
                )}
              </EntityPropertyLabel>
            </div>
          )}
          {custom && (
            <EntityProperty
              name={`${this.tmpPrefix}[${id}][name]`}
              value={name}
              onChange={this.handleCustomParameterNameChange(id)}
              placeholder="Enter parameter name"
              classes={`${this.tmpPrefix}[name][type][${type}]`}
              asLabel
            />
          )}
          {!custom && types.length > 1 && (
            <EntityProperty
              title="Type"
              name={`${this.tmpPrefix}[${id}][type]`}
              value={type}
              onChange={this.handleTypeChange(id)}
              placeholder={placeholder}
              options={types.map(label => ({label, value: label}))}
              classes={`${this.tmpPrefix}[type][${name}]`}
              type="types"
            />
          )}
          {!!name && this.renderProperty({
            id,
            type,
            name,
            value,
            label: custom ? 'Parameter Value' : (title || name),
            width: custom ? undefined : 'calc(100% - 190px)',
            enum: item.enum,
            custom,
            schemas,
            description,
            items,
            arrayItem,
            implicit,
            postfix,
            title: custom ? 0 : title,
            onChange: this.handlePropertyValueChange(id, `${prefix}[${name}]`),
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
        title: title === 0 ? undefined : (title || name),
        titleRemark,
        name: `${implicit ? 'implicit' : ''}${inputName}`,
        value,
        onChange: this.handlePropertyValueChange(id, inputName),
        width: width || 'calc(100% - 20px)',
        description,
        placeholder,
        type,
        invalid: validations.data[`${prefix}[${name}]`],
        textarea,
        password: schemas.password || false,
        contextual,
        ...(schemas.props || {}),
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
        if (arrayItem === 'string') {
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
        return (
          <span>
            {item.items.length > 1 && (
              <EntityProperty
                title="Items type"
                name={`${this.tmpPrefix}[${id}][type]`}
                value={arrayItem}
                onChange={this.handleArrayTypeChange(id)}
                placeholder=" "
                options={item.items.map(label => ({label, value: label}))}
                classes={`${this.tmpPrefix}[type][${name}]`}
                type="types"
              />
            )}
            {arrayItem === 'string' && <EntityProperty {...props} />}
            {arrayItem === 'object' && (
              <div>
                <div className="GatewayPolicyAction__arrayItem__add">
                  <IconButton
                    icon="iconPlus"
                    onClick={this.handleParameterAddArrayItem(id)}
                  />
                </div>
                {value.length === 0 && (
                  <div className="GatewayPolicyAction__emptyArray">
                    {'Empty Array'}
                    <Input
                      type="hidden"
                      name={`${inputName}[]`}
                    />
                  </div>
                )}
                {value.map((valueItem, idx) => {
                  const itemSchemas = (item.schemas || {items: {}}).items;
                  return (
                    <div
                      key={idx + JSON.stringify(valueItem)}
                      className="GatewayPolicyAction__arrayItem"
                    >
                      <EntityPropertyLabel>
                        Item {idx}
                      </EntityPropertyLabel>
                      <div className="GatewayPolicyAction__arrayItem__remove">
                        <IconButton
                          icon="iconDelete"
                          onClick={this.handleParameterRemoveArrayItem(id, idx)}
                        />
                      </div>
                      <GatewayPolicyAction
                        action={valueItem}
                        schemas={itemSchemas}
                        prefix={`${prefix}[${name}][${idx}]`}
                        onChangeState={onChangeState}
                        horizontal={horizontal}
                        validations={validations}
                        tmpPrefix={tmpPrefix}
                        withPlaceholders={withPlaceholders}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </span>
        );
      }
      if (type === 'object') {
        Object.assign(props, {
          object: true,
          onBlur: undefined,
          onChange: this.handleArrayChange(id),
          tmpPrefix: this.tmpPrefix,
        });
        if (item.schemas) {
          return (
            <div className={cs('GatewayPolicyAction__object', name)}>
              {!custom && (
                <EntityPropertyLabel
                  description={description}
                >
                  {name}
                  {!!titleRemark && (
                    <span className="EntityProperty__titleRemark">
                      {titleRemark}
                    </span>
                  )}
                </EntityPropertyLabel>
              )}
              <GatewayPolicyAction
                action={value}
                schemas={item.schemas}
                prefix={`${prefix}[${name}]`}
                onChangeState={onChangeState}
                horizontal={horizontal}
                validations={validations}
                tmpPrefix={tmpPrefix}
                withPlaceholders={withPlaceholders}
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
  };

  render() {
    const {
      schemas = {},
      prefix,
      collapsibleTitle,
      collapsibleDocsLink,
      visibleParameters,
      entry,
      collapsibleBarToggable,
      collapsibleSpace,
    } = this.props;
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
            <div key={item.id} className={cs('GatewayPolicyAction__parameter', {
              defaultValue: propertyDefaultValue(item),
              hidden: visibleParameters.length > 0 && !visibleParameters.includes(item.name),
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
          id={`${entry.id || entry}/${collapsibleTitle}`}
          bar={
            <EntityPropertyLabel>
              {collapsibleTitle}
              {collapsibleDocsLink && <DocsLink item={collapsibleDocsLink} />}
            </EntityPropertyLabel>
          }
          collapsible={collapsible}
          barToggable={collapsibleBarToggable}
          space={collapsibleSpace}
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
            implicit: item.implicit,
            hidden: visibleParameters.length && !visibleParameters.includes(item.name),
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
        {reorderedParameters.length === 0 && (
          <div className="GatewayPolicyAction__emptyObject">
            {'Empty Object'}
          </div>
        )}
        <Input
          type="hidden"
          name={`${prefix}[fake]`}
        />
      </div>
    );
  }
}
