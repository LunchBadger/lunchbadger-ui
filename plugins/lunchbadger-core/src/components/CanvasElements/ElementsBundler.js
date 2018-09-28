import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DropTarget} from 'react-dnd';
import classNames from 'classnames';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {setCurrentlySelectedParent} from '../../reduxActions';
import './ElementsBundler.scss';

const boxTarget = {
  canDrop(props, monitor) {
    const item = monitor.getItem();
    if (item.currentlySelectedSubelements) {
      return item.currentlySelectedSubelements
        .map(elem => props.canDropCheck(elem))
        .reduce((res, elem) => res && elem, true);
    }
    return props.canDropCheck(item.entity);
  },
  drop(_props, monitor, component) {
    component.onDrop(monitor.getItem());
  }
};

@DropTarget(['canvasElement', 'elementsGroup'], boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({shallow: true}),
  itemType: monitor.getItemType()
}))
export default class ElementsBundler extends Component {
  static contextTypes = {
    store: PropTypes.object,
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

  static defaultProps = {
    dropText: 'Drag Endpoints Here',
    modalTitle: 'Bundle API'
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
      isShowingModalMultiple: false,
      bundledItem: null
    };
  }

  onDrop = item => item && this.setState({
    [`isShowingModal${item.currentlySelectedSubelements ? 'Multiple' : ''}`]: true,
    bundledItem: item
  });

  onAdd = endpoint => this.props.onAdd(this.props.entity, endpoint);

  onMove = (from, endpoint) =>
    this.props.onMove(from, this.props.entity, endpoint);

  onMoveMultiple = (from, endpoints) =>
    this.props.onMoveMultiple(from, this.props.entity, endpoints);

  handleModalConfirm = () => {
    const item = this.state.bundledItem;
    if (item.parent) {
      this.onMove(item.parent, item.entity);
    }
    if (this.props.onAddCheck(item)) {
      this.onAdd(item.entity);
    }
    this.props.parent.setState({expanded: true});
  };

  handleModalConfirmMultiple = () => {
    const item = this.state.bundledItem;
    const {currentlySelectedParent, currentlySelectedSubelements} = item;
    if (currentlySelectedSubelements) {
      this.onMoveMultiple(currentlySelectedParent, currentlySelectedSubelements);
    }
    this.props.parent.setState({expanded: true});
    this.context.store.dispatch(setCurrentlySelectedParent(this.props.entity));
  };

  handleClose = () => this.setState({isShowingModal: false});

  handleCloseMultiple = () => this.setState({isShowingModalMultiple: false});

  render() {
    const {
      isOver,
      connectDropTarget,
      dropText,
      modalTitle,
      entity,
    } = this.props;
    const {
      isShowingModal,
      isShowingModalMultiple,
      bundledItem,
    } = this.state;
    const placeholderClass = classNames({
      'canvas-element__drop-placeholder': true,
      'canvas-element__drop-placeholder--over': isOver
    });
    return connectDropTarget(
      <div>
        <div className={placeholderClass}>
          {dropText}
        </div>
        {isShowingModal && (
          <TwoOptionModal title={modalTitle}
          confirmText="Yes"
          discardText="No"
          onClose={this.handleClose}
          onSave={this.handleModalConfirm}
          >
            Are you sure you want to bundle
            "{bundledItem.entity.name}"
            into
            "{entity.name}"?
          </TwoOptionModal>
        )}
        {isShowingModalMultiple && (
          <TwoOptionModal title={modalTitle}
          confirmText="Yes"
          discardText="No"
          onClose={this.handleCloseMultiple}
          onSave={this.handleModalConfirmMultiple}
          >
            Are you sure you want to bundle
            "{bundledItem.currentlySelectedSubelements.map(({name}) => name).join(', ')}"
            into
            "{entity.name}"?
          </TwoOptionModal>
        )}
      </div>
    );
  }
}
