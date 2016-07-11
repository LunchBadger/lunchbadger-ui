import React, {Component} from 'react';
import './Aside.scss';
import classNames from 'classnames';

export default class Aside extends Component {
  constructor(props) {
    super(props);
  }

  _renderToolGroups() {
    return this.props.plugins.getToolGroups().map((plugin, index) => {
      const ToolGroupComponent = plugin.component;
      const tools = plugin.tools;

      return (
        <ToolGroupComponent key={`tools-${plugin.name}-${index}`}
                            groupName={plugin.name}
                            tools={tools}/>
      );
    });
  }

  render() {
    const asideClass = classNames({
      aside: true,
      'aside--editing': this.props.appState.getStateKey('currentEditElement') || this.props.appState.getStateKey('isPanelOpened')
    });

    return (
      <aside className={asideClass}>
        {this._renderToolGroups()}
      </aside>
    );
  }
}
