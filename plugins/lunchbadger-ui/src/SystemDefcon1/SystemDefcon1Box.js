import React, {Component} from 'react';
import cs from 'classnames';
import {SmoothCollapse, IconSVG} from '../';
import {iconDelete} from '../../../../src/icons';
import './SystemDefcon1.scss';

class SystemDefcon1Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleError: false,
    }
  }

  toggleVisibleError = () => this.setState({visibleError: !this.state.visibleError});

  handleClose = () => {
    const {onClose, server} = this.props;
    if (server) {
      document.location.reload();
    } else {
      onClose();
    }
  }

  render() {
    const {server = false, errors} = this.props;
    const {visibleError} = this.state;
    const title = server ? 'Server Failure' : 'The workspace crashed';
    const content = server
      ? "The system can't connect to the server. Please check that the server is running and reload the page."
      : "You'll need to fix the workspace crash cause";
    return (
      <div className="SystemDefcon1">
        <div className={cs('SystemDefcon1__box', {['visibleError']: visibleError})}>
          <div className="SystemDefcon1__box__title">
            {title}
          </div>
          <div className="SystemDefcon1__box__content">
            {content}
            {server && (
              <div className="SystemDefcon1__box__content--error">
                ERROR: {errors.join('')}
              </div>
            )}
            {!server && (
              <div className="SystemDefcon1__box__content__details">
                <div>
                  <span
                    className="SystemDefcon1__box__content__details--link"
                    onClick={this.toggleVisibleError}
                  >
                    {visibleError ? 'Hide' : 'Show'} server output details
                  </span>
                </div>
                <SmoothCollapse expanded={visibleError} heightTransition="500ms ease">
                  <div className="SystemDefcon1__box__content__details--box">
                    {errors.map((item, idx) => (
                      <div key={idx}>
                        {errors.length > 1 && <h3>Error {idx + 1}</h3>}
                        <pre>{item}</pre>
                      </div>
                    ))}
                  </div>
                </SmoothCollapse>
              </div>
            )}
          </div>
          <div className="SystemDefcon1__box__content">
            <button onClick={this.handleClose}>
              {server ? 'RELOAD' : 'OK'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default SystemDefcon1Box;
