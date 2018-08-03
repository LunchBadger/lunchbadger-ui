import React, {PureComponent} from 'react';
import {ResizableBox} from 'react-resizable';
import './Resizable.scss';

export default class Resizable extends PureComponent {
  render() {
    const {
      width,
      height,
      maxWidth,
      fullWidth,
      children,
      onResize,
      onResizeStop,
    } = this.props;
    return (
      <ResizableBox
        width={width}
        height={height}
        minConstraints={[200, 100]}
        maxConstraints={[maxWidth, 3000]}
        onResize={onResize}
        onResizeStop={onResizeStop}
        axis={fullWidth ? 'y' : 'both'}
      >
        {children}
      </ResizableBox>
    );
  }
}
