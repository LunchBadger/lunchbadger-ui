import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import Model from './Subelements/Model';
import updateMicroservice from '../../actions/CanvasElements/Microservice/update';
import {bundleStart, bundleFinish} from '../../actions/CanvasElements/Microservice/bundle';
import {unbundleStart, unbundleFinish} from '../../actions/CanvasElements/Microservice/unbundle';
import moveBetweenMicroservice from '../../actions/CanvasElements/Microservice/rebundle';
import removeModel from '../../actions/CanvasElements/Model/remove';
import updateModel from '../../actions/CanvasElements/Model/update';

const removeEntity = LunchBadgerCore.actions.removeEntity;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;
const ElementsBundler = LunchBadgerCore.components.ElementsBundler;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const Private = LunchBadgerManage.stores.Private;
const Connection = LunchBadgerCore.stores.Connection;

class Microservice extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
  };

  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.previousConnection = null;

    this.state = {
      hasTargetConnection: false,
      hasSourceConnection: false,
      isShowingModal: false,
      bundledItem: null
    }
  }

  componentDidMount() {
    this.props.paper.bind('connectionDetached', this.onConnectionDetached);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState === null || this.state.hasTargetConnection !== nextState.hasTargetConnection) {
      const hasConnection = nextProps.entity.models.some((modelId) => {
        return Connection.getConnectionsForTarget(modelId).length;
      });

      if (hasConnection) {
        this.setState({hasTargetConnection: true});
      } else {
        this.setState({hasTargetConnection: false});
      }
    }

    if (nextState === null || this.state.hasSourceConnection !== nextState.hasSourceConnection) {
      const hasConnection = nextProps.entity.models.some((modelId) => {
        return Connection.getConnectionsForSource(modelId).length;
      });

      if (hasConnection) {
        this.setState({hasSourceConnection: true});
      } else {
        this.setState({hasSourceConnection: false});
      }
    }
  }

  componentWillUnmount() {
    this.props.paper.unbind('connectionDetached', this.onConnectionDetached);
  }

  onConnectionDetached = (info) => {
    this.previousConnection = info;
  };

  update(model) {
    updateMicroservice(this.props.entity.id, model);
  }

  removeEntity() {
    this.props.entity.models.forEach((modelId) => {
      const entity = Private.findEntity(modelId);

      entity && removeModel(this.context.projectService, entity);
    });

    removeEntity(this.props.entity);
  }

  renderModels() {
    return this.props.entity.models.map((modelId) => {
      const entity = Private.findEntity(modelId);

      if (!entity) {
        return null;
      }

      return (
        <div key={entity.id} className="canvas-element__sub-element canvas-element__sub-element--api">
          <Model
            {...this.props}
            parent={this.props.entity}
            key={entity.id}
            id={entity.id}
            entity={entity}
            paper={this.props.paper}
            left={entity.left}
            top={entity.top}
            handleEndDrag={(item) => this.handleEndDrag(item)}
            hideSourceOnDrag={true}/>
        </div>
      );
    });
  }

  handleEndDrag(item) {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item
      });
    }
  }

  handleModalConfirm() {
    const item = this.state.bundledItem;
    const {entity} = item;
    const modelData = {
      name: entity.name,
      contextPath: entity.contextPath,
      wasBundled: false
    };

    unbundleStart(item.parent);

    updateModel(this.context.projectService, entity.lunchbadgerId || entity.id, modelData)
      .then(() => unbundleFinish(item.parent, entity));
  }

  handleModalClose() {
    this.setState({isShowingModal: false});
  }

  bundleMicroservice(microservice, bundledItem) {
    const modelData = {
      name: bundledItem.name,
      contextPath: bundledItem.contextPath,
      wasBundled: true
    };

    bundleStart(microservice);

    updateModel(this.context.projectService, bundledItem.id, modelData)
      .then(() => bundleFinish(microservice, bundledItem));
  }

  render() {
    const elementClass = classNames({
      'has-connection-in': this.state.hasTargetConnection,
      'has-connection-out': this.state.hasSourceConnection
    });

    return (
      <div className={elementClass}>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
          </div>
        </div>

        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Models
          </div>
          <div className="canvas-element__endpoints" ref="endpoints">
            <DraggableGroup iconClass="icon-icon-microservice" entity={this.props.entity}
                            appState={this.props.appState}>
              {this.renderModels()}
            </DraggableGroup>
          </div>
          <div className="canvas-element__drop">
            <ElementsBundler {...this.props}
                             canDropCheck={
                               (item) => _.includes(this.props.entity.accept, item.entity.constructor.type)
                               && !_.includes(this.props.entity.models, item.entity.lunchbadgerId)
                             }
                             onAddCheck={(item) => !_.includes(this.props.entity.models, item.entity.lunchbadgerId)}
                             onAdd={this.bundleMicroservice.bind(this)}
                             onMove={moveBetweenMicroservice}
                             dropText="Drag Models Here"
                             modalTitle="Bundle Microservice"
                             parent={this.props.parent}
                             entity={this.props.entity}/>
          </div>
        </div>

        {
          this.state.isShowingModal &&
          <TwoOptionModal title="Unbundle Microservice"
                          confirmText="Yes"
                          discardText="No"
                          onClose={this.handleModalClose.bind(this)}
                          onSave={this.handleModalConfirm.bind(this)}>
            <span>
              Are you sure you want to unbundle "{this.state.bundledItem.entity.name}" from "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        }
      </div>
    );
  }
}

export default CanvasElement(Microservice);
