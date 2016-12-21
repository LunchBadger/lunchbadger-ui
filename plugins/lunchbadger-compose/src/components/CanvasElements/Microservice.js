import React, {Component, PropTypes} from 'react';
import Model from './Subelements/Model';
import updateMicroservice from '../../actions/CanvasElements/Microservice/update';
import bundleMicroservice from '../../actions/CanvasElements/Microservice/bundle';
import unbundleMicroservice from '../../actions/CanvasElements/Microservice/unbundle';
import moveBetweenMicroservice from '../../actions/CanvasElements/Microservice/rebundle';

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
      hasConnection: null,
      isShowingModal: false,
      bundledItem: null
    }
  }

  componentDidMount() {
    this.props.paper.bind('connectionDetached', (info) => {
      this.previousConnection = info;
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextState === null || this.state.hasConnection !== nextState.hasConnection) {
      const hasConnection = nextProps.entity.models.some((modelId) => {
        return Connection.getConnectionsForTarget(modelId).length;
      });

      if (hasConnection) {
        this.setState({hasConnection: true});
      } else {
        this.setState({hasConnection: false});
      }
    }
  }

  update(model) {
    updateMicroservice(this.props.entity.id, model);
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

    unbundleMicroservice(item.parent, item.entity);
  }

  handleClose() {
    this.setState({isShowingModal: false});
  }

  render() {
    return (
      <div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
          </div>
        </div>

        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Models
          </div>
          <div className="canvas-element__endpoints" ref="endpoints">
            <DraggableGroup iconClass="icon-icon-microservice" entity={this.props.entity} appState={this.props.appState}>
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
                             onAdd={bundleMicroservice}
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
                          onClose={this.handleClose.bind(this)}
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
