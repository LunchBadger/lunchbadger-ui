import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import './DateSlider.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import DateSliderMark from './DateSliderMark';
import setForecast from '../../../actions/AppState/setForecast';

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
      count: 12
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({range: this.getRange(nextProps)});
  }

  componentDidMount() {
    this.setState({
      marks: this.getMarks(),
      range: this.getRange(this.props)
    }, () => {
      this._rescale(this.state.range[1], () => {
        setForecast(this.props.parent, moment(this.props.selectedDate, 'M/YYYY').clone().add(1, 'months').toDate());

        setTimeout(() => {
          setForecast(this.props.parent, moment(this.props.selectedDate, 'M/YYYY').clone().subtract(1, 'months').toDate());
        });
      });
    });
  }

  getRange(props) {
    if (props.range) {
      const startYear = +props.range.startDate.format('YYYY');
      const endYear = +props.range.endDate.format('YYYY');
      const startDate = startYear > +moment().format('YYYY') ? +props.range.startDate.format('M') + 12 : +props.range.startDate.format('M');
      const endDate = endYear > +moment().format('YYYY') ? +props.range.endDate.format('M') + 12 : +props.range.endDate.format('M');

      return [startDate, endDate];
    } else {
      return [+props.selectedDate[0], +props.selectedDate[0] + 1];
    }
  }

  getMarks(count = 12) {
    let marks = {};

    for (var i = 1; i < count + 1; i++) {
      marks[i] = moment.months(i - 1)[0];
    }

    return marks;
  }

  formatToolTip = (tooltip) => {
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
                        selectedRange={this.props.range}
                        monthName={this.state.marks[mark]}
                        count={this.state.count}/>
      );
    });
  }

  _handleOnChange = (e) => {
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
          maxEndDate: endDate.isAfter(this.props.range.maxEndDate) ? endDate : this.props.range.maxEndDate
        }));
      }
    });

    this._rescale(e[1]);
  }

  _rescale(value, cb = () => {}) {
    if (value >= this.state.count && value < 24) {
      this.setState({
        count: value + 1,
        marks: this.getMarks(value + 1)
      }, cb);
    }
  }

  render() {
    return (
      <div className="date-slider" style={{width: '97%'}}>
        <div className="date-slider__slider">
          <Slider range
                  defaultValue={this.state.range}
                  value={this.state.range}
                  marks={this.state.marks}
                  min={1}
                  max={this.state.count}
                  onChange={this._handleOnChange}
                  tipFormatter={this.formatToolTip}/>
          <div className="date-slider__marks">
            {this.renderSliderMarks()}
          </div>
        </div>
      </div>
    )
  }
}
