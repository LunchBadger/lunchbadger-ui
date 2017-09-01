/*eslint no-console:0 */
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {DragSource} from 'react-dnd';
import classNames from 'classnames';
import moment from 'moment';
import {updateAPIForecast, setForecast} from '../../reduxActions/forecasts';
import ForecastDetails from './Subelements/ForecastDetails';
import DateSlider from './Subelements/DateSlider';
import ForecastService from '../../services/ForecastService';
import ForecastDataParser from '../../services/ForecastDataParser';
import DateRangeBar from './Subelements/DateRangeBar';
import ForecastNav from './Subelements/ForecastNav';
import ForecastPlans from './Subelements/ForecastPlans';
import ForecastResizeHandle from './Subelements/ForecastResizeHandle';
import './APIForecast.scss';

const {actions: coreActions} = LunchBadgerCore.utils;

const boxSource = {
  beginDrag(props) {
    const {entity, left, top} = props;
    return {entity, left, top};
  },
  canDrag: (props) => {
    return !props.isExpanded;
  }
};

@DragSource('forecastElement', boxSource, (connect) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview()
}))

class APIForecast extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
    onClose: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired,
    isExpanded: PropTypes.bool.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const date = new Date();
    this.currentDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
    this.state = {
      dragging: false,
      expanded: props.isExpanded,
      data: [],
      startDate: null,
      endDate: null,
      selectedRange: null,
      incomeSummary: [],
      selectedDate: this.currentDate,
      scale: 1,
    };
  }

  componentDidMount() {
    this.setState({data: ForecastDataParser.prepareData(this.props.entity.toJSON())}, () => {
      this._updateForecast(this.props.currentForecast);
      this._fetchForecastData().finally(() => this._updateForecast(this.props.currentForecast));
    });
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({data: ForecastDataParser.prepareData(nextProps.entity.toJSON())}, () => {
      this._updateForecast(nextProps.currentForecast);
    });
    const {currentForecastInformation} = nextProps;
    if (nextProps.isExpanded !== this.props.isExpanded) {
      this.setForecast(nextProps.entity, currentForecastInformation.selectedDate || nextState.selectedDate || this.currentDate, nextProps.isExpanded);
    }
  }

  setForecast = (forecast, date, expanded) => this.context.store.dispatch(setForecast(forecast, date, expanded));

  _updateForecast(forecast = null) {
    const selectedDate = (forecast && forecast.selectedDate) ? forecast.selectedDate : this.currentDate;
    this.setState({
      incomeSummary: ForecastDataParser.calculateMonthlyIncome(this.props.entity.api, selectedDate),
      selectedDate: selectedDate
    });
  }

  _fetchForecastData() {
    return ForecastService.get(this.props.entity.api.id).then((response) => {
      const data = response.body;
      let forecastData;
      if (data.length) {
        forecastData = data[0];
      } else {
        forecastData = this.props.entity.toJSON();
      }
      this.context.store.dispatch(updateAPIForecast(this.props.entity.id, forecastData));
      this.setState({data: ForecastDataParser.prepareData(forecastData)}, () => {
        if (this.state.data.length) {
          const firstSetDateKeys = Object.keys(this.state.data[0]);
          this.setState({
            startDate: firstSetDateKeys[0],
            endDate: firstSetDateKeys[firstSetDateKeys.length - 1]
          });
          this.setForecast(this.props.entity, this.state.selectedDate, this.props.isExpanded);
        }
      });
    }).catch((err) => {
      this.props.dispatch(coreActions.addSystemDefcon1(err));
    });
  }

  _handleRangeUpdate = (range) => {
    this.setState({
      selectedRange: range,
      startDate: range.startDate,
      endDate: range.endDate
    }, () => {
      const selectedDate = moment(this.state.selectedDate, 'M/YYYY');
      if (this.state.startDate.isAfter(selectedDate, 'month')) {
        this.setState({selectedDate: this.state.startDate.format('M/YYYY')}, () => {
          this.setForecast(this.props.entity, this.state.selectedDate, this.props.isExpanded);
        });
      } else if (this.state.endDate.isBefore(selectedDate, 'month')) {
        this.setState({selectedDate: this.state.endDate.format('M/YYYY')}, () => {
          this.setForecast(this.props.entity, this.state.selectedDate, this.props.isExpanded);
        });
      }
    });
  }

  _handleEndDateUpdate = (endDate) => {
    const {selectedRange} = this.state;
    const newRange = Object.assign({}, selectedRange, {endDate: endDate});
    if (selectedRange.endDate.isAfter(endDate)) {
      return;
    }
    this.setState({
      selectedRange: newRange,
      endDate: newRange.endDate
    });
  }

  handlePanelResize = (event) => {
    const container = this.forecast;
    const containerBBox = container.getBoundingClientRect();
    // we need to store percentage value
    let newPixelHeight = event.clientY - containerBBox.top;
    const newScale = parseInt(newPixelHeight / containerBBox.height * this.state.scale * 100, 10) / 100;
    this.setState({
      dragging: true,
      scale: newScale
    });
  }

  handlePanelResizeEnd = () => {
    this.setState({dragging: false});
  }

  render() {
    const elementClass = classNames({
      expanded: this.props.isExpanded
    });
    const {hideSourceOnDrag, left, top, connectDragSource, connectDragPreview, isDragging} = this.props;
    if (isDragging && hideSourceOnDrag) {
      return null;
    }
    const forecastStyle = {
      left,
      top,
      transform: `scale(${this.state.scale})`
    }
    return connectDragPreview(
      <div className={`api-forecast ${elementClass}`}
           style={forecastStyle}
           ref={(instance) => this.forecast = instance}>
        {connectDragSource(
          <div className="api-forecast__header">
            <div className="api-forecast__header__icon">
              <i className="fa icon-icon-product" />
            </div>
            <div className="api-forecast__header__title">
              {this.props.entity.api.name}
              <span className="api-forecast__header__subtitle">Revenue Forecast</span>
            </div>
            {
              !!this.state.startDate && (
                <DateRangeBar onInit={this._handleRangeUpdate}
                              onRangeUpdate={this._handleRangeUpdate}
                              startDate={this.state.startDate}
                              endDate={this.state.endDate}/>
              )
            }
            <ForecastNav entity={this.props.entity}
                         onClose={() => this.props.onClose()}
                         onExpand={() => this.props.onExpand()}/>
          </div>
        )}
        <div className="api-forecast__content">
          <div className="expanded-only">
            <div className="api-forecast__date-slider">
              {
                !!this.state.selectedRange && (
                  <DateSlider parent={this.props.entity}
                              range={this.state.selectedRange}
                              onRangeUpdate={this._handleRangeUpdate}
                              selectedDate={this.state.selectedDate}/>
                )
              }
            </div>
            <div className="api-forecast__plans">
              <ForecastPlans selectedDate={this.state.selectedDate}
                             handleUpgradeCreation={this._handleEndDateUpdate}
                             entity={this.props.entity}/>
            </div>
          </div>
          {
            this.state.data.length > 0 && (
              <ForecastDetails
                panelHeight={this.props.panelHeight}
                dateRange={this.state.selectedRange}
                className="api-forecast__details"
                data={this.state.data}
                entity={this.props.entity}
                selectedDate={this.state.selectedDate}
                expanded={this.props.isExpanded}
                incomeSummary={this.state.incomeSummary}/>
            )
          }
        </div>
        <ForecastResizeHandle resizable={!this.props.isExpanded}
                           onDragEnd={this.handlePanelResizeEnd}
                           onDrag={this.handlePanelResize}/>
      </div>
    );
  }
}

const selector = createSelector(
  state => state.states.currentForecast,
  state => state.states.currentForecastInformation,
  (currentForecast, currentForecastInformation) =>
    ({currentForecast, currentForecastInformation}),
);

export default connect(selector)(APIForecast);
