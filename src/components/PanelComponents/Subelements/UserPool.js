import React, {Component, PropTypes} from 'react';
import UserPoolIcon, {USER_POOL} from './UserPoolIcon';
import {DropTarget} from 'react-dnd';
import './UserPool.scss';

const boxTarget = {
  drop(props, monitor) {
    const item = monitor.getItem();

    if (item.type === USER_POOL) {
      return;
    }
  }
};

@DropTarget('planElement', boxTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class UserPool extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired
  };

  render() {
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="user-pool">
        <div className="user-pool__title">User Pool</div>
        <UserPoolIcon/>
      </div>
    );
  }
}
