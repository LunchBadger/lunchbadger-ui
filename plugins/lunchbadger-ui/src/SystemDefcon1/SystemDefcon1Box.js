import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import {SmoothCollapse} from '../';
import {toggleSystemDefcon1, removeSystemDefcon1} from '../../../../plugins/lunchbadger-core/src/reduxActions';
import LoginManager from '../../../../plugins/lunchbadger-core/src/utils/auth';
import './SystemDefcon1.scss';

class SystemDefcon1Box extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleError: true,
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
    const {dispatch, server} = this.props;
    if (server) {
      LoginManager().logout();
    } else {
      dispatch(toggleSystemDefcon1());
    }
  }

  handleRemove = item => () => this.props.dispatch(removeSystemDefcon1(item));

  handleBoxClick = event => event.stopPropagation();

  render() {
    const {title, server, errors, content, buttons} = this.props;
    const {visibleError} = this.state;
    const titleTxt = title || (server ? 'Server Failure' : 'The workspace crashed');
    const contentTxt = content || (server
      ? 'The system can\'t connect to the server. Please check that the server is running and reload the page.'
      : 'You\'ll need to fix the workspace crash cause');
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
          {errors.length > 0 && (
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
                      <h3>
                        Error {idx + 1}
                        {' '}
                        <small className="removeError" onClick={this.handleRemove(item)}>remove</small>
                      </h3>
                      <pre>{item}</pre>
                    </div>
                  ))}
                </div>
              </SmoothCollapse>
            </div>
          )}
        </div>
        <div className="SystemDefcon1__box__content">
          {buttons && buttons.map(({label, onClick}, idx) => (
            <button
              key={label}
              onClick={onClick}
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

SystemDefcon1Box.propTypes = {
  server: PropTypes.bool,
  errors: PropTypes.array,
};

SystemDefcon1Box.defaultProps = {
  server: false,
  errors: [],
};

export default connect(null)(SystemDefcon1Box);
