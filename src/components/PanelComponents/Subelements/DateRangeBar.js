import React, {Component, PropTypes} from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import './DateRangeBar.scss';

export default class DateRangeBar extends Component {
  static propTypes = {
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    onRangeUpdate: PropTypes.func
  };

  constructor(props) {
    super(props);

    const format = 'M/YYYY';

    this.state = {
      startDate: props.startDate ? moment(props.startDate, format) : moment(),
      endDate: props.endDate ? moment(props.endDate, format).endOf('month') : moment(),
      minStartDate: props.startDate ? moment(props.startDate, format) : moment(),
      maxStartDate: props.endDate ? moment(props.endDate, format).endOf('month') : moment(),
      minEndDate: props.startDate ? moment(props.startDate, format) : moment(),
      maxEndDate: props.endDate ? moment(props.endDate, format).endOf('month') : moment()
    }
  }

  handleChangeStart(date) {
    this.setState({
      startDate: date,
      minEndDate: date
    }, () => {
      if (typeof this.props.onRangeUpdate === 'function') {
        this.props.onRangeUpdate(this.state);
      }
    });
  }

  handleChangeEnd(date) {
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
          selected={this.state.startDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minDate={this.state.minStartDate}
          maxDate={this.state.maxStartDate}
          onChange={this.handleChangeStart.bind(this)}/>
        <DatePicker
          selected={this.state.endDate}
          startDate={this.state.startDate}
          endDate={this.state.endDate}
          minDate={this.state.minEndDate}
          maxDate={this.state.maxEndDate}
          onChange={this.handleChangeEnd.bind(this)}/>
      </div>
    )
  }
}
