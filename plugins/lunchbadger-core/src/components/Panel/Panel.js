import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import PanelResizeHandle from './PanelResizeHandle';
import classNames from 'classnames';
import lockr from 'lockr';
import {actions} from '../../reduxActions/actions';
import './Panel.scss';

const headerHeight = 52;
const getContainerHeight = () => window.innerHeight;

export default (ComposedComponent) => {
  class Panel extends Component {
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
      let height = '50vh';
      if (lockr.get(this.storageKey)) {
        height = `${parseInt(lockr.get(this.storageKey) / 100 * getContainerHeight())}px`;
      }
      this.setState({height});
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.handleWindowResize);
    }

    componentWillReceiveProps(nextProps) {
      const {currentlyOpenedPanel} = nextProps;
      if (currentlyOpenedPanel !== this.props.currentlyOpenedPanel) {
        if (this.storageKey === currentlyOpenedPanel && !this.state.opened) {
          this.setState({opened: true});
          const panel = this.getPanelNode();
          panel && panel.onPanelOpen && panel.onPanelOpen();
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
        this.openTimeout = setTimeout(this.updateCanvasHeight);
        return;
      }
      if (this.state.opened) {
        this.updateCanvasHeight();
      } else {
        this.setCanvasHeight(null);
      }
    }

    getPanelNode = () => {
      if (!this.panel) return null;
      return this.panel.wrappedInstance || this.panel.decoratedComponentInstance || this.panel;
    };

    updateCanvasHeight = () => {
      const containerHeight = getContainerHeight();
      const heightToCalculation = this.state.height === '50vh' ? containerHeight / 2 : this.state.height;
      const canvasHeight = containerHeight - parseInt(heightToCalculation, 10);
      this.setCanvasHeight(canvasHeight);
    }

    handleWindowResize = (_event) => {
      if (this.state.opened) {
        this.updateCanvasHeight();
      }
    }

    setCanvasHeight = height => this.props.dispatch(actions.setCanvasHeight(height));

    handlePanelResize = (event) => {
      const containerHeight = getContainerHeight();
      // we need to store percentage value
      let newPixelHeight = event.clientY - headerHeight;
      if (newPixelHeight > containerHeight - 100) {
        newPixelHeight = containerHeight - 100;
      } else if (newPixelHeight < 50) {
        newPixelHeight = 80;
      }
      const newHeight = parseInt(newPixelHeight / containerHeight * 100, 10);
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
      let type = '';
      if (this.panel) {
        type = this.getPanelNode().constructor.type;
      }
      const containerClass = classNames(type, 'panel__container', {
        'panel__container--dragging': this.state.dragging,
      });
      return (
        <div className="panel highlighted editable">
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

  const selector = createSelector(
    state => state.states.currentlyOpenedPanel,
    currentlyOpenedPanel => ({currentlyOpenedPanel}),
  );

  return connect(selector)(Panel);
}
