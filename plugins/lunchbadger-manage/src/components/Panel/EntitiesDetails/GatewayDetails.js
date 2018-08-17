import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {arrayMove} from 'react-sortable-hoc';
import Pipeline from '../../../models/Pipeline';
import Policy from '../../../models/Policy';
import initialPipelinePolicies from '../../../utils/initialPipelinePolicies';
import HttpsTlsDomain from '../../../models/HttpsTlsDomain';
import ConditionAction from '../../../models/ConditionAction';
import Parameter from '../../../models/Parameter';
import GatewayPolicyCAPair from './Subelements/GatewayPolicyCAPair';
import GatewayPolicyCondition from './Subelements/GatewayPolicyCondition';
import GatewayPolicyAction from './Subelements/GatewayPolicyAction';
import CustomerManagement from './Subelements/CustomerManagement';
import {
  EntityProperty,
  EntityPropertyLabel,
  EntityProperties,
  CollapsibleProperties,
  Input,
  Checkbox,
  Table,
  IconButton,
  Sortable,
  scrollToElement,
  CopyOnHover,
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
    this.originalPipelines = _.cloneDeep(this.state.pipelines);
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
    this.updateGatewayPipelines(this.originalPipelines);
    Object.keys(this.policyCARefs).forEach(key => this.policyCARefs[key] && this.policyCARefs[key].discardChanges());
    this.onPropsUpdate(this.props, callback);
  };

  tabProcessed = model => {
    if (this.props.rect.tab === 'customerManagement') {
      const {isForm, processModel} = this.customerManagementRef;
      if (isForm()) {
        processModel(model);
        return true;
      }
    }
    return false;
  };

  processModel = model => this.props.entity.processModel(model);

  postProcessModel = model => {
    const {paper: paperRef} = this.context;
    const paper = paperRef.getInstance();
    (model.pipelines || []).forEach(({id, policies}) => {
      // remove connections for pipelines having no proxy policy
      if (!((policies || []).find(({name}) => name === 'proxy'))) {
        const connectionsTo = Connections.search({toId: id});
        connectionsTo.forEach((conn) => {
          conn.info.source.classList.add('discardAutoSave');
          paper.detach(conn.info.connection);
        });
      }
      (policies || []).forEach((policy) => {
        if (policy.name === 'proxy') {
          // removing old serviceEndpoints connections
          Connections.search({toId: id}).forEach((conn) => {
            conn.info.source.classList.add('discardAutoSave');
            paper.detach(conn.info.connection);
          });
          // restoring current serviceEndpoints connections
          (policy.pairs || []).forEach(({action: {serviceEndpoint}}) => {
            // FIXME: crashes, when new pipelines with proxy are defined
            if (serviceEndpoint) {
              const source = document.getElementById(`port_out_${serviceEndpoint}`).querySelector('.port__anchor');
              const target = document.getElementById(`port_in_${id}`).querySelector('.port__anchor');
              source.classList.add('discardAutoSave');
              paper.connect({
                source,
                target,
                parameters: {
                  forceDropped: true,
                }
              }, {
                fireEvent: true,
              });
            }
          });
        }
      });
    });
  };

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  changeState = (obj, cb) => this.setState({...obj, changed: true}, () => {
    this.props.parent.checkPristine();
    this.updateGatewayPipelines(this.state.pipelines);
    cb && cb();
  });

  updateGatewayPipelines = pipelines => window.dispatchEvent(
    new CustomEvent('updateGatewayPipelines', {detail: {
      gatewayId: this.props.entity.id,
      pipelines,
    }})
  );

  addPipeline = () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines.push(Pipeline.create({name: 'Pipeline', policies: initialPipelinePolicies}));
    this.changeState({pipelines});
    setTimeout(() => scrollToElement(document.getElementById(`pipelines[${pipelines.length - 1}][name]`)));
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
    const policyIdx = pipelines[pipelineIdx].policies.length - 1;
    this.changeState({pipelines});
    setTimeout(() => {
      scrollToElement(document.querySelector(`.select__pipelines${pipelineIdx}policies${policyIdx}name input`));
    });
  };

  removePipelinePolicy = (pipelineIdx, idx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies.splice(idx, 1);
    this.changeState({pipelines});
  };

  handlePolicyChange = (pipelineIdx, policyIdx) => ({target: {value}}) => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    const {name} = pipelines[pipelineIdx].policies[policyIdx];
    if (name !== value) {
      pipelines[pipelineIdx].policies[policyIdx].name = value;
      pipelines[pipelineIdx].policies[policyIdx].conditionAction = [];
      this.changeState({pipelines});
    }
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
    setTimeout(() => {
      const pairIdx = pipelines[pipelineIdx].policies[policyIdx].conditionAction.length - 1;
      scrollToElement(document.querySelector(`.pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}CAPair`));
    });
  };

  removeCAPair = (pipelineIdx, policyIdx, idx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies[policyIdx].conditionAction.splice(idx, 1);
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

  handleReorderPolicies = pipelineIdx => ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) return;
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies = arrayMove(pipelines[pipelineIdx].policies, oldIndex, newIndex);
    this.changeState({pipelines});
  };

  handleReorderCAPairs = (pipelineIdx, policyIdx) => ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) return;
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies[policyIdx].conditionAction =
      arrayMove(pipelines[pipelineIdx].policies[policyIdx].conditionAction, oldIndex, newIndex);
    this.changeState({pipelines});
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
      validations={this.props.validations}
    />
  );

  renderPolicy = (policy, pipelineIdx, policyIdx) => {
    let button = <IconButton
      icon="iconPlus"
      name={`add__pipeline${pipelineIdx}policy${policyIdx}CAPair`}
      onClick={this.addCAPair(pipelineIdx, policyIdx, policy.name)}
    />;
    if (policy.name === 'proxy') {
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
        <Sortable
          items={policy.conditionAction}
          renderItem={(pair, idx) => (
            <div key={pair.id}>
              <Input
                type="hidden"
                value={pair.id}
                name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${idx}][id]`}
              />
              <GatewayPolicyCAPair
                nr={idx + 1}
                renderCondition={this.renderPolicyCondition(pair, pipelineIdx, policyIdx, idx)}
                renderAction={this.renderPolicyAction(pair, pipelineIdx, policyIdx, idx, policy.name)}
                onRemove={this.removeCAPair(pipelineIdx, policyIdx, idx)}
                prefix={`pipelines${pipelineIdx}policies${policyIdx}pairs${idx}`}
              />
            </div>
          )}
          onSortEnd={this.handleReorderCAPairs(pipelineIdx, policyIdx)}
          inPanel
          handlerOffsetTop={10}
        />
        {policy.conditionAction.length === 0 && this.renderDefaultCAPair(pipelineIdx, policyIdx, policy.name)}
      </div>
    );
  };

  renderDefaultCAPair = (pipelineIdx, policyIdx, policyName) => {
    const pair = ConditionAction.create({
      condition: {
        name: 'always',
      },
      action: {},
    });
    const key = `fake-${pipelineIdx}-${policyIdx}-${policyName}`;
    return (
      <GatewayPolicyCAPair
        key={key}
        renderCondition={this.renderPolicyCondition(pair, pipelineIdx, policyIdx, key)}
        renderAction={this.renderPolicyAction(pair, pipelineIdx, policyIdx, key, policyName)}
        fake
      />
    );
  };

  getPolicyInputOptions = () => Object.keys(this.context.store.getState().entities.gatewaySchemas.policy)
    .map(label => ({label, value: label}));

  renderPolicyInput = (pipelineIdx, policyIdx, policy) => {
    const options = this.getPolicyInputOptions();
    return (
      <div className="GatewayDetails__bar">
        <EntityProperty
          name={`pipelines[${pipelineIdx}][policies][${policyIdx}][name]`}
          value={policy.name || options[0].value}
          options={options}
          hiddenInputs={[{name: `pipelines[${pipelineIdx}][policies][${policyIdx}][id]`, value: policy.id}]}
          onBlur={this.handlePolicyChange(pipelineIdx, policyIdx)}
          autocomplete
        />
      </div>
    );
  };

  renderPipeline = (pipeline, pipelineIdx) => {
    const collapsible = (
      <Sortable
        items={pipeline.policies}
        renderItem={(policy, idx) => (
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
              </span>
            )}
            defaultOpened
            space="0"
            buttonOnHover
            noDividers
          />
        )}
        onSortEnd={this.handleReorderPolicies(pipelineIdx)}
        inPanel
      />
    );
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
    <div className="GatewayDetails__bar">
      <EntityProperty
        name={`pipelines[${idx}][name]`}
        value={pipeline.name}
        placeholder="Enter pipeline name here"
        hiddenInputs={[{name: `pipelines[${idx}][id]`, value: pipeline.id}]}
      />
      <div className="GatewayDetails__id">
        ID:
        <CopyOnHover copy={pipeline.id}>
          {pipeline.id}
        </CopyOnHover>
      </div>
    </div>
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

  renderAccessSection = () => {
    const {rootUrl} = this.props.entity;
    const accessProperties = [
      {
        name: 'accessUrl',
        title: 'Gateway root URL',
        value: rootUrl,
        fake: true,
        link: true,
      },
    ];
    return (
      <div className="general access" key="access">
        <EntityProperties properties={accessProperties} />
      </div>
    );
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
          <div className="panel__details__checkbox hideable narrow">
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
          <div className="panel__details__checkbox hideable narrow">
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

  handleCredentialsEntryChange = enabled => this.props.parent.setOkEnabled(enabled);

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
          <div className="panel__details__checkbox hideable">
            {admin.enabled && (
              <EntityProperty
                title="Hostname"
                placeholder=" "
                name="admin[hostname]"
                value={admin.hostname}
              />
            )}
          </div>
          <div className="panel__details__checkbox hideable narrow">
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
        buttonOnHover
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

  renderCustomerManagementSection = () => {
    const {adminApi} = this.props.entity;
    return (
      <div className="customerManagement" key="customerManagement">
        <CustomerManagement
          ref={r => this.customerManagementRef = r}
          api={adminApi}
          onEntryChange={this.handleCredentialsEntryChange}
        />
      </div>
    );
  };

  render() {
    const sections = [
      {title: 'Access'},
      {title: 'Protocol'},
      {title: 'Admin'},
      {title: 'Pipelines'},
      {title: 'CustomerManagement'}
    ];
    return (
      <div className="panel__details GatewayDetails">
        {sections.map(({title, render}) => this[`render${render || title}Section`]())}
      </div>
    );
  }

}

export default BaseDetails(GatewayDetails);
