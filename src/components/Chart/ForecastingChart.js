import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import './ForecastingChart.scss';

export const dataKeys = {
  churn: '-',
  downgrades: '-',
  existing: '+',
  upgrades: '+',
  new: '+'
};

export default class ForecastingChart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.color = d3.scale.ordinal().range(['#8dad45', '#ccdea8', '#a8c667', '#f29332', '#fad35c']);

    this.customOffset = (data) => {
      var j = -1,
        m = data[0].length,
        y0 = [];

      while (++j < m) {
        y0[j] = -(data[0][j][1] + data[1][j][1]);
      }

      return y0;
    }
  }

  componentDidMount() {
    this.chart = findDOMNode(this.refs.chart);
    this.chartContainer = d3.select(this.chart);

    const chartBounds = this.chart.getBoundingClientRect();

    this.margin = {top: 0, right: 0, bottom: 30, left: 50};
    this.width = chartBounds.width - this.margin.left - this.margin.right;
    this.height = 240 - this.margin.top - this.margin.bottom;

    this.x = d3.scale.ordinal().rangeRoundBands([0, this.width]);
    this.y = d3.scale.linear().rangeRound([this.height, 0]);
    this.z = d3.scale.category10();

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient('bottom')
      .tickSize(0, 0)
      .tickFormat(d3.time.format('%m'));

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient('left')
      .ticks(6)
      .tickSize(2, 0)
      .tickFormat(d3.format('.2s'));

    this.svg = this.chartContainer.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .attr('id', 'chart')
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.tooltip = this.chartContainer.append('div')
      .attr('class', 'chart__tooltip')
      .style('opacity', 0);

    this.barSelector = this.chartContainer.append('div')
      .attr('class', 'chart__bar-selector')
      .style('opacity', 0);

    this.chartContainer.append('div')
      .attr('class', 'chart__x-axis');

    // TODO: this line should be calculated depending on the Y values
    // draw line on 0 for y
    this.zeroLine = this.svg.append('line')
      .style('stroke', 'black')
      .attr('x1', 0)
      .attr('y1', this.y(0.17))
      .attr('x2', 500)
      .attr('y2', this.y(0.17));

    return this._renderChart(this.props.data);
  }

  _renderChart(data) {
    this.color.domain(d3.keys(data[0]).filter((key) => {
      return key !== 'date';
    }));

    const layers = this._formatData(data);
    this._formatAxis(data, layers);

    this._drawBars(data, layers);
    this._drawAxises();
  }

  _formatData(data) {
    return d3.layout.stack().offset(this.customOffset)(Object.keys(dataKeys).map((dataKey) => {
      return data.map(function (d) {
        return {
          x: d.date,
          y: d[dataKey],
          name: dataKey
        };
      });
    }));
  }

  _formatAxis(data, layers) {
    this.x.domain(layers[0].map((d) => {
      return d.x;
    }));

    let maxValue = 0;
    let minValue = 0;

    data.forEach((d) => {
      let minSum = 0;
      let maxSum = 0;

      Object.keys(dataKeys).forEach((key) => {
        if (dataKeys[key] === '-') {
          minSum -= d[key];
        } else {
          maxSum += d[key];
        }
      });

      if (minSum < minValue) {
        minValue = minSum;
      }

      if (maxSum > maxValue) {
        maxValue = maxSum;
      }
    });

    const offsetFactor = 0.2;
    const yAxisOffset = (Math.abs(minValue) > maxValue) ? Math.abs(minValue) * offsetFactor : maxValue * offsetFactor;

    this.y.domain([
      minValue - yAxisOffset,
      maxValue + yAxisOffset
    ]);
  }

  _drawBars(data, layers) {
    const layer = this.svg.selectAll('.layer')
      .data(layers)
      .enter().append('g')
      .attr('class', 'layer')
      .style('fill', (d, i) => {
        return this.z(i);
      });

    layer.selectAll('rect')
      .data((d) => {
        return d;
      })
      .enter().append('rect')
      .attr('x', (d) => {
        return this.x(d.x) + 2;
      })
      .attr('y', (d) => {
        return this.y(d.y + d.y0);
      })
      .attr('height', (d) => {
        return this.y(d.y0) - this.y(Math.abs(d.y) + d.y0);
      })
      .attr('width', this.x.rangeBand() - 4)
      .style('fill', (d) => {
          return this.color(d.name);
        }
      )
      .on('mouseover', (d) => {
        this.tooltip
          .transition()
          .duration(200);

        this.tooltip
          .style('opacity', 1)
          .html(d.name.charAt(0).toUpperCase() + d.name.slice(1) + ': ' + '<br />' + d.y)
          .style('left', `${d3.event.pageX}px`)
          .style('top', `${d3.event.pageY}px`);
      })
      .on('mouseout', () => {
        this.tooltip.transition()
          .duration(100)
          .style('opacity', 0);
      })
      .on('click', (d) => {
        const timestamp = d.x.getTime() + '';

        if (timestamp === this.barSelector.attr('selected-date')) {
          return (
            this.barSelector
              .style('opacity', 0)
              .attr('selected-date', '')
          );
        }

        this.barSelector
          .style('opacity', 1)
          .style('left', `${this.x(d.x) + this.margin.left + 2}px`)
          .style('height', `${this.height + 20}px`)
          .style('width', `${this.x.rangeBand() - 4}px`)
          .attr('selected-date', timestamp);
      });
  }

  _drawAxises() {
    this.svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + this.height + ')')
      .call(this.xAxis);

    this.svg.append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);
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
