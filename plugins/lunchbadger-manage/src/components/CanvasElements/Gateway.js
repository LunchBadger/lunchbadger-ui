import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
// import update from 'react-addons-update';
import Pipeline from '../../models/Pipeline';
import Policy from '../../models/Policy';
import initialPipelinePolicies from '../../utils/initialPipelinePolicies';
// import PipelineComponent from './Subelements/Pipeline';
// import {removePipeline} from '../../reduxActions/gateways';
import {
  EntityProperty,
  EntityPropertyLabel,
  EntitySubElements,
  CollapsibleProperties,
  IconButton,
  Input,
} from '../../../../lunchbadger-ui/src';
import './Gateway.scss';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Port = LunchBadgerCore.components.Port;
// const DraggableGroup = LunchBadgerCore.components.DraggableGroup;

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {...this.stateFromStores(props)};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.onStoreUpdate(nextProps);
    }
    // if (nextProps.entity !== this.props.entity) {
    //   this.setState({
    //     dnsPrefix: nextProps.entity.dnsPrefix,
    //     pipelinesOpened: {},
    //     showRemovingModal: false,
    //     pipelineToRemove: null,
    //   });
    // }
    // // if (nextProps.ready && !this.props.ready) {
    // //   this._onDeploy();
    // // }
    // // if (nextState === null || this.state.hasInConnection !== nextState.hasInConnection) {
    // //   const hasInConnection = nextProps.entity.pipelines.some((pipeline) => {
    // //     return Connection.getConnectionsForTarget(pipeline.id).length;
    // //   });
    // //   if (hasInConnection) {
    // //     this.setState({hasInConnection: true});
    // //   } else {
    // //     this.setState({hasInConnection: false});
    // //   }
    // // }
    // // if (nextState === null || this.state.hasOutConnection !== nextState.hasOutConnection) {
    // //   const hasOutConnection = nextProps.entity.pipelines.some((pipeline) => {
    // //     return Connection.getConnectionsForSource(pipeline.id).length;
    // //   });
    // //   if (hasOutConnection) {
    // //     this.setState({hasOutConnection: true});
    // //   } else {
    // //     this.setState({hasOutConnection: false});
    // //   }
    // // }
    // // if (!this.props.parent.state.editable) { //FIXME
    // //   this.setState({dnsPrefix: nextProps.entity.dnsPrefix});
    // // }
    // const pipelinesOpened = {...this.state.pipelinesOpened};
    // let pipelinesAdded = false;
    // nextProps.entity.pipelines.forEach(({id}) => {
    //   if (typeof pipelinesOpened[id] === 'undefined') {
    //     pipelinesOpened[id] = false;
    //     pipelinesAdded = true;
    //   }
    // });
    // if (pipelinesAdded) this.setState({pipelinesOpened});
  }

  stateFromStores = props => {
    const {dnsPrefix, pipelines} = props.entity;
    const newState = {
      dnsPrefix,
      pipelines: pipelines.slice(),
    };
    return newState;
  };

  onStoreUpdate = (props = this.props, callback) =>
    this.setState({...this.stateFromStores(props)}, () => callback && callback());

  discardChanges = callback => this.onStoreUpdate(this.props, callback);

  processModel = model => {
    const {entity} = this.props;
    return entity.processModel(model);
  };

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

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

  getPolicyInputOptions = () => this.props.entity.policies.map(label => ({label, value: label}));

  getPolicyHiddenInputs = (pipelineIdx, policyIdx, policy) => {
    const prefix = `pipelines[${pipelineIdx}][policies][${policyIdx}]`;
    const hiddenInputs = [{name: `${prefix}[id]`, value: policy.id}];
    policy.conditionAction.forEach((pair, pairIdx) => {
      hiddenInputs.push({
        name: `${prefix}[pairs][${pairIdx}][id]`,
        value: pair.id,
      });
      pair.condition.parameters.forEach((parameter, idx) => {
        hiddenInputs.push({
          name: `${prefix}[pairs][${pairIdx}][condition][${idx}][name]`,
          value: parameter.name,
        });
        hiddenInputs.push({
          name: `${prefix}[pairs][${pairIdx}][condition][${idx}][value]`,
          value: parameter.value,
        });
      });
      pair.action.parameters.forEach((parameter, idx) => {
        hiddenInputs.push({
          name: `${prefix}[pairs][${pairIdx}][action][${idx}][name]`,
          value: parameter.name,
        });
        hiddenInputs.push({
          name: `${prefix}[pairs][${pairIdx}][action][${idx}][value]`,
          value: parameter.value,
        });
      });
    });
    return hiddenInputs;
  }

  renderPipeline = (pipeline, pipelineIdx) => {
    const options = this.getPolicyInputOptions();
    const collapsible = (
      <div>
        {pipeline.policies.map((policy, idx) => (
          <EntityProperty
            key={idx}
            name={`pipelines[${pipelineIdx}][policies][${idx}][name]`}
            value={policy.name || options[0].value}
            options={options}
            hiddenInputs={this.getPolicyHiddenInputs(pipelineIdx, idx, policy)}
            onDelete={this.deletePipelinePolicy(pipelineIdx, idx)}
          />
        ))}
      </div>
    );
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

  renderPipelinePorts = ports => ports.map(port => (
    <Port
      key={`port-${port.portType}-${port.id}`}
      way={port.portType}
      elementId={port.id}
      middle={true}
      scope={port.portGroup}
    />
  ));

  renderPipelines = () => {
    const {pipelines} = this.state;
    return (
      <div className="Gateway__pipelines">
        {pipelines.map((pipeline, idx) => (
          <div key={pipeline.id}>
            {this.renderPipelinePorts(pipeline.ports)}
            <CollapsibleProperties
              bar={this.renderPipelineInput(idx, pipeline)}
              collapsible={this.renderPipeline(pipeline, idx)}
              button={<IconButton icon="iconDelete" onClick={this.removePipeline(idx)} />}
              defaultOpened
              space="0"
              noDividers
            />
          </div>
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
    const {validations: {data}, entityDevelopment, onResetField, multiEnvIndex} = this.props;
    const elementClass = cs('Gateway', {
      'multi': multiEnvIndex > 0,
      // 'has-connection-in': this.state.hasInConnection,
      // 'has-connection-out': this.state.hasOutConnection
    });
    // const mainProperties = [
    //   {
    //     name: 'rootURL',
    //     title: 'root URL',
    //     value: `http://${this.state.dnsPrefix}.customer.lunchbadger.com`,
    //     fake: true,
    //   },
    //   {
    //     name: 'dnsPrefix',
    //     title: 'DNS prefix',
    //     value: this.props.entity.dnsPrefix,
    //     editableOnly: true,
    //     invalid: data.dnsPrefix,
    //     onChange: this.onPrefixChange,
    //     onBlur: this.handleFieldChange('dnsPrefix'),
    //   },
    // ];
    // mainProperties[0].isDelta = this.state.dnsPrefix !== entityDevelopment.dnsPrefix;
    // mainProperties[0].onResetField = () => onResetField('dnsPrefix');
    return (
      <div className={elementClass}>
        {this.renderHiddenFields()}
        <EntitySubElements
          title="Pipelines"
          onAdd={this.addPipeline}
          main
        >
          {this.renderPipelines()}
        </EntitySubElements>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
