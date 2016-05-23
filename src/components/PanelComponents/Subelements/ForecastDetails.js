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
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: null,
      incomeSummary: []
    };

    this.forecastUpdated = () => {
      const currentForecast = AppState.getStateKey('currentForecast');

      if (currentForecast && currentForecast.forecast.id === this.props.entity.id) {
        this.setState({
          incomeSummary: ForecastDataParser.calculateMonthlyIncome(
            this.props.entity.api.plans,
            currentForecast.selectedDate
          ),
          selectedDate: currentForecast.selectedDate
        });
      }
    };
  }

  componentDidMount() {
    AppState.addChangeListener(this.forecastUpdated);
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.forecastUpdated);
  }

  render() {
    return (
      <div className={this.props.className || ''}>
        <ForecastDetailsTop incomeSummary={this.state.incomeSummary}
                            selectedDate={this.state.selectedDate}
                            data={this.props.data}/>
        <ForecastingChart forecast={this.props.entity} data={this.props.data}/>
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
