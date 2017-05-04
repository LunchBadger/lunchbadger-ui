import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class SaveButton extends Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    enabled: PropTypes.bool
  };

  static defaultProps = {
    enabled: false
  };

  handleClick = () => {
    if (this.props.enabled) {
      this.props.onSave();
    }
  };

  render() {
    const buttonClass = classNames({
      'confirm-button__accept': true,
      'confirm-button__accept--enabled': this.props.enabled
    });

    return (
      <a className={buttonClass} onClick={this.handleClick}>
        <span className="confirm-button__button">Save</span>
      </a>
    )
  }
}
