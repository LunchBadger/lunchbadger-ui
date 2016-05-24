import React, {Component, PropTypes} from 'react';
import ForecastDetailsTop from './ForecastDetailsTop';
import ForecastDetailsBottom from './ForecastDetailsBottom';
import ForecastingChart from 'components/Chart/ForecastingChart';
import ForecastDataParser from 'services/ForecastDataParser';
import './ForecastDetails.scss';

const AppState = LunchBadgerCore.stores.AppState;

export default class ForecastDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    className: PropTypes.string,
    dateRange: PropTypes.object
  };

  constructor(props) {
    super(props);

    const date = new Date();
    this.currentDate = `${date.getMonth() + 1}/${date.getFullYear()}`;

    this.state = {
      selectedDate: this.currentDate,
      incomeSummary: []
    };

    this.forecastUpdated = () => {
      const currentForecast = AppState.getStateKey('currentForecast');

      if (currentForecast && currentForecast.forecast.id === this.props.entity.id) {
        this._updateForecast(currentForecast);
      }
    };
  }

  componentDidMount() {
    AppState.addChangeListener(this.forecastUpdated);

    this._updateForecast();
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.forecastUpdated);
  }

  _updateForecast(forecast = null) {
    const selectedDate = (forecast && forecast.selectedDate) ? forecast.selectedDate : this.currentDate;

    this.setState({
      incomeSummary: ForecastDataParser.calculateMonthlyIncome(
        this.props.entity.api.plans,
        selectedDate
      ),
      selectedDate: selectedDate
    });
  }

  render() {
    return (
      <div className={this.props.className || ''}>
        <ForecastDetailsTop incomeSummary={this.state.incomeSummary}
                            selectedDate={this.state.selectedDate}
                            data={this.props.data}/>
        <ForecastingChart forecast={this.props.entity}
                          dateRange={this.props.dateRange}
                          data={this.props.data}/>
        {
          this.state.incomeSummary.length > 0 && (
            <ForecastDetailsBottom selectedDate={this.state.selectedDate}
                                   incomeSummary={this.state.incomeSummary}
                                   data={this.props.data}/>
          )
        }
      </div>
    );
  }
}
