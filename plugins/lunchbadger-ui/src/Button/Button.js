import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './Button.scss';

const Button = ({type, children, onClick, name}) => {
  if (type === 'submit') return <button type="submit" className={cs('Button', name)}>{children}</button>
  return <div className={cs('Button', name)} onClick={onClick}>{children}</div>;
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
  name: PropTypes.string,
}

Button.defaultProps = {
  type: '',
  name: '',
}

export default Button;
