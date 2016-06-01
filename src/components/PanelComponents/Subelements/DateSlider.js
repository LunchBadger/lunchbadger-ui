import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import './DateSlider.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DateSliderMark from './DateSliderMark';

export default class DateSlider extends Component {
  static propTypes = {
    parent: PropTypes.object.isRequired,
    selectedDate: PropTypes.string,
    range: PropTypes.object,
    onRangeUpdate: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      marks: this.getMarks(),
      range: this.getRange(props),
      count: 24
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      range: this.getRange(nextProps)
    });
  }

  componentDidMount() {
    this.setState({
      marks: this.getMarks(),
      range: this.getRange(this.props)
    });
  }

  getRange(props) {
    if (props.range) {
      const startYear = +props.range.startDate.format('YYYY');
      const endYear = +props.range.endDate.format('YYYY');
      const startDate = startYear > +moment().format('YYYY') ? +props.range.startDate.format('M') + 12 : +props.range.startDate.format('M');
      const endDate = endYear > +moment().format('YYYY') ? +props.range.endDate.format('M') + 12 : +props.range.endDate.format('M')
      return [startDate, endDate];
    } else {
      return [+props.selectedDate[0], +props.selectedDate[0] + 1];
    }
  }

  getMarks(count = 24) {
    let marks = {};
    for (var i = 1; i < count + 1; i++) {
      marks[i] = moment.months(i - 1)[0];
    }
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
                        range={this.state.range}
                        selectedDate={this.props.selectedDate}
                        forecast={this.props.parent}
                        month={+mark}
                        monthName={this.state.marks[mark]}
                        count={this.state.count} />
      )
    })
  }

  _handleOnChange(e) {
    const year = +this.props.range.startDate.format('YYYY');
    const startDate = e[0] > 12 ? moment(year + 1 + '/' + (e[0] - 12), 'YYYY/M') : moment(year + '/' + e[0], 'YYYY/M');
    const endDate = e[1] > 12 ? moment(year + 1 + '/' + (e[1] - 12), 'YYYY/M') : moment(year + '/' + e[1], 'YYYY/M');
    this.setState({
      range: e
    }, () => {
      if (typeof this.props.onRangeUpdate === 'function') {
        this.props.onRangeUpdate(Object.assign({}, this.props.range, {
          startDate: startDate,
          endDate: endDate,
          maxEndDate: endDate.isAfter(this.props.range.maxEndDate) ? endDate: this.props.range.maxEndDate
        }));
      }
    });
  }

  render() {
    return (
      <div className="date-slider" style={{width: '150%'}}>
        <div className="date-slider__slider">
          <Slider range
                  defaultValue={this.state.range}
                  value={this.state.range}
                  marks={this.state.marks}
                  min={1}
                  max={this.state.count}
                  onChange={this._handleOnChange.bind(this)}
                  tipFormatter={this.formatToolTip.bind(this)}/>
          <div className="date-slider__marks">
            {this.renderSliderMarks()}
          </div>
        </div>
      </div>
    )
  }
}
