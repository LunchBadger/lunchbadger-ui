import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import _ from 'lodash';
import {
  EntityProperty,
  Table,
  IconButton,
  Input,
} from '../../../../../lunchbadger-ui/src';
import './GatewayPolicyCondition.scss';

const getDefaultValueByType = (type, prevType, prevValue) => {
  if (!prevType) {
    return {
      string: '',
      array: [],
    }[type];
  }
  if (type === 'string') {
    if (prevType === 'array') return prevValue.map(({value}) => value).join(',');
    return '';
  }
  if (type === 'array') {
    if (prevType === 'string') return prevValue.split(',').map(value => ({id: uuid.v4(), value}));
    return [];
  }
};

const determineType = value => {
  if (Array.isArray(value)) return 'array';
  return typeof value;
};

export default class GatewayPolicyCondition extends PureComponent {
  static propTypes = {
    condition: PropTypes.object,
    schemas: PropTypes.object,
    prefix: PropTypes.string,
    onChangeState: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = this.stateFromStores(props);
  }

  discardChanges = () => {
    this.onPropsUpdate(this.props);
    this.policyConditionRef && this.policyConditionRef.discardChanges();
  };

  stateFromStores = props => {
    const state = {
      data: _.cloneDeep(props.condition),
    };
    Object.keys(props.schemas[props.condition.name].properties || {}).forEach((key) => {
      const item = props.schemas[props.condition.name].properties[key];
      if (item.type && Array.isArray(item.type)) {
        state.data[`${key}_dataType`] = determineType(props.condition[key]);
        if (state.data[`${key}_dataType`] === 'array') {
          state.data[key] = props.condition[key].map(value => {
            if (typeof value === 'string') return {id: uuid.v4(), value};
            return value;
          });
        }
      }
    });
    return state;
  }

  onPropsUpdate = (props = this.props) => this.setState(this.stateFromStores(props));

  changeState = obj => this.setState(obj, () => this.props.onChangeState({}));

  handleAddCondition = () => {
    const data = _.cloneDeep(this.state.data);
    data.conditions.push({id: uuid.v4(), name: 'always'});
    this.changeState({data});
  };

  handleRemoveCondition = idx => () => {
    const data = _.cloneDeep(this.state.data);
    data.conditions.splice(idx, 1);
    this.changeState({data});
  };

  handleTypeChange = name => (type) => {
    const data = _.cloneDeep(this.state.data);
    data[name] = getDefaultValueByType(type, data[`${name}_dataType`], data[name]);
    data[`${name}_dataType`] = type;
    this.changeState({data});
  };

  handlePropertyValueChange = name => ({target: {value}}) => {
    const data = _.cloneDeep(this.state.data);
    data[name] = value;
    this.changeState({data});
  };

  handleArrayItemAdd = item => () => {
    const data = _.cloneDeep(this.state.data);
    data[item.name].push({id: uuid.v4(), value: ''});
    this.changeState({data});
    setTimeout(() => {
      const idx = data[item.name].length - 1;
      const input = document.getElementById(`${this.props.prefix}[${item.name}][${idx}]`);
      input && input.focus();
    });
  };

  handleArrayItemRemove = (item, idx) => () => {
    const data = _.cloneDeep(this.state.data);
    data[item.name].splice(idx, 1);
    this.changeState({data});
  };

  handleArrayItemUpdate = (item, idx) => (event) => {
    const data = _.cloneDeep(this.state.data);
    data[item.name][idx].value = event.target.value;
    this.changeState({data});
  };

