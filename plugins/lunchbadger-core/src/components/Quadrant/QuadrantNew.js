import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import {DropTarget} from 'react-dnd';
import './Quadrant.scss';

// const boxTarget = {
//   drop(_props, monitor, component) {
//     // const hasDroppedOnChild = monitor.didDrop();
//     // const item = monitor.getItem();
//     // if (!hasDroppedOnChild) {
//     //   if (item.subelement) {
//     //     if (typeof item.handleEndDrag === 'function') {
//     //       item.handleEndDrag(item);
//     //     }
//     //   } else if (item.appState) {
//     //     if (typeof item.groupEndDrag === 'function') {
//     //       item.groupEndDrag();
//     //     }
//     //   }
//     // }
//     // component.setState({
//     //   hasDropped: true,
//     //   hasDroppedOnChild: hasDroppedOnChild
//     // });
//   }
// };
//
// @DropTarget(['canvasElement', 'elementsGroup'], boxTarget, connect => ({
//   connectDropTarget: connect.dropTarget()
// }))

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
  };

  constructor(props) {
    super(props);
    this.state = {
      hasDroppedOnChild: false,
      hasDropped: false,
      orderedIds: [],
      draggingId: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    this.updateOrderedIds(this.getOrderedIds(nextProps));
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
          itemOrder: props[type][id].data.itemOrder,
        })),
      ]), [])
    .sort((a, b) => a.itemOrder > b.itemOrder)
    .map(({id, type}) => ({id, type}));

  recalculateQuadrantWidth = (event) => {
    const {recalculateQuadrantsWidths, index} = this.props;
    recalculateQuadrantsWidths(index, event.clientX - this.quadrantDOM.getBoundingClientRect().left);
  }

  moveEntity = (id, dragIndex, hoverIndex) => {
    const type = this.state.orderedIds.find(item => item.id === id).type;
    const orderedIds = this.state.orderedIds.filter(item => item.id !== id);
    orderedIds.splice(hoverIndex, 0, {id, type});
    this.updateOrderedIds(orderedIds, id);
  }

  saveOrder = () => {
    this.setState({draggingId: ''});
  }

  render() {
    const {title, connectDropTarget, scrollLeft, resizable, width, components} = this.props;
    const styles = {width};
    const titleStyles = {
      ...styles,
      transform: `translateX(-${scrollLeft}px)`,
    }
    const {orderedIds, draggingId} = this.state;
    // console.log('RENDER QuadrantNew', title, orderedIds);
    return (
      <div
        className="quadrant"
        ref={(ref) => this.quadrantDOM = ref}
        style={styles}
      >
        <div className="quadrant__title" style={titleStyles}>
          {title}
          {resizable && <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth} />}
        </div>
        <div className="quadrant__body">
          {orderedIds.map(({id, type}, idx) => {
            const entity = this.props[type][id];
            const Component = components[entity.metadata.type];
            return (
              <Component
                id={id}
                icon=""
                key={idx}
                appState={null}
                paper={null}
                entity={entity}
                hideSourceOnDrag={true}
                itemOrder={idx}
                moveEntity={this.moveEntity}
                saveOrder={this.saveOrder}
                dragging={draggingId === id}
              />
            );
          })}
        </div>
        {resizable && <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth} />}
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
