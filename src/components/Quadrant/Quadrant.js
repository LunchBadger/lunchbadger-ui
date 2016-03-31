import React, {Component, PropTypes} from 'react';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';

export default (ComposedComponent) => {
  return class Quadrant extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
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
        })
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
            <ComposedComponent {...this.props} entities={this.state.entities}/>
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
}
