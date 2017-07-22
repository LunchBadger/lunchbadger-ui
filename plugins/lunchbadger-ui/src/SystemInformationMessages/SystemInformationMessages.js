import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux'
import SystemInformationMessage from './SystemInformationMessage';
import {removeSystemInformationMessages} from '../actions';
import './SystemInformationMessages.scss';

class SystemInformationMessages extends Component {
  componentWillMount() {
    this.cronjob = setInterval(this.checkMessages, 500);
  }

  componentWillUnmount() {
    clearInterval(this.cronjob);
  }

  checkMessages = () => {
    const {messages, removeMessages} = this.props;
    const messagesToRemove = [];
    messages.forEach((item) => {
      if (Date.now() >= item.validUntil) messagesToRemove.push(item.message);
    });
    if (messagesToRemove.length > 0) {
      removeMessages(messagesToRemove);
    }
  }

  onRemove = message => () => this.props.removeMessages([message]);

  render() {
    const {messages} = this.props;
    return (
      <div className="SystemInformationMessages">
        {messages.map(({message}, idx) => (
          <SystemInformationMessage
            key={idx}
            message={message}
            onRemove={this.onRemove(message)}
          />
        ))}
      </div>
    );
  }
}

SystemInformationMessages.propTypes = {
  messages: PropTypes.array,
  removeMessages: PropTypes.func,
};

const mapStateToProps = state => ({
  messages: state.ui.systemInformationMessages,
});

const mapDispatchToProps = dispatch => ({
  removeMessages: messages => dispatch(removeSystemInformationMessages(messages)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SystemInformationMessages);
