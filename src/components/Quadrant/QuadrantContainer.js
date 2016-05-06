import React, {Component, PropTypes} from 'react';

const Pluggable = LunchBadgerCore.stores.Pluggable;

export default class QuadrantContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      pluggedQuadrants: Pluggable.getQuadrants()
    };

    this.pluginStoreChanged = () => {
      this.setState({pluggedQuadrants: Pluggable.getQuadrants()});
    }
  }

  componentWillMount() {
    Pluggable.addChangeListener(this.pluginStoreChanged);
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.pluginStoreChanged);
  }

  renderQuadrants() {
    const {pluggedQuadrants} = this.state;
    const initialPercentageWidth = 100 / pluggedQuadrants.length;

    return pluggedQuadrants.map((plugin, index) => {
      const QuadrantComponent = plugin.component;

      return (
        <QuadrantComponent key={`plugged-quadrant-${index}-${plugin.title}`}
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
      <div className={this.props.className} id={this.props.id}>
        {this.renderQuadrants()}
      </div>
    );
  }
}
