import React, {Component, PropTypes} from 'react';
import './DateSlider.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default class DateSlider extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="date-slider">
        <div className="date-slider__slider">
          <Slider defaultValue={15} min={0} max={100}/>
        </div>
      </div>
    )
  }
}
