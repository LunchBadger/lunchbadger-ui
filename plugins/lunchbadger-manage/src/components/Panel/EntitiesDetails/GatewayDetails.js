import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Pipeline from '../../../models/Pipeline';
import Policy from '../../../models/Policy';
import initialPipelinePolicies from '../../../utils/initialPipelinePolicies';
import HttpsTlsDomain from '../../../models/HttpsTlsDomain';
import ConditionAction from '../../../models/ConditionAction';
import Parameter from '../../../models/Parameter';
import GATEWAY_POLICIES from '../../../utils/gatewayPolicies';
import GatewayPolicyCAPair from './Subelements/GatewayPolicyCAPair';
import GatewayPolicyCondition from './Subelements/GatewayPolicyCondition';
import GatewayPolicyAction from './Subelements/GatewayPolicyAction';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Checkbox,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';
import './GatewayDetails.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const {Connections} = LunchBadgerCore.stores;

class GatewayDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = this.stateFromStores(props);
    this.policyCARefs = {};
  }

  componentWillMount() {
    const {condition, policy} = this.context.store.getState().entities.gatewaySchemas;
    this.conditionSchemas = condition;
    this.policiesSchemas = policy;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  stateFromStores = props => ({
    changed: false,
    pipelines: _.cloneDeep(props.entity.pipelines),
    http: _.cloneDeep(props.entity.http),
    https: _.cloneDeep(props.entity.https),
    admin: _.cloneDeep(props.entity.admin),
  });

  onPropsUpdate = (props = this.props, callback) => this.setState(this.stateFromStores(props), callback);

  discardChanges = (callback) => {
    Object.keys(this.policyCARefs).forEach(key => this.policyCARefs[key] && this.policyCARefs[key].discardChanges());
    this.onPropsUpdate(this.props, callback);
  };

  processModel = model => {
    const {entity} = this.props;
    const {paper: paperRef} = this.context;
    const paper = paperRef.getInstance();
    (model.pipelines || []).forEach(({id, policies}) => {
      // remove connections for pipelines having no proxy policy
      if (!(policies || []).find(({name}) => name === GATEWAY_POLICIES.PROXY)) {
        const connectionsTo = Connections.search({toId: id});
        const connectionsFrom = Connections.search({fromId: id});
        [...connectionsTo, ...connectionsFrom].map(conn => paper.detach(conn.info.connection));
      }
      (policies || []).forEach((policy) => {
        if (policy.name === GATEWAY_POLICIES.PROXY) {
          // removing old serviceEndpoints connections
          Connections.search({toId: id}).forEach((conn) => {
            paper.detach(conn.info.connection);
          });
          // restoring current serviceEndpoints connections
          (policy.pairs || []).forEach(({action: {serviceEndpoint}}) => {
            paper.connect({
              source: document.getElementById(`port_out_${serviceEndpoint}`).querySelector('.port__anchor'),
              target: document.getElementById(`port_in_${id}`).querySelector('.port__anchor'),
              parameters: {
                forceDropped: true,
              }
            }, {
              fireEvent: true,
            });
          });
        }
      });
    });
    return entity.processModel(model);
  };

  changeState = (obj, cb) => this.setState({...obj, changed: true}, () => {
    this.props.parent.checkPristine();
    cb && cb();
  });

  addPipeline = () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines.push(Pipeline.create({name: 'Pipeline', policies: initialPipelinePolicies}));
    this.changeState({pipelines});
    setTimeout(() => {
      const idx = pipelines.length - 1;
      const input = document.getElementById(`pipelines[${idx}][name]`);
      input && input.focus();
    });
  };

  removePipeline = idx => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines.splice(idx, 1);
    this.changeState({pipelines});
  };

  reorderPipeline = (idx, step) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    const tmp = pipelines[idx + step];
    pipelines[idx + step] = pipelines[idx];
    pipelines[idx] = tmp;
    this.changeState({pipelines});
  };

  addPipelinePolicy = pipelineIdx => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    const defaultPolicy = Object.keys(this.policiesSchemas)[0];
    pipelines[pipelineIdx].addPolicy(Policy.create({[defaultPolicy]: []}));
    this.changeState({pipelines});
    setTimeout(() => {
      const policyIdx = pipelines[pipelineIdx].policies.length - 1;
      const input = document.querySelector(`.select__pipelines${pipelineIdx}policies${policyIdx}name button`);
      input && input.focus();
    });
  };

  removePipelinePolicy = (pipelineIdx, idx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies.splice(idx, 1);
    this.changeState({pipelines});
  };

  reorderPipelinePolicy = (pipelineIdx, idx, step) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    const tmp = pipelines[pipelineIdx].policies[idx + step];
    pipelines[pipelineIdx].policies[idx + step] = pipelines[pipelineIdx].policies[idx];
    pipelines[pipelineIdx].policies[idx] = tmp;
    this.changeState({pipelines});
  };

  handlePolicyChange = (pipelineIdx, policyIdx) => (policyName) => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies[policyIdx].name = policyName;
    pipelines[pipelineIdx].policies[policyIdx].conditionAction = [];
    this.changeState({pipelines});
  };

  addCAPair = (pipelineIdx, policyIdx, policyName) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    const pair = {
      condition: {
        name: 'always',
      },
      action: {},
    };
    pipelines[pipelineIdx].policies[policyIdx].addConditionAction(ConditionAction.create(pair));
    this.changeState({pipelines});
  };

  removeCAPair = (pipelineIdx, policyIdx, idx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies[policyIdx].conditionAction.splice(idx, 1);
    this.changeState({pipelines});
  };

  reorderCAPair = (pipelineIdx, policyIdx, idx, step) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    const tmp = pipelines[pipelineIdx].policies[policyIdx].conditionAction[idx + step];
    pipelines[pipelineIdx].policies[policyIdx].conditionAction[idx + step] = pipelines[pipelineIdx].policies[policyIdx].conditionAction[idx];
    pipelines[pipelineIdx].policies[policyIdx].conditionAction[idx] = tmp;
    this.changeState({pipelines});
  };

  addParameter = (kind, pipelineIdx, policyIdx, pairIdx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx]
      .policies[policyIdx]
      .conditionAction[pairIdx]
      [kind]
      .addParameter(Parameter.create({name: '', value: '', type: 'string'}));
    this.changeState({pipelines});
  };

  removeParameter = (kind, pipelineIdx, policyIdx, pairIdx, idx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx]
      .policies[policyIdx]
      .conditionAction[pairIdx]
      [kind]
      .parameters
      .splice(idx, 1);
    this.changeState({pipelines});
  };

  handleParametersTab = (kind, pipelineIdx, policyIdx, pairIdx, idx) => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const size = this.state.pipelines[pipelineIdx]
      .policies[policyIdx]
      .conditionAction[pairIdx]
      [kind]
      .parameters.length;
    if (size - 1 === idx) {
      this.addParameter(kind, pipelineIdx, policyIdx, pairIdx)();
    }
  };

  renderParameters = (pipelineIdx, policyIdx, pairIdx, pair, kind) => {
    const columns = [
      'Parameter Name',
      'Parameter Value',
      <IconButton
        icon="iconPlus"
        name={`add__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}${kind}parameter`}
        onClick={this.addParameter(kind, pipelineIdx, policyIdx, pairIdx)}
      />,
    ];
    const widths = [350, undefined, 70];
    const paddings = [true, true, false];
    const data = pair[kind].parameters.map((item, idx) => [
      <Input
        name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][${kind}][${idx}][name]`}
        value={item.name}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
      />,
      <Input
        name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][${kind}][${idx}][value]`}
        value={item.value}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleKeyDown={this.handleParametersTab(kind, pipelineIdx, policyIdx, pairIdx, idx)}
      />,
      <IconButton
        icon="iconDelete"
        name={`remove__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}${kind}parameter${idx}`}
        onClick={this.removeParameter(kind, pipelineIdx, policyIdx, pairIdx, idx)}
      />,
    ]);
    const table = <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
    />;
    return table;
  };

  renderPolicyCondition = (pair, pipelineIdx, policyIdx, pairIdx) => horizontal => (
    <GatewayPolicyCondition
      ref={r => this.policyCARefs[`${pairIdx}_condition`] = r}
      condition={pair.condition}
      schemas={this.conditionSchemas}
      prefix={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][condition]`}
      onChangeState={this.changeState}
      root
      horizontal={horizontal}
    />
  );

  renderPolicyAction = (pair, pipelineIdx, policyIdx, pairIdx, policyName) => horizontal => (
    <GatewayPolicyAction
      ref={r => this.policyCARefs[`${pairIdx}_action`] = r}
      action={pair.action}
      schemas={this.policiesSchemas[policyName]}
      prefix={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][action]`}
      onChangeState={this.changeState}
      horizontal={horizontal}
    />
  );

  renderPolicy = (policy, pipelineIdx, policyIdx) => {
    let button = <IconButton
      icon="iconPlus"
      name={`add__pipeline${pipelineIdx}policy${policyIdx}CAPair`}
      onClick={this.addCAPair(pipelineIdx, policyIdx, policy.name)}
    />;
    if (policy.name === GATEWAY_POLICIES.PROXY) {
      const state = this.context.store.getState();
      const {serviceEndpointEntities} = state.plugins.quadrants[1];
      const {entities} = state;
      const endpointsAmount = serviceEndpointEntities.reduce((amount, type) => amount += Object.keys(entities[type]).length, 0);
      if (endpointsAmount === 0) {
        button = null;
      }
    }
    return (
      <div className="GatewayDetails__CA">
        <div className="GatewayDetails__CA__header">
          {button}
          <EntityPropertyLabel>Condition / action pairs</EntityPropertyLabel>
        </div>
        {policy.conditionAction.map((pair, idx) => (
          <GatewayPolicyCAPair
            key={pair.id}
            nr={idx + 1}
            renderCondition={this.renderPolicyCondition(pair, pipelineIdx, policyIdx, idx)}
            renderAction={this.renderPolicyAction(pair, pipelineIdx, policyIdx, idx, policy.name)}
            onRemove={this.removeCAPair(pipelineIdx, policyIdx, idx)}
            onMoveDown={this.reorderCAPair(pipelineIdx, policyIdx, idx, 1)}
            onMoveUp={this.reorderCAPair(pipelineIdx, policyIdx, idx, -1)}
            moveDownDisabled={idx === policy.conditionAction.length - 1}
            moveUpDisabled={idx === 0}
            prefix={`pipelines${pipelineIdx}policies${policyIdx}pairs${idx}`}
          />
        ))}
      </div>
    );
  };

  getPolicyInputOptions = () => Object.keys(this.context.store.getState().entities.gatewaySchemas.policy)
    .map(label => ({label, value: label}));

  renderPolicyInput = (pipelineIdx, policyIdx, policy) => {
    const options = this.getPolicyInputOptions();
    return (
      <EntityProperty
        name={`pipelines[${pipelineIdx}][policies][${policyIdx}][name]`}
        value={policy.name || options[0].value}
        options={options}
        hiddenInputs={[{name: `pipelines[${pipelineIdx}][policies][${policyIdx}][id]`, value: policy.id}]}
        onChange={this.handlePolicyChange(pipelineIdx, policyIdx)}
      />
    );
  };

  renderPipeline = (pipeline, pipelineIdx) => {
    const collapsible = pipeline.policies.map((policy, idx) => (
      <CollapsibleProperties
        key={policy.id}
        bar={this.renderPolicyInput(pipelineIdx, idx, policy)}
        collapsible={this.renderPolicy(policy, pipelineIdx, idx)}
        button={(
          <span>
            <IconButton
              icon="iconDelete"
              name={`remove__pipelines${pipelineIdx}policies${idx}`}
              onClick={this.removePipelinePolicy(pipelineIdx, idx)}
            />
            <IconButton
              icon="iconArrowDown"
              name={`moveDown__pipelines${pipelineIdx}policies${idx}`}
              onClick={this.reorderPipelinePolicy(pipelineIdx, idx, 1)}
              disabled={idx === pipeline.policies.length - 1}
            />
            <IconButton
              icon="iconArrowUp"
              name={`moveUp__pipelines${pipelineIdx}policies${idx}`}
              onClick={this.reorderPipelinePolicy(pipelineIdx, idx, -1)}
              disabled={idx === 0}
            />
          </span>
        )}
        defaultOpened
        space="0"
      />
    ));
    return (
      <CollapsibleProperties
        bar={<EntityPropertyLabel>Policies</EntityPropertyLabel>}
        collapsible={collapsible}
        button={
          <IconButton
            icon="iconPlus"
            name={`add__pipelines${pipelineIdx}policy`}
            onClick={this.addPipelinePolicy(pipelineIdx)}
          />
        }
        defaultOpened
        untoggable
        space="15px 0 5px"
      />
    );
  };

  renderPipelineInput = (idx, pipeline) => (
    <EntityProperty
      name={`pipelines[${idx}][name]`}
      value={pipeline.name}
      placeholder="Enter pipeline name here"
      hiddenInputs={[{name: `pipelines[${idx}][id]`, value: pipeline.id}]}
    />
  );

  onHttpToggle = (event) => {
    const http = _.cloneDeep(this.state.http);
    http.enabled = event.currentTarget.checked;
    this.changeState({http});
  };

  onHttpsToggle = (event) => {
    const https = _.cloneDeep(this.state.https);
    https.enabled = event.currentTarget.checked;
    this.changeState({https});
  };

  addHttpsTlsDomain = () => {
    const https = _.cloneDeep(this.state.https);
    https.tls.push(HttpsTlsDomain.create({domain: '', key: '', cert: ''}));
    this.changeState({https});
    setTimeout(() => {
      const idx = https.tls.length - 1;
      const input = document.getElementById(`https[tls][${idx}][domain]`);
      input && input.focus();
    });
  };

  removeHttpsTlsDomain = idx => () => {
    const https = _.cloneDeep(this.state.https);
    https.tls.splice(idx, 1);
    this.changeState({https});
  };

  handleHttpsTlsTab = idx => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const size = this.state.https.tls.length;
    if (size - 1 === idx) {
      this.addHttpsTlsDomain();
    }
  };

  renderProtocolSection = () => {
    const {http, https} = this.state;
    const columns = [
      'Host Domain',
      'TLS Key',
      'TLS Certificate',
      <IconButton
        icon="iconPlus"
        name="add__gatewayHttpsTlsDomain"
        onClick={this.addHttpsTlsDomain}
      />,
    ];
    const widths = [250, 300, undefined, 70];
    const paddings = [true, true, true, false];
    const data = https.tls.map((item, idx) => [
      <Input
        name={`https[tls][${idx}][domain]`}
        value={item.domain}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
      />,
      <Input
        name={`https[tls][${idx}][key]`}
        value={item.key}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
      />,
      <Input
        name={`https[tls][${idx}][cert]`}
        value={item.cert}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleKeyDown={this.handleHttpsTlsTab(idx)}
      />,
      <IconButton
        icon="iconDelete"
        name={`remove__gatewayHttpsTlsDomain${idx}`}
        onClick={this.removeHttpsTlsDomain(idx)}
      />,
    ]);
    const table = <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
    />;
    const collapsible = (
      <div className="panel__details__enableable">
        <div>
          <div className="panel__details__checkbox">
            <Checkbox
              name="http[enabled]"
              label="HTTP"
              value={http.enabled}
              handleChange={this.onHttpToggle}
            />
          </div>
          <div className="panel__details__checkbox narrow">
            {http.enabled && (
              <EntityProperty
                title="Port"
                placeholder=" "
                name="http[port]"
                value={http.port}
              />
            )}
          </div>
        </div>
        <div>
          <div className="panel__details__checkbox">
            <Checkbox
              name="https[enabled]"
              label="HTTPS"
              value={https.enabled}
              handleChange={this.onHttpsToggle}
            />
          </div>
          <div className="panel__details__checkbox narrow">
            {https.enabled && (
              <EntityProperty
                title="Port"
                placeholder=" "
                name="https[port]"
                value={https.port}
              />
            )}
          </div>
          {https.enabled && table}
        </div>
      </div>
    );
    return (
      <div className="general" key="protocol">
        <CollapsibleProperties
          bar={<EntityPropertyLabel>Protocol</EntityPropertyLabel>}
          collapsible={collapsible}
          barToggable
          defaultOpened
        />
      </div>
    );
  };

  onAdminToggle = (event) => {
    const admin = _.cloneDeep(this.state.admin);
    admin.enabled = event.currentTarget.checked;
    this.changeState({admin});
  };

  renderAdminSection = () => {
    const {admin} = this.state;
    const collapsible = (
      <div className="panel__details__enableable">
        <div>
          <div className="panel__details__checkbox">
            <Checkbox
              name="admin[enabled]"
              label="Enabled"
              value={admin.enabled}
              handleChange={this.onAdminToggle}
            />
          </div>
          <div className="panel__details__checkbox">
            {admin.enabled && (
              <EntityProperty
                title="Hostname"
                placeholder=" "
                name="admin[hostname]"
                value={admin.hostname}
              />
            )}
          </div>
          <div className="panel__details__checkbox narrow">
            {admin.enabled && (
              <EntityProperty
                title="Port"
                placeholder=" "
                name="admin[port]"
                value={admin.port}
              />
            )}
          </div>
        </div>
      </div>
    );
    return (
      <div className="general" key="admin">
        <CollapsibleProperties
          bar={<EntityPropertyLabel>Admin</EntityPropertyLabel>}
          collapsible={collapsible}
          barToggable
          defaultOpened
        />
      </div>
    );
  };

  renderPipelinesSection = () => {
    const {pipelines} = this.state;
    const collapsible = pipelines.map((pipeline, idx) => (
      <CollapsibleProperties
        key={pipeline.id}
        bar={this.renderPipelineInput(idx, pipeline)}
        collapsible={this.renderPipeline(pipeline, idx)}
        button={(
          <span>
            <IconButton
              icon="iconDelete"
              name={`remove__pipeline${idx}`}
              onClick={this.removePipeline(idx)}
            />
            <IconButton
              icon="iconArrowDown"
              name={`moveDown__pipeline${idx}`}
              onClick={this.reorderPipeline(idx, 1)}
              disabled={idx === pipelines.length - 1}
            />
            <IconButton
              icon="iconArrowUp"
              name={`moveUp__pipeline${idx}`}
              onClick={this.reorderPipeline(idx, -1)}
              disabled={idx === 0}
            />
          </span>
        )}
        defaultOpened
        space="0"
        noDividers
      />
    ));
    return (
      <div className="pipelines" key="pipelines">
        <CollapsibleProperties
          bar={<EntityPropertyLabel>Pipelines</EntityPropertyLabel>}
          collapsible={collapsible}
          button={
            <IconButton
              icon="iconPlus"
              name="add__pipeline"
              onClick={this.addPipeline}
            />
          }
          barToggable
          defaultOpened
        />
      </div>
    );
  };

  render() {
    const sections = [
      {title: 'Protocol'},
      {title: 'Admin'},
      {title: 'Pipelines'},
    ];
    return (
      <div className="panel__details GatewayDetails">
        {sections.map(({title, render}) => this[`render${render || title}Section`]())}
      </div>
    );
  }

}

export default BaseDetails(GatewayDetails);
