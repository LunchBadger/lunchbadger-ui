import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import './DraggableGroup.scss';

const boxSource = {
  beginDrag(props) {
    return props;
  },

  canDrag(props) {
    const {currentlySelectedSubelements, currentlySelectedParent} = props;
    if (!currentlySelectedSubelements || !currentlySelectedParent) {
      return false;
    }
    return currentlySelectedSubelements.length > 0 && currentlySelectedParent.id === props.entity.id;
  }
};

@DragSource('elementsGroup', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))

class DraggableGroup extends PureComponent {
  static propTypes = {
    connectDragSource: PropTypes.func,
    connectDragPreview: PropTypes.func,
    entity: PropTypes.object.isRequired,
    iconClass: PropTypes.string.isRequired
  };

  static defaultProps = {
    currentlySelectedSubelements: [],
  };

  render() {
    const {connectDragSource, connectDragPreview, currentlySelectedSubelements} = this.props;
    return connectDragSource(
      <div className="draggable-group">
        {this.props.children}
        {connectDragPreview(
          <div className="draggable-group__preview">
            <div className="draggable-group__preview__icon">
              <i className={this.props.iconClass}/>
            </div>
            <div className="draggable-group__preview__items">
              {currentlySelectedSubelements.map(element => {
                return <div className="draggable-group__preview__title" key={element.id}>{element.name}</div>
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentlySelectedParent,
  state => state.states.currentlySelectedSubelements,
  (currentlySelectedParent, currentlySelectedSubelements) => ({
    currentlySelectedParent, currentlySelectedSubelements
  }),
);

export default connect(selector)(DraggableGroup);
