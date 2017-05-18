import React, {Component} from 'react';
import {connect} from 'react-redux';
import cs from 'classnames';
import {SmoothCollapse, IconSVG} from '../';
import {showSystemDefcon1} from '../actions';
import {iconDelete} from '../../../../src/icons';
import './SystemDefcon1.scss';

class SystemDefcon1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleError: false,
    }
  }

  toggleVisibleError = () => this.setState({visibleError: !this.state.visibleError});

  handleClose = () => this.props.close();

  render() {
    const {server = false, error} = this.props;
    const {visibleError} = this.state;
    const title = server ? 'Server Failure' : 'The workspace crashed';
    const content = server
      ? "The system can't connect to the server. Please check that the server is running and reload the page."
      : "You'll need to reload the page to continue";
    return (
      <div className="SystemDefcon1">
        <div className={cs('SystemDefcon1__box', {['visibleError']: visibleError})}>
          <div className="SystemDefcon1__box__title">
            {title}
          </div>
          <div className="SystemDefcon1__box__delete" onClick={this.handleClose}>
            <IconSVG svg={iconDelete} />
          </div>
          <div className="SystemDefcon1__box__content">
            {content}
            {server && (
              <div className="SystemDefcon1__box__content--error">
                ERROR: {error}
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
                  <pre>
                    {error}
                  </pre>
                </SmoothCollapse>
              </div>
            )}
          </div>
          <div className="SystemDefcon1__box__content">
            <button onClick={() => { document.location.reload(); }}>RELOAD</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  close: () => dispatch(showSystemDefcon1('')),
});

export default connect(null, mapDispatchToProps)(SystemDefcon1);
