/* eslint-disable no-console */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';
import {addSystemNotification} from '../../../../lunchbadger-ui/src/actions';
import ConfigStoreService from '../../services/ConfigStoreService';
import ProjectService from '../../services/ProjectService';
import Config from '../../../../../src/config';
import {getUser} from '../../utils/auth';

class SettingsPanel extends Component {
  constructor(props) {
    super(props);
    props.parent.storageKey = panelKeys.SETTINGS_PANEL;
    this.state = {
      accessKey: null
    };
  }

  componentWillMount() {
    ConfigStoreService.getAccessKey().then(data => {
      this.setState({
        accessKey: data.body.key
      });
    }).catch(err => {
      this.props.displaySystemNotification({output: 'Error fetching Git access key'});
    });
  }

  onRegenerate = () => {
    this.setState({
      accessKey: null
    });
    ConfigStoreService.regenerateAccessKey().then(data => {
      this.setState({
        accessKey: data.body.key
      });
    }).catch(err => {
      this.props.displaySystemNotification({output: 'Error regenerating Git access key'});
    });
  }

  onRestartWorkspace = () => {
    ProjectService.restartWorkspace();
  }

  onReinstall = () => {
    ProjectService.reinstallDeps();
  }

  render() {
    let cloneCommand;
    if (this.state.accessKey) {
      const anchor = document.createElement('a');
      anchor.href = Config.get('gitBaseUrl');
      anchor.pathname += `/${getUser().profile.sub}.git`;
      anchor.username = 'git';
      anchor.password = this.state.accessKey;
      cloneCommand = `git clone ${anchor.href}`;
    } else {
      cloneCommand = '...';
    }
    const workspaceUrl = Config.get('workspaceUrl');
    return (
      <div className="panel__body">
        <div className="panel__title">
          Settings
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Your application URLs
            </label>
            <div className="details-panel__static-field">
              <a href={workspaceUrl} target="_blank">
                {workspaceUrl}
              </a> (root)
              <br />
              <a href={workspaceUrl + '/explorer'} target="_blank">
                {workspaceUrl + '/explorer'}
              </a> (API explorer)
            </div>
          </div>
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Access via Git
            </label>
            <div className="details-panel__static-field">
              <pre>{cloneCommand}</pre>
            </div>
            <div>
              <button onClick={this.onRegenerate}>Regenerate</button>
            </div>
          </div>
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Restart application
            </label>
            <div className="details-panel__static-field">
              <button onClick={this.onRestartWorkspace}>Restart</button>
            </div>
          </div>
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Reinstall dependencies
            </label>
            <div className="details-panel__static-field">
              <button onClick={this.onReinstall}>Reinstall</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  displaySystemNotification: notification => dispatch(addSystemNotification(notification)),
});

export default connect(null, mapDispatchToProps)(Panel(SettingsPanel));
