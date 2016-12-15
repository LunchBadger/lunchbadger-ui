import React, {Component} from 'react';
import Panel from './Panel';
import panelKeys from '../../constants/panelKeys';

class SettingsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.SETTINGS_PANEL;
  }

  static contextTypes = {
    loginManager: React.PropTypes.object,
    lunchbadgerConfig: React.PropTypes.object
  };

  render() {
    const userName = this.context.loginManager.user.profile.sub;
    const gitBaseUrl = this.context.lunchbadgerConfig.gitBaseUrl
    const url = `${gitBaseUrl}/${userName}.git`;

    return (
      <div className="panel__body">
        <div className="panel__title">
          Settings
        </div>
        <div className="details-panel__element">
          <div className="details-panel__fieldset">
            <label className="details-panel__label">
              Access via Git
            </label>
            <div className="details-panel__static-field">
              <pre>git clone {url}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Panel(SettingsPanel);
