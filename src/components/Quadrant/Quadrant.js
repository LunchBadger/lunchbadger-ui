import React, {Component, PropTypes} from 'react';
import Sortable from 'react-sortablejs';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';

const sortableOptions = {
  ref: 'list',
  model: 'entities'
};

export default (ComposedComponent) => {
  class Quadrant extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      sortableInstance: React.PropTypes.object,
      resizable: PropTypes.bool,
      data: PropTypes.object.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        quadrantWidth: '25%',
        entities: []
      };

      this.onStoreChange = () => {
        this.setState({
          entities: this.props.data.getData()
        });
      }
    }

    componentDidMount() {
      if (this.props.data) {
        this.props.data.addChangeListener(this.onStoreChange);
      }
    }

    componentWillUnmount() {
      if (this.props.data) {
        this.props.data.removeChangeListener(this.onStoreChange);
      }
    }

    recalculateQuadrantWidth(event) {
      const quadrantBounds = this.refs.quadrant.getBoundingClientRect();
      const newWidth = event.clientX - quadrantBounds.left;

      this.setState({quadrantWidth: `${newWidth}px`});
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
