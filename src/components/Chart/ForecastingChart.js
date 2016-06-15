import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
// import setForecast from 'actions/AppState/setForecast';
import './ForecastingChart.scss';
import ForecastDataParser from 'services/ForecastDataParser';
import _ from 'lodash';
import moment from 'moment';
import Forecast from 'stores/Forecast';

export default class ForecastingChart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    forecast: PropTypes.object.isRequired,
    dateRange: PropTypes.object,
    selectedDate: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: new Date()
    };

    this.forecastChanged = () => {
      this.setState({lastUpdate: new Date()});
    };
  }

  componentDidMount() {
    this._renderChart();

    Forecast.addChangeListener(this.forecastChanged);
  }

  componentDidUpdate() {
    this._renderChart();
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newData = nextProps.data;
    const oldData = this.props.data;

    if (nextProps.dateRange && this.props.dateRange && !_.isEqual(nextProps.dateRange, this.props.dateRange)) {
      return true;
    }

    if (nextProps.selectedDate !== this.props.selectedDate) {
      return true;
    }

    if (this.state.lastUpdate.toTimeString() !== nextState.lastUpdate.toTimeString()) {
      return true;
    }

    return !_.isEqual(Object.keys(newData), Object.keys(oldData));
  }

  componentWillUnmount() {
    Forecast.removeChangeListener(this.forecastChanged);
  }

  _renderChart() {
    const data = this._formatData();

    if (data.length > 0) {
      const tickvals = data[0].x;
      const ticktext = data[0].x.map((date) => {
        return this._formatDate(date);
      });

      const layout = {
        barmode: 'stack',
        showlegend: false,
        xaxis: {
          tickvals: tickvals,
          ticktext: ticktext
        },
        yaxis: {
          tickformat: '.2s'
        }
      };

      const chart = findDOMNode(this.refs.chart);

      Plotly.newPlot(chart, data, layout, {displayModeBar: false});

      chart.on('plotly_click', function () {
      });
    }
  }

  _formatData() {
    let data = [];
    let filteredData = this.props.data;

    const newTrace = {
      x: [],
      y: [],
      name: 'New',
      type: 'bar',
      marker: {
        color: '#ccdea8'
      }
    };
    const upgradesTrace = {
      x: [],
      y: [],
      name: 'Upgrades',
      type: 'bar',
      marker: {
        color: '#a8c667'
      }
    };
    const existingTrace = {
      x: [],
      y: [],
      name: 'Existing',
      type: 'bar',
      marker: {
        color: '#8dad45'
      }
    };
    const downgradesTrace = {
      x: [],
      y: [],
      name: 'Downgrades',
      type: 'bar',
      marker: {
        color: '#fad35c'
      }
    };
    const churnTrace = {
      x: [],
      y: [],
      name: 'Churn',
      type: 'bar',
      marker: {
        color: '#f29332'
      }
    };

    if (this.props.dateRange) {
      filteredData = ForecastDataParser.filterData(this.props.dateRange, this.props.data, this.props.forecast.api);
    }

    const newUsers = {};
    const upgradedUsers = {};
    const existingUsers = {};
    const downgradedUsers = {};
    const churnUsers = {};

    filteredData.forEach((plan) => {
      Object.keys(plan).forEach((planDetails) => {
        const {subscribers} = plan[planDetails];

        if (!newUsers.hasOwnProperty(planDetails)) {
          newUsers[planDetails] = subscribers.new;
          upgradedUsers[planDetails] = subscribers.upgrades;
          existingUsers[planDetails] = subscribers.existing;
          downgradedUsers[planDetails] = subscribers.downgrades;
          churnUsers[planDetails] = subscribers.churn;
        } else {
          newUsers[planDetails] += subscribers.new;
          upgradedUsers[planDetails] += subscribers.upgrades;
          existingUsers[planDetails] += subscribers.existing;
          downgradedUsers[planDetails] += subscribers.downgrades;
          churnUsers[planDetails] += subscribers.churn;
        }
      });
    });

    Object.keys(newUsers).forEach((date) => {
      newTrace.x.push(date);
      newTrace.y.push(newUsers[date]);
    });

    Object.keys(upgradedUsers).forEach((date) => {
      upgradesTrace.x.push(date);
      upgradesTrace.y.push(upgradedUsers[date]);
    });

    Object.keys(existingUsers).forEach((date) => {
      existingTrace.x.push(date);
      existingTrace.y.push(existingUsers[date]);
    });

    Object.keys(downgradedUsers).forEach((date) => {
      downgradesTrace.x.push(date);
      downgradesTrace.y.push(downgradedUsers[date]);
    });

    Object.keys(churnUsers).forEach((date) => {
      churnTrace.x.push(date);
      churnTrace.y.push(churnUsers[date]);
    });

    data = [churnTrace, downgradesTrace, existingTrace, upgradesTrace, newTrace];

    return data;
  }

  _formatDate(date) {
    const momentDate = moment(date, 'M/YYYY');

    return momentDate.format('MMMM')[0];
  }

  render() {
    return (
      <div className="chart">
        <div className="chart__container" ref="chart">
        </div>
      </div>
    );
  }
}
