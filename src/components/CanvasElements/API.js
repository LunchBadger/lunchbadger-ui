import React, {Component, PropTypes} from 'react';
import PublicEndpoint from './Subelements/PublicEndpoint';
import updateAPI from '../../actions/CanvasElements/API/update';
import bundleAPI from 'actions/CanvasElements/API/bundle';
import unbundleAPI from 'actions/CanvasElements/API/unbundle';
import moveBetweenAPIs from 'actions/CanvasElements/API/rebundle';
import _ from 'lodash';

const CanvasElement = LBCore.components.CanvasElement;
const TwoOptionModal = LBCore.components.TwoOptionModal;

class API extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.previousConnection = null;

    this.state = {
      showingModal: false,
      bundledItem: null
    }
  }

  componentDidMount() {
    this.props.paper.bind('connectionDetached', (info) => {
      this.previousConnection = info;
    });
  }

  update(model) {
    updateAPI(this.props.entity.id, model);
  }

  onDrop(item) {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item
      });
    }
  }

  onAddEndpoint(endpoint) {
    bundleAPI(this.props.entity, endpoint);
  }

  onMoveEndpoint(item) {
    moveBetweenAPIs(item.parent, this.props.entity, item.entity);
  }

  renderEndpoints() {
    return this.props.entity.endpoints.map((endpoint) => {
      return (
        <div key={endpoint.id} className="canvas-element__sub-element">
          <PublicEndpoint
            parent={this.props.entity}
            key={endpoint.id}
            id={endpoint.id}
            entity={endpoint}
            paper={this.props.paper}
            left={endpoint.left}
            top={endpoint.top}
            handleEndDrag={this._handleDrop.bind(this)}
            hideSourceOnDrag={true}/>
        </div>
      );
    });
  }

  _handleDrop(item) {
    unbundleAPI(item.parent, item.entity);
  }

  _handleModalConfirm() {
    const item = this.state.bundledItem;

    if (item.parent) {
      this.onMoveEndpoint(item);
    }

    if (!_.includes(this.props.entity.endpoints, item.entity)) {
      this.onAddEndpoint(item.entity);
    }

    this.props.parent.setState({
      editable: true,
      expanded: true
    });
  }

  _handleClose() {
    this.setState({isShowingModal: false});
  }

  render() {
    return (
      <div>
        {
          this.props.entity.endpoints.length > 0 && (
            <div className="canvas-element__sub-elements">
              <div className="canvas-element__sub-elements__title">
                Endpoints
              </div>
              <div ref="endpoints">{this.renderEndpoints()}</div>
            </div>
          )
        }

        {
          this.state.isShowingModal &&
          <TwoOptionModal title="Bundle API"
                          confirmText="Yes"
                          discardText="No"
                          onClose={this._handleClose.bind(this)}
                          onSave={this._handleModalConfirm.bind(this)}>
            <span>
              Are you sure you want to bundle "{this.state.bundledItem.entity.name}" endpoint into "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        }
      </div>
    );
  }
}

export default CanvasElement(API);
