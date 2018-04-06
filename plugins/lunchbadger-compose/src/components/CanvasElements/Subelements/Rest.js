import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import uuid from 'uuid';
import _ from 'lodash';
import predefinedRests, {predefinedOperation} from '../../../utils/predefinedRests';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  IconButton,
  Input,
  Checkbox,
  Table,
} from '../../../../../lunchbadger-ui/src';

const requestMethods = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'OPTIONS',
  'HEAD',
  'TRACE',
  'CONNECT',
];

const transformParameters = (template, kind) => {
  if (!template[kind]) {
    template[kind] = [];
    return;
  }
  if (!Array.isArray(template[kind])) {
    template[kind] = Object.keys(template[kind]).map(key => {
      const item = {
        key,
        value: template[kind][key],
        id: uuid.v4(),
      };
      if (kind === 'functions') {
        item.value = item.value.join(',');
      }
      return item;
    });
  }
};

const transformOperations = operations => _.merge([], operations)
  .map(operation => {
    const item = _.merge({...operation, id: operation.id || uuid.v4()});
    transformParameters(item.template, 'headers');
    transformParameters(item.template, 'query');
    transformParameters(item, 'functions');
    return item;
  });

const transformOptions = options => {
  if (!options) return options;
  const result = _.merge({}, options);
  if (result.headers && !Array.isArray(result.headers)) {
    result.headers = Object.keys(result.headers).map(key => ({
      id: uuid.v4(),
      key,
      value: result.headers[key],
    }));
  }
  return result;
};

