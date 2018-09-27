import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {IconSVG} from '../../../../../lunchbadger-ui/src';
import {iconArrow} from '../../../../../../src/icons';
import './ModelPropertyCollapsed.scss';

class ModelPropertyCollapsed extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  toggleCollapse = collapsed => this.setState({
    collapsed: typeof collapsed === 'boolean' ? collapsed : !this.state.collapsed,
  });

  render() {
    const {children, level, collapsable, nested} = this.props;
    const {collapsed} = this.state;
    return (
      <div className={cs('ModelPropertyCollapsed', {collapsed})}>
        <div className="ModelPropertyCollapsed__row">
          <div className={cs('ModelPropertyCollapsed__col', 'toggle')}>
            {collapsable && (
              <div onClick={this.toggleCollapse}>
                <IconSVG svg={iconArrow} />
              </div>
            )}
          </div>
          <div className={cs('ModelPropertyCollapsed__col', 'content')}>
            {children}
          </div>
        </div>
        {!collapsed && nested}
      </div>
    );
  }
}

ModelPropertyCollapsed.propTypes = {
  children: PropTypes.node,
  level: PropTypes.number,
  collapsable: PropTypes.bool,
  nested: PropTypes.node,
};

ModelPropertyCollapsed.defaultProps = {
  level: 0,
  collapsed: false,
};

export default ModelPropertyCollapsed;
