import React, {Component} from 'react';
import PropTypes from 'prop-types';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';
import {DropTarget} from 'react-dnd';

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
export default (ComposedComponent) => {
  class Quadrant extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      sortableInstance: PropTypes.object,
      resizable: PropTypes.bool,
      data: PropTypes.object.isRequired,
      paper: PropTypes.object,
      width: PropTypes.number,
      index: PropTypes.number,
      scrollLeft: PropTypes.number,
      recalculateQuadrantsWidths: PropTypes.func,
    };

    constructor(props) {
      super(props);
      this.dataStoreUpdate = () => {
        this.setState({entities: this.props.data.getData()});
      };
      this.state = {
        entities: this.props.data.getData(),
        hasDroppedOnChild: false,
        hasDropped: false,
      };
    }

    componentWillMount() {
      this.props.data.addChangeListener(this.dataStoreUpdate);
      this.props.data.addInitListener(this.dataStoreUpdate);
    }

    componentWillUnmount() {
      this.props.data.removeChangeListener(this.dataStoreUpdate);
      this.props.data.removeInitListener(this.dataStoreUpdate);
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
      const {connectDropTarget, scrollLeft, resizable, width} = this.props;
      const styles = {width};
      const titleStyles = {
        ...styles,
        transform: `translateX(-${scrollLeft}px)`,
      }
      return connectDropTarget(
        <div
          className="quadrant"
          ref={(ref) => this.quadrantDOM = ref}
          style={styles}
        >
          <div className="quadrant__title" style={titleStyles}>
            {this.props.title}
          </div>
          <ComposedComponent {...this.props} ref={(ref) => this.quadrant = ref} entities={this.state.entities}/>
          {resizable && <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth} />}
        </div>
      );
    }
  }

  return Quadrant;
}
