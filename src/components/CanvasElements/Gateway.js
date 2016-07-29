import React, {Component, PropTypes} from 'react';
import Pipeline from './Subelements/Pipeline';
import redeployGateway from 'actions/CanvasElements/Gateway/redeploy';
import addPipeline from 'actions/CanvasElements/Gateway/addPipeline';
import {notify} from 'react-notify-toast';
import classNames from 'classnames';
import Policy from 'models/Policy';
import PipelineFactory from 'models/Pipeline';
import _ from 'lodash';

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
      hasOutConnection: null
    };
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
  }

  renderPipelines() {
    return this.props.entity.pipelines.map((pipeline, index) => {
      return (
        <div key={pipeline.id} className="canvas-element__sub-element canvas-element__sub-element--pipeline">
          <Pipeline {...this.props}
                    index={index}
                    parent={this.props.entity}
                    paper={this.props.paper}
                    rootPath={this.props.entity.rootPath}
                    entity={pipeline}/>
        </div>
      );
    });
  }

  update(model) {
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

    redeployGateway(this.props.entity, _.merge(model, data));
  }

  onAddPipeline(name) {
    addPipeline(this.props.entity, name);
  }

  _onDeploy() {
    notify.show('Gateway successfully deployed', 'success');

    this.props.parent.triggerElementAutofocus();
  }

  render() {
    const elementClass = classNames({
      'has-connection-in': this.state.hasInConnection,
      'has-connection-out': this.state.hasOutConnection
    });

    return (
      <div className={elementClass}>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Root path</div>
              <div className="canvas-element__properties__property-value">
              <span className="hide-while-edit">
                {this.props.entity.rootPath}
              </span>

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       name="rootPath"
                       value={this.props.entity.rootPath}/>
              </div>
            </div>
          </div>
        </div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Pipelines
            <i onClick={() => this.onAddPipeline('Pipeline')} className="canvas-element__add fa fa-plus"/>
          </div>
          <DraggableGroup iconClass="icon-icon-gateway" entity={this.props.entity} appState={this.props.appState}>
            {this.renderPipelines()}
          </DraggableGroup>
        </div>
      </div>
    );
  }
}

export default CanvasElement(Gateway);
