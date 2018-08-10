import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import {DropTarget} from 'react-dnd';
import {saveOrder} from '../../reduxActions';
import {GAEvent} from '../../../../lunchbadger-ui/src';
import './Quadrant.scss';

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
    paper: PropTypes.object,
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
  }

  componentWillReceiveProps(nextProps) {
    const oldOrdering = this.getOrderedIds(this.props);
    const newOrdering = this.getOrderedIds(nextProps);
    if (oldOrdering.join(',') !== newOrdering.join(',')) {
      this.updateOrderedIds(newOrdering);
    }
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
    } = this.props;
    const styles = {width};
    const titleStyles = {
      ...styles,
      transform: `translateX(-${scrollLeft}px)`,
    }
    const {orderedIds, draggingId} = this.state;
    return connectDropTarget(
      <div
        className={cs('quadrant', title)}
        ref={(ref) => this.quadrantDOM = ref}
        style={{...styles, ...style}}
      >
        <div className="quadrant__title" style={titleStyles}>
          {title}
          {resizable && <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth} />}
        </div>
        <div className="quadrant__body">
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
  (entities, types, components) => {
    const result = {
      types,
      components,
    };
    types.forEach((type) => {
      result[type] = entities[type];
    });
    return result;
  },
);

export default connect(selector)(Quadrant);
