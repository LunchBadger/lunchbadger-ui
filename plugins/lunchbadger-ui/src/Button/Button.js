import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './Button.scss';

export default class Button extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    type: PropTypes.string,
    onClick: PropTypes.func,
    name: PropTypes.string,
  };

  static defaultProps = {
    type: '',
    name: '',
  };

  handleClick = event => {
    event.preventDefault();
    const {onClick} = this.props;
    onClick(event);
  }

  render() {
    const {type, children, name, disabled} = this.props;
    const classNames = cs('Button', name, type, {disabled});
    if (type === 'submit') return <button type="submit" className={classNames}>{children}</button>
    return <button className={classNames} onClick={this.handleClick}>{children}</button>;
  }
}
