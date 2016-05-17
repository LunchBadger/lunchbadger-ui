import React, {Component, PropTypes} from 'react';
import './UpgradeSlider.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class UpgradeSlider extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percentage: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="upgrade-slider">
        <div className="upgrade-slider__legend">
          <span  className="upgrade-slider__value">{this.props.value}</span>
          <span  className="upgrade-slider__value">{this.props.name}</span>
        </div>
        <div className="upgrade-slider__slider">
          <Slider defaultValue={this.props.percentage} min={0} max={100}/>
        </div>
      </div>
    )
  }
}
