import React, {Component, PropTypes} from 'react';
import _ from 'lodash';
import bundleAPI from 'actions/CanvasElements/API/bundle';
import moveBetweenAPIs from 'actions/CanvasElements/API/rebundle';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';

const TwoOptionModal = LunchBadgerCore.components.TwoOptionModal;

const boxTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();

    return (
      _.includes(props.entity.accept, item.entity.constructor.type)
      && !_.includes(props.entity.publicEndpoints, item.entity)
    );
  },
  drop(props, monitor, component) {
    const item = monitor.getItem();

    if (props.appState.getStateKey('isPanelOpened')) {
      return;
    }

    component.onDrop(item);
  }
};

@DropTarget('canvasElement', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({shallow: true}),
  itemType: monitor.getItemType()
}))
export default class APIDrop extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false,
      bundledItem: null
    };
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

  _handleModalConfirm() {
    const item = this.state.bundledItem;

    if (item.parent) {
      this.onMoveEndpoint(item);
    }

    if (!_.includes(this.props.entity.publicEndpoints, item.entity)) {
      this.onAddEndpoint(item.entity);
    }

    this.props.parent.setState({expanded: true});
  }

  _handleClose() {
    this.setState({isShowingModal: false});
  }

  render() {
    const {isOver, connectDropTarget} = this.props;
    const placeholderClass = classNames({
      'canvas-element__drop-placeholder': true,
      'canvas-element__drop-placeholder--over': isOver
    });

    return connectDropTarget(
      <div>
        <div className={placeholderClass}>
          Drag Endpoints Here
        </div>

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
