import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import './DateSlider.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DateSliderMark from './DateSliderMark';



export default class DateSlider extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      marks: this.getMarks()
    }
  }

  getMarks() {
    let marks = {};

    for (var i = 1; i < 13; i++) {
      marks[i] = moment.months(i - 1)[0];
    }
    console.log(marks);
    return marks;
  }

  formatToolTip(tooltip) {
    return moment.months(tooltip - 1);
  }

  renderSliderMarks() {
    return Object.keys(this.state.marks).map((mark, index) => {
      return (
        <DateSliderMark key={index}
                        position={index}
                        month={this.state.marks[mark]}
                        count={12} />
      )
    })
  }

  render() {

    return (
      <div className="date-slider">
        <div className="date-slider__slider">
          <Slider range defaultValue={[5, 12]} marks={this.state.marks} min={1} max={12} tipFormatter={this.formatToolTip.bind(this)}/>
          <div className="date-slider__marks">
            {this.renderSliderMarks()}
          </div>
        </div>
      </div>
    )
  }
}
