import React, {Component, PropTypes} from 'react';
import './Panel.scss';
import PanelResizeHandle from './PanelResizeHandle';
import classNames from 'classnames';
import lockr from 'lockr';
import togglePanel from 'actions/togglePanel';

const storageKey = 'PANEL_HEIGHT';

export default class Panel extends Component {
  static propTypes = {
    canvas: PropTypes.func.isRequired,
    opened: PropTypes.bool.isRequired,
    container: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      height: '50vh'
    };
  }

  componentDidMount() {
    setTimeout(() => {
      const container = this.props.container();
      const containerBBox = container.getBoundingClientRect();
      let panelDefaultHeight = '50vh';

      if (lockr.get(storageKey)) {
        panelDefaultHeight = `${parseInt(lockr.get(storageKey) / 100 * containerBBox.height)}px`;
      }

      this.setState({height: panelDefaultHeight});
    });
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
    const container = this.props.container();
    const containerBBox = container.getBoundingClientRect();

    // we need to store percentage value
    let newPixelHeight = event.clientY - containerBBox.top;

    if (newPixelHeight > containerBBox.height - 100) {
      newPixelHeight = containerBBox.height - 100;
    } else if (newPixelHeight < 50) {
      newPixelHeight = 80;
      togglePanel();
    }

    const newHeight = parseInt(newPixelHeight / containerBBox.height * 100, 10);

    lockr.set(storageKey, newHeight);

    this.setState({
      dragging: true,
      height: `${newPixelHeight}px`
    });
  }

  handlePanelResizeEnd() {
    this.setState({dragging: false});
  }

  render() {
    let panelHeight = '0px';

    if (this.props.opened) {
      panelHeight = this.state.height;
    }

    const containerClass = classNames({
      'panel__container': true,
      'panel__container--dragging': this.state.dragging
    });

    return (
      <div className="panel">
        <div className={containerClass} style={{height: panelHeight}}>
          <div className="panel__body"></div>
        </div>
        <PanelResizeHandle resizable={this.props.opened}
                           onDragEnd={this.handlePanelResizeEnd.bind(this)}
                           onDrag={this.handlePanelResize.bind(this)}/>
      </div>
    );
  }
}
