import React, {PureComponent} from 'react';
import cs from 'classnames';
import Slider from 'material-ui/Slider';
import {ContextualInformationMessage, UIDefaults} from '../../';
import userStorage from '../../../../lunchbadger-core/src/utils/userStorage';
import './CanvasZoom.scss';

const STEP = 0.05;
const LEVEL_MIN = 0.6;
const LEVEL_MAX = 1;

export default class CanvasZoom extends PureComponent {
  constructor(props) {
    super(props);
    const level = userStorage.getNumber('zoomLevel') || UIDefaults.zoomFactor;
    this.state = {
      level,
    };
    this.setHtmlFontSize(this.state.level);
  }

  handleZoomClick = step => () => {
    let {level} = this.state;
    level += step;
    level = Math.round(level * 100) / 100;
    level = Math.min(level, LEVEL_MAX);
    level = Math.max(level, LEVEL_MIN);
    this.setLevel(level);
  };

  setLevel = (level) => {
    this.setState({level});
    this.setHtmlFontSize(level);
    userStorage.set('zoomLevel', level);
  };

  handleSliderChanged = (_, value) => this.setLevel(value);

  setHtmlFontSize = zoomFactor => {
    document.querySelector('html').style.fontSize = `${zoomFactor}px`;
    window.dispatchEvent(new CustomEvent('zoomFactorChanged', {detail: {zoomFactor}}));
  };

  render() {
    const {level} = this.state;
    return (
      <div className="CanvasZoom">
        <ContextualInformationMessage
          tooltip="Zoom in entities"
          direction="right"
        >
          <i
            className={cs('fa', 'fa-search-plus', {
              disabled: level === LEVEL_MAX,
            })}
            onClick={this.handleZoomClick(STEP)}
          />
        </ContextualInformationMessage>
        <div className="slider">
          <Slider
            style={{height: 60}}
            sliderStyle={{margin: 0, display: 'inline-block'}}
            min={LEVEL_MIN}
            max={LEVEL_MAX}
            step={STEP}
            axis="y"
            value={level}
            onChange={this.handleSliderChanged}
          />
        </div>
        <ContextualInformationMessage
          tooltip="Zoom out entities"
          direction="right"
        >
          <i
            className={cs('fa', 'fa-search-minus', {
              disabled: level === LEVEL_MIN,
            })}
            onClick={this.handleZoomClick(-STEP)}
          />
        </ContextualInformationMessage>
      </div>
    );
  }
}
