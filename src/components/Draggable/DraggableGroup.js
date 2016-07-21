import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import './DraggableGroup.scss';

const boxSource = {
  beginDrag(props) {
    return props;
  },

  canDrag(props) {
    const selectedElements = props.appState.getStateKey('currentlySelectedSubelements');
    const selectedParent = props.appState.getStateKey('currentlySelectedParent');

    if (!selectedElements || !selectedParent) {
      return false;
    }

    return selectedElements.length > 0 && selectedParent.id === props.entity.id;
  }
};

@DragSource('elementsGroup', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))
export default class DraggableGroup extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func,
    connectDragPreview: PropTypes.func,
    appState: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    iconClass: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {connectDragSource, connectDragPreview} = this.props;
    const selectedElements = this.props.appState.getStateKey('currentlySelectedSubelements') || [];

    return connectDragSource(
      <div className="draggable-group">
        {this.props.children}
        {connectDragPreview(
          <div className="draggable-group__preview">
            <div className="draggable-group__preview__icon">
              <i className="icon-icon-gateway"/>
            </div>
            <div className="draggable-group__preview__items">
              {selectedElements.map(element => {
                return <div className="draggable-group__preview__title" key={element.id}>{element.name}</div>
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}
