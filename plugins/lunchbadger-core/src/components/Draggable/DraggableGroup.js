import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import {entityIcons, IconSVG} from '../../ui';
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
    icon: PropTypes.string.isRequired
  };

  static defaultProps = {
    currentlySelectedSubelements: [],
  };

  render() {
    const {
      connectDragSource,
      connectDragPreview,
      currentlySelectedSubelements,
      children,
      icon,
    } = this.props;
    return connectDragSource(
      <div className="draggable-group">
        {children}
        {connectDragPreview(
          <div className="draggable-group__preview">
            <div className="draggable-group__preview__icon">
              <IconSVG svg={entityIcons[icon]}/>
            </div>
            <div className="draggable-group__preview__items">
              {currentlySelectedSubelements.map(({id, name}) => (
                <div
                  key={id}
                  className="draggable-group__preview__title"
                >
                    {name}
                </div>
              ))}
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