export default class Rest extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    plain: PropTypes.bool,
    onStateChange: PropTypes.func,
  };

  static defaultProps = {
    plain: false,
    onStateChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.onPropsUpdate = (callback, props = this.props) => this.setState(this.initState(props), callback);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.props.entity) {
      this.onPropsUpdate(undefined, nextProps);
    }
  }

  initState = (props = this.props) => {
    const {predefined, operations, options} = props.entity;
    return {
      predefined,
      operations: transformOperations(operations),
      options: transformOptions(options),
    };
  };

  handlePredefinedChanged = predefined => this.changeState({
    predefined,
    operations: transformOperations(predefinedRests[predefined].operations),
    options: transformOptions(predefinedRests[predefined].options),
  });

  changeState = state => this.setState(state, this.props.onStateChange);

  handleAddOperation = () => {
    this.changeState({operations: transformOperations([
      ...this.state.operations,
      predefinedOperation,
    ])});
  };

  handleRemoveOperation = idx => () => {
    const operations = _.merge([], this.state.operations);
    operations.splice(idx, 1);
    this.changeState({operations});
  };

  handleAddParameter = (kind, operationIdx) => () => {
    const operations = transformOperations(this.state.operations);
    operations[operationIdx].template[kind].push({
      id: uuid.v4(),
      key: '',
      value: '',
    });
    this.changeState({operations});
    setTimeout(() => {
      const idx = operations[operationIdx].template[kind].length - 1;
      const input = document.getElementById(`operations[${operationIdx}][template][${kind}][${idx}][key]`);
      input && input.focus();
    });
  };

  checkParameterTabButton = (kind, operationIdx) => (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
      this.handleAddParameter(kind, operationIdx)();
    }
  };

  handleRemoveParameter = (kind, operationIdx, idx) => () => {
    const operations = transformOperations(this.state.operations);
    operations[operationIdx].template[kind].splice(idx, 1);
    this.changeState({operations});
  };

  handleUpdateParameter = (kind, operationIdx, idx, param) => ({target: {value}}) => {
    const operations = transformOperations(this.state.operations);
    operations[operationIdx].template[kind][idx][param] = value;
    this.changeState({operations});
  };

  handleAddFunction = (operationIdx) => () => {
    const operations = transformOperations(this.state.operations);
    operations[operationIdx].functions.push({
      id: uuid.v4(),
      key: '',
      value: '',
    });
    this.changeState({operations});
    setTimeout(() => {
      const idx = operations[operationIdx].functions.length - 1;
      const input = document.getElementById(`operations[${operationIdx}][functions][${idx}][key]`);
      input && input.focus();
    });
  };

  checkFunctionsTabButton = operationIdx => (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
      this.handleAddFunction(operationIdx)();
    }
  }

  handleRemoveFunction = (operationIdx, functionIdx) => () => {
    const operations = transformOperations(this.state.operations);
    operations[operationIdx].functions.splice(functionIdx, 1);
    this.changeState({operations});
  };

  handleAddOptionsHeadersParameter = () => {
    const options = transformOptions(this.state.options);
    options.headers.push({
      id: uuid.v4(),
      key: '',
      value: '',
    });
    this.changeState({options});
    setTimeout(() => {
      const idx = options.headers.length - 1;
      const input = document.getElementById(`options[headers][params][${idx}][key]`);
      input && input.focus();
    });
  };

  checkOptionHeadersParameterTabButton = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
      this.handleAddOptionsHeadersParameter();
    }
  }

  handleUpdateOptionsHeadersParameter = (idx, param) => ({target: {value}}) => {
    const options = transformOptions(this.state.options);
    options.headers[idx][param] = value;
    this.changeState({options});
  };

  handleRemoveOptionsHeadersParameter = idx => () => {
    const options = transformOptions(this.state.options);
    options.headers.splice(idx, 1);
    this.changeState({options});
  };

  handleToggleOptions = ({target: {checked}}) => {
    let options;
    if (checked) {
      options = {
        strictSSL: false,
        useQuerystring: false,
      };
    } else {
      options = undefined;
    }
    this.changeState({options});
  }

  handleToggleTemplateOptions = operationIdx => ({target: {checked}}) => {
    const operations = transformOperations(this.state.operations);
    if (checked) {
      operations[operationIdx].template.options = {
        strictSSL: false,
        useQuerystring: false,
      };
    } else {
      delete operations[operationIdx].template.options;
    }
    this.changeState({operations});
  };

  handleToggleOptionsHeaders = ({target: {checked}}) => {
    const options = transformOptions(this.state.options);
    if (checked) {
      options.headers = [];
    } else {
      delete options.headers;
    }
    this.changeState({options});
  };

  handleUpdateFunctionParameter = (operationIdx, functionIdx, param) => ({target: {value}}) => {
    const operations = transformOperations(this.state.operations);
    operations[operationIdx].functions[functionIdx][param] = value;
    this.changeState({operations});
  }

  renderOptionHeaders = (headers) => {
    return (
      <div>
        <Checkbox
          label="Enabled"
          name="options[headers][enabled]"
          value={!!headers}
          handleChange={this.handleToggleOptionsHeaders}
        />
        {!!headers && this.renderOptionHeadersParameters(headers)}
      </div>
    );
  };

  renderOptionHeadersParameters = (headers) => {
    const columns = [
      'Parameter name',
      'Parameter value',
      <IconButton
        icon="iconPlus"
        name="add__optionsHeadersParameter"
        onClick={this.handleAddOptionsHeadersParameter}
      />,
    ];
    const widths = [300, undefined, 70];
    const paddings = [true, true, false];
    const centers = [false, false, false];
    const paramsSize = headers.length - 1;
    const data = headers.map(({key, value}, idx) => ([
      <Input
        name={`options[headers][params][${idx}][key]`}
        value={key}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleUpdateOptionsHeadersParameter(idx, 'key')}
      />,
      <Input
        name={`options[headers][params][${idx}][value]`}
        value={value}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleUpdateOptionsHeadersParameter(idx, 'value')}
        handleKeyDown={idx === paramsSize ? this.checkOptionHeadersParameterTabButton : undefined}
      />,
      <IconButton
        icon="iconDelete"
        name={`remove__optionsHeadersParameter${idx}`}
        onClick={this.handleRemoveOptionsHeadersParameter(idx)}
      />,
    ]));
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
    />;
  };

  renderOptions = () => {
    const {options} = this.state;
    return (
      <div className="Rest__options">
        <span>
          <Checkbox
            label="Enabled"
            name="options[enabled]"
            value={!!options}
            handleChange={this.handleToggleOptions}
          />
        </span>
        {!!options && (
          <span>
            <Checkbox
              label="Strict SSL"
              name="options[strictSSL]"
              value={options.strictSSL || false}
            />
          </span>
        )}
        {!!options && (
          <span>
            <Checkbox
              label="Use Querystring"
              name="options[useQuerystring]"
              value={options.useQuerystring || false}
            />
          </span>
        )}
        {!!options && (
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Headers</EntityPropertyLabel>}
            collapsible={this.renderOptionHeaders(options.headers)}
            defaultOpened
            barToggable
          />
        )}
      </div>
    );
  };

  renderParameters = (kind, params, operationIdx) => {
    const columns = [
      'Parameter name',
      'Parameter value',
      <IconButton
        icon="iconPlus"
        name={`add__operation${operationIdx}${kind}Parameter`}
        onClick={this.handleAddParameter(kind, operationIdx)}
      />,
    ];
    const widths = [300, undefined, 70];
    const paddings = [true, true, false];
    const centers = [false, false, false];
    const paramsSize = params.length - 1;
    const data = params.map(({key, value}, idx) => ([
      <Input
        name={`operations[${operationIdx}][template][${kind}][${idx}][key]`}
        value={key}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleUpdateParameter(kind, operationIdx, idx, 'key')}
      />,
      <Input
        name={`operations[${operationIdx}][template][${kind}][${idx}][value]`}
        value={value}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleUpdateParameter(kind, operationIdx, idx, 'value')}
        handleKeyDown={idx === paramsSize ? this.checkParameterTabButton(kind, operationIdx) : undefined}
      />,
      <IconButton
        icon="iconDelete"
        name={`remove__operation${operationIdx}${kind}Parameter${idx}`}
        onClick={this.handleRemoveParameter(kind, operationIdx, idx)}
      />,
    ]));
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
    />;
  };

  renderFunctions = (functions, operationIdx) => {
    const columns = [
      'Function name',
      'Function parameters (comma separated)',
      <IconButton
        icon="iconPlus"
        name={`add__operation${operationIdx}function`}
        onClick={this.handleAddFunction(operationIdx)}
      />,
    ];
    const widths = [300, undefined, 70];
    const paddings = [true, true, false];
    const centers = [false, false, false];
    const paramsSize = functions.length - 1;
    const data = functions.map(({key, value}, idx) => ([
      <Input
        name={`operations[${operationIdx}][functions][${idx}][key]`}
        value={key}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleUpdateFunctionParameter(operationIdx, idx, 'key')}
      />,
      <Input
        name={`operations[${operationIdx}][functions][${idx}][value]`}
        value={value}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleUpdateFunctionParameter(operationIdx, idx, 'value')}
        handleKeyDown={idx === paramsSize ? this.checkFunctionsTabButton(operationIdx) : undefined}
      />,
      <IconButton
        icon="iconDelete"
        name={`remove__operation${operationIdx}function${idx}`}
        onClick={this.handleRemoveFunction(operationIdx, idx)}
      />,
    ]));
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
    />;
  };

  renderTemplateOptions = (options, operationIdx) => {
    return (
      <div className="Rest__options">
        <span>
          <Checkbox
            label="Enabled"
            name={`operations[${operationIdx}][template][options][enabled]`}
            value={!!options}
            handleChange={this.handleToggleTemplateOptions(operationIdx)}
          />
        </span>
        {!!options && (
          <span>
            <Checkbox
              label="Strict SSL"
              name={`operations[${operationIdx}][template][options][strictSSL]`}
              value={options.strictSSL}
            />
          </span>
        )}
        {!!options && (
          <span>
            <Checkbox
              label="Use Querystring"
              name={`operations[${operationIdx}][template][options][useQuerystring]`}
              value={options.useQuerystring}
            />
          </span>
        )}
      </div>
    );
  }

  renderOperation = (operation, idx) => {
    const {plain} = this.props;
    const methodOptions = requestMethods.map(label => ({label, value: label}));
    let widthMethod;
    let widthTemplate;
    if (!plain) {
      widthMethod = 145;
      widthTemplate = 300;
    }
    return (
      <div className="Rest__operations__collapsible__operation">
        <span className="Rest__method">
          <EntityProperty
            name={`operations[${idx}][template][method]`}
            title="Method"
            value={operation.template.method}
            options={methodOptions}
            width={widthMethod}
          />
        </span>
        <span className="Rest__url">
          <EntityProperty
            name={`operations[${idx}][template][url]`}
            title="URL"
            value={operation.template.url}
            width={widthTemplate}
          />
        </span>
        <span className="Rest__plain">
          <EntityProperty
            name={`operations[${idx}][template][responsePath]`}
            title="Response Path"
            value={operation.template.responsePath}
            width={widthTemplate}
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Options</EntityPropertyLabel>}
            collapsible={this.renderTemplateOptions(operation.template.options, idx)}
            defaultOpened
            barToggable
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Headers</EntityPropertyLabel>}
            collapsible={this.renderParameters('headers', operation.template.headers, idx)}
            defaultOpened
            barToggable
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Query</EntityPropertyLabel>}
            collapsible={this.renderParameters('query', operation.template.query, idx)}
            defaultOpened
            barToggable
          />
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Functions</EntityPropertyLabel>}
            collapsible={this.renderFunctions(operation.functions, idx)}
            defaultOpened
            barToggable
          />
        </span>
      </div>
    );
  };

  render() {
    const {plain} = this.props;
    const {predefined, operations} = this.state;
    const predefinedOptions = Object.keys(predefinedRests).map(value => ({label: predefinedRests[value].label, value}));
    const operationsCollapsible = (
      <div>
        {operations.map((operation, idx) => (
          <div className="Rest__operations__collapsible" key={operation.id}>
            <CollapsibleProperties
              bar={<EntityPropertyLabel plain>Operation {idx + 1}</EntityPropertyLabel>}
              collapsible={this.renderOperation(operation, idx)}
              button={idx === 0
                ? null
                : <IconButton
                    icon="iconDelete"
                    name={`remove__operation${idx}`}
                    onClick={this.handleRemoveOperation(idx)}
                  />
              }
              defaultOpened
              barToggable
              buttonOnHover
            />
          </div>
        ))}
      </div>
    );
    let widthPredefined;
    if (!plain) {
      widthPredefined = 300;
    }
    return (
      <div className={cs('Rest', {plain, notPlain: !plain})}>
        <div className="Rest__predefined">
          <EntityProperty
            name="predefined"
            title="Predefined properties"
            value={predefined}
            options={predefinedOptions}
            onChange={this.handlePredefinedChanged}
            width={widthPredefined}
          />
        </div>
        <div className="Rest__plain">
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Options</EntityPropertyLabel>}
            collapsible={this.renderOptions()}
            defaultOpened
            barToggable
          />
        </div>
        <div className="Rest__operations">
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Operations</EntityPropertyLabel>}
            collapsible={operationsCollapsible}
            button={<IconButton icon="iconPlus" name="add__operation" onClick={this.handleAddOperation} />}
            defaultOpened
            barToggable={!plain}
            untoggable={plain}
            noDividers={plain}
          />
        </div>
      </div>
    );
  }
}
