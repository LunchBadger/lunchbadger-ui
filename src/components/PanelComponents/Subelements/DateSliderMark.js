import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import setForecast from 'actions/AppState/setForecast';
import moment from 'moment';

export default class DateSliderMark extends Component {
  static propTypes = {
    month: PropTypes.number.isRequired,
    monthName: PropTypes.string.isRequired,
    count: PropTypes.number.isRequired,
    position: PropTypes.number.isRequired,
    selectedDate: PropTypes.string,
    forecast: PropTypes.object.isRequired,
    range: PropTypes.array,
    selectedRange: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selectedDate === this.formatMonth(props.month).format('M/YYYY')
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.selectedDate !== this.props.selectedDate
      || nextProps.range[0] !== this.props.range[0]
      || nextProps.range[1] !== this.props.range[1]
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selectedDate === this.formatMonth(nextProps.month).format('M/YYYY')
    });
  }

  getWidth() {
    return 100 / (this.props.count - 1);
  }

  getPosition() {
    return this.props.position * this.getWidth() - this.getWidth() / 2;
  }

  toggleSelected() {
    const date = this.formatMonth(this.props.month);

    if (date.isAfter(this.props.selectedRange.endDate, 'month') || date.isBefore(this.props.selectedRange.startDate, 'month')) {
      return;
    }

    setForecast(this.props.forecast, date.toDate());
  }

  formatMonth(month) {
    const year = parseInt(moment().format('YYYY'), 10);
    return month > 12 ? moment(month - 12 + '/' + (year + 1), 'M/YYYY') : moment(month + '/' + year, 'M/YYYY');
  }

  renderYear() {
    if (this.props.month === 1) {
      return (<span className="date-slider__year">{moment().format('YYYY')}</span>);
    } else if (this.props.month === 13) {
      return (<span className="date-slider__year">{+moment().format('YYYY') + 1}</span>);
    }
  }

  render() {
    const elementClass = classNames({
      selected: this.state.selected,
      current: moment().format('M') === this.props.month.toString()
    });
    const style = {
      width: this.getWidth() + '%',
      left: this.getPosition() + '%'
    };
    const barClass = classNames({
      'date-slider__mark__bar-fragment': true,
      'date-slider__mark__bar-fragment--after': this.formatMonth(this.props.month).isAfter(moment(), 'month')
    });

    return (
      <div onClick={this.toggleSelected.bind(this)}
           className={`date-slider__mark ${elementClass}`}
           style={style}>

        {this.props.month > this.props.range[0] && this.props.month <= this.props.range[1] && (
          <div className={barClass}></div>
        )}
        {this.props.monthName}
        {this.renderYear()}
        {moment().format('M') === this.props.month.toString() && (<i className="fa fa-caret-up date-slider__mark-current"/>)}
      </div>
    )
  }
}
