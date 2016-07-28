import React, {Component, PropTypes} from 'react';
import './Panel.scss';
import PanelResizeHandle from './PanelResizeHandle';
import classNames from 'classnames';
import lockr from 'lockr';

export default (ComposedComponent) => {
  return class Panel extends Component {
    static propTypes = {
      canvas: PropTypes.func.isRequired,
      container: PropTypes.func.isRequired,
      header: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        height: '50vh',
        opened: false
      };

      this.storageKey = null;

      this.appStateUpdate = () => {
        const currentPanel = this.props.appState.getStateKey('currentlyOpenedPanel');

        if (this.storageKey === currentPanel && !this.state.opened) {
          this.setState({opened: true});
        } else if (this.storageKey !== currentPanel) {
          this.setState({opened: false});
        }
      }
    }

    componentDidMount() {
      setTimeout(() => {
        this.header = this.props.header().refs.headerContainer;
        this.canvas = this.props.canvas();
        this.container = this.props.container();
        this.containerBBox = this.container.getBoundingClientRect();
        let panelDefaultHeight = '50vh';

        if (lockr.get(this.storageKey)) {
          panelDefaultHeight = `${parseInt(lockr.get(this.storageKey) / 100 * this.containerBBox.height)}px`;
        }

        this.setState({height: panelDefaultHeight});
      });
    }

    componentWillReceiveProps(nextProps) {
      if (nextProps.appState.getStateKey('currentlyOpenedPanel') !== this.props.appState.getStateKey) {
        this.appStateUpdate();
      }
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.opened === prevState.opened && this.state.height === prevState.height) {
        return;
      }

      const heightToCalculation = this.state.height === '50vh' ? this.containerBBox.height / 2 : this.state.height;

      clearTimeout(this.openTimeout);

      if (this.state.opened && !prevState.opened) {
        this.openTimeout = setTimeout(() => {
          this.canvas.setState({canvasHeight: this.containerBBox.height - parseInt(heightToCalculation, 10)});
        }, 1500);

        return;
      }

      if (this.state.opened) {
        this.canvas.setState({canvasHeight: this.containerBBox.height - parseInt(heightToCalculation, 10)});
      } else {
        this.canvas.setState({canvasHeight: null});
      }
    }

    handlePanelResize(event) {
      const container = this.props.container();
      const containerBBox = container.getBoundingClientRect();
      const headerBBox = this.header.getBoundingClientRect();

      // we need to store percentage value
      let newPixelHeight = event.clientY - headerBBox.height;

      if (newPixelHeight > containerBBox.height - 100) {
        newPixelHeight = containerBBox.height - 100;
      } else if (newPixelHeight < 50) {
        newPixelHeight = 80;
      }

      const newHeight = parseInt(newPixelHeight / containerBBox.height * 100, 10);

      lockr.set(this.storageKey, newHeight);

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

      if (this.state.opened) {
        panelHeight = this.state.height;
      }

      const containerClass = classNames({
        'panel__container': true,
        'panel__container--dragging': this.state.dragging
      });

      return (
        <div className="panel">
          <div className={containerClass} style={{height: panelHeight}}>
            <ComposedComponent parent={this} ref={(ref) => this.panel = ref} {...this.props} {...this.state} />
          </div>
          <PanelResizeHandle resizable={this.state.opened}
                             onDragEnd={this.handlePanelResizeEnd.bind(this)}
                             onDrag={this.handlePanelResize.bind(this)}/>
        </div>
      );
    }
  }
}
