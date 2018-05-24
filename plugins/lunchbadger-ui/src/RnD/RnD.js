import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import Rnd from 'react-rnd';
import {IconSVG, entityIcons, Toolbox} from '../';
import userStorage from '../../../lunchbadger-core/src/utils/userStorage';
import './RnD.scss';

export default class RnD extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    rect: PropTypes.object.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.deltaX = 0;
    this.deltaY = 0;
    const {rect, entityId} = props;
    let {width, height} = rect.zoomWindow;
    const entityZoomWindow = userStorage.getObjectKey('zoomWindow', entityId);
    if (entityZoomWindow) {
      width = entityZoomWindow.width;
      height = entityZoomWindow.height;
    }
    const {innerWidth, innerHeight} = window;
    width = Math.min(width, innerWidth - 20);
    height = Math.min(height, innerHeight - 40);
    this.state = {
      left: 0,
      top: 0,
      width,
      height,
    };
  }

  componentDidMount() {
    const {x, y} = this.props.rect;
    setTimeout(() => this.setState({
      opened: true,
      x: 0,
      y: 0,
      left: `calc(50% - ${x}px)`,
      top: `calc(50% - ${y}px)`,
    }));
    setTimeout(this.dispatchResizeEvent, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const {rect: {x, y, close}, onClose} = nextProps;
    if (close) {
      this.setState({
        opened: false,
        x,
        y,
        left: -this.deltaX,
        top: -this.deltaY,
        custom: false,
      });
      setTimeout(onClose, 1000);
    }
  }

  handleResizeStart = (event, dir, ref) => {
    if (this.state.dirtyResize) return;
    const {x, y} = ref.getBoundingClientRect();
    const {rect} = this.props;
    this.setState({
      opened: false,
      custom: true,
      left: x - rect.x - this.deltaX,
      top: y - rect.y - this.deltaY,
      dirtyResize: true,
    });
  };

  handleResize = () => this.dispatchResizeEvent();

  handleResizeStop = (event, dir, refToElement, delta) => {
    const {width, height} = delta;
    if (['topLeft', 'left', 'bottomLeft'].includes(dir)) {
      this.deltaX -= width;
    }
    if (['topLeft', 'top', 'topRight'].includes(dir)) {
      this.deltaY -= height;
    }
    const {offsetWidth, offsetHeight} = refToElement;
    userStorage.setObjectKey('zoomWindow', this.props.entityId, {
      width: offsetWidth,
      height: offsetHeight,
    });
  };

  handleDragStart = (event, data) => {
    const {x, y} = data;
    this.deltaXStart = x;
    this.deltaYStart = y;
  };

  handleDragStop = (event, data) => {
    const {x, y} = data;
    this.deltaX += x - this.deltaXStart;
    this.deltaY += y - this.deltaYStart;
  };

  dispatchResizeEvent = () => window.dispatchEvent(new Event('rndresized'));

  render() {
    const {
      children,
      name,
      type,
      toolbox,
      rect,
    } = this.props;
    const {x, y, width: maxWidth, height: maxHeight} = rect;
    const {opened, custom, left, top, width, height} = this.state;
    return (
      <div
        ref={r => this.refWrap = r}
        className={cs('wrap', {opened, custom})}
        style={{left, top}}
      >
      <div>
        <Rnd
          ref={r => this.rndRef = r}
          className={cs('RnD', {opened, custom})}
          minWidth={rect.width}
          minHeight={rect.height}
          z={1005}
          bounds=".canvas__zoom-area"
          dragHandleClassName=".RnD__header"
          default={{x, y, width, height}}
          onResizeStart={this.handleResizeStart}
          onResize={this.handleResize}
          onResizeStop={this.handleResizeStop}
          onDragStart={this.handleDragStart}
          onDragStop={this.handleDragStop}
        >
          <div className="RnD__box" style={{maxWidth, maxHeight}}>
            <div className="RnD__header">
              <div className="RnD__header__icon">
                <IconSVG svg={entityIcons[type]} />
              </div>
              <div className="RnD__header__name">
                <div className="RnD__header__name__text">
                  {name}
                </div>
              </div>
            </div>
            <div className="RnD__toolbox">
              <Toolbox config={toolbox} zoom />
            </div>
            <div className="RnD__content">
              {children}
            </div>
          </div>
        </Rnd>
      </div>
      </div>
    );
  }
}
