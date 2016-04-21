import React, {Component, PropTypes} from 'react';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';
import {DropTarget} from 'react-dnd';
import movePublicEndpoint from '../../actions/CanvasElements/PublicEndpoint/move';
import removeEndpoint from '../../actions/CanvasElements/API/removeEndpoint';

const boxTarget = {
  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();

    if (!hasDroppedOnChild) {
      const item = monitor.getItem();
      if (item.subelement) {
        movePublicEndpoint(item.entity);
        removeEndpoint(item.parent, item.entity);
      } else {
        const delta = monitor.getDifferenceFromInitialOffset();
        const left = Math.round(item.left + delta.x);
        const top = Math.round(item.top + delta.y);
        component.moveEntity(item.entity, left, top);
      }
    }

    component.setState({
      hasDropped: true,
      hasDroppedOnChild: hasDroppedOnChild
    });
  }
};

@DropTarget('canvasElement', boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
export default (ComposedComponent) => {
  class Quadrant extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      sortableInstance: React.PropTypes.object,
      resizable: PropTypes.bool,
      data: PropTypes.object.isRequired,
      paper: PropTypes.object
    };

    constructor(props) {
      super(props);
      this.moveEntity = this.moveEntity.bind(this);

      this.state = {
        quadrantWidth: '25%',
        entities: this.props.data.getData(),
        hasDroppedOnChild: false,
        hasDropped: false
      };
    }

    componentDidUpdate() {
      if (this.props.paper) {
        this.props.paper.repaintEverything();
      }
    }

    recalculateQuadrantWidth(event) {
      const quadrantBounds = this.quadrantDOM.getBoundingClientRect();
      const newWidth = event.clientX - quadrantBounds.left;

      this.setState({quadrantWidth: `${newWidth}px`});
      this.props.paper.repaintEverything();
    }

    moveEntity(...props) {
      if (typeof this.quadrant.moveEntity === 'function') {
        this.quadrant.moveEntity(...props);
      }
    }

    render() {
      const {connectDropTarget} = this.props;
      return connectDropTarget(
        <div className="quadrant" ref={(ref) => this.quadrantDOM = ref} style={{width: this.state.quadrantWidth}}>
          <div className="quadrant__title">{this.props.title}</div>
          <div className="quadrant__body">
            <ComposedComponent {...this.props} ref={(ref) => this.quadrant = ref} entities={this.state.entities}/>
          </div>
          {(() => {
            if (this.props.resizable) {
              return <QuadrantResizeHandle onDrag={this.recalculateQuadrantWidth.bind(this)}/>;
            }
          })()}
        </div>
      );
    }
  }

  return Quadrant;
}
