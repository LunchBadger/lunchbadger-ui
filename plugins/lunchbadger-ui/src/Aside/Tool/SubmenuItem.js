import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import MenuItem from 'material-ui/MenuItem';
import {IconSVG, ContextualInformationMessage} from '../../';
import {iconWand} from '../../../../../src/icons';
import {tooltipSet} from '../../actions';
import './Tool.scss';

class SubmenuItem extends Component {
  toggleTooltip = (ref, visible, tooltip) => () => {
    const {top, right} = this[ref].getBoundingClientRect();
    this.props.setTooltip(
      visible ? tooltip : null,
      right + (ref === 'wizardDOM' ?  10 : 0),
      top + 12,
    );
  }

  onClick = (event) => {
    const {onMenuItemClick, onClick, setTooltip} = this.props;
    setTooltip(null);
    onMenuItemClick();
    if (event.target.closest('.Tool__wizard') === null) {
      onClick();
    }
  }

  onWizardClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const {setTooltip, wizard} = this.props;
    setTooltip(null);
    wizard();
  }

  render() {
    const {icon, label, name, wizard, plain, tooltip, wizardTooltip} = this.props;
    return (
      <MenuItem
        onTouchTap={this.onClick}
        style={{fontSize: 18, minHeight: 34, lineHeight: '34px'}}
        innerDivStyle={{padding: 0}}
      >
        <div
          className={cs('Tool__submenuItem', name)}
          style={{width: plain ? 130 : 224}}
        >
          <span
            ref={(r) => {this.labelDOM = r;}}
            onMouseEnter={this.toggleTooltip('labelDOM', true, tooltip)}
            onMouseLeave={this.toggleTooltip('labelDOM', false)}
          >
            <IconSVG className={cs('Tool__icon', 'submenu', {plain})} svg={icon} />
            <div className={cs('Tool__label', {plain})}>{label}</div>
          </span>
        </div>
        {wizard && (
          <span
            ref={(r) => {this.wizardDOM = r;}}
            className="Tool__wizard"
            onClick={this.onWizardClick}
            onMouseEnter={this.toggleTooltip('wizardDOM', true, wizardTooltip)}
            onMouseLeave={this.toggleTooltip('wizardDOM', false)}
          >
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
  plain: PropTypes.bool,
  tooltip: PropTypes.string,
  name: PropTypes.string,
  wizardTooltip: PropTypes.string,
  onTooltipToggle: PropTypes.func,
};

SubmenuItem.defaultProps = {
  tooltip: null,
  plain: false,
};

const mapDispatchToProps = dispatch => ({
  setTooltip: (content, left, top) => dispatch(tooltipSet(content, left, top)),
});

export default connect(null, mapDispatchToProps)(SubmenuItem);
