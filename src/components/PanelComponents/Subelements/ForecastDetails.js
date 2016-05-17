import React, {Component, PropTypes} from 'react';
import ForecastDetailsTop from './ForecastDetailsTop';
import ForecastDetailsBottom from './ForecastDetailsBottom';
import ForecastingChart from 'components/Chart/ForecastingChart';
import ForecastService from 'services/ForecastService';
import {dataKeys} from 'components/Chart/ForecastingChart';
import './ForecastDetails.scss';

export default class ForecastDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.parseDate = d3.time.format('%m/%Y').parse;

    this.prepareData = (data) => {
      return data.map((dataRow) => {
        dataRow.date = this.parseDate(dataRow.date);

        delete dataRow.id;

        Object.keys(dataKeys).forEach((dataKey) => {
          dataRow[dataKey] = +dataRow[dataKey];
        });

        return dataRow;
      });
    };
  }

  componentDidMount() {
    this._fetchForecastData();
  }

  _fetchForecastData() {
    ForecastService.get(this.props.entity.apiId).then((response) => {
      const data = response.body[0].values;

      this.setState({data: this.prepareData(data)});
    }).catch((error) => {
      return console.error(error);
    });
  }

  render() {
    return this.state.data.length > 0 && (
      <div className={this.props.className || ''}>
        <ForecastDetailsTop />
        <ForecastingChart data={this.state.data}/>
        <ForecastDetailsBottom />
      </div>
    );
  }
}
