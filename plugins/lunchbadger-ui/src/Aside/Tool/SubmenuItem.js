import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import MenuItem from 'material-ui/MenuItem';
import {IconSVG, ContextualInformationMessage} from '../../';
import * as icons from '../../../../../src/icons';
import './Tool.scss';

class SubmenuItem extends Component {

  onClick = (event) => {
    const {onMenuItemClick, onClick, action} = this.props;
    onMenuItemClick();
    if (event.target.closest('.Tool__wizard') === null) {
      onClick(action);
    }
  }

  onWizardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.props.wizard();
  }

  render() {
    const {icon, label, name, wizard, plain, wizardTooltip} = this.props;
    return (
      <MenuItem
        onClick={this.onClick}
        style={{fontSize: 18, minHeight: 34, lineHeight: '34px'}}
        innerDivStyle={{padding: 0}}
      >
        <button
          className={cs('Tool__submenuItem', name)}
          style={{width: plain ? 130 : 230}}
        >
          <IconSVG className={cs('Tool__icon', 'submenu', {plain})} svg={icons[icon]} />
          <div className={cs('Tool__label', {plain})}>{label}</div>
        </button>
        {wizard && (
          <ContextualInformationMessage tooltip={wizardTooltip}>
            <span className="Tool__wizard" onClick={this.onWizardClick}>
              <IconSVG className="Tool__wizard__icon" svg={icons.iconWand} />
            </span>
          </ContextualInformationMessage>
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
  plain: PropTypes.bool,
  name: PropTypes.string,
  wizardTooltip: PropTypes.string,
  onTooltipToggle: PropTypes.func,
};

SubmenuItem.defaultProps = {
  plain: false,
};

export default SubmenuItem;
