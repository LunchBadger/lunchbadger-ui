import React, {Component} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class QuadrantContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paper: PropTypes.object,
    canvasHeight: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  };

  constructor(props) {
    super(props);
    this.state = {
      scrollLeft: 0,
      quadrantWidths: {},
    };
    this.quadrantsPercentageWidths = [
      0.19,
      0.265,
      0.295,
      0.25,
    ];
    this.lastQuadrantResizedIndex = 0;
    this.anyQuadrantWasResized = false;
    this.canvasMinWidth = 1300;
    this.quadrantsMinWidths = [];
    this.quadrantsPercentageWidths.forEach((item, idx) => {
      this.state.quadrantWidths[idx] = 0;
      this.quadrantsMinWidths.push(this.canvasMinWidth * item);
    });
  }

  componentDidMount() {
    this.canvasContainerDOM.addEventListener('scroll', this.onCanvasScroll);
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  componentWillUnmount() {
    this.canvasContainerDOM.removeEventListener('scroll', this.onCanvasScroll);
    window.removeEventListener('resize', this.onWindowResize);
  }

  onCanvasScroll = (event) => {
    this.setState({scrollLeft: event.target.scrollLeft});
  }

  getCanvasWidth = () => window.innerWidth - 60;

  onWindowResize = () => {
    if (this.anyQuadrantWasResized) {
      this.recalculateQuadrantsWidths(
        this.lastQuadrantResizedIndex,
        this.state.quadrantWidths[this.lastQuadrantResizedIndex],
      );
      return;
    };
    const {innerWidth} = window;
    const quadrantWidths = {};
    this.quadrantsPercentageWidths.forEach((percentage, idx) => {
      quadrantWidths[idx] = Math.max(percentage * this.getCanvasWidth(), this.quadrantsMinWidths[idx]);
    });
    this.setState({quadrantWidths});
  }

  recalculateQuadrantsWidths = (index, width) => {
    this.anyQuadrantWasResized = true;
    this.lastQuadrantResizedIndex = Math.max(this.lastQuadrantResizedIndex, index);
    const quadrantWidths = {
      ...this.state.quadrantWidths,
      [index]: Math.max(width, this.quadrantsMinWidths[index]),
    };
    let unresizedTotalWidth = this.getCanvasWidth();
    let unresizedTotalPercentage = 1;
    for (let i = 0; i < 4; i += 1) {
      if (i <= this.lastQuadrantResizedIndex) {
        unresizedTotalWidth -= quadrantWidths[i];
        unresizedTotalPercentage -= this.quadrantsPercentageWidths[i];
      } else {
        quadrantWidths[i] = Math.max(
          this.quadrantsPercentageWidths[i] * unresizedTotalWidth / unresizedTotalPercentage,
          this.quadrantsMinWidths[i],
        );
      }
    }
    this.setState({quadrantWidths});
    this.props.paper.repaintEverything();
  }

  renderQuadrants() {
    const pluggedQuadrants = this.props.plugins.getQuadrants();
    const {scrollLeft, quadrantWidths} = this.state;
    return pluggedQuadrants.map((plugin, index) => {
      const QuadrantComponent = plugin.component;
      return (
        <QuadrantComponent
          key={`plugged-quadrant-${index}-${plugin.title}`}
          appState={this.props.appState}
          paper={this.props.paper}
          data={plugin.dataStore}
          resizable={index < pluggedQuadrants.length - 1}
          index={index}
          width={quadrantWidths[index]}
          title={plugin.title}
          scrollLeft={scrollLeft}
          recalculateQuadrantsWidths={this.recalculateQuadrantsWidths}
        />
      );
    });
  }

  render() {
    const containerClass = classNames({
      'canvas__container--editing': this.props.appState.getStateKey('currentEditElement')
    });

    return (
      <div
        style={{minHeight: this.props.canvasHeight}}
        className={`${this.props.className} ${containerClass}`}
        id={this.props.id}
        ref={(r) => {this.canvasContainerDOM = r;}}
      >
        {this.renderQuadrants()}
      </div>
    );
  }
}
