import React, {Component, PropTypes} from 'react';
import ForecastDetailsTop from './ForecastDetailsTop';
import ForecastDetailsBottom from './ForecastDetailsBottom';
import ForecastingChart from 'components/Chart/ForecastingChart';
import './ForecastDetails.scss';

export default class ForecastDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    data: PropTypes.array.isRequired,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.className || ''}>
        <ForecastDetailsTop />
        <ForecastingChart forecast={this.props.entity} data={this.props.data}/>
        <ForecastDetailsBottom />
      </div>
    );
  }
}
