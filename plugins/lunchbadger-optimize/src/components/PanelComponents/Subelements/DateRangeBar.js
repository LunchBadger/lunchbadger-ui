import React, {Component} from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangeBar.scss';

export default class DateRangeBar extends Component {
  static propTypes = {
    startDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    endDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    onRangeUpdate: PropTypes.func,
    onInit: PropTypes.func
  };

  constructor(props) {
    super(props);

    const format = 'M/YYYY';

    this.state = {
      startDate: props.startDate ? moment(props.startDate, format) : moment(),
      endDate: props.endDate ? moment(props.endDate, format).endOf('month') : moment(),
      maxStartDate: props.endDate ? moment(props.endDate, format).endOf('month') : moment(),
      minEndDate: props.startDate ? moment(props.startDate, format) : moment()
    }
  }

  componentDidMount() {
    if (typeof this.props.onInit === 'function') {
      this.props.onInit(this.state);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      startDate: nextProps.startDate,
      endDate: nextProps.endDate
    });
  }

  handleChangeStart = (date) => {
    this.setState({
      startDate: date,
      minEndDate: date
    }, () => {
      if (typeof this.props.onRangeUpdate === 'function') {
        this.props.onRangeUpdate(this.state);
      }
    });
  }

  handleChangeEnd = (date) => {
    this.setState({
      endDate: date,
      maxStartDate: date
    }, () => {
      if (typeof this.props.onRangeUpdate === 'function') {
        this.props.onRangeUpdate(this.state);
      }
    });
  }

  render() {
    return (
      <div className="date-range-bar">
        <DatePicker
          dateFormat="D MMM YYYY"
          className="date-range-bar__picker date-range-bar__picker--from"
          selected={this.state.startDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          maxDate={this.state.maxStartDate}
          readOnly={true}
          popoverAttachment="top left"
          popoverTargetAttachment="bottom center"
          onChange={this.handleChangeStart}/>
        <span className="date-range-bar__between">to</span>
        <DatePicker
          dateFormat="D MMM YYYY"
          className="date-range-bar__picker date-range-bar__picker--to"
          selected={this.state.endDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minDate={this.state.minEndDate}
          readOnly={true}
          popoverAttachment="top center"
          popoverTargetAttachment="bottom center"
          onChange={this.handleChangeEnd}/>
      </div>
    )
  }
}
