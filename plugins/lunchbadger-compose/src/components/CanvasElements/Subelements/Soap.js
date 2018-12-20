import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';

const {
  UI: {
    EntityProperty,
    EntityProperties,
    EntityPropertyLabel,
    CollapsibleProperties,
    IconButton,
    Input,
    Checkbox,
    Table,
    DocsLink,
  },
} = LunchBadgerCore;

const sections = [
  {label: 'Properties', render: 'Properties', docs: 'DATASOURCE_SOAP_PROPERTIES'},
  {label: 'WSDL Options', render: 'WsdlOptions', docs: 'DATASOURCE_SOAP_WSDL_OPTIONS'},
  {label: 'Operations', render: 'Operations', docs: 'DATASOURCE_SOAP_OPERATIONS'},
  {label: 'Security', render: 'Security', docs: 'DATASOURCE_SOAP_SECURITY'},
  {label: 'SOAP Headers', render: 'SoapHeaders', docs: 'DATASOURCE_SOAP_SOAP_HEADERS'},
];
const widths = [200, 200, 200, undefined, 70];
const paddings = [true, true, true, true, false];
const centers = [false, false, false, false, false];
const optionsScheme = ['WS', 'BasicAuth', 'ClientSSL'].map(label => ({label, value: label}));
const optionsPasswordType = ['PasswordText', 'PasswordDigest'].map(label => ({label, value: label}));
const transformOperations = operations => Object.keys(operations).map(key => ({
  key,
  service: operations[key].service,
  port: operations[key].port,
  operation: operations[key].operation,
}));

const transformSoapHeaders = headers => headers.map(({element, prefix, namespace}) => {
  const item = {prefix, namespace};
  Object.keys(element).forEach((key) => {
    item.elementKey = key;
    item.elementValue = element[key];
  });
  return item;
});

