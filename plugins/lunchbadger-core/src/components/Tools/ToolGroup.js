import React, {Component, PropTypes} from 'react';

export default class ToolGroup extends Component {
  static propTypes = {
    tools: PropTypes.array.isRequired,
    groupName: PropTypes.string.isRequired
  };

  static defaultProps = {
    tools: []
  };

  constructor(props) {
    super(props);
  }

  renderTools() {
    return this.props.tools.map((tool, index) => {
      const ToolComponent = tool.component;

      return <ToolComponent key={`tool-button-${this.props.groupName}-${index}`} />
    })
  }

  render() {
    return (
      <div>
        {this.renderTools()}
        <hr />
      </div>
    )
  }
}
