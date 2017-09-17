import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {EntityPropertyLabel, IconSVG} from '../../';
import getPlainText from '../../utils/getPlainText';
import iconPlus from '../../../../../src/icons/icon-plus.svg';
import './EntitySubElements.scss';

const EntitySubElements = ({title, children, main, onAdd}) => (
  <div className={cs('EntitySubElements', {['EntitySubElements__main']: main})}>
    {title !== '' && (
      <div className="EntitySubElements__title">
        <EntityPropertyLabel>{title}</EntityPropertyLabel>
        {onAdd && (
          <div className={cs('EntitySubElements__title__add', getPlainText(`button__add__${title}`))} onClick={onAdd}>
            <IconSVG svg={iconPlus} />
          </div>
        )}
      </div>
    )}
    <div className="EntitySubElements__elements">
      {children}
    </div>
  </div>
);

EntitySubElements.propTypes = {
  children: PropTypes.node.isRequired,
  main: PropTypes.bool,
  title: PropTypes.node,
  onAdd: PropTypes.func,
};

EntitySubElements.defaultProps = {
  title: '',
  main: false,
};

export default EntitySubElements;