  handleArrayItemTab = (item, idx) => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const size = this.state.data[item.name].length;
    if (size - 1 === idx) {
      this.handleArrayItemAdd(item)();
    }
  };

  handleNameChange = name => {
    const {schemas, condition} = this.props;
    const data = {
      id: condition.id,
      name,
    };
    const currData = _.cloneDeep(this.state.data);
    Object.keys(schemas[name].properties || {}).forEach((key) => {
      const {type} = schemas[name].properties[key];
      if (Array.isArray(type)) {
        data[key] = getDefaultValueByType(type[0]);
        data[`${key}_dataType`] = type[0];
      }
      if (type === undefined) { //not
        if (currData.conditions) {
          data[key] = currData.conditions[0];
        } else {
          data[key] = currData;
        }
      }
      if (type === 'string') {
        data[key] = '';
      }
      if (type === 'array') {
        if (currData.conditions) {
          data[key] = currData.conditions;
        } else if (currData.condition) {
          data[key] = [currData.condition];
        } else {
          data[key] = [currData];
        }
      }
    });
    this.changeState({data});
  };

  renderProperty = (item) => {
    const {
      schemas,
      prefix,
      onChangeState,
    } = this.props;
    const {data} = this.state;
    if (Array.isArray(item.type)) {
      return (
        <span key={item.name}>
          <EntityProperty
            title="Type"
            name={`${prefix}[${item.name}_dataType]`}
            value={data[`${item.name}_dataType`]}
            options={item.type.map(label => ({label, value: label}))}
            onChange={this.handleTypeChange(item.name)}
            width={100}
          />
          {this.renderProperty({
            type: data[`${item.name}_dataType`],
            name: item.name,
          })}
        </span>
      );
    }
    if (item.type === 'string') {
      const value = data[item.name] || '';
      return (
        <EntityProperty
          key={item.name}
          title={item.name}
          name={`${prefix}[${item.name}]`}
          value={value}
          onBlur={this.handlePropertyValueChange(item.name)}
        />
      );
    }
    if (item.name === 'condition') return (
      <span key={item.name}>
        <div className="GatewayPolicyCondition__C">
          <GatewayPolicyCondition
            condition={data.condition}
            schemas={schemas}
            prefix={`${prefix}[condition]`}
            onChangeState={onChangeState}
          />
        </div>
      </span>
    );
    if (item.name === 'conditions') return (
      <span key={item.name}>
        <div className="GatewayPolicyCondition__button">
          <IconButton icon="iconPlus" onClick={this.handleAddCondition} />
        </div>
        <div className="GatewayPolicyCondition__C">
          {data.conditions.map((condition, idx) => (
            <div key={condition.id}>
              {data.conditions.length !== 1 && (
                <div className="GatewayPolicyCondition__button">
                  <IconButton icon="iconDelete" onClick={this.handleRemoveCondition(idx)} />
                </div>
              )}
              <GatewayPolicyCondition
                ref={r => this.policyConditionRef = r}
                condition={condition}
                schemas={schemas}
                prefix={`${prefix}[conditions][${idx}]`}
                onChangeState={onChangeState}
              />
            </div>
          ))}
        </div>
      </span>
    );
    if (item.type === 'array') {
      const columns = [
        _.upperFirst(item.name),
        <IconButton icon="iconPlus" onClick={this.handleArrayItemAdd(item)} />,
      ];
      const tableData = data[item.name].map((arrItem, idx) => [
        <Input
          key={arrItem.id}
          name={`${prefix}[${item.name}][${idx}]`}
          value={arrItem.value}
          underlineStyle={{bottom: 0}}
          fullWidth
          hideUnderline
          handleBlur={this.handleArrayItemUpdate(item, idx)}
          handleKeyDown={this.handleArrayItemTab(item, idx)}
        />,
        <IconButton icon="iconDelete" onClick={this.handleArrayItemRemove(item, idx)} />,
      ]);
      const widths = [undefined, 70];
      const paddings = [true, false];
      return (
        <div key={item.name} className="GatewayPolicyCondition__array">
          <Table
            columns={columns}
            data={tableData}
            widths={widths}
            paddings={paddings}
          />
        </div>
      );
    }
    return null;
  };

  render() {
    const {
      schemas,
      prefix,
    } = this.props;
    const options = Object.keys(schemas).map(label => ({label, value: label}));
    const {data} = this.state;
    const {id, name} = data;
    const schema = schemas[name];
    const properties = Object.keys(schema.properties || {}).map(name => ({name, ...schema.properties[name]}));
    return (
      <div className="GatewayPolicyCondition">
        <EntityProperty
          title="Name"
          name={`${prefix}[name]`}
          value={name}
          options={options}
          onChange={this.handleNameChange}
          hiddenInputs={[{name: `${prefix}[id]`, value: id}]}
          width={140}
        />
        {properties.map(item => this.renderProperty(item))}
      </div>
    );
  }
}
