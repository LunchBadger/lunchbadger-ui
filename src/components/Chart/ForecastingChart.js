import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import setForecast from 'actions/AppState/setForecast';
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
    expanded: PropTypes.bool,
    selectedDate: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      lastUpdate: new Date()
    };

    this.forecastChanged = () => {
      setTimeout(() => this.setState({lastUpdate: new Date()}));
    };

    this.onWindowResize = () => {
      this._renderChart();
    }
  }

  componentDidMount() {
    this._renderChart();

    Forecast.addChangeListener(this.forecastChanged);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
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

    if (nextProps.expanded !== this.props.expanded) {
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

    console.log('rerender chart');

    if (data.length > 0) {
      this.tickvals = data[0].x;
      const ticktext = data[0].x.map((date) => {
        return this._formatDate(date);
      });

      const layout = {
        margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 15
        },
        barmode: 'relative',
        showlegend: false,
        xaxis: {
          tickvals: this.tickvals,
          ticktext: ticktext,
          tickfont: {
            color: '#000'
          }
        },
        yaxis: {
          tickformat: '.2s'
        },
        shapes: [
          // selected bar
          {
            type: 'rect',
            xref: 'x',
            yref: 'paper',
            x0: 0,
            y0: -0.15,
            x1: 0,
            y1: 1.02,
            fillcolor: 'rgba(0, 171, 255, 0.15)',
            opacity: 0,
            line: {
              color: '#00abff',
              width: 1
            }
          }
          // x axis all
          // {
          //   layer: 'below',
          //   type: 'rect',
          //   xref: 'paper',
          //   yref: 'paper',
          //   x0: 0,
          //   y0: -0.1,
          //   x1: 1,
          //   y1: 0,
          //   fillcolor: '#dededd',
          //   opacity: 1,
          //   line: {
          //     width: 0
          //   }
          // }
        ]
      };

      this.chart = findDOMNode(this.refs.chart);

      Plotly.newPlot(this.chart, data, layout, {displayModeBar: false}).then((chart) => {
        this._markCurrentMonth();
        this._markForecastedMonths();

        const xTicks = d3.selectAll('.xtick').selectAll('text');

        xTicks.forEach((tick, index) => {
          tick[0].setAttribute('data', this.tickvals[index]);
        });

        chart.on('plotly_click', (data) => {
          const {points} = data;

          if (points.length) {
            const {x} = points[0];

            setForecast(this.props.forecast, x);
            this._markCurrentMonth();
            this._markForecastedMonths();
          }
        });

        chart.on('plotly_relayout', () => {
          this._markForecastedMonths();
        });
      });
    }
  }

  _markCurrentMonth() {
    this.tickvals.forEach((tick) => {
      const currentTick = moment(tick, 'M/YYYY');

      if (currentTick.isSame(moment(this.props.selectedDate, 'M/YYYY'), 'month')) {
        let currentMonthNumber = parseInt(currentTick.format('M'), 10) + ((parseInt(currentTick.format('Y'), 10) - parseInt(moment().format('Y'), 10)) * 12);

        if (this.props.dateRange) {
          currentMonthNumber -= parseInt(this.props.dateRange.startDate.format('M'), 10) - 1;
        }

        Plotly.relayout(this.chart, {
          'shapes[0].x0': currentMonthNumber - 1.5,
          'shapes[0].x1': currentMonthNumber - 0.5,
          'shapes[0].opacity': 1
        });
      }
    });
  }

  _markForecastedMonths() {
    const barPaths = d3.selectAll('.bars').selectAll('path');
    const xTicks = d3.selectAll('.xtick').selectAll('text');

    this.tickvals.forEach((tick, index) => {
      let tickForecasted = false;
      const currentTick = moment(tick, 'M/YYYY');

      if (currentTick.isAfter(moment(), 'month')) {
        tickForecasted = true;
      }

      xTicks.forEach((xTick) => {
        if (xTick[0].getAttribute('data') === tick && tickForecasted) {
          xTick[0].classList.add('chart__tick-forecasted');
        }
      });

      barPaths.forEach((paths) => {
        if (paths[index] && tickForecasted) {
          paths[index].classList.add('chart__bar-forecasted');
        }
      });
    });
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
          downgradedUsers[planDetails] = -subscribers.downgrades;
          churnUsers[planDetails] = -subscribers.churn;
        } else {
          newUsers[planDetails] += subscribers.new;
          upgradedUsers[planDetails] += subscribers.upgrades;
          existingUsers[planDetails] += subscribers.existing;
          downgradedUsers[planDetails] -= subscribers.downgrades;
          churnUsers[planDetails] -= subscribers.churn;
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
