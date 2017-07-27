import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import QuadrantNew from './QuadrantNew';

class QuadrantContainer extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    canvasHeight: PropTypes.oneOfType([PropTypes.object, PropTypes.number]),
  };

  constructor(props) {
    super(props);
    this.state = {
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
    window.addEventListener('resize', this.onWindowResize);
    this.onWindowResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
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
    // this.props.paper.repaintEverything();
  }

  // renderQuadrants() {
  //   const {plugins, appState, paper, scrollLeft} = this.props;
  //   const pluggedQuadrants = plugins.getQuadrants();
  //   const {quadrantWidths} = this.state;
  //   return pluggedQuadrants.map((plugin, index) => {
  //     const QuadrantComponent = plugin.component;
  //     return (
  //       <QuadrantComponent
  //         key={`plugged-quadrant-${index}-${plugin.title}`}
  //         appState={appState}
  //         paper={paper}
  //         data={plugin.dataStore}
  //         resizable={index < pluggedQuadrants.length - 1}
  //         index={index}
  //         width={quadrantWidths[index]}
  //         title={plugin.title}
  //         scrollLeft={scrollLeft}
  //         recalculateQuadrantsWidths={this.recalculateQuadrantsWidths}
  //       />
  //     );
  //   });
  // }

  render() {
    const {editing, canvasHeight, className, id, scrollLeft, quadrants} = this.props;
    const containerClass = classNames({
      'canvas__container--editing': editing,
    });
    const {quadrantWidths} = this.state;
    // console.log('RENDER QuadrantContainer');
    return (
      <div
        style={{minHeight: canvasHeight}}
        className={`${className} ${containerClass}`}
        id={id}
      >
        {quadrants.map(({name, entities}, idx) => (
          <QuadrantNew
            key={idx}
            title={name}
            resizable={idx < quadrants.length - 1}
            index={idx}
            width={quadrantWidths[idx]}
            scrollLeft={scrollLeft}
            types={entities}
          />
        ))}
      </div>
    );
  }
}

const selector = createSelector(
  state => !!state.states.currentEditElement,
  state => state.plugins.quadrants,
  (
    editing,
    quadrants,
  ) => ({
    editing,
    quadrants: Object.keys(quadrants).map(key => quadrants[key]),
  }),
);

export default connect(selector)(QuadrantContainer);
