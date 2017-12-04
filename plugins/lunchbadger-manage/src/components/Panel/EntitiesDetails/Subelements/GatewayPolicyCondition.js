import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import _ from 'lodash';
import cs from 'classnames';
import {EntityProperty, IconButton, IconMenu, IconSVG} from '../../../../../../lunchbadger-ui/src';
import {iconConditionAllOf, iconConditionNot, iconConditionOneOf} from '../../../../../../../src/icons';
import './GatewayPolicyCondition.scss';

const iconCondition = {
  allOf: iconConditionAllOf,
  oneOf: iconConditionOneOf,
  not: iconConditionNot,
};

const groupingParameters = Object.keys(iconCondition);

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

export default class GatewayPolicyCondition extends PureComponent {
  static propTypes = {
    condition: PropTypes.object,
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

  getState = (name, condition) => {
    const id = uuid.v4();
    if (!name) return {
      id,
      name: 'always',
      custom: false,
      properties: [],
    };
    const {schemas} = this.props;
    const propSchemas = {...(schemas[name] || {properties: {}}).properties};
    Object.keys(condition).forEach((key) => {
      if (key === 'id' || key === 'name' || propSchemas[key]) return;
      propSchemas[key] = {
        description: '',
        type: determineType(condition[key]),
        types: customPropertyTypes,
        custom: true,
      };
    });
    const properties = [];
    Object.keys(propSchemas).forEach((key) => {
      properties.push({
        ...propSchemas[key],
        name: key,
        id: uuid.v4(),
        value: condition[key] || getDefaultValueByType(propSchemas[key].type),
      });
    });
    properties.forEach((item) => {
      if (item.name === 'conditions') {
        item.value = item.value.map(k => ({...k, id: uuid.v4()}));
      }
    });
    return {
      id,
      name,
      custom: !schemas[name],
      properties,
    };
  };

  stateFromStores = props => this.getState(props.condition.name, props.condition);

  onPropsUpdate = (props = this.props) => this.setState(this.stateFromStores(props));

  changeState = obj => this.setState(obj, () => {
    this.props.onChange && this.props.onChange(obj);
    this.props.onChangeState({});
  });

  onChange = (kind, propIdx, idx) => obj => {
    const state = _.cloneDeep(this.state);
    const value = {id: obj.id, name: obj.name};
    obj.properties.forEach((p) => {
      value[p.name] = p.value;
    });
    if (kind === 'conditions') {
      state.properties[propIdx].value[idx] = value;
    } else {
      state.properties[propIdx].value = value;
    }
    this.changeState(state);
  };

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

  handleAddCustomParameter = (type) => {
    const state = _.cloneDeep(this.state);
    state.properties.push({
      id: uuid.v4(),
      name: '',
      type,
      types: customPropertyTypes,
      value: getDefaultValueByType(type),
      custom: true,
    });
    this.changeState(state);
  };

  handlePropertyValueChange = name => ({target: {value, checked}}) => {
    const state = _.cloneDeep(this.state);
    const property = state.properties.find(item => item.name === name);
    if (property.type === 'boolean') {
      property.value = checked;
    } else if (property.type === 'integer') {
      property.value = +value;
    } else {
      property.value = value;
    }
    this.changeState(state);
  };

  handleCustomParameterNameChange = propIdx => ({target: {value}}) => {
    const state = _.cloneDeep(this.state);
    state.properties[propIdx].name = value;
    this.changeState(state);
  };

  handleCustomParameterRemove = propIdx => () => {
    const state = _.cloneDeep(this.state);
    state.properties.splice(propIdx, 1);
    this.changeState(state);
  };

  handleArrayItemAdd = propIdx => (value) => {
    const state = _.cloneDeep(this.state);
    value.split(',').forEach((val) => {
      const item = val.trim();
      if (item !== '' && !state.properties[propIdx].value.includes(item)) {
        state.properties[propIdx].value.push(item);
      }
    });
    this.changeState(state);
  };

  handleArrayItemRemove = propIdx => (idx) => {
    const state = _.cloneDeep(this.state);
    state.properties[propIdx].value.splice(idx, 1);
    this.changeState(state);
  };

  handleNameChange = ({target: {value: name}}) => {
    const obj = {};
    const {conditions, condition} = (this.props.schemas[name] || {properties: {}}).properties;
    if (conditions || condition) {
      const {conditions: prevConditions, condition: prevCondition} = (this.props.schemas[this.state.name] || {properties: {}}).properties;
      if (prevConditions || prevCondition) {
        let v;
        if (prevConditions) {
          if (conditions) {
            v = this.state.properties[0].value;
          } else {
            v = this.state.properties[0].value[0];
          }
        } else {
          if (conditions) {
            v = [this.state.properties[0].value];
          } else {
            v = this.state.properties[0].value;
          }
        }
        obj[conditions ? 'conditions' : 'condition'] = v;
      } else {
        const ab = {
          id: this.state.id,
          name: this.state.name,
        };
        this.state.properties.forEach((pr) => {
          ab[pr.name] = pr.value;
        });
        if (conditions) {
          obj.conditions = [ab];
        } else {
          obj.condition = ab;
        }
      }
    }
    this.changeState(this.getState(name, obj));
  };

  renderProperty = (item, propIdx) => {
    const {id, name, value, type, types, description, label, width, custom} = item;
    const {
      schemas,
      prefix,
      onChangeState,
      horizontal,
    } = this.props;
    if (types) {
      return (
        <div key={id} className="GatewayPolicyCondition">
          <EntityProperty
            title="Parameter Name"
            name={`${this.tmpPrefix}[${propIdx}][name]`}
            value={name}
            onBlur={this.handleCustomParameterNameChange(propIdx)}
            width={150}
            placeholder=" "
          />
          {this.renderProperty({
            id,
            type,
            name,
            value,
            label: 'Parameter Value',
            width: 'calc(100% - 220px)',
            enum: [],
            custom,
          }, propIdx)}
          <div className="GatewayPolicyCondition__button">
            <IconButton icon="iconDelete" onClick={this.handleCustomParameterRemove(propIdx)} />
          </div>
        </div>
      );
    }
    if (['boolean', 'integer', 'string', 'jscode'].includes(type)) {
      const props = {
        key: id,
        title: label || name,
        name: `${prefix}[${name}]`,
        value,
        width: width || 'calc(100% - 170px)',
        description,
        placeholder: ' '
      }
      if (type === 'boolean') {
        props.bool = true;
        props.onChange = this.handlePropertyValueChange(name);
      }
      if (type === 'integer') {
        props.number = true;
        props.alignRight = true;
        props.onChange = this.handlePropertyValueChange(name);
      }
      if ((type === 'string' && custom) || type === 'jscode') {
        props.codeEditor = true;
        props.onBlur = this.handlePropertyValueChange(name);
      }
      if (type === 'string') {
        props.onBlur = this.handlePropertyValueChange(name);
      }
      return <EntityProperty {...props} />;
    }
    if (name === 'condition') return (
      <span key={id}>
        <div className="GatewayPolicyCondition__C">
          <GatewayPolicyCondition
            ref={r => this.policyConditionRef = r}
            condition={value}
            schemas={schemas}
            prefix={`${prefix}[condition]`}
            onChangeState={onChangeState}
            onChange={this.onChange('condition', propIdx)}
            nested="first"
            nestedSingle
            horizontal={horizontal}
          />
        </div>
      </span>
    );
    if (name === 'conditions') return (
      <span key={id}>
        <div>
          {value.map((condition, idx) => (
            <div key={condition.id} className="GatewayPolicyCondition__C">
              <GatewayPolicyCondition
                ref={r => this.policyConditionRef = r}
                condition={condition}
                schemas={schemas}
                prefix={`${prefix}[conditions][${idx}]`}
                onChangeState={onChangeState}
                onChange={this.onChange('conditions', propIdx, idx)}
                nested={idx === 0 ? 'first' : (idx === value.length - 1 ? 'last': 'other')}
                nestedSingle={value.length === 1}
                horizontal={horizontal}
              />
              {value.length !== 1 && (
                <div className="GatewayPolicyCondition__button">
                  <IconButton icon="iconDelete" onClick={this.handleRemoveCondition(idx)} />
                </div>
              )}
            </div>
          ))}
        </div>
      </span>
    );
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
          width={width || 'calc(100% - 170px)'}
          onAddChip={this.handleArrayItemAdd(propIdx)}
          onRemoveChip={this.handleArrayItemRemove(propIdx)}
          description={item.description}
          options={options}
          autocomplete={autocomplete}
        />
      );
    }
    return null;
  };

  render() {
    const {
      schemas,
      prefix,
      nested,
      nestedSingle,
      horizontal,
    } = this.props;
    const groupingOptions = Object.keys(schemas)
      .filter(key => groupingParameters.includes(key))
      .map(label => ({
        label,
        value: label,
        icon: <IconSVG className="GatewayPolicyCondition__optionIcon" svg={iconCondition[label]} />,
      }));
    const otherOptions = Object.keys(schemas)
      .filter(key => !groupingParameters.includes(key))
      .map(label => ({
        label,
        value: label,
      }));
    const {name, properties, custom} = this.state;
    let button = null;
    if (properties.find(i => i.name === 'conditions')) {
      button = <IconButton icon="iconPlus" onClick={this.handleAddCondition} />;
    }
    if (custom) {
      button = (
        <div className="GatewayPolicyCondition__add">
          <IconMenu
            options={customPropertyTypes}
            onClick={this.handleAddCustomParameter}
            horizontal="left"
          />
        </div>
      );
    }
    return (
      <div className={cs('GatewayPolicyCondition', {nested: !!nested, [nested]: true, nestedSingle})}>
        <EntityProperty
          title="Name"
          name={`${prefix}[name]`}
          value={name}
          options={groupingOptions}
          secondaryOptions={otherOptions}
          onBlur={this.handleNameChange}
          width={140}
          autocomplete
          button={button}
        />
        {properties.map((item, idx) => {
          if (custom) return <div key={item.id}>{this.renderProperty(item, idx)}</div>;
          return <span key={item.id}>{this.renderProperty(item, idx)}</span>;
        })}
      </div>
    );
  }
}
