import React, {Component, PropTypes} from 'react';
import updateAPI from '../../actions/CanvasElements/API/update';
import unbundleAPI from 'actions/CanvasElements/API/unbundle';
import APIDrop from './Subelements/APIDrop';
import classNames from 'classnames';
import {notify} from 'react-notify-toast';
import './API.scss';

const toggleEdit = LunchBadgerCore.actions.toggleEdit;
const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;
const Connection = LunchBadgerCore.stores.Connection;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const DraggableGroup = LunchBadgerCore.components.DraggableGroup;

class Portal extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    parent: PropTypes.object
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

    toggleEdit(this.props.entity);
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.ready && !this.props.ready) {
      this._onDeploy();
    }

    if (nextState === null || this.state.hasConnection !== nextState.hasConnection) {
      const hasConnection = nextProps.entity.publicEndpoints.some((publicEndpoint) => {
        return Connection.getConnectionsForTarget(publicEndpoint.id).length;
      });

      if (hasConnection) {
        this.setState({hasConnection: true});
      } else {
        this.setState({hasConnection: false});
      }
    }
  }

  _onDeploy() {
    notify.show('Portal successfully deployed', 'success');

    this.props.parent.triggerElementAutofocus();
  }

  update(model) {
    updateAPI(this.props.entity.id, model);
  }

  renderAPIs() {
    return null;
  }

  _handleModalConfirm() {
    const item = this.state.bundledItem;

    unbundleAPI(item.parent, item.entity);
  }

  _handleClose() {
    this.setState({isShowingModal: false});
  }

  render() {
    const elementClass = classNames({
      'has-connection': this.state.hasConnection
    });

    return (
      <div className={elementClass}>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            APIs
          </div>
          <div className="canvas-element__endpoints" ref="endpoints">
            <DraggableGroup iconClass="icon-icon-portal" entity={this.props.entity} appState={this.props.appState}>
              {this.renderAPIs()}
            </DraggableGroup>
          </div>
          <div className="canvas-element__drop">
            <APIDrop {...this.props} parent={this.props.parent} entity={this.props.entity}/>
          </div>
        </div>

        {
          this.state.isShowingModal &&
          <TwoOptionModal title="Unbundle Portal"
                          confirmText="Yes"
                          discardText="No"
                          onClose={this._handleClose.bind(this)}
                          onSave={this._handleModalConfirm.bind(this)}>
            <span>
              Are you sure you want to unbundle "{this.state.bundledItem.entity.name}" API from "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        }
      </div>
    );
  }
}

export default CanvasElement(Portal);
