import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import Pipeline from './Subelements/Pipeline';
import redeployGateway from '../../actions/CanvasElements/Gateway/redeploy';
import addPipeline from '../../actions/CanvasElements/Gateway/addPipeline';
import removePipeline from '../../actions/CanvasElements/Gateway/removePipeline';
import classNames from 'classnames';
import Policy from '../../models/Policy';
import PipelineFactory from '../../models/Pipeline';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import _ from 'lodash';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';

const toggleEdit = LunchBadgerCore.actions.toggleEdit;
const Connection = LunchBadgerCore.stores.Connection;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      hasInConnection: null,
      hasOutConnection: null,
      dnsPrefix: props.entity.dnsPrefix,
      pipelinesOpened: {},
      markedRemovePipelines: {},
      pipelinesBeforeEdit: props.entity.pipelines.map(pl => pl.id),
    };
    props.entity.pipelines.forEach((item) => {
      this.state.pipelinesOpened[item.id] = false;
    });
  }

  componentDidMount() {
    if (!this.props.ready) {
      toggleEdit(this.props.entity);
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.ready && !this.props.ready) {
      this._onDeploy();
    }
    if (nextState === null || this.state.hasInConnection !== nextState.hasInConnection) {
      const hasInConnection = nextProps.entity.pipelines.some((pipeline) => {
        return Connection.getConnectionsForTarget(pipeline.id).length;
      });
      if (hasInConnection) {
        this.setState({hasInConnection: true});
      } else {
        this.setState({hasInConnection: false});
      }
    }
    if (nextState === null || this.state.hasOutConnection !== nextState.hasOutConnection) {
      const hasOutConnection = nextProps.entity.pipelines.some((pipeline) => {
        return Connection.getConnectionsForSource(pipeline.id).length;
      });
      if (hasOutConnection) {
        this.setState({hasOutConnection: true});
      } else {
        this.setState({hasOutConnection: false});
      }
    }
    if (!this.props.parent.state.editable) {
      this.setState({dnsPrefix: nextProps.entity.dnsPrefix});
    }
    const pipelinesOpened = {...this.state.pipelinesOpened};
    let pipelinesAdded = false;
    nextProps.entity.pipelines.forEach(({id}) => {
      if (typeof pipelinesOpened[id] === 'undefined') {
        pipelinesOpened[id] = false;
        pipelinesAdded = true;
      }
    });
    if (pipelinesAdded) this.setState({pipelinesOpened});
  }

  discardChanges = () => {
    const {entity} = this.props;
    const {pipelines} = entity;
    pipelines.filter(pl => !this.state.pipelinesBeforeEdit.includes(pl.id)).forEach((pipeline) => {
      removePipeline(entity, pipeline);
    });
    this.setState({markedRemovePipelines: {}});
  };

  handleTogglePipelineOpen = pipelineId => opened => {
    const pipelinesOpened = {...this.state.pipelinesOpened};
    pipelinesOpened[pipelineId] = opened;
    this.setState({pipelinesOpened});
  }

  renderPipelines = () => {
    return this.props.entity.pipelines.map((pipeline, index) => (
      <Pipeline
        key={pipeline.id}
        {...this.props}
        index={index}
        parent={this.props.entity}
        paper={this.props.paper}
        entity={pipeline}
        onToggleOpen={this.handleTogglePipelineOpen(pipeline.id)}
        pipelinesOpened={this.state.pipelinesOpened}
        onRemove={this.markRemovePipeline(pipeline)}
        markedRemove={this.state.markedRemovePipelines[pipeline.id]}
      />
    ));
  }

  getModelAfterUpdate = (model) => {
    const marked = Object.keys(this.state.markedRemovePipelines);
    model.pipelines = model.pipelines.filter(pipeline => !marked.includes(pipeline.id));
    return model;
  }

  update(model) {
    const marked = Object.keys(this.state.markedRemovePipelines);
    model.pipelines = model.pipelines.filter(pipeline => !marked.includes(pipeline.id));
    let data = {
      pipelines: (model.pipelines || []).map(pipeline => {
        let policies = pipeline.policies || [];
        delete pipeline.policies;

        return PipelineFactory.create({
          ...pipeline,
          policies: policies.map(policy => Policy.create(policy))
        });
      })
    };
    const validations = this.validate(model);
    if (validations.isValid) {
      redeployGateway(this.props.entity, _.merge(model, data));
    }
    this.setState({pipelinesBeforeEdit: model.pipelines.map(pl => pl.id)});
    return validations;
  }

  validate = (model) => {
    const validations = {
      isValid: true,
      data: {},
    }
    const messages = {
      empty: 'This field cannot be empty',
    }
    if (model.dnsPrefix === '') validations.data.dnsPrefix = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  onAddPipeline = name => () => addPipeline(this.props.entity, name);

  markRemovePipeline = pipeline => () => {
    if (this.state.pipelinesBeforeEdit.includes(pipeline.id)) {
      this.setState({
        markedRemovePipelines: {
          ...this.state.markedRemovePipelines,
          [pipeline.id]: true,
        },
      });
    } else {
      removePipeline(this.props.entity, pipeline);
    }
  }

  _onDeploy() {
    const dispatchRedux = LunchBadgerCore.dispatchRedux;
    dispatchRedux(addSystemInformationMessage({
      message: 'Gateway successfully deployed',
      type: 'success'
    }));
    this.props.parent.triggerElementAutofocus();
  }

  onPrefixChange = event => this.setState({dnsPrefix: event.target.value});

  render() {
    const elementClass = classNames({
      'has-connection-in': this.state.hasInConnection,
      'has-connection-out': this.state.hasOutConnection
    });
    const {validations: {data}, entityDevelopment, onResetField} = this.props;
    const mainProperties = [
      {
        name: 'rootURL',
        title: 'root URL',
        value: `http://${this.state.dnsPrefix}.customer.lunchbadger.com`,
        fake: true,
      },
      {
        name: 'dnsPrefix',
        title: 'DNS prefix',
        value: this.props.entity.dnsPrefix,
        editableOnly: true,
        invalid: data.dnsPrefix,
        onChange: this.onPrefixChange,
        onBlur: this.handleFieldChange('dnsPrefix'),
      },
    ];
    mainProperties[0].isDelta = this.state.dnsPrefix !== entityDevelopment.dnsPrefix;
    mainProperties[0].onResetField = () => onResetField('dnsPrefix');
    return (
      <div className={elementClass}>
        <EntityProperties properties={mainProperties} />
        <EntitySubElements
          title="Pipelines"
          onAdd={this.onAddPipeline('Pipeline')}
          main
        >
          <DraggableGroup iconClass="icon-icon-gateway" entity={this.props.entity} appState={this.props.appState}>
            {this.renderPipelines()}
          </DraggableGroup>
        </EntitySubElements>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
