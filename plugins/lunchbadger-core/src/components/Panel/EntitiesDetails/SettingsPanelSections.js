import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';

class SettingsPanelSections extends PureComponent {
  render() {
    const {settingsPanelSections} = this.props;
    return (
      <div>
        {Object.keys(settingsPanelSections).map((key) => {
          const Component = settingsPanelSections[key];
          return <Component />;
        })}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.plugins.settingsPanelSections,
  settingsPanelSections => ({settingsPanelSections}),
);

export default connect(selector)(SettingsPanelSections);
