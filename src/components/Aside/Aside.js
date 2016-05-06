import React, {Component} from 'react';
import './Aside.scss';
import Endpoint from '../Tools/Endpoint';
import Gateway from '../Tools/Gateway';
import API from '../Tools/API';

const Pluggable = LunchBadgerCore.stores.Pluggable;

export default class Aside extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pluggedTools: Pluggable.getToolGroups()
    };

    this.pluginStoreChanged = () => {
      this.setState({pluggedTools: Pluggable.getToolGroups()});
    }
  }

  componentWillMount() {
    Pluggable.addChangeListener(this.pluginStoreChanged);
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.pluginStoreChanged);
  }

  _renderToolGroups() {
    return this.state.pluggedTools.map((plugin, index) => {
      const ToolGroupComponent = plugin.toolGroup.component;
      const tools = plugin.toolGroup.tools;

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
        <Endpoint />
        <hr />
        <Gateway />
        <hr />
        <API />
      </aside>
    );
  }
}
