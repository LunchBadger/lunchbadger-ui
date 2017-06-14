import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import './Aside.scss';

const Aside = ({children, disabled}) => (
  <aside className={cs('Aside', {disabled})}>
    {children}
  </aside>
);

Aside.propTypes = {
  children: PropTypes.node,
  disabled: PropTypes.bool,
};

Aside.defaultProps = {
  disabled: false,
};

export default Aside;
