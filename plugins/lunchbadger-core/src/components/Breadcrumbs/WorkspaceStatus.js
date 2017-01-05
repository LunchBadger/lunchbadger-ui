/*eslint no-console:0 */
import React, {Component, PropTypes} from 'react';
import classnames from 'classnames';
import './WorkspaceStatus.scss';
import OneOptionModal from '../Generics/Modal/OneOptionModal';

export default class WorkspaceStatus extends Component {
  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor() {
    super();
    this.state = {
      running: false,
      connected: false,
      output: '',
      instance: null,
      visible: false,
      isShowingModal: false
    };
  }

  componentDidMount() {
    this.es = this.context.projectService.monitorStatus();
    this.es.addEventListener('data', this.onStatusReceived.bind(this));
    this.es.addEventListener('open', this.onConnected.bind(this));
    this.es.addEventListener('error', this.onDisconnected.bind(this));
  }

  componentWillUnmount() {
    if (this.es) {
      this.es.close();
      this.es = null;
    }
  }

  onClick() {
    this.setState({
      visible: !this.state.visible
    });
  }

  onStatusReceived(message) {
    let status = JSON.parse(message.data).data;

    console.log('Status from server', status);

    if (this.state.instance && this.state.instance !== status.instance) {
      this.setState({
        isShowingModal: true
      });
    }

    this.setState({
      connected: true,
      running: status.running,
      output: status.output,
      instance: status.instance
    });
  }

  onConnected() {
    this.setState({
      connected: true
    });
  }

  onDisconnected() {
    this.setState({
      connected: false
    });
  }

  onModalClose() {
    location.reload();
  }

  renderInfo(message) {
    let output = null;
    if (this.state.connected && this.state.output) {
      output = (
        <div className="workspace-status__output">
          {this.state.output}
        </div>
      );
    }

    return (
      <div className="workspace-status__info">
        {message}
        {output}
      </div>
    );
  }

  render() {
    let classes = ['fa'];
    let message = null;

    if (!this.state.connected) {
        message = 'Error connecting to server';
        classes.push(...['fa-question-circle', 'workspace-status__unknown'])
    } else if (this.state.running) {
        message = 'Workspace OK';
        classes.push(...['fa-check-circle', 'workspace-status__success']);
    } else {
        message = 'Workspace crashed. Output follows:'
        classes.push(...['fa-exclamation-triangle', 'workspace-status__failure']);
    }

    return (
      <span className="workspace-status">
        <i className={classnames(classes)} onClick={this.onClick.bind(this)} />
        {this.state.visible ? this.renderInfo(message) : null}
        {
          this.state.isShowingModal &&
          <OneOptionModal confirmText="Reload"
                          onClose={this.onModalClose.bind(this)}>
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
