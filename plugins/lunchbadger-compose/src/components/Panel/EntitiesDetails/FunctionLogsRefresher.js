import React, {PureComponent} from 'react';
import cs from 'classnames';
import './FunctionLogsRefresher.scss';

const {
  UI: {
    IconButton,
    Checkbox,
    Select,
  },
} = LunchBadgerCore;

export default class FunctionLogsRefresher extends PureComponent {
  render() {
    const {
      autorefresh,
      period,
      periodOptions,
      onAutorefreshToggle,
      onReloadLogs,
      onPeriodChange,
    } = this.props;
    return (
      <div className={cs('FunctionLogsRefresher', {autorefresh})}>
        <div className="FunctionLogsRefresher__cell">
          <Checkbox
            label="autorefresh"
            name="autorefresh"
            value={autorefresh}
            handleChange={onAutorefreshToggle}
          />
        </div>
        <div className={cs('FunctionLogsRefresher__cell', 'period')}>
          <span>
            every
          </span>
          <span>
            <Select
              name="autorefreshPeriod"
              value={period}
              options={periodOptions}
              handleChange={onPeriodChange}
            />
          </span>
        </div>
        <div className={cs('FunctionLogsRefresher__cell', 'FunctionLogsRefresher__btn')}>
          <IconButton
            icon="iconReload"
            name="reloadLogs"
            onClick={onReloadLogs}
          />
        </div>
      </div>
    );
  }
}
