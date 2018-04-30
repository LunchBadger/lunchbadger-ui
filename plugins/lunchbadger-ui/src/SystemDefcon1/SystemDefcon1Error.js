import React, {PureComponent} from 'react';
import './SystemDefcon1.scss';

export default class SystemDefcon1Error extends PureComponent {
  state = {
    stackVisible: false,
    requestDataVisible: false,
  };

  toggleStackVisible = () => this.setState({stackVisible: !this.state.stackVisible});

  toggleRequestDataVisible = () => this.setState({requestDataVisible: !this.state.requestDataVisible});

  render() {
    const {index, children, onRemove, stack, request} = this.props;
    const {stackVisible, requestDataVisible} = this.state;
    return (
      <div>
        <h3>
          Error {index}
          {' '}
          <small className="removeError" onClick={onRemove}>remove</small>
          {' '}
          <small className="removeError" onClick={this.toggleRequestDataVisible}>
            {requestDataVisible ? 'hide' : 'show'} request data
          </small>
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
      </div>
    );
  }
}
