import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import slug from 'slug';
import {arrayMove} from 'react-sortable-hoc';
import Pipeline from '../../models/Pipeline';
import Policy from '../../models/Policy';
import initialPipelinePolicies from '../../utils/initialPipelinePolicies';
import PipelineComponent from './Subelements/Pipeline';
import GatewayPolicyCondition from '../Panel/EntitiesDetails/Subelements/GatewayPolicyCondition';
import GatewayPolicyAction from '../Panel/EntitiesDetails/Subelements/GatewayPolicyAction';
import {
  EntityProperties,
  EntityProperty,
  EntityPropertyLabel,
  EntitySubElements,
  CollapsibleProperties,
  IconButton,
  Input,
  Sortable,
} from '../../../../lunchbadger-ui/src';
import Config from '../../../../../src/config';
import './Gateway.scss';

const {CanvasElement, DraggableGroup, Port} = LunchBadgerCore.components;
const {Connections} = LunchBadgerCore.stores;
// const DraggableGroup = LunchBadgerCore.components.DraggableGroup;

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired
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

  stateFromStores = props => {
    const {dnsPrefix, pipelines} = props.entity;
    const newState = {
      dnsPrefix,
      pipelines: pipelines.slice(),
    };
    return newState;
  };

  onPropsUpdate = (props = this.props, callback) => this.setState(this.stateFromStores(props), callback);

  discardChanges = callback => {
    Object.keys(this.policyCARefs).forEach(key => this.policyCARefs[key] && this.policyCARefs[key].discardChanges());
    this.onPropsUpdate(this.props, callback);
  };

  processModel = model => {
    const {entity} = this.props;
    const {paper: paperRef} = this.context;
    const paper = paperRef.getInstance();
    (model.pipelines || []).forEach(({id, policies}) => {
      if (!(policies || []).find(({name}) => name === 'proxy')) {
        const connectionsTo = Connections.search({toId: id});
        const connectionsFrom = Connections.search({fromId: id});
        [...connectionsTo, ...connectionsFrom].map((conn) => {
          conn.info.connection.setParameter('discardAutoSave', true);
          paper.detach(conn.info.connection);
        });
      }
    });
    return entity.processModel(model);
  };

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  };

  // onPrefixChange = event => this.setState({dnsPrefix: event.target.value});

  changeState = obj => this.setState(obj);

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

  deletePipelinePolicy = (pipelineIdx, policyIdx) => () => {
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies.splice(policyIdx, 1);
    this.changeState({pipelines});
  }

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

  handleReorderPolicies = pipelineIdx => ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) return;
    const pipelines = _.cloneDeep(this.state.pipelines);
    pipelines[pipelineIdx].policies = arrayMove(pipelines[pipelineIdx].policies, oldIndex, newIndex);
    this.changeState({pipelines});
  };

  getPolicyInputOptions = () => Object.keys(this.context.store.getState().entities.gatewaySchemas.policy)
    .map(label => ({label, value: label}));

  renderPipeline = (pipeline, pipelineIdx) => {
    const options = this.getPolicyInputOptions();
    const collapsible = (
      <Sortable
        items={pipeline.policies}
        renderItem={(policy, policyIdx) => (
          <div key={policyIdx}>
            <EntityProperty
              name={`pipelines[${pipelineIdx}][policies][${policyIdx}][name]`}
              value={policy.name || options[0].value}
              options={options}
              onDelete={this.deletePipelinePolicy(pipelineIdx, policyIdx)}
              onBlur={this.handlePolicyChange(pipelineIdx, policyIdx)}
              autocomplete
            />
            <div className="Gateway__CA">
              {policy.conditionAction.map((pair, pairIdx) => (
                <div key={pairIdx}>
                  <GatewayPolicyCondition
                    ref={r => this.policyCARefs[`${pairIdx}_condition`] = r}
                    condition={pair.condition}
                    schemas={this.conditionSchemas}
                    prefix={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][condition]`}
                    root
                  />
                  <GatewayPolicyAction
                    ref={r => this.policyCARefs[`${pairIdx}_action`] = r}
                    action={pair.action}
                    schemas={this.policiesSchemas[policy.name]}
                    prefix={`pipelines[${pipelineIdx}][policies][${policyIdx}][pairs][${pairIdx}][action]`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        onSortEnd={this.handleReorderPolicies(pipelineIdx)}
      />
    );
    return (
      <CollapsibleProperties
        bar={<EntityPropertyLabel>Policies</EntityPropertyLabel>}
        collapsible={collapsible}
        button={<IconButton name={`add__pipelines${pipelineIdx}policy`} icon="iconPlus" onClick={this.addPipelinePolicy(pipelineIdx)} />}
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

  renderPipelinePorts = pipeline => {
    const {entity: {deleting}} = this.props;
    const {ports, policies} = pipeline;
    const hasProxyPolicy = !!policies.find(item => item.name === 'proxy');
    return ports.map(port => (
      <Port
        key={`port-${port.portType}-${port.id}`}
        way={port.portType}
        elementId={port.id}
        middle={true}
        scope={hasProxyPolicy ? port.portGroup : port.id}
        disabled={!hasProxyPolicy || deleting}
      />
    ));
  }

  renderPipelines = () => {
    const {entity} = this.props;
    const {pipelines} = this.state;
    return (
      <div className="Gateway__pipelines">
        {pipelines.map((pipeline, idx) => (
          <PipelineComponent
            key={pipeline.id}
            entity={pipeline}
            parent={entity}
            idx={idx}
            left={0}
            top={0}
            renderPipelinePorts={this.renderPipelinePorts}
            renderPipelineInput={this.renderPipelineInput}
            renderPipeline={this.renderPipeline}
            removePipeline={this.removePipeline}
            handleEndDrag={() => {}}
          />
        ))}
      </div>
    );
  }

  renderHiddenFields = () => {
    const {http, https, admin} = this.props.entity;
    const hiddenInputs = [];
    hiddenInputs.push({name: 'http[enabled]', value: http.enabled});
    hiddenInputs.push({name: 'http[port]', value: http.port});
    hiddenInputs.push({name: 'https[enabled]', value: https.enabled});
    hiddenInputs.push({name: 'https[port]', value: https.port});
    https.tls.forEach(({domain, key, cert}, idx) => {
      hiddenInputs.push({name: `https[tls][${idx}][domain]`, value: domain});
      hiddenInputs.push({name: `https[tls][${idx}][key]`, value: key});
      hiddenInputs.push({name: `https[tls][${idx}][cert]`, value: cert});
    });
    hiddenInputs.push({name: 'admin[enabled]', value: admin.enabled});
    hiddenInputs.push({name: 'admin[hostname]', value: admin.hostname});
    hiddenInputs.push({name: 'admin[port]', value: admin.port});
    return (
      <div>
        {hiddenInputs.map(({name, value}) => <Input key={name} type="hidden" value={value} name={name} />)}
      </div>
    );
  };

  render() {
    const {
      validations: {data},
      entity,
      entityDevelopment,
      onResetField,
      multiEnvIndex,
      editable,
    } = this.props;
    const elementClass = cs('Gateway', {
      'multi': multiEnvIndex > 0,
    });
    const {name, loaded} = entity;
    const slugifiedName = slug(name, {lower: true});
    const accessProperties = [
      {
        name: 'accessUrl',
        title: 'Gateway URL',
        value: Config.get('expressGatewayAccessApiUrl').replace('{NAME}', slugifiedName),
        fake: true,
        link: true,
      },
    ];
    return (
      <div className={elementClass}>
        {this.renderHiddenFields()}
        {loaded && (
          <EntityProperties properties={accessProperties} />
        )}
        <EntitySubElements
          title="Pipelines"
          onAdd={this.addPipeline}
          main
        >
          <DraggableGroup
            iconClass="icon-icon-gateway"
            entity={entity}
          >
            {this.renderPipelines()}
          </DraggableGroup>
        </EntitySubElements>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
