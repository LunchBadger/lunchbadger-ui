import React, {Component} from 'react';
import {connect} from 'react-redux';
import SystemNotification from './SystemNotification';

class SystemNotifications extends Component {
  render() {
    const {notifications} = this.props;
    return (
      <div>
        {notifications.map((item, idx) => <SystemNotification key={idx} {...item} />)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.ui.systemNotifications,
});

export default connect(mapStateToProps)(SystemNotifications);