export default class Soap extends PureComponent {
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
    const {entity} = props;
    const security = _.cloneDeep(entity.security);
    const soapOperations = _.cloneDeep(entity.soapOperations);
    const soapHeaders = _.cloneDeep(entity.soapHeaders);
    return {
      security,
      soapOperations: transformOperations(soapOperations),
      soapHeaders: transformSoapHeaders(soapHeaders),
    };
  };

  changeState = state => this.setState(state, this.props.onStateChange);

  handleSecuritySchemeChange = (scheme) => {
    if (this.state.security.scheme === scheme) return;
    const {username, password} = this.state.security;
    const security = {scheme};
    if (scheme === 'WS' || scheme === 'BasicAuth') {
      security.username = username || '';
      security.password = password || '';
    }
    if (scheme === 'WS') {
      security.passwordType = 'PasswordText';
    }
    if (scheme === 'ClientSSL') {
      security.keyPath = '';
      security.certPath = '';
    }
    this.changeState({security});
  };

  handleAddOperation = () => {
    const soapOperations = _.cloneDeep(this.state.soapOperations);
    soapOperations.push({
      key: '',
      service: '',
      port: '',
      operation: '',
    });
    this.changeState({soapOperations});
    setTimeout(() => {
      const idx = soapOperations.length - 1;
      const input = document.getElementById(`soapOperations[${idx}][key]`);
      input && input.focus();
    });
  };

  handleOperationUpdate = (idx, field) => ({target: {value}}) => {
    const soapOperations = _.cloneDeep(this.state.soapOperations);
    soapOperations[idx][field] = value;
    this.changeState({soapOperations});
  };

  handleOperationTab = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
      this.handleAddOperation();
    }
  };

  handleRemoveOperation = idx => () => {
    const soapOperations = _.cloneDeep(this.state.soapOperations);
    soapOperations.splice(idx, 1);
    this.changeState({soapOperations});
  };

  handleAddSoapHeader = () => {
    const soapHeaders = _.cloneDeep(this.state.soapHeaders);
    soapHeaders.push({
      elementKey: '',
      elementValue: '',
      prefix: '',
      namespace: '',
    });
    this.changeState({soapHeaders});
    setTimeout(() => {
      const idx = soapHeaders.length - 1;
      const input = document.getElementById(`soapHeaders[${idx}][elementKey]`);
      input && input.focus();
    });
  };

  handleSoapHeaderUpdate = (idx, field) => ({target: {value}}) => {
    const soapHeaders = _.cloneDeep(this.state.soapHeaders);
    soapHeaders[idx][field] = value;
    this.changeState({soapHeaders});
  };

  handleSoapHeaderTab = (event) => {
    if ((event.which === 9 || event.keyCode === 9) && !event.shiftKey) {
      this.handleAddSoapHeader();
    }
  };

  handleRemoveSoapHeader = idx => () => {
    const soapHeaders = _.cloneDeep(this.state.soapHeaders);
    soapHeaders.splice(idx, 1);
    this.changeState({soapHeaders});
  };

  renderProperties = () => {
    const {entity, plain} = this.props;
    const {url, wsdl, remotingEnabled} = entity;
    let widthUrl;
    if (!plain) {
      widthUrl = 420;
    }
    return (
      <div className="Soap__options">
        {!plain && (
          <span>
            <EntityProperty
              title="URL"
              name="url"
              value={url}
              width={widthUrl}
            />
          </span>
        )}
        <span>
          <EntityProperty
            title="WSDL"
            name="wsdl"
            value={wsdl}
            width={widthUrl}
          />
        </span>
        <span>
          <Checkbox
            label="Remoting Enabled"
            name="remotingEnabled"
            value={remotingEnabled || false}
          />
        </span>
      </div>
    );
  };

  renderWsdlOptionsInput = (label, name, value) => (
    <span>
      <Checkbox
        label={label}
        name={`wsdl_options[${name}]`}
        value={value || false}
      />
    </span>
  );

  renderWsdlOptions = () => {
    const {wsdl_options: {rejectUnauthorized, strictSSL, requestCert}} = this.props.entity;
    return (
      <div className="Soap__options">
        {this.renderWsdlOptionsInput('Reject Unauthorized', 'rejectUnauthorized', rejectUnauthorized)}
        {this.renderWsdlOptionsInput('Strict SSL', 'strictSSL', strictSSL)}
        {this.renderWsdlOptionsInput('Request Certificate', 'requestCert', requestCert)}
      </div>
    );
  };

  renderOperationsInput = (idx, name, value, handleKeyDown) => (
    <div className="TableInput">
      <Input
        name={`soapOperations[${idx}][${name}]`}
        value={value}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleBlur={this.handleOperationUpdate(idx, name)}
        handleKeyDown={handleKeyDown}
      />
    </div>
  );

  renderOperations = () => {
    const columns = [
      'Key',
      'Service',
      'Port',
      'Operation',
      <IconButton icon="iconPlus" name="add__operation" onClick={this.handleAddOperation} />,
    ];
    const {soapOperations} = this.state;
    const soapOperationsSize = soapOperations.length - 1;
    const data = soapOperations.map(({key, service, port, operation}, idx) => ([
      this.renderOperationsInput(idx, 'key', key),
      this.renderOperationsInput(idx, 'service', service),
      this.renderOperationsInput(idx, 'port', port),
      this.renderOperationsInput(idx, 'operation', operation, idx === soapOperationsSize ? this.handleOperationTab : undefined),
      <IconButton icon="iconDelete" name={`remove__operation${idx}`} onClick={this.handleRemoveOperation(idx)} />,
    ]));
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
      verticalAlign="top"
    />;
  };

  renderSecurity = () => {
    const {security} = this.state;
    const {scheme} = security;
    let properties = [{
      name: 'scheme',
      options: optionsScheme,
      onChange: this.handleSecuritySchemeChange,
      width: 150,
    }];
    if (scheme === 'WS' || scheme === 'BasicAuth') {
      properties.push({name: 'username', width: 200});
      properties.push({name: 'password', width: 200, password: true});
    }
    if (scheme === 'WS') {
      properties.push({name: 'passwordType', options: optionsPasswordType, width: 200});
    }
    if (scheme === 'ClientSSL') {
      properties.push({name: 'keyPath'});
      properties.push({name: 'certPath'});
    }
    properties = properties.map(item => ({
      ...item,
      title: _.startCase(item.name),
      name: `security[${item.name}]`,
      value: security[item.name],
      placeholder: ' ',
    }));
    return (
      <div>
        {properties.map(item => <EntityProperty key={item.name} {...item} />)}
      </div>
    );
  };

  renderSoapHeadersInput = (idx, name, value, handleKeyDown) => (
    <Input
      name={`soapHeaders[${idx}][${name}]`}
      value={value}
      underlineStyle={{bottom: 0}}
      fullWidth
      hideUnderline
      handleBlur={this.handleSoapHeaderUpdate(idx, name)}
      handleKeyDown={handleKeyDown}
    />
  );

  renderSoapHeaders = () => {
    const columns = [
      'Element Key',
      'Element Value',
      'Prefix',
      'Namespace',
      <IconButton icon="iconPlus" name="add__soapHeader" onClick={this.handleAddSoapHeader} />,
    ];
    const {soapHeaders} = this.state;
    const soapHeadersSize = soapHeaders.length - 1;
    const data = soapHeaders.map(({elementKey, elementValue, prefix, namespace}, idx) => ([
      this.renderSoapHeadersInput(idx, 'elementKey', elementKey),
      this.renderSoapHeadersInput(idx, 'elementValue', elementValue),
      this.renderSoapHeadersInput(idx, 'prefix', prefix),
      this.renderSoapHeadersInput(idx, 'namespace', namespace, idx === soapHeadersSize ? this.handleSoapHeaderTab : undefined),
      <IconButton icon="iconDelete" name={`remove__soapHeader${idx}`} onClick={this.handleRemoveSoapHeader(idx)} />,
    ]));
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      centers={centers}
    />;
  };

  render() {
    const {entity: {url, id}, plain} = this.props;
    const properties = [{title: 'Url', name: 'url', value: url}];
    return (
      <div className={cs('Soap', {plain, notPlain: !plain})}>
        {plain && <EntityProperties properties={properties} />}
        <div style={{display: plain ? 'none' : 'block'}}>
          {sections.map(({label, render, docs}) => (
            <CollapsibleProperties
              id={`${id}/${render}`}
              key={render}
              bar={
                <EntityPropertyLabel>
                  {label}
                  <DocsLink item={docs} />
                </EntityPropertyLabel>
              }
              collapsible={this[`render${render}`]()}
              defaultOpened
              barToggable
            />
          ))}
        </div>
      </div>
    );
  }
}
