import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import './ElementsBundler.scss';

const boxTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();

    return props.canDropCheck(item);
  },
  drop(_props, monitor, component) {
    component.onDrop(monitor.getItem());
  }
};

@DropTarget('canvasElement', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({shallow: true}),
  itemType: monitor.getItemType()
}))
export default class ElementsBundler extends Component {
  static defaultProps = {
    dropText: 'Drag Endpoints Here',
    modalTitle: 'Bundle API'
  };

  static propTypes = {
    entity: PropTypes.object.isRequired,
    parent: PropTypes.object.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDropCheck: PropTypes.func.isRequired,
    dropText: PropTypes.string,
    modalTitle: PropTypes.string,
    onAdd: PropTypes.func.isRequired,
    onAddCheck: PropTypes.func.isRequired,
    onMove: PropTypes.func.isRequired
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

  onAdd(endpoint) {
    this.props.onAdd(this.props.entity, endpoint);
  }

  onMove(item) {
    this.props.onMove(item.parent, this.props.entity, item.entity);
  }

  _handleModalConfirm = () => {
    const item = this.state.bundledItem;

    if (item.parent) {
      this.onMove(item);
    }

    if (this.props.onAddCheck(item)) {
      this.onAdd(item.entity);
    }

    this.props.parent.setState({expanded: true});
  }

  _handleClose = () => {
    this.setState({isShowingModal: false});
  }

  render() {
    const {isOver, connectDropTarget, dropText} = this.props;
    const placeholderClass = classNames({
      'canvas-element__drop-placeholder': true,
      'canvas-element__drop-placeholder--over': isOver
    });

    return connectDropTarget(
      <div>
        <div className={placeholderClass}>
          {dropText}
        </div>

        {
          this.state.isShowingModal &&
          <TwoOptionModal title={this.props.modalTitle}
                          confirmText="Yes"
                          discardText="No"
                          onClose={this._handleClose}
                          onSave={this._handleModalConfirm}>
            <span>
              Are you sure you want to bundle "{this.state.bundledItem.entity.name}" into "{this.props.entity.name}"?
            </span>
          </TwoOptionModal>
        }
      </div>
    );
  }
}
