/* eslint-disable no-console */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';
import ProjectService from '../../services/ProjectService';
import Config from '../../../../../src/config';
import SshManager from './EntitiesDetails/SshManager';
import './SettingsPanel.scss';

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
    const cloneCommand = Config.get('gitCloneCommand');
    const workspaceUrl = Config.get('workspaceUrl');
    return (
      <div className="panel__body settings">
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
              <pre className="gitCloneCommand">
                {cloneCommand}
              </pre>
              {cloneCommand !== '...' && (
                <CopyToClipboard text={cloneCommand}>
                  <i className="fa fa-copy iconCopy" />
                </CopyToClipboard>
              )}
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
              Reset application
            </label>
            <div className="details-panel__static-field">
              <button onClick={this.onResetWorkspace}>Reset</button>
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
        <SshManager />
      </div>
    );
  }
}

export default Panel(SettingsPanel);
