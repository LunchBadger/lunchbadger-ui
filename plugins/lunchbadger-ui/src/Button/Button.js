import React, {PropTypes} from 'react';
import './Button.scss';

const Button = ({type, children, onClick}) => {
  if (type === 'submit') return <button type="submit" className="Button">{children}</button>
  return <div className="Button" onClick={onClick}>{children}</div>;
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  type: PropTypes.string,
  onClick: PropTypes.func,
}

Button.defaultProps = {
  type: '',
}

export default Button;
