import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import SystemDefcon1Error from './SystemDefcon1Error';
import {SmoothCollapse} from '../';
import {toggleSystemDefcon1, removeSystemDefcon1} from '../../reduxActions';
import {LoginManager} from '../../utils/auth';
import './SystemDefcon1.scss';

class SystemDefcon1Box extends Component {
  static propTypes = {
    server: PropTypes.bool,
    errors: PropTypes.array,
    defaultDetailsCollapse: PropTypes.bool,
    toggleErrorDetailsText: PropTypes.string,
    onClose: PropTypes.func,
    hideRemoveButton: PropTypes.bool,
  };

  static defaultProps = {
    server: false,
    errors: [],
    defaultDetailsCollapse: false,
    toggleErrorDetailsText: 'server output details',
    hideRemoveButton: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      visibleError: !props.defaultDetailsCollapse,
    }
  }

  componentWillMount() {
    this.toggleCanvasEntities3D('none');
  }

  componentWillUnmount() {
    this.toggleCanvasEntities3D('translateZ(0)');
  }

  toggleCanvasEntities3D = transform =>
    document.querySelectorAll('.Entity').forEach(item => item.style.transform = transform);

  toggleVisibleError = () => this.setState({visibleError: !this.state.visibleError});

  handleClose = () => {
    const {dispatch, server, onClose} = this.props;
    if (server) {
      LoginManager().logout();
    } else if (onClose) {
      onClose();
    } else {
      dispatch(toggleSystemDefcon1());
    }
  };

  handleClick = onClick => (event) => {
    const {onClose} = this.props;
    onClose && onClose();
    onClick && onClick(event);
  };

  handleRemove = item => () => this.props.dispatch(removeSystemDefcon1(item));

  handleBoxClick = event => event.stopPropagation();

  render() {
    const {
      title,
      server,
      errors,
      content,
      buttons,
      toggleErrorDetailsText,
      hideRemoveButton,
    } = this.props;
    const {visibleError} = this.state;
    const titleTxt = title || (server ? 'Server Failure' : 'The workspace crashed');
    const contentTxt = content || (server
      ? 'The system can\'t connect to the server. Please check that the server is running and reload the page.'
      : 'You\'ll need to fix the workspace crash cause');
    const hasErrorDetails = errors.length > 0 && errors[0].error.error.message;
    return (
      <div
        onClick={this.handleBoxClick}
        className={cs('SystemDefcon1__box', {visibleError, ConfirmModal: buttons})}
      >
        <div className="SystemDefcon1__box__title">
          {titleTxt}
        </div>
        <div className="SystemDefcon1__box__content">
          {contentTxt}
          {hasErrorDetails && (
            <div className="SystemDefcon1__box__content__details">
              <div>
                <span
                  className="SystemDefcon1__box__content__details--link"
                  onClick={this.toggleVisibleError}
                >
                  {visibleError ? 'Hide' : 'Show'} {toggleErrorDetailsText}
                </span>
              </div>
              <SmoothCollapse expanded={visibleError} heightTransition="500ms ease">
                <div className="SystemDefcon1__box__content__details--box">
                  {errors.map(({error: {error: {
                    message,
                    stack,
                    request,
                    body,
                    endpoint,
                    name,
                    method,
                    statusCode,
                  }}}, idx) => {
                    const isHtml = message.startsWith('<!DOCTYPE');
                    return (
                      <SystemDefcon1Error
                        key={idx}
                        index={idx + 1}
                        stack={stack}
                        request={request}
                        body={body}
                        onRemove={this.handleRemove(message)}
                        hideRemoveButton={hideRemoveButton}
                      >
                        <pre>
                          {method} on {endpoint}
                          <br />
                          {name} {statusCode !== 0 && statusCode}: {!isHtml && message}
                        </pre>
                        {isHtml && <span dangerouslySetInnerHTML={{__html: message}} />}
                      </SystemDefcon1Error>
                    );
                  })}
                </div>
              </SmoothCollapse>
            </div>
          )}
        </div>
        <div className="SystemDefcon1__box__content">
          {buttons && buttons.map(({label, onClick}, idx) => (
            <button
              key={label}
              onClick={this.handleClick(onClick)}
              className={cs({confirm: idx === 0, discard: idx === 1})}
            >
              {label}
            </button>
          ))}
          {!buttons && (
            <button onClick={this.handleClose}>
              {server ? 'RELOAD' : 'OK'}
            </button>
          )}
        </div>
      </div>
    );
  }
}

export default connect(null)(SystemDefcon1Box);
