/*eslint no-console:0 */
import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import './APIForecast.scss';
import updateForecast from 'actions/APIForecast/update';
import ForecastDetails from './Subelements/ForecastDetails';
import DateSlider from './Subelements/DateSlider';
import ForecastService from 'services/ForecastService';
import ForecastDataParser from 'services/ForecastDataParser';
import DateRangeBar from './Subelements/DateRangeBar';
import ForecastNav from './Subelements/ForecastNav';
import ForecastPlans from './Subelements/ForecastPlans';

const AppState = LunchBadgerCore.stores.AppState;

const boxSource = {
  beginDrag(props) {
    const {entity, left, top} = props;
    return {entity, left, top};
  }
};

@DragSource('forecastElement', boxSource, (connect) => ({
  connectDragSource: connect.dragSource()
}))
export default class APIForecast extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);

    const date = new Date();
    this.currentDate = `${date.getMonth() + 1}/${date.getFullYear()}`;

    this.forecastUpdated = () => {
      const currentForecast = AppState.getStateKey('currentForecast');

      if (currentForecast && currentForecast.forecast.id === this.props.entity.id) {
        this._updateForecast(currentForecast);
      }
    };

    this.state = {
      expanded: false,
      data: [],
      startDate: null,
      endDate: null,
      selectedRange: null,
      incomeSummary: [],
      selectedDate: this.currentDate
    };
  }

  componentDidMount() {
    AppState.addChangeListener(this.forecastUpdated);

    this.setState({data: ForecastDataParser.prepareData(this.props.entity.toJSON())}, () => {
      this._updateForecast(AppState.getStateKey('currentForecast'));
      this._fetchForecastData().then(() => this._updateForecast(AppState.getStateKey('currentForecast')));
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: ForecastDataParser.prepareData(nextProps.entity.toJSON())}, () => {
      this._updateForecast(AppState.getStateKey('currentForecast'));
    });
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

  _fetchForecastData() {
    return ForecastService.get(this.props.entity.api.id).then((response) => {
      const data = response.body;

      if (data.length) {
        const forecastData = data[0];

        updateForecast(this.props.entity.id, forecastData);

        this.setState({data: ForecastDataParser.prepareData(forecastData)}, () => {
          if (this.state.data.length) {
            const firstSetDateKeys = Object.keys(this.state.data[0]);

            this.setState({
              startDate: firstSetDateKeys[0],
              endDate: firstSetDateKeys[firstSetDateKeys.length - 1]
            });
          }
        });
      }
    }).catch((error) => {
      return console.error(error);
    });
  }

  _handleRangeUpdate(range) {
    this.setState({
      selectedRange: range,
      startDate: range.startDate,
      endDate: range.endDate
    });
  }

  render() {
    const elementClass = classNames({
      expanded: this.state.expanded
    });
    const {hideSourceOnDrag, left, top, connectDragSource, isDragging} = this.props;

    if (isDragging && hideSourceOnDrag) {
      return null;
    }

    return connectDragSource(
      <div className={`api-forecast ${elementClass}`} style={{left, top}}>
        <div className="api-forecast__header">
          {
            !!this.state.startDate && (
              <DateRangeBar onInit={this._handleRangeUpdate.bind(this)}
                            onRangeUpdate={this._handleRangeUpdate.bind(this)}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}/>
            )
          }
          <ForecastNav entity={this.props.entity} onExpand={() => this.setState({expanded: !this.state.expanded})}/>
        </div>
        <div className="api-forecast__content">
          <div className="expanded-only">
            <div className="api-forecast__date-slider">
              {
                !!this.state.selectedRange && (
                  <DateSlider parent={this.props.entity}
                              range={this.state.selectedRange}
                              onRangeUpdate={this._handleRangeUpdate.bind(this)}
                              selectedDate={this.state.selectedDate}/>
                )
              }
            </div>
            <div className="api-forecast__plans">
              <ForecastPlans selectedDate={this.state.selectedDate} entity={this.props.entity} />
            </div>
          </div>
          {
            this.state.data.length > 0 && (
              <ForecastDetails
                dateRange={this.state.selectedRange}
                className="api-forecast__details"
                data={this.state.data}
                entity={this.props.entity}
                selectedDate={this.state.selectedDate}
                incomeSummary={this.state.incomeSummary}/>
            )
          }
        </div>
      </div>
    );
  }
}
