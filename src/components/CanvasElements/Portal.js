import React, {Component, PropTypes} from 'react';
import updatePortal from '../../actions/CanvasElements/Portal/update';
import unbundlePortal from 'actions/CanvasElements/Portal/unbundle';
import moveBetweenPortals from 'actions/CanvasElements/Portal/rebundle';
import APIDrop from './Subelements/APIDrop';
import classNames from 'classnames';
import {notify} from 'react-notify-toast';
import bundlePortal from 'actions/CanvasElements/Portal/bundle';
import _ from 'lodash';
import './API.scss';
import API from './Subelements/API';

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
    updatePortal(this.props.entity.id, model);
  }

  renderAPIs() {
    return this.props.entity.apis.map((endpoint) => {
      return (
        <div key={endpoint.id} className="canvas-element__sub-element canvas-element__sub-element--api">
          <API
            {...this.props}
            parent={this.props.entity}
            key={endpoint.id}
            id={endpoint.id}
            entity={endpoint}
            paper={this.props.paper}
            left={endpoint.left}
            top={endpoint.top}
            handleEndDrag={(item) => this._handleEndDrag(item)}
            hideSourceOnDrag={true}/>
        </div>
      );
    });
  }

  _handleModalConfirm() {
    const item = this.state.bundledItem;

    unbundlePortal(item.parent, item.entity);
  }

  _handleClose() {
    this.setState({isShowingModal: false});
  }

  _handleEndDrag(item) {
    if (item) {
      this.setState({
        isShowingModal: true,
        bundledItem: item
      });
    }
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
          <div className="canvas-element__endpoints" ref="apis">
            <DraggableGroup iconClass="icon-icon-portal" entity={this.props.entity} appState={this.props.appState}>
              {this.renderAPIs()}
            </DraggableGroup>
          </div>
          <div className="canvas-element__drop">
            <APIDrop {...this.props}
                     canDropCheck={
                       (item) => _.includes(this.props.entity.accept, item.entity.constructor.type)
                       && !_.includes(this.props.entity.apis, item.entity)
                     }
                     onAddCheck={(item) => !_.includes(this.props.entity.apis, item.entity)}
                     onAdd={bundlePortal}
                     onMove={moveBetweenPortals}
                     dropText={'Drag APIs here'}
                     parent={this.props.parent}
                     entity={this.props.entity}/>
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
              Are you sure you want to unbundle "{this.state.bundledItem.entity.name}" from "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        }
      </div>
    );
  }
}

export default CanvasElement(Portal);
