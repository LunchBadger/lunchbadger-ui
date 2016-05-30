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
    forecast: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selected: props.selectedDate === this.formatMonth(props.month).format('M/YYYY')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedDate === this.props.selectedDate) {
      return;
    }
    this.setState({
      selected: nextProps.selectedDate === this.formatMonth(nextProps.month).format('M/YYYY')
    })
  }

  getWidth() {
    return 100 / (this.props.count - 1);
  }

  getPosition() {
    return this.props.position * this.getWidth() - this.getWidth() / 2;
  }

  toggleSelected() {
    setForecast(this.props.forecast, this.formatMonth(this.props.month).toDate());
  }

  formatMonth(month) {
    const year = +moment(this.props.selectedDate, 'M/YYYY').format('YYYY');
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
      selected: this.state.selected
    });
    const style = {
      width: this.getWidth() + '%',
      left: this.getPosition() + '%'
    };
    return (
      <div onClick={this.toggleSelected.bind(this)}
           className={`date-slider__mark ${elementClass}`}
           style={style}>
        {this.props.monthName}
        {this.renderYear()}
        {moment().format('M') == this.props.month &&
          (<i className="fa fa-caret-up date-slider__mark-current"/>)
        }
      </div>
    )
  }
}
