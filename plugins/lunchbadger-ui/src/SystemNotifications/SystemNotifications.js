import React, {Component} from 'react';
import {connect} from 'react-redux';
import cs from 'classnames';
import {toggleSystemNotifications} from '../actions';
import './SystemNotifications.scss';

class SystemNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    }
  }

  toggleOpen = () => this.setState({opened: !this.state.opened});

  hideMessages = () => {
    this.setState({opened: false}, this.props.hideMessages);
  }

  render() {
    const {visible, notifications, hideMessages} = this.props;
    const {opened} = this.state;
    const amount = notifications.length;
    if (!visible || amount === 0) return null;
    return (
      <div className="SystemNotification">
        <button className="SystemNotification__close" onClick={this.hideMessages}>
          Close
        </button>
        <div className="SystemNotification__title">
          The workspace crashed
        </div>
        <div className="SystemNotification__details">
          <span className="SystemNotification__details__link" onClick={this.toggleOpen}>
            {`${opened ? 'Hide' : 'Show'} server output details`}
          </span>
          <div className={cs('SystemNotification__details__output', {opened})}>
            <div className="SystemNotification__details__output--box">
              {notifications.map((item, idx) => (
                <div key={idx}>
                  {amount > 1  && (
                    <div className="SystemNotification__details__output--title">
                      Error {idx + 1}:
                    </div>
                  )}
                  <pre>{item.output}</pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  notifications: state.ui.systemNotifications.errors,
  visible: state.ui.systemNotifications.visible,
});

const mapDispatchToProps = dispatch => ({
  hideMessages: () => dispatch(toggleSystemNotifications(false)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SystemNotifications);
