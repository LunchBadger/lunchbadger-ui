import React, {Component} from 'react';

export default class ForecastDetailsTop extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="forecast__details-top">
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Annual recurring
          </span>
          <span className="forecast__details-top__detail__value">
            $2,415,345
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Monthly recurring
          </span>
          <span className="forecast__details-top__detail__value">
            $116,867
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Avg per user
          </span>
          <span className="forecast__details-top__detail__value">
            $22.68
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Monthly retention
          </span>
          <span className="forecast__details-top__detail__value">
            96.4%
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Paying users
          </span>
          <span className="forecast__details-top__detail__value">
            6,203
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Total users
          </span>
          <span className="forecast__details-top__detail__value">
            9,505
          </span>
        </div>
      </div>
    );
  }
};
