import React, {Component, PropTypes} from 'react';
import {findDOMNode} from 'react-dom';
import updatePlan from '../../../actions/APIForecast/updatePlan';

export default class ForecastPlanInput extends Component {
  static propTypes = {
    value: PropTypes.string,
    plan: PropTypes.object,
    forecast: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.value
    };
  }

  componentDidMount() {
    this.triggerElementAutofocus();
  }

  triggerElementAutofocus() {
    const nameInput = findDOMNode(this.refs.input);
    const selectAllOnce = () => {
      nameInput.select();
      nameInput.removeEventListener('focus', selectAllOnce);
    };

    nameInput.addEventListener('focus', selectAllOnce);
    nameInput.focus();
  }

  _handleChange = (event) => {
    this.setState({value: event.target.value});
  }

  _handleKeyPress = (event) => {
    if ((event.keyCode === 13 || event.which === 13) && event.target.value.trim().length > 0) {
      this._update();
    }
  }

  _update = () => {
    updatePlan(this.props.forecast, this.props.plan, this.state.value);
  }

  render() {
    return (
      <input value={this.state.value}
             onBlur={this._update}
             ref="input"
             className={this.props.className || ''}
             onKeyDown={this._handleKeyPress}
             onChange={this._handleChange}
             type="text"/>
    );
  }
}
