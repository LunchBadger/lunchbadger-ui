import React, {Component} from 'react';
import {connect} from 'react-redux'
import {shiftSystemInformationMessage} from '../actions';
import SystemInformationMessage from './SystemInformationMessage';
import './SystemInformationMessages.scss';

class SystemInformationMessages extends Component {
  render() {
    const {messages} = this.props;
    return (
      <div className="SystemInformationMessages">
        {messages.map(({message}, idx) => <SystemInformationMessage key={idx} message={message} />)}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  messages: state.ui.systemInformationMessages,
});

export default connect(mapStateToProps)(SystemInformationMessages);
