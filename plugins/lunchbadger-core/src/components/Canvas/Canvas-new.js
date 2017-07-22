import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import QuadrantContainer from '../Quadrant/QuadrantContainer';
import CanvasOverlay from './CanvasOverlay';
import addConnection from '../../actions/Connection/add';
import removeConnection from '../../actions/Connection/remove';
import moveConnection from '../../actions/Connection/move';
import Connection from '../../stores/Connection';
import ProjectService from '../../services/ProjectService';
import './Canvas.scss';

export default class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // lastUpdate: new Date(),
      canvasHeight: null,
      // connections: [],
      scrollLeft: 0,
    };
  }

  render() {
    const {onClick, currentlyOpenedPanel} = this.props;
    const {scrollLeft} = this.state;
    let {canvasHeight} = this.state;
    if (!currentlyOpenedPanel) {
      canvasHeight = null;
    }
    return (
      <section
        className="canvas"
        onClick={onClick}
      >
        <CanvasOverlay />
        <div
          style={{height: canvasHeight}}
          className="canvas__wrapper"
          ref={(r) => {this.canvasWrapperDOM = r;}}
        >
          <div style={{height: canvasHeight}} className="canvas__legend">
            <div className="canvas__label canvas__label--left">Producers</div>
            <div className="canvas__label canvas__label--right">Consumers</div>
          </div>
          <QuadrantContainer
            canvasHeight={canvasHeight}
            className="canvas__container"
            id="canvas"
            scrollLeft={scrollLeft}
          />
        </div>
      </section>
    );
  }
}
