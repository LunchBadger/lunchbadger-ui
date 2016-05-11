import React, {Component, PropTypes} from 'react';
import './Panel.scss';
import PanelResizeHandle from './PanelResizeHandle';
import classNames from 'classnames';
import lockr from 'lockr';

export default (ComposedComponent) => {
  return class Panel extends Component {
    static propTypes = {
      canvas: PropTypes.func.isRequired,
      container: PropTypes.func.isRequired
    };

    constructor(props) {
      super(props);

      this.state = {
        height: '50vh',
        opened: false
      };

      let animationTime = (this.props.appState.getStateKey('isPanelOpened')) ? 500 : 0;
      this.storageKey = null;

      this.appStateUpdate = () => {
        const currentPanel = this.props.appState.getStateKey('currentlyOpenedPanel');

        if (this.storageKey === currentPanel && !this.state.opened) {
          // keep the timeout equal to css animation time...

          setTimeout(() => {
            this.setState({opened: true});
          }, animationTime);
        } else if (this.storageKey !== currentPanel) {
          this.setState({opened: false});
        }

        animationTime = (this.props.appState.getStateKey('isPanelOpened')) ? 500 : 0;
      }
    }

    componentDidMount() {
      setTimeout(() => {
        const container = this.props.container();
        const containerBBox = container.getBoundingClientRect();
        let panelDefaultHeight = '50vh';

        if (lockr.get(this.storageKey)) {
          panelDefaultHeight = `${parseInt(lockr.get(this.storageKey) / 100 * containerBBox.height)}px`;
        }

        this.setState({height: panelDefaultHeight});
      });
    }

    componentWillReceiveProps() {
      this.appStateUpdate();
    }

    componentDidUpdate() {
      const canvas = this.props.canvas();

      if (this.state.opened) {
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
