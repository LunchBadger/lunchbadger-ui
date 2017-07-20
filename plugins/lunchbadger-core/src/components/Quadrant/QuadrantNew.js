import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import {DropTarget} from 'react-dnd';

import './Quadrant.scss';
const boxTarget = {
  drop(_props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();
    const item = monitor.getItem();
    if (!hasDroppedOnChild) {
      if (item.subelement) {
        if (typeof item.handleEndDrag === 'function') {
          item.handleEndDrag(item);
        }
      } else if (item.appState) {
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

export default class Quadrant extends Component {
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
    };
  }

  recalculateQuadrantWidth = (event) => {
    const {recalculateQuadrantsWidths, index} = this.props;
    recalculateQuadrantsWidths(index, event.clientX - this.quadrantDOM.getBoundingClientRect().left);
  }

  moveEntity = (...props) => {
    if (typeof this.quadrant.moveEntity === 'function') {
      this.quadrant.moveEntity(...props);
    }
  }

  render() {
    const {appState, paper, connectDropTarget, scrollLeft, resizable, width, entities, components} = this.props;
    const styles = {width};
    const titleStyles = {
      ...styles,
      transform: `translateX(-${scrollLeft}px)`,
    }
    const Component = components
    return connectDropTarget(
      <div
        className="quadrant"
        ref={(ref) => this.quadrantDOM = ref}
        style={styles}
      >
        <div className="quadrant__title" style={titleStyles}>
          {this.props.title}
          {resizable && <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth} />}
        </div>
        <div className="quadrant__body">
          {entities.map((entity, idx) => {
            const Component = components[entity.constructor.type];
            return (
              <Component
                icon=""
                key={idx}
                appState={appState}
                paper={paper}
                entity={entity}
                hideSourceOnDrag={true}
                itemOrder={entity.itemOrder}
                moveEntity={() => {}}
                saveOrder={() => {}}
                ready={entity.ready}
              />
            )
          })}
        </div>
        {resizable && <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth} />}
      </div>
    );
  }
}
