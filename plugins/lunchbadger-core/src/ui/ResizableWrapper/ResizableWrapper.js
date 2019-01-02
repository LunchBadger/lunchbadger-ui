import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Resizable} from '../';
import userStorage from '../../utils/userStorage';

import './ResizableWrapper.scss';

export default class ResizableWrapper extends PureComponent {
  static propTypes = {
    initialHeight: PropTypes.number,
    fullWidth: PropTypes.bool,
  };

  static defaultProps = {
    initialHeight: 200,
    fullWidth: false,
  };

  constructor(props) {
    super(props);
    const {initialHeight} = props;
    this.state = {
      width: 9999,
      maxWidth: 0,
      height: initialHeight,
    };
  }

  componentDidMount() {
    this.recalculateWidth(true);
    window.addEventListener('rndresized', this.recalculateWidth);
  }

  componentWillUnmount() {
    window.removeEventListener('rndresized', this.recalculateWidth);
  }

  recalculateWidth = (init = false) => {
    const {width, maxWidth} = this.state;
    const rect = this.boxRef.getBoundingClientRect();
    const max = Math.max(0, rect.width - 5);
    const state = {maxWidth: max};
    if (width > max || width === maxWidth) {
      state.width = max;
    }
    if (init) {
      const resizableWrapperSize = userStorage.getObjectKey('ResizableWrapperSize', this.props.entityId);
      if (resizableWrapperSize) {
        state.width = resizableWrapperSize.width;
        state.height = resizableWrapperSize.height;
      }
    }
    this.setState(state);
  };

  handleResize = (_, {size}) => {
    this.inpRef.focus();
    this.inpRef.blur();
    const width = Math.floor(size.width);
    const height = Math.floor(size.height);
    const newSize = {width, height};
    const {entityId} = this.props;
    if (entityId) {
      userStorage.setObjectKey('ResizableWrapperSize', entityId, newSize);
    }
    this.setState(newSize);
  };

  render() {
    const {children} = this.props;
    const {width, height, maxWidth, fullWidth} = this.state;
    return (
      <div
        className="ResizableWrapper"
        ref={r => this.boxRef = r}
      >
        <Resizable
          width={width}
          height={height}
          fullWidth={fullWidth}
          maxWidth={maxWidth}
          onResize={this.handleResize}
        >
          {children}
        </Resizable>
        <input
          className="ResizableWrapper__indicator"
          ref={r => this.inpRef = r}
        />
      </div>
    );
  }
}
