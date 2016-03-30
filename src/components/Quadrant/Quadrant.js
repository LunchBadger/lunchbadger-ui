import React, {Component, PropTypes} from 'react';
import QuadrantResizeHandle from './QuadrantResizeHandle';
import './Quadrant.scss';

export default (ComposedComponent) => {
  return class Quadrant extends Component {
    static propTypes = {
      title: PropTypes.string.isRequired,
      resizable: PropTypes.bool,
      data: PropTypes.object
    };

    constructor(props) {
      super(props);

      this.state = {
        quadrantWidth: '25',
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

    render() {
      return (
        <div className="quadrant" style={{width: `${this.state.quadrantWidth}%`}}>
          <div className="quadrant__title">{this.props.title}</div>
          <div className="quadrant__body">
            <ComposedComponent {...this.props} entities={this.state.entities} />
          </div>
          {(() => {
            if (this.props.resizable) {
              return <QuadrantResizeHandle />;
            }
          })()}
        </div>
      );
    }
  }
}
