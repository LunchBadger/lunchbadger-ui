import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import {IconButton as Icon} from '../';
import getPlainText from '../utils/getPlainText';
import './IconMenu.scss';

const listStyle = {
  fontWeight: 400,
  fontSize: 'inherit',
  color: 'inherit',
};

export default class IconMenuComponent extends PureComponent {
  static propTypes = {
    icon: PropTypes.string,
    options: PropTypes.array,
    secondaryOptions: PropTypes.array,
    onClick: PropTypes.func,
    horizontal: PropTypes.string,
    vertical: PropTypes.string,
    name: PropTypes.string,
  };

  static defaultProps = {
    icon: 'iconPlus',
    secondaryOptions: [],
    horizontal: 'right',
    vertical: 'top',
  };

  handleClick = event => event.stopPropagation();

  handleChange = (event, value) => this.props.onClick(value, event);

  renderIconMenuItem = (item) => (
    <MenuItem
      key={item}
      value={item}
      primaryText={<div className={getPlainText(`IconMenuItem__${this.props.name}__${item}`)}>{item}</div>}
    />
  );

  render() {
    const {icon, options, secondaryOptions, horizontal, vertical, name} = this.props;
    const isSecondary = secondaryOptions.length > 0;
    const isDivider = isSecondary && options.length > 0;
    const origin = {horizontal, vertical};
    const iconButtonElement = (
      <IconButton className={getPlainText(`button__${name}`)}>
        <Icon icon={icon} />
      </IconButton>
    );
    return (
      <div onClick={this.handleClick}>
        <IconMenu
          iconButtonElement={iconButtonElement}
          anchorOrigin={origin}
          targetOrigin={origin}
          onChange={this.handleChange}
          touchTapCloseDelay={1}
          desktop
          maxHeight={250}
          listStyle={listStyle}
          desktop
        >
          {options.map(item => this.renderIconMenuItem(item))}
          {isDivider && <Divider />}
          {isSecondary && secondaryOptions.map(item => this.renderIconMenuItem(item))}
        </IconMenu>
      </div>
    );
  }
}
//
