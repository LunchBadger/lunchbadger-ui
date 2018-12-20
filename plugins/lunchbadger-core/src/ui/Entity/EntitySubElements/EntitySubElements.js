import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {EntityPropertyLabel, IconSVG} from '../../';
import getPlainText from '../../utils/getPlainText';
import icons from '../../icons';
import './EntitySubElements.scss';

const {iconPlus} = icons;

export default class EntitySubElements extends PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    main: PropTypes.bool,
    title: PropTypes.node,
    onAdd: PropTypes.func,
  };

  static defaultProps = {
    title: '',
    main: false,
  };

  handleClickAdd = event => {
    const {onAdd} = this.props;
    onAdd(event);
    event.preventDefault();
  };

  render() {
    const {title, children, main, onAdd} = this.props;
    return (
      <div className={cs('EntitySubElements', {['EntitySubElements__main']: main})}>
        {title !== '' && (
          <div className="EntitySubElements__title">
            <EntityPropertyLabel>{title}</EntityPropertyLabel>
            {onAdd && (
              <button
                type="button"
                className={cs('EntitySubElements__title__add', getPlainText(`button__add__${title}`))}
                onClick={this.handleClickAdd}
              >
                <IconSVG svg={iconPlus} />
              </button>
            )}
          </div>
        )}
        <div className="EntitySubElements__elements">
          {children}
        </div>
      </div>
    );
  }
}
