import React, {Component} from 'react';

export default class ForecastDetailsBottom extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="forecast__details-bottom">
        <div className="forecast__details-bottom__date">
          October<br />
          2015
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--new">
          <span className="forecast__details-bottom__detail__title">
            711 new users
          </span>
          <span className="forecast__details-bottom__detail__value">
            $19.9k
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--upgrades">
          <span className="forecast__details-bottom__detail__title">
            522 upgrades
          </span>
          <span className="forecast__details-bottom__detail__value">
            $6.2
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--existing">
          <span className="forecast__details-bottom__detail__title">
            9,111 existing
          </span>
          <span className="forecast__details-bottom__detail__value">
            $258.4
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--downgrades">
          <span className="forecast__details-bottom__detail__title">
            208 downgrades
          </span>
          <span className="forecast__details-bottom__detail__value">
            -$2.3k
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--churn">
          <span className="forecast__details-bottom__detail__title">
            323 churn
          </span>
          <span className="forecast__details-bottom__detail__value">
            -$8.7k
          </span>
        </div>
      </div>
    );
  }
};
