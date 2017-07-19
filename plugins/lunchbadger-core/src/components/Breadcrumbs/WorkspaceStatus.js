/*eslint no-console:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classnames from 'classnames';
import OneOptionModal from '../Generics/Modal/OneOptionModal';
import {ContextualInformationMessage} from '../../../../lunchbadger-ui/src';
import {addSystemDefcon1, toggleSystemDefcon1} from '../../../../lunchbadger-ui/src/actions';
import ProjectService from '../../services/ProjectService';
import './WorkspaceStatus.scss';

class WorkspaceStatus extends Component {
  constructor() {
    super();
    this.state = {
      connected: false,
      status: null,
      output: '',
      instance: null,
      visible: false,
      isShowingModal: false
    };
  }

  componentDidMount() {
    this.es = ProjectService.monitorStatus();
    this.es.addEventListener('data', this.onStatusReceived);
    this.es.addEventListener('open', this.onConnected);
    this.es.addEventListener('error', this.onDisconnected);
  }

  componentWillUnmount() {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
  }

  onClick = () => {
    if (this.state.status === 'crashed') {
      this.props.showSystemDefcon1();
    }
  }

  onEnter = () => {
    if (['running', 'installing'].includes(this.state.status)) {
      this.setState({visible: true});
    }
  }

  onLeave = () => {
    this.setState({visible: false});
  }

  onStatusReceived = (message) => {
    let status = JSON.parse(message.data).data;

    console.log('Status from server', status);

    if (this.state.instance && this.state.instance !== status.instance) {
      this.setState({
        isShowingModal: true
      });
    }

    this.setState({
      connected: true,
      status: status.status,
      output: status.output,
      instance: status.instance
    });

    if (status.status === 'crashed') {
      this.props.displaySystemDefcon1(status.output);
    }
  }

  onConnected = () => {
    this.setState({
      connected: true
    });
  }

  onDisconnected = () => {
    this.setState({
      connected: false
    });
  }

  onModalClose = () => {
    location.reload();
  }

  render() {
    let classes = ['fa'];
    let message = null;

    if (!this.state.connected) {
      message = 'Error connecting to server';
      classes.push(...['fa-question-circle', 'workspace-status__unknown'])
    } else if (this.state.status === 'running') {
      message = 'Workspace OK';
      classes.push(...['fa-check-circle', 'workspace-status__success']);
    } else if (this.state.status === 'crashed') {
      message = 'Workspace crashed';
      classes.push(...['fa-exclamation-triangle', 'workspace-status__failure']);
    } else if (this.state.status === 'installing') {
      message = 'Updating dependencies';
      classes.push('workspace-status__progress');
    }
    const {visible} = this.state;
    return (
      <span className="workspace-status">
        <span className={classnames(classes)}
          onClick={this.onClick}
          onMouseEnter={this.onEnter}
          onMouseLeave={this.onLeave}
        >
          {visible && (
            <ContextualInformationMessage>
              {message}
            </ContextualInformationMessage>
          )}
        </span>
        {
          this.state.isShowingModal &&
          <OneOptionModal confirmText="Reload"
                          onClose={this.onModalClose}>
            <p>
              The workspace has changed since the Canvas was loaded. Please
              reload the page to refresh the Canvas contents.
            </p>
          </OneOptionModal>
        }
      </span>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displaySystemDefcon1: error => dispatch(addSystemDefcon1(error)),
  showSystemDefcon1: () => dispatch(toggleSystemDefcon1()),
});

export default connect(null, mapDispatchToProps)(WorkspaceStatus);
