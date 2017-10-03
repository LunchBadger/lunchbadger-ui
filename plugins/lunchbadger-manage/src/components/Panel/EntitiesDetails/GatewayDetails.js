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
import PolicyProxyActionPair from './PolicyProxyActionPair';

import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Checkbox,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';

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
    this.state = {...this.stateFromStores(props)};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.onStoreUpdate(nextProps);
    }
  }

  stateFromStores = props => ({
    changed: false,
    pipelines: props.entity.pipelines.slice(),
    http: _.cloneDeep(props.entity.http),
    https: _.cloneDeep(props.entity.https),
    admin: _.cloneDeep(props.entity.admin),
  });

  onStoreUpdate = (props = this.props, callback) => this.setState({...this.stateFromStores(props)}, callback);

  discardChanges = callback => this.onStoreUpdate(this.props, callback);

  processModel = model => {
    const {entity} = this.props;
    const {paper: paperRef} = this.context;
    const paper = paperRef.getInstance();
    (model.pipelines || []).forEach(({id, policies}) => {
      // remove connections for pipelines having no proxy policy
      if (!policies.find(({name}) => name === GATEWAY_POLICIES.PROXY)) {
        const connectionsTo = Connections.search({toId: id});
        const connectionsFrom = Connections.search({fromId: id});
        [...connectionsTo, ...connectionsFrom].map(conn => paper.detach(conn.info.connection));
      }
      policies.forEach((policy) => {
        if (policy.name === GATEWAY_POLICIES.PROXY) {
          // removing old serviceEndpoints connections
          Connections.search({toId: id}).forEach((conn) => {
            paper.detach(conn.info.connection);
          });
          // restoring current serviceEndpoints connections
          (policy.pairs || []).forEach((pair) => {
            const serviceEndpointId = pair.action.find(p => p.name === 'serviceEndpoint').value;
            paper.connect({
              source: document.getElementById(`port_out_${serviceEndpointId}`).querySelector('.port__anchor'),
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

  changeState = obj => this.setState({...obj, changed: true}, () => {
    this.props.parent.checkPristine();
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

  addPipelinePolicy = pipelineIdx => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].addPolicy(Policy.create({'': []}));
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
  }

  addCAPair = (pipelineIdx, policyIdx, policyName) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies[policyIdx].addConditionAction(ConditionAction.create({}));
    const pairIdx = pipelines[pipelineIdx].policies[policyIdx].conditionAction.length - 1;
    pipelines[pipelineIdx]
      .policies[policyIdx]
      .conditionAction[pairIdx]
      .action.addParameter(Parameter.create({name: '', value: ''}));
    this.changeState({pipelines})
    setTimeout(() => {
      const input = policyName === GATEWAY_POLICIES.PROXY
        ? document.querySelector(`.select__pipelines${pipelineIdx}policies${policyIdx}pairs${pairIdx}action0value button`)
        : document.getElementById(`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][action][0][name]`);
      input && input.focus();
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
      .addParameter(Parameter.create({name: '', value: ''}));
    this.changeState({pipelines});
    setTimeout(() => {
      const idx = pipelines[pipelineIdx]
        .policies[policyIdx]
        .conditionAction[pairIdx]
        [kind]
        .parameters.length - 1;
      const input = document.getElementById(`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][${kind}][${idx}][name]`);
      input && input.focus();
    });
  };

  removeParameter = (kind, pipelineIdx, policyIdx, pairIdx, idx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx]
      .policies[policyIdx]
      .conditionAction[pairIdx]
      [kind]
      .parameters
      .splice(idx, 1)
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
      <IconButton icon="iconPlus" onClick={this.addParameter(kind, pipelineIdx, policyIdx, pairIdx)} />,
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
      <IconButton icon="iconDelete" onClick={this.removeParameter(kind, pipelineIdx, policyIdx, pairIdx, idx)} />,
    ]);
    const table = <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
    />;
    return (
      <CollapsibleProperties
        bar={<EntityPropertyLabel>{kind}</EntityPropertyLabel>}
        collapsible={table}
        defaultOpened
        untoggable
        space={`${kind === 'action' ? 2 : 1}0px 0 0`}
      />
    );
  };

  renderCAPair = (pair, pipelineIdx, policyIdx, pairIdx, policyName) => {
    const actionParameters = policyName === GATEWAY_POLICIES.PROXY
      ? <PolicyProxyActionPair
          pair={pair}
          namePrefix={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}]`}
        />
      : this.renderParameters(pipelineIdx, policyIdx, pairIdx, pair, 'action');
    return (
      <div>
        <Input
          type="hidden"
          name={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][id]`}
          value={pair.id}
        />
        {this.renderParameters(pipelineIdx, policyIdx, pairIdx, pair, 'condition')}
        {actionParameters}
      </div>
    );
  };

  renderPolicy = (policy, pipelineIdx, policyIdx) => {
    const collapsible = policy.conditionAction.map((pair, idx) => (
      <CollapsibleProperties
        key={pair.id}
        bar={<EntityPropertyLabel plain>C/A Pair {idx + 1}</EntityPropertyLabel>}
        collapsible={this.renderCAPair(pair, pipelineIdx, policyIdx, idx, policy.name)}
        button={<IconButton icon="iconDelete" onClick={this.removeCAPair(pipelineIdx, policyIdx, idx)} />}
        barToggable
        defaultOpened
        space="10px 0"
      />
    ));
    return (
      <CollapsibleProperties
        bar={<EntityPropertyLabel>Condition / action pairs</EntityPropertyLabel>}
        collapsible={collapsible}
        button={<IconButton icon="iconPlus" onClick={this.addCAPair(pipelineIdx, policyIdx, policy.name)} />}
        defaultOpened
        untoggable
        space="15px 0 10px"
      />
    );
  };

  getPolicyInputOptions = () => this.props.entity.policies.map(label => ({label, value: label}));

  renderPolicyInput = (pipelineIdx, policyIdx, policy) => {
    const options = this.getPolicyInputOptions();
    return (
      <EntityProperty
        name={`pipelines[${pipelineIdx}][policies][${policyIdx}][name]`}
        value={policy.name || options[0].value}
        options={options}
        hiddenInputs={[{name: `pipelines[${pipelineIdx}][policies][${policyIdx}][id]`, value: policy.id}]}
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
              onClick={this.removePipelinePolicy(pipelineIdx, idx)}
            />
            <IconButton
              icon="iconArrowDown"
              onClick={this.reorderPipelinePolicy(pipelineIdx, idx, 1)}
              disabled={idx === pipeline.policies.length - 1}
            />
            <IconButton
              icon="iconArrowUp"
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
        button={<IconButton icon="iconPlus" onClick={this.addPipelinePolicy(pipelineIdx)} />}
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
      <IconButton icon="iconPlus" onClick={this.addHttpsTlsDomain} />,
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
      <IconButton icon="iconDelete" onClick={this.removeHttpsTlsDomain(idx)} />,
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
      <CollapsibleProperties
        key="protocol"
        bar={<EntityPropertyLabel>Protocol</EntityPropertyLabel>}
        collapsible={collapsible}
        barToggable
        defaultOpened={false}
      />
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
      <CollapsibleProperties
        key="admin"
        bar={<EntityPropertyLabel>Admin</EntityPropertyLabel>}
        collapsible={collapsible}
        barToggable
        defaultOpened={false}
      />
    );
  };

  renderPipelinesSection = () => {
    const {pipelines} = this.state;
    const collapsible = pipelines.map((pipeline, idx) => (
      <CollapsibleProperties
        key={pipeline.id}
        bar={this.renderPipelineInput(idx, pipeline)}
        collapsible={this.renderPipeline(pipeline, idx)}
        button={<IconButton icon="iconDelete" onClick={this.removePipeline(idx)} />}
        defaultOpened
        space="0"
        noDividers
      />
    ));
    return (
      <CollapsibleProperties
        key="pipelines"
        bar={<EntityPropertyLabel>Pipelines</EntityPropertyLabel>}
        collapsible={collapsible}
        button={<IconButton icon="iconPlus" onClick={this.addPipeline} />}
        barToggable
        defaultOpened
      />
    );
  };

  render() {
    const sections = [
      {title: 'Protocol'},
      {title: 'Admin'},
      {title: 'Pipelines'},
    ];
    return (
      <div className="panel__details">
        {sections.map(({title, render}) => this[`render${render || title}Section`]())}
      </div>
    );
  }

}

export default BaseDetails(GatewayDetails);
