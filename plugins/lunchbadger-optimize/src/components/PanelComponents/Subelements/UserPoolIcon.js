import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {DragSource} from 'react-dnd';

export const USER_POOL = 'USER_POOL';

const boxSource = {
  beginDrag() {
    return {
      type: USER_POOL
    };
  }
};

@DragSource('planElement', boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class UserPoolIcon extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired
  };

  render() {
    const {connectDragSource} = this.props;

    return connectDragSource(
      <div className="user-pool__icon">
        <i className="fa fa-user"/>
      </div>
    );
  }
}
