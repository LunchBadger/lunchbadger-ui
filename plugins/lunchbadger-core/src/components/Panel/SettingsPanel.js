/* eslint-disable no-console */
import React, {Component} from 'react';
import cs from 'classnames';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';
import ProjectService from '../../services/ProjectService';
import Config from '../../../../../src/config';
import SshManager from './EntitiesDetails/SshManager';
import RestartWalkthrough from './EntitiesDetails/RestartWalkthrough';
import SettingsPanelSections from './EntitiesDetails/SettingsPanelSections';
import {EntityPropertyLabel, DocsLink} from '../../ui';
import './SettingsPanel.scss';

const {gitAccess, appUrls, workspaceButtons} = Config.get('features');

const dummyLoopbackGitCloneCommand = 'git clone git@xxxxxxxxx.xxxxxxxxx.xxx:xxxxxxxxx-xxxxxxxxx/xxxxxxxxx.xxx';
const dummyServerlessGitCloneCommand = 'git clone git@xxxxxxxxxx.xxxxxxxxxx.xxx:xxxxxxxxxx-xxxxxxxxxx/xxxxxxxxxx.xxx';

class SettingsPanel extends Component {
  static type = 'SettingsPanel';

  constructor(props) {
    super(props);
    props.parent.storageKey = panelKeys.SETTINGS_PANEL;
  }

  onRestartWorkspace = () => ProjectService.restartWorkspace();

  onResetWorkspace = () => ProjectService.resetWorkspace();

  onReinstall = () => ProjectService.reinstallDeps();

  render() {
    const loopbackGitCloneCommand = gitAccess
      ? Config.get('loopbackGitCloneCommand')
      : dummyLoopbackGitCloneCommand;
    const serverlessGitCloneCommand = gitAccess
      ? Config.get('serverlessGitCloneCommand')
      : dummyServerlessGitCloneCommand;
    const workspaceUrl = Config.get('workspaceUrl');
    return (
      <div className="panel__body settings">
        <div className="panel__title">
          Settings
        </div>
        <RestartWalkthrough />
        {appUrls && (
          <div className="details-panel__element">
            <div className="details-panel__fieldset">
              <EntityPropertyLabel>
                Your application URLs
                <DocsLink item="SETTINGS_YOUR_APPLICATION_URLS" />
              </EntityPropertyLabel>
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
        )}
        <SettingsPanelSections />
        <div className="accessViaGit details-panel__element">
          <div className="details-panel__fieldset">
            <EntityPropertyLabel>
              Access via Git
              <DocsLink item="SETTINGS_ACCESS_VIA_GIT" />
            </EntityPropertyLabel>
            <div className={cs('data', {blocked: !gitAccess})}>
              <label className="details-panel__label">
                Models and Model Connectors
              </label>
              <div className="details-panel__static-field">
                <pre className="gitCloneCommand">
                  {loopbackGitCloneCommand}
                </pre>
                <CopyToClipboard text={loopbackGitCloneCommand}>
                  <i className="fa fa-copy iconCopy" />
                </CopyToClipboard>
              </div>
              <label className="details-panel__label">
                Serverless Functions
              </label>
              <div className="details-panel__static-field">
                <pre className="gitCloneCommand">
                  {serverlessGitCloneCommand}
                </pre>
                <CopyToClipboard text={serverlessGitCloneCommand}>
                  <i className="fa fa-copy iconCopy" />
                </CopyToClipboard>
              </div>
            </div>
            {!gitAccess && (
              <div className="accessInfo">
                git access is not part of the trial - please contact LunchBadger support to learn more
              </div>
            )}
          </div>
        </div>
        {workspaceButtons && (
          <div className="details-panel__element WorkspaceButtons">
            <div className="details-panel__fieldset">
              <EntityPropertyLabel>
                Workspace actions
              </EntityPropertyLabel>
              <div className="details-panel__static-field">
                <button onClick={this.onReinstall}>
                  Reinstall Dependencies
                </button>
                {' '}
                <button onClick={this.onResetWorkspace}>
                  Reset Workspace
                </button>
                {' '}
                <button onClick={this.onRestartWorkspace}>
                  Restart Workspace
                </button>
              </div>
            </div>
          </div>
        )}
        <SshManager />
      </div>
    );
  }
}

export default Panel(SettingsPanel);
