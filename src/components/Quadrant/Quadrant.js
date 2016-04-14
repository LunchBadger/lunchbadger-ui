import React, {Component, PropTypes} from 'react';
import Sortable from 'react-sortablejs';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';

const sortableOptions = {
  ref: 'list',
  model: 'entities',
  group: 'all',
  onStar: 'handleStart',
  onEnd: 'handleEnd'
};

export default (ComposedComponent) => {
  class Quadrant extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      sortableInstance: React.PropTypes.object,
      resizable: PropTypes.bool,
      data: PropTypes.object.isRequired,
      paper: PropTypes.object
    };

    handleStart(evt) {
      console.log('handleStart:', evt);
    }

    handleEnd(evt) {
      console.log('handleEnd:', evt);
    }

    constructor(props) {
      super(props);

      this.state = {
        quadrantWidth: '25%',
        entities: this.props.data.getData()
      };
    }

    componentDidUpdate() {
      if (this.props.paper) {
        this.props.paper.repaintEverything();
      }
    }

    recalculateQuadrantWidth(event) {
      const quadrantBounds = this.refs.quadrant.getBoundingClientRect();
      const newWidth = event.clientX - quadrantBounds.left;

      this.setState({quadrantWidth: `${newWidth}px`});
      this.props.paper.repaintEverything();
    }

    render() {
      return (
        <div className="quadrant" ref="quadrant" style={{width: this.state.quadrantWidth}}>
          <div className="quadrant__title">{this.props.title}</div>
          <div className="quadrant__body">
            <ComposedComponent {...this.props} ref="list" entities={this.state.entities}/>
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

  return Sortable(sortableOptions)(Quadrant);
}
