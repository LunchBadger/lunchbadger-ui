import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import Quadrant from './Quadrant';

class QuadrantContainer extends PureComponent {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    style: PropTypes.object,
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
    this.quadrantRefs = {};
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
  };

  handleMouseMove = event => Object
    .values(this.quadrantRefs)
    .forEach(ref => ref
      .getWrappedInstance()
      .getDecoratedComponentInstance()
      .wrappedInstance
      .handleMouseMove(event)
    );

  render() {
    const {
      editing,
      className,
      id,
      scrollLeft,
      quadrants,
      style,
    } = this.props;
    const containerClass = classNames({
      'canvas__container--editing': editing,
    });
    const {quadrantWidths} = this.state;
    return (
      <div
        className={`${className} ${containerClass}`}
        style={style}
        id={id}
        onMouseMove={this.handleMouseMove}
      >
        {quadrants.map(({name, entities}, idx) => (
          <Quadrant
            ref={r => this.quadrantRefs[name] = r}
            key={idx}
            title={name}
            resizable={idx < quadrants.length - 1}
            index={idx}
            width={quadrantWidths[idx]}
            scrollLeft={scrollLeft}
            types={entities}
            recalculateQuadrantsWidths={this.recalculateQuadrantsWidths}
            style={style}
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
