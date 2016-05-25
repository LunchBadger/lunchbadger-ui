import React, {Component, PropTypes} from 'react';

export default class QuadrantContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paper: PropTypes.object,
    style: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  renderQuadrants() {
    const pluggedQuadrants = this.props.plugins.getQuadrants();
    const initialPercentageWidth = 100 / pluggedQuadrants.length;

    return pluggedQuadrants.map((plugin, index) => {
      const QuadrantComponent = plugin.component;

      return (
        <QuadrantComponent key={`plugged-quadrant-${index}-${plugin.title}`}
                           appState={this.props.appState}
                           paper={this.props.paper}
                           data={plugin.dataStore}
                           resizable
                           initialPercentageWidth={initialPercentageWidth}
                           title={plugin.title}/>
      );
    });
  }

  render() {
    return (
      <div style={this.props.style} className={this.props.className} id={this.props.id}>
        {this.renderQuadrants()}
      </div>
    );
  }
}
