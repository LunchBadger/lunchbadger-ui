import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Pipeline from './Subelements/Pipeline';
import redeployGateway from '../../actions/CanvasElements/Gateway/redeploy';
import {addPipeline, removePipeline} from '../../reduxActions/gateways';
import classNames from 'classnames';
import Policy from '../../models/Policy';
import PipelineFactory from '../../models/Pipeline';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import _ from 'lodash';
import {addSystemInformationMessage} from '../../../../lunchbadger-ui/src/actions';
import {toggleEdit} from '../../../../lunchbadger-core/src/reduxActions';

const Connection = LunchBadgerCore.stores.Connection;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;

class Gateway extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasInConnection: null,
      hasOutConnection: null,
      dnsPrefix: props.entity.dnsPrefix,
      pipelinesOpened: {},
      showRemovingModal: false,
      pipelineToRemove: null,
    };
    props.entity.pipelines.forEach((item) => {
      this.state.pipelinesOpened[item.id] = false;
    });
  }

  componentDidMount() {
    // const {ready, toggleEdit, entity} = this.props;
    // if (!ready) {
    //   toggleEdit(entity);
    // }
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
    // if (!this.props.parent.state.editable) { //FIXME
    //   this.setState({dnsPrefix: nextProps.entity.dnsPrefix});
    // }
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
        onRemove={this.onRemovePipeline(pipeline.id)}
      />
    ));
  }

  // update(model) {
  //   let data = {
  //     pipelines: (model.pipelines || []).map(pipeline => {
  //       let policies = pipeline.policies || [];
  //       delete pipeline.policies;
  //
  //       return PipelineFactory.create({
  //         ...pipeline,
  //         policies: policies.map(policy => Policy.create(policy))
  //       });
  //     })
  //   };
  //   const validations = this.validate(model);
  //   if (validations.isValid) {
  //     redeployGateway(this.props.entity, _.merge(model, data));
  //   }
  //   return validations;
  // }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  onAddPipeline = () => {
    const {store: {dispatch}} = this.context;
    const {entity} = this.props;
    dispatch(addPipeline(entity.metadata.id));
  }

  onRemovePipeline = pipelineToRemove => () => {
    this.setState({
      showRemovingModal: true,
      pipelineToRemove,
    });
  }

  removePipeline = () => {
    const {store: {dispatch}} = this.context;
    const {entity} = this.props;
    dispatch(removePipeline(entity.metadata.id, this.state.pipelineToRemove));
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
          onAdd={this.onAddPipeline}
          main
        >
          <DraggableGroup
            iconClass="icon-icon-gateway"
            entity={this.props.entity}
          >
            {this.renderPipelines()}
          </DraggableGroup>
        </EntitySubElements>
        {this.state.showRemovingModal && (
          <TwoOptionModal
            onClose={() => this.setState({showRemovingModal: false})}
            onSave={this.removePipeline}
            onCancel={() => this.setState({showRemovingModal: false})}
            title="Remove pipeline"
            confirmText="Remove"
            discardText="Cancel"
          >
            <span>
              Do you really want to remove that pipeline?
            </span>
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  toggleEdit: element => dispatch(toggleEdit(element)),
})

export default connect(null, mapDispatchToProps)(CanvasElement(Gateway));
