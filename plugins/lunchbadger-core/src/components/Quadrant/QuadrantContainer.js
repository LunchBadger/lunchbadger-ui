import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import classNames from 'classnames';
import QuadrantNew from './QuadrantNew';

class QuadrantContainer extends Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paper: PropTypes.object,
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
    this.props.paper.repaintEverything();
  }

  renderQuadrants() {
    const {plugins, appState, paper, scrollLeft} = this.props;
    const pluggedQuadrants = plugins.getQuadrants();
    const {quadrantWidths} = this.state;
    return pluggedQuadrants.map((plugin, index) => {
      const QuadrantComponent = plugin.component;
      return (
        <QuadrantComponent
          key={`plugged-quadrant-${index}-${plugin.title}`}
          appState={appState}
          paper={paper}
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

  renderQuadrantsNew = () => {
    const {appState, paper, scrollLeft, quadrants, components} = this.props;
    const {quadrantWidths} = this.state;
    return quadrants.map(({name, entities}, idx) => (
      <QuadrantNew
        key={idx}
        title={name}
        appState={appState}
        paper={paper}
        resizable={idx < quadrants.length - 1}
        index={idx}
        width={quadrantWidths[idx]}
        scrollLeft={scrollLeft}
        recalculateQuadrantsWidths={this.recalculateQuadrantsWidths}
        entities={entities}
        components={components}
      />
    ));
  }

  render() {
    const {editing, canvasHeight, className, id} = this.props;
    const containerClass = classNames({
      'canvas__container--editing': editing,
    });
    return (
      <div
        style={{minHeight: canvasHeight}}
        className={`${className} ${containerClass}`}
        id={id}
      >
        {this.renderQuadrantsNew()}
      </div>
    );
  }
}

const selector = createSelector(
  state => !!state.core.appState.currentEditElement,
  state => state.plugins.quadrants,
  state => state.entities,
  state => state.plugins.canvasElements,
  (editing, config, entities, components) => {
    const quadrants = [];
    Object.keys(config).forEach((key) => {
      const quadrant = {name: config[key].name, entities: []};
      config[key].entities.forEach((type) => {
        if (entities[type]) {
          quadrant.entities = [
            ...quadrant.entities,
            ...entities[type],
          ];
        }
      });
      quadrant.entities = quadrant.entities.sort((a, b) => a.data.itemOrder > b.data.itemOrder);
      quadrants.push(quadrant);
    });
    return {editing, quadrants, components};
  }
);

export default connect(selector)(QuadrantContainer);
