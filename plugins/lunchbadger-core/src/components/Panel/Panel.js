import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PanelResizeHandle from './PanelResizeHandle';
import classNames from 'classnames';
import lockr from 'lockr';
import './Panel.scss';

export default (ComposedComponent) => {
  class Panel extends Component {
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
    }

    componentDidMount() {
      window.addEventListener('resize', this.handleWindowResize);
      setTimeout(() => {
        this.header = this.props.header().refs.headerContainer;
        this.canvas = this.props.canvas();
        this.container = this.props.container();
        let panelDefaultHeight = '50vh';

        if (lockr.get(this.storageKey)) {
          panelDefaultHeight = `${parseInt(lockr.get(this.storageKey) / 100 * this.getContainerHeight())}px`;
        }

        this.setState({height: panelDefaultHeight});
      });
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize);
    }

    componentWillReceiveProps(nextProps) {
      const {currentlyOpenedPanel} = nextProps;
      if (currentlyOpenedPanel !== this.props.currentlyOpenedPanel) {
        if (this.storageKey === currentlyOpenedPanel && !this.state.opened) {
          this.setState({opened: true});
        } else if (this.storageKey !== currentlyOpenedPanel) {
          this.setState({opened: false});
        }
      }
    }

    componentDidUpdate(_prevProps, prevState) {
      if (this.state.opened === prevState.opened && this.state.height === prevState.height) {
        return;
      }

      clearTimeout(this.openTimeout);

      if (this.state.opened && !prevState.opened) {
        this.openTimeout = setTimeout(() => {
          this.updateCanvasHeight();
        }, 1500);

        return;
      }

      if (this.state.opened) {
        this.updateCanvasHeight();
      } else {
        this.canvas.setState({canvasHeight: null});
      }
    }

    updateCanvasHeight() {
      const containerHeight = this.getContainerHeight();
      const heightToCalculation = this.state.height === '50vh' ? containerHeight / 2 : this.state.height;
      this.canvas.setState({canvasHeight: containerHeight - parseInt(heightToCalculation, 10)});
    }

    getContainerHeight() {
      return this.container.getBoundingClientRect().height;
    }

    handleWindowResize = (_event) => {
      if (this.state.opened) {
        this.updateCanvasHeight();
      }
    }

    handlePanelResize = (event) => {
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

    handlePanelResizeEnd = () => {
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
                             onDragEnd={this.handlePanelResizeEnd}
                             onDrag={this.handlePanelResize}/>
        </div>
      );
    }
  }

  const mapStateToProps = state => ({
    currentlyOpenedPanel: state.core.appState.currentlyOpenedPanel,
  });

  return connect(mapStateToProps)(Panel);
}
