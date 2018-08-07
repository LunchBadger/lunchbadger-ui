import React, {PureComponent} from 'react';
import cs from 'classnames';
import zxcvbn from 'zxcvbn';
import './PasswordStrengthMeter.scss';

export default class PasswordStrengthMeter extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
  }

  setPassword = password => this.setState({password});

  render() {
    const {password} = this.state;
    const {score} = zxcvbn(password);
    return (
      <div className={cs('PasswordStrengthMeter', `score-${score}`)} />
    );
  }
}
