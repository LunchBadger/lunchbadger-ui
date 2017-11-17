import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import _ from 'lodash';
import cs from 'classnames';
import {EntityProperty, IconButton, IconMenu} from '../../../../../../lunchbadger-ui/src';
import GatewayProxyServiceEndpoint from './GatewayProxyServiceEndpoint';
import './GatewayPolicyAction.scss';

const customPropertyTypes = [
  'string',
  'boolean',
  'integer',
  'array',
];

const getDefaultValueByType = type => ({
  string: '',
  boolean: false,
  integer: 0,
  jscode: '',
  array: [],
})[type];

const determineType = value => {
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'number') return 'integer';
  return typeof value;
};

export default class GatewayPolicyAction extends PureComponent {
  static propTypes = {
    action: PropTypes.object,
    schemas: PropTypes.object,
    prefix: PropTypes.string,
    onChangeState: PropTypes.func,
    horizontal: PropTypes.bool,
  };

  static defaultProps = {
    onChangeState: () => {},
    horizontal: true,
  };

  constructor(props) {
    super(props);
    this.state = this.stateFromStores(props);
    this.tmpPrefix = props.prefix.replace('pipelines', 'tmp[pipelines]');
  }

  discardChanges = () => {
    this.onPropsUpdate(this.props);
    this.policyConditionRef && this.policyConditionRef.discardChanges();
  };

  getState = (props) => {
    const {action, schemas: {properties, required}} = props;
    const parameters = {};
    required.forEach((name) => {
      const {description, type, types, default: def, enum: enum_, postfix} = properties[name];
      parameters[name] = {
        id: uuid.v4(),
        name,
        type,
        types,
        value: action[name] || def || getDefaultValueByType(type),
        description,
        enum: enum_ || [],
        postfix,
      };
    });
    Object.keys(action).forEach((name) => {
      if (parameters[name]) return;
      const {description, type, types, default: def, enum: enum_, postfix} = (properties[name] || {
        description: '',
        // type: determineType(action[name]),
        types: customPropertyTypes,
        value: action[name],
        default: getDefaultValueByType(determineType(action[name])),
        enum: [],
      });
      const value = action[name] || def || getDefaultValueByType(type);
      parameters[name] = {
        id: uuid.v4(),
        name,
        type: determineType(value),
        value,
        description,
        enum: enum_ || [],
        custom: !properties[name],
        types,
        postfix,
      };
    });
    return {parameters: Object.keys(parameters).map(key => parameters[key])};
  };

  stateFromStores = props => this.getState(props);

  onPropsUpdate = (props = this.props) => this.setState(this.stateFromStores(props));

  changeState = (obj, cb) => this.setState(obj, () => this.props.onChangeState({}, cb));

  handleAddCondition = () => {
    const state = _.cloneDeep(this.state);
    state.properties[0].value.push({id: uuid.v4(), name: 'always'});
    this.changeState(state);
  };

