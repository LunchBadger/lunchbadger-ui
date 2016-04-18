import React, {Component, PropTypes} from 'react';
import './Panel.scss';
import PanelResizeHandle from './PanelResizeHandle';

export default class Panel extends Component {
  static propTypes = {
    canvas: PropTypes.func.isRequired,
    opened: PropTypes.bool.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      height: '50vh'
    };
  }

  componentDidUpdate() {
    const canvas = this.props.canvas();

    if (this.props.opened) {
      canvas.setState({disabled: true});
    } else {
      canvas.setState({disabled: false});
    }
  }

  handlePanelResize(event) {
    console.log(event);
  }

  render() {
    let panelHeight = '0px';

    if (this.props.opened) {
      panelHeight = this.state.height;
    }

    return (
      <div className="panel">
        <div className="panel__container" style={{height: panelHeight}}>
          <div className="panel__body"></div>
        </div>
        <PanelResizeHandle resizable={this.props.opened} onDrag={this.handlePanelResize.bind(this)}/>
      </div>
    );
  }
}
