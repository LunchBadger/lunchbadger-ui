/*eslint no-console:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classnames from 'classnames';
import OneOptionModal from '../Generics/Modal/OneOptionModal';
import {ContextualInformationMessage} from '../../../../lunchbadger-ui/src';
import {addSystemDefcon1, toggleSystemDefcon1, clearSystemDefcon1} from '../../reduxActions/systemDefcon1';
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
      isShowingModal: false,
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
    const {isSystemDefcon1, dispatch} = this.props;
    const {status} = this.state;
    if (status === 'crashed' || isSystemDefcon1) {
      dispatch(toggleSystemDefcon1());
    }
  }

  onStatusReceived = (message) => {
    let status = JSON.parse(message.data).data;
    console.log('Status from server', status);
    if (this.state.instance && this.state.instance !== status.instance) {
      this.setState({isShowingModal: true});
    }
    this.setState({
      connected: true,
      status: status.status,
      output: status.output,
      instance: status.instance,
    });
    if (status.status === 'running') {
      this.props.dispatch(clearSystemDefcon1());
    } else if (status.status === 'crashed') {
      this.props.dispatch(addSystemDefcon1(status.output, 'workspace'));
    }
  }

  onConnected = () => this.setState({connected: true});

  onDisconnected = () => this.setState({connected: false});

  onModalClose = () => location.reload();

  render() {
    const {isSystemDefcon1} = this.props;
    const {connected, status} = this.state;
    const classes = ['fa'];
    let message = null;
    if (status === 'installing') {
      message = 'Updating dependencies';
      classes.push('workspace-status__progress');
    } else if (!connected) {
      message = 'Error connecting to server';
      classes.push(...['fa-question-circle', 'workspace-status__unknown'])
    } else if (status === 'crashed' || isSystemDefcon1) {
      message = 'Workspace crashed';
      classes.push(...['fa-exclamation-triangle', 'workspace-status__failure']);
    } else if (status === 'running') {
      message = 'Workspace OK';
      classes.push(...['fa-check-circle', 'workspace-status__success']);
    }
    return (
      <span className="workspace-status">
        <ContextualInformationMessage
          tooltip={['running', 'installing'].includes(status) ? message : ''}
          direction="bottom"
        >
          <span className={classnames(classes)}
            onClick={this.onClick}
          >
          </span>
        </ContextualInformationMessage>
        {this.state.isShowingModal && (
          <OneOptionModal
            confirmText="Reload"
            onClose={this.onModalClose}
          >
            The workspace has changed since the Canvas was loaded. Please
            reload the page to refresh the Canvas contents.
          </OneOptionModal>
        )}
      </span>
    );
  }
}

const selector = createSelector(
  state => state.systemDefcon1.errors.length > 0,
  isSystemDefcon1 => ({isSystemDefcon1}),
);

export default connect(selector)(WorkspaceStatus);
