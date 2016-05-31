/*eslint no-console:0 */
import React, {Component, PropTypes} from 'react';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import './APIForecast.scss';
import removeAPIForecast from 'actions/APIForecast/remove';
import BasePlan from './Subelements/BasePlan';
import addPlan from 'actions/APIForecast/addPlan';
import updateForecast from 'actions/APIForecast/update';
import UpgradeSlider from 'components/PanelComponents/Subelements/UpgradeSlider';
import ForecastDetails from './Subelements/ForecastDetails';
import DateSlider from './Subelements/DateSlider';
import ForecastService from 'services/ForecastService';
import ForecastDataParser from 'services/ForecastDataParser';
import DateRangeBar from './Subelements/DateRangeBar';
import {notify} from 'react-notify-toast';
import 'rc-slider/assets/index.css';

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
      this._updateForecast();
    });

    this._fetchForecastData().then(() => this._updateForecast());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({data: ForecastDataParser.prepareData(nextProps.entity.toJSON())}, () => {
      this._updateForecast();
    });
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.forecastUpdated);
  }

  save() {
    ForecastService.save(this.props.entity.id, this.props.entity.toJSON()).then(() => {
      notify.show('Forecast has been successfully saved into local API', 'success');
    }).catch(() => {
      notify.show('There are problems with syncing data with local API, check console for more', 'error');
    });
  }

  remove() {
    removeAPIForecast(this.props.entity.id);
  }

  toggleExpand() {
    this.setState({expanded: !this.state.expanded})
  }

  addPlan() {
    //addPlan(this.props.entity, {name: 'Super whale', icon: 'fa-space-shuttle'});
  }

  renderPlans() {
    return this.props.entity.api.plans.map((plan, index) => {
      return (
        <li key={`plan_${index}`}>
          <span>{plan.name}</span>
          <BasePlan key={plan.id}
                    parent={this.props.entity}
                    entity={plan}/>
        </li>
      )
    })
  }

  renderUpgrades() {
    return this.props.entity.upgrades.map((upgrade, index) => {
      return (
        <li key={`upgrade_${index}`}>
          <UpgradeSlider key={upgrade.id}
                         value={upgrade.value}
                         name={upgrade.name}
                         percentage={upgrade.percentage}/>
        </li>
      )
    })
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
          <ul className="api-forecast__header__nav">
            <li>
              <a onClick={this.save.bind(this)}>
                <i className="fa fa-floppy-o"/>
              </a>
            </li>
            <li>
              <a onClick={this.remove.bind(this)}>
                <i className="fa fa-remove"/>
              </a>
            </li>
            <li>
              <a onClick={this.toggleExpand.bind(this)}>
                <i className="fa fa-expand"/>
              </a>
            </li>
          </ul>
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
            <ul className="api-forecast__plans">
              {this.renderPlans()}
              <li>
                <a className="api-forecast__add-plan" onClick={this.addPlan.bind(this)}>
                  <i className="fa fa-plus"/>
                </a>
              </li>
            </ul>
            <ul className="api-forecast__upgrade-sliders">
              {this.renderUpgrades()}
            </ul>
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
