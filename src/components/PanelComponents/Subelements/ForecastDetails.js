import React, {Component, PropTypes} from 'react';
import ForecastDetailsTop from './ForecastDetailsTop';
import ForecastDetailsBottom from './ForecastDetailsBottom';
import ForecastingChart from 'components/Chart/ForecastingChart';
import createForecast from 'actions/APIForecast/createForecast';
import './ForecastDetails.scss';

export default class ForecastDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    dateRange: PropTypes.object,
    selectedDate: PropTypes.string,
    incomeSummary: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.dateRange && this.props.dateRange
      && nextProps.dateRange.endDate !== this.props.dateRange.endDate
      && nextProps.entity.api.plans.length) {
      if (!nextProps.entity.api.plans[0].checkPlanDetailsExistence(nextProps.dateRange.endDate)) {
        createForecast(nextProps.entity, nextProps.dateRange.endDate);
      }
    }
  }

  render() {
    return (
      <div className={this.props.className || ''}>
        <ForecastDetailsTop incomeSummary={this.props.incomeSummary}
                            selectedDate={this.props.selectedDate}
                            dateRange={this.props.dateRange}
                            forecast={this.props.entity}
                            data={this.props.data}/>
        <ForecastingChart forecast={this.props.entity}
                          dateRange={this.props.dateRange}
                          selectedDate={this.props.selectedDate}
                          data={this.props.data}/>
        {
          this.props.incomeSummary.length > 0 && (
            <ForecastDetailsBottom selectedDate={this.props.selectedDate}
                                   incomeSummary={this.props.incomeSummary}
                                   data={this.props.data}/>
          )
        }
      </div>
    );
  }
}
