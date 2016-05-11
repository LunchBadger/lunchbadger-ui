import React, {Component} from 'react';
import './Aside.scss';

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
    return (
      <aside className="aside">
        {this._renderToolGroups()}
      </aside>
    );
  }
}
