import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import MenuItem from 'material-ui/MenuItem';
import {IconSVG} from '../../';
import {iconWand} from '../../../../../src/icons';
import './Tool.scss';

class SubmenuItem extends Component {
  onClick = (event) => {
    const {onMenuItemClick, onClick} = this.props;
    onMenuItemClick();
    if (event.target.closest('.Tool__wizard') === null) {
      onClick();
    }
  }

  onWizardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.wizard();
  }

  render() {
    const {icon, label, wizard, plain} = this.props;
    return (
      <MenuItem
        onTouchTap={this.onClick}
        style={{fontSize: 18, minHeight: 34, lineHeight: '34px'}}
        innerDivStyle={{padding: 0}}
      >
        <IconSVG className={cs('Tool__icon', 'submenu', {plain})} svg={icon} />
        <div className={cs('Tool__label', {plain})}>{label}</div>
        {wizard && (
          <span className="Tool__wizard" onClick={this.onWizardClick}>
            <IconSVG className="Tool__wizard__icon" svg={iconWand} />
          </span>
        )}
      </MenuItem>
    );
  }
}

SubmenuItem.propTypes = {
  label: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  onMenuItemClick: PropTypes.func,
  wand: PropTypes.func,
  plain: PropTypes.bool,
};

export default SubmenuItem;