  handleRemoveCondition = idx => () => {
    const state = _.cloneDeep(this.state);
    state.properties[0].value.splice(idx, 1);
    this.changeState(state);
  };

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
      const {description, type, types, default: def, enum: enum_, postfix} = this.props.schemas.properties[name];
      state.parameters.push({
        id,
        name,
        type,
        types,
        value: def || getDefaultValueByType(type),
        custom,
        enum: enum_ || [],
        description,
        postfix,
      });
    }
    this.changeState(state, () => setTimeout(() => {
      const elementId = custom ? `${this.tmpPrefix}[${id}][name]` : `${this.props.prefix}[${name}]`;
      const input = document.getElementById(elementId);
      input && input.focus();
    }), 200);
  };

  handlePropertyValueChange = id => ({target: {value, checked}}) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    if (property.type === 'boolean') {
      property.value = checked;
    } else if (property.type === 'integer') {
      property.value = +value;
    } else {
      property.value = value;
    }
    this.changeState(state);
  };

  // handlePropertyTab = id => () => { // TODO - consider auto-create new custom parameter
  //   const {parameters} = this.state;
  //   const idx = _.findIndex(parameters, item => item.id === id);
  //   if (idx === parameters.length - 1) {
  //     this.handleAddParameter('string');
  //   }
  // };

  handleCustomParameterNameChange = id => ({target: {value}}) => {
    const state = _.cloneDeep(this.state);
    const property = state.parameters.find(item => item.id === id);
    property.name = value;
    this.changeState(state);
  };

  handleParameterRemove = id => () => {
    const state = _.cloneDeep(this.state);
    state.parameters = state.parameters.filter(item => item.id !== id);
    this.changeState(state);
  };

  handleArrayItemAdd = id => (value) => {
    const state = _.cloneDeep(this.state);
    const parameter = state.parameters.find(item => item.id === id);
    value.split(',').forEach((val) => {
      const item = val.trim();
      if (item !== '' && !parameter.value.includes(item)) {
        parameter.value.push(item);
      }
    });
    this.changeState(state);
  };

  handleArrayItemRemove = id => (idx) => {
    const state = _.cloneDeep(this.state);
    const parameter = state.parameters.find(item => item.id === id);
    parameter.value.splice(idx, 1);
    this.changeState(state);
  };

  handleNameChange = ({target: {value: name}}) => this.changeState(this.getState(name, {}));

  renderProperty = (item) => {
    const {id, name, value, type, types, description, label, width, custom, postfix} = item;
    const {prefix} = this.props;
    if (types) {
      return (
        <div key={id} className="GatewayPolicyAction">
          {custom && (
            <EntityProperty
              title="Parameter Name"
              name={`${this.tmpPrefix}[${id}][name]`}
              value={name}
              onBlur={this.handleCustomParameterNameChange(id)}
              width={150}
              placeholder=" "
            />
          )}
          {this.renderProperty({
            id,
            type,
            name,
            value,
            label: custom ? 'Parameter Value' : name,
            width: `calc(100% - ${custom ? 220 : 190}px)`,
            enum: item.enum,
            custom,
          })}
        </div>
      );
    }
    if (type === 'boolean') {
      return (
        <EntityProperty
          key={id}
          title={label || name}
          name={`${prefix}[${name}]`}
          value={value}
          onChange={this.handlePropertyValueChange(id)}
          width={width || 'calc(100% - 50px)'}
          description={description}
          placeholder=" "
          bool
        />
      );
    }
    if (type === 'integer') {
      return (
        <EntityProperty
          key={id}
          title={label || name}
          name={`${prefix}[${name}]`}
          value={value}
          onBlur={this.handlePropertyValueChange(id)}
          // onTab={this.handlePropertyTab(id)}
          width={150} //width || 'calc(100% - 50px)'}
          description={description}
          placeholder=" "
          number
          alignRight
          postfix={postfix}
        />
      );
    }
    if ((type === 'string' && custom) || type === 'jscode') {
      return (
        <EntityProperty
          key={id}
          title={label || name}
          name={`${prefix}[${name}]`}
          value={value}
          onBlur={this.handlePropertyValueChange(id)}
          // onTab={this.handlePropertyTab(id)}
          width={width || 'calc(100% - 50px)'}
          description={description}
          placeholder=" "
          codeEditor
        />
      );
    }
    if (type === 'string') {
      return (
        <EntityProperty
          key={id}
          title={label || name}
          name={`${prefix}[${name}]`}
          value={value}
          onBlur={this.handlePropertyValueChange(id)}
          width={width || 'calc(100% - 50px)'}
          description={description}
          placeholder=" "
        />
      );
    }
    if (type === 'array') {
      const hiddenInputs = value.map((value, idx) => ({
        id: uuid.v4(),
        name: `${prefix}[${name}][${idx}]`,
        value,
      }));
      const options = item.enum
        ? _.difference(item.enum, value).map(label => ({label, value: label}))
        : undefined;
      const autocomplete = !!item.enum;
      return (
        <EntityProperty
          key={`${id}_${hiddenInputs.length}`}
          title={label || name}
          name={`${name}_name`}
          value=""
          placeholder=" "
          hiddenInputs={hiddenInputs}
          chips
          width={width || 'calc(100% - 50px)'}
          onAddChip={this.handleArrayItemAdd(id)}
          onRemoveChip={this.handleArrayItemRemove(id)}
          // onTab={this.handlePropertyTab(id)}
          description={item.description}
          options={options}
          autocomplete={autocomplete}
        />
      );
    }
    if (type === 'serviceEndpoint') {
      return (
        <GatewayProxyServiceEndpoint
          name={`${prefix}[${name}]`}
          value={value}
          description={description}
          onChange={this.handlePropertyValueChange(id)}
        />
      )
    }
    return null;
  };

  render() {
    const {schemas} = this.props;
    const {parameters} = this.state;
    const currParameters = parameters.map(({name}) => name);
    const availableParameters = _.difference(Object.keys(schemas.properties), currParameters);
    const addButton = (
      <div className="GatewayPolicyAction__button add menu">
        <IconMenu
          options={availableParameters}
          secondaryOptions={customPropertyTypes}
          onClick={this.handleAddParameter}
        />
      </div>
    );
    return (
      <div className="GatewayPolicyAction">
        {addButton}
        {parameters.map(item => (
          <div key={item.id} className="GatewayPolicyAction__parameter">
            {this.renderProperty(item)}
            {!schemas.required.includes(item.name) && (
              <div className="GatewayPolicyAction__button">
                <IconButton icon="iconDelete" onClick={this.handleParameterRemove(item.id)} />
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}
