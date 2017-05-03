import React, {Component} from 'react';
import {connect} from 'react-redux'
import './SystemInformationMessage.scss';

class SystemInformationMessage extends Component {
  render() {
    const {messages} = this.props;
    return (
      <div className="SystemInformationMessage">
        {messages.map(({message}, idx) => (
          <div key={idx} className="SystemInformationMessage__item">
            {message}
          </div>
        ))}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  messages: state.ui.systemInformationMessages,
});

export default connect(mapStateToProps)(SystemInformationMessage);
