import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import SystemInformationMessage from './SystemInformationMessage';
import {removeSystemInformationMessages} from '../../../../plugins/lunchbadger-core/src/reduxActions/systemInformationMessages';
import './SystemInformationMessages.scss';

class SystemInformationMessages extends Component {
  componentWillMount() {
    this.cronjob = setInterval(this.checkMessages, 500);
  }

  componentWillUnmount() {
    clearInterval(this.cronjob);
  }

  checkMessages = () => {
    const {messages, dispatch} = this.props;
    const messagesToRemove = [];
    messages.forEach((item) => {
      if (Date.now() >= item.validUntil) messagesToRemove.push(item.message);
    });
    if (messagesToRemove.length > 0) {
      dispatch(removeSystemInformationMessages(messagesToRemove));
    }
  }

  onRemove = message => () => this.props.dispatch(removeSystemInformationMessages([message]));

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

const selector = createSelector(
  state => state.systemInformationMessages,
  messages => ({messages}),
);

export default connect(selector)(SystemInformationMessages);
