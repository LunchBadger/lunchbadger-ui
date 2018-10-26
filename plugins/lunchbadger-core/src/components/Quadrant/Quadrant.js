import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import FlipMove from 'react-flip-move';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import {DropTarget} from 'react-dnd';
import {saveOrder} from '../../reduxActions';
import {GAEvent} from '../../../../lunchbadger-ui/src';
import './Quadrant.scss';

const AUTOSCROLL_INCREASE = 50;

const boxTarget = {
  drop(_, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();
    const item = monitor.getItem();
    if (!hasDroppedOnChild) {
      if (item.subelement) {
        if (typeof item.handleEndDrag === 'function') {
          item.handleEndDrag(item);
        }
      } else if (item.groupEndDrag) {
        if (typeof item.groupEndDrag === 'function') {
          item.groupEndDrag();
        }
      }
    }
    component.setState({
      hasDropped: true,
      hasDroppedOnChild: hasDroppedOnChild
    });
  }
};

@DropTarget(['canvasElement', 'elementsGroup'], boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))

@inject('connectionsStore') @observer
class Quadrant extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
    sortableInstance: PropTypes.object,
    resizable: PropTypes.bool,
    width: PropTypes.number,
    index: PropTypes.number,
    scrollLeft: PropTypes.number,
    recalculateQuadrantsWidths: PropTypes.func,
    style: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      hasDroppedOnChild: false,
      hasDropped: false,
      orderedIds: this.getOrderedIds(props),
      draggingId: '',
    };
    this.autoScrollOffset = 0;
  }

  componentDidMount() {
    window.addEventListener('connectionDragging', this.handleConnectionDragging);
  }

  componentWillReceiveProps(nextProps) {
    const oldOrdering = this.getOrderedIds(this.props);
    const newOrdering = this.getOrderedIds(nextProps);
    if (oldOrdering.map(item => item.id).join(',') !== newOrdering.map(item => item.id).join(',')) {
      this.updateOrderedIds(newOrdering);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('connectionDragging', this.handleConnectionDragging);
  }

  updateOrderedIds = (orderedIds, draggingId) => {
    if (this.state.orderedIds.map(item => item.id).join(',') !== orderedIds.map(item => item.id).join(',')) {
      this.setState({orderedIds, draggingId: draggingId || this.state.draggingId});
    }
    if (this.state.draggingId !== draggingId) {
      this.setState({draggingId});
    }
  }

  getOrderedIds = props => props.types
    .reduce((map, type) => ([
        ...map,
        ...Object.keys(props[type]).map(id => ({
          id,
          type,
          itemOrder: props[type][id].itemOrder,
        })),
      ]), [])
    .sort((a, b) => a.itemOrder > b.itemOrder)
    .map(({id, type}) => ({id, type}));

  recalculateQuadrantWidth = (event) => {
    const {recalculateQuadrantsWidths, index} = this.props;
    recalculateQuadrantsWidths(index, event.clientX - this.quadrantDOM.getBoundingClientRect().left);
  };

  handleResizeEnd = () => {
    const {title, width} = this.props;
    GAEvent('Canvas', 'Resized Quadrant', title, Math.floor(width));
  };

  moveEntity = (id, dragIndex, hoverIndex) => {
    const type = this.state.orderedIds.find(item => item.id === id).type;
    const orderedIds = this.state.orderedIds.filter(item => item.id !== id);
    orderedIds.splice(hoverIndex, 0, {id, type});
    this.updateOrderedIds(orderedIds, id);
  };

  saveOrder = () => {
    const {orderedIds} = this.state;
    const {store: {dispatch}} = this.context;
    dispatch(saveOrder(orderedIds.map(item => item.id)));
    this.setState({draggingId: ''});
    GAEvent('Canvas', 'Reordered Entities in Quadrant', this.props.title, orderedIds.length);
  };

  handleMouseMove = ({clientX, clientY}) => {
    if (!this.autoScrollInterval) return;
    const {left, top, width, height} = this.quadrantDOM.getBoundingClientRect();
    if ((clientX < left) || (clientX > left + width)) {
      this.autoScrollOffset = 0;
      return;
    }
    if (clientY < top + 99) {
      let factor = 1;
      if (clientY < top + 33) {
        factor = 4;
      } else if (clientY < top + 66) {
        factor = 2;
      }
      this.autoScrollOffset = - factor * AUTOSCROLL_INCREASE;
    } else if (clientY > top + height - 99) {
      let factor = 1;
      if (clientY > top + height - 33) {
        factor = 4;
      } else if (clientY > top + height - 66) {
        factor = 2;
      }
      this.autoScrollOffset = factor * AUTOSCROLL_INCREASE;
    } else {
      this.autoScrollOffset = 0;
    }
  };

  handleConnectionDragging = ({detail: {dragging}}) => {
    if (dragging) {
      this.autoScrollInterval = setInterval(this.autoScrollOnDragging, 100);
    } else if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = undefined;
    }
  };

  autoScrollOnDragging = () => this.quadrantBodyDOM.scrollBy({
    top: this.autoScrollOffset,
    behavior: 'smooth',
  });

  render() {
    const {
      title,
      connectDropTarget,
      scrollLeft,
      resizable,
      width,
      components,
      connectionsStore,
      style,
      canvasHeight,
    } = this.props;
    const styles = {width};
    const titleStyles = {
      ...styles,
    }
    const bodyStyles = {
      ...style,
    }
    if (canvasHeight > 0) {
      Object.assign(bodyStyles, {
        height: canvasHeight - 82,
      });
    }
    const {orderedIds, draggingId} = this.state;
    return connectDropTarget(
      <div
        className={cs('quadrant', title)}
        ref={(ref) => this.quadrantDOM = ref}
        style={{...styles}}
      >
        <div className="quadrant__title" style={titleStyles}>
          {title}
          {resizable && (
            <QuadrantResizeHandle
              onDrag={this.recalculateQuadrantWidth}
              onDragEnd={this.handleResizeEnd}
            />
          )}
        </div>
        <div
          ref={(ref) => this.quadrantBodyDOM = ref}
          className="quadrant__body"
          style={bodyStyles}
        >
          <div className="quadrant__body__wrap">
            <FlipMove
              staggerDurationBy="30"
              duration={300}
              enterAnimation="accordionVertical"
              leaveAnimation="accordionVertical"
              typeName="div"
            >
              {orderedIds.map(({id, type}, idx) => {
                const entity = this.props[type][id];
                if (!entity || !entity.constructor || !entity.constructor.type) return null;
                const Component = components[entity.constructor.type];
                return (
                  <Component
                    id={id}
                    key={entity.id}
                    entity={entity}
                    hideSourceOnDrag={true}
                    itemOrder={idx}
                    moveEntity={this.moveEntity}
                    saveOrder={this.saveOrder}
                    dragging={draggingId === id}
                    sourceConnections={connectionsStore.getConnectionsForTarget(entity.id)}
                    targetConnections={connectionsStore.getConnectionsForSource(entity.id)}
                  />
                );
              })}
            </FlipMove>
          </div>
        </div>
        {resizable && (
          <QuadrantResizeHandle
            onDrag={this.recalculateQuadrantWidth}
            onDragEnd={this.handleResizeEnd}
          />
        )}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.entities,
  (_, props) => props.types,
  state => state.plugins.canvasElements,
  state => state.canvasHeight,
  (entities, types, components, canvasHeight) => {
    const result = {
      types,
      components,
      canvasHeight,
    };
    types.forEach((type) => {
      result[type] = entities[type];
    });
    return result;
  },
);

export default connect(selector, null, null, {withRef: true})(Quadrant);
