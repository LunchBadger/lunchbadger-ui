import React, {PureComponent} from 'react';
import './SystemDefcon1.scss';

export default class SystemDefcon1Error extends PureComponent {
  state = {
    stackVisible: false,
    requestDataVisible: true,
    responseDataVisible: true,
  };

  toggleStackVisible = () => this.setState({stackVisible: !this.state.stackVisible});

  toggleRequestDataVisible = () => this.setState({requestDataVisible: !this.state.requestDataVisible});

  toggleResponseDataVisible = () => this.setState({responseDataVisible: !this.state.responseDataVisible});

  render() {
    const {index, children, onRemove, stack, request, body, hideRemoveButton} = this.props;
    const {
      stackVisible,
      requestDataVisible,
      responseDataVisible,
    } = this.state;
    return (
      <div>
        <h3>
          Error {index}
          {' '}
          {!hideRemoveButton && (
            <small className="removeError" onClick={onRemove}>remove</small>
          )}
          {' '}
          {request && (
            <small className="removeError" onClick={this.toggleRequestDataVisible}>
              {requestDataVisible ? 'hide' : 'show'} request data
            </small>
          )}
          {' '}
          {body && (
            <small className="removeError" onClick={this.toggleResponseDataVisible}>
              {responseDataVisible ? 'hide' : 'show'} response data
            </small>
          )}
          {' '}
          {stack && (
            <small className="removeError" onClick={this.toggleStackVisible}>
              {stackVisible ? 'hide' : 'show'} stack trace
            </small>
          )}
        </h3>
        {children}
        {stackVisible && (
          <pre>
            STACK TRACE:
            <br />
            {stack}
          </pre>
        )}
        {requestDataVisible && (
          <pre>
            REQUEST DATA:
            <br />
            {JSON.stringify(request, null, 2)}
          </pre>
        )}
        {responseDataVisible && (
          <pre>
            RESPONSE DATA:
            <br />
            {JSON.stringify(body, null, 2)}
          </pre>
        )}
      </div>
    );
  }
}
