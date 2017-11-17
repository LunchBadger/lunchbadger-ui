import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import {IconButton as Icon} from '../';
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
  };

  static defaultProps = {
    icon: 'iconPlus',
    secondaryOptions: [],
    horizontal: 'right',
    vertical: 'top',
  };

  handleClick = (_, value) => this.props.onClick(value);

  render() {
    const {icon, options, secondaryOptions, horizontal, vertical} = this.props;
    const isSecondary = secondaryOptions.length > 0;
    const isDivider = isSecondary && options.length > 0;
    const origin = {horizontal, vertical};
    return (
      <IconMenu
        iconButtonElement={<IconButton><Icon icon={icon} /></IconButton>}
        anchorOrigin={origin}
        targetOrigin={origin}
        onChange={this.handleClick}
        touchTapCloseDelay={1}
        desktop
        maxHeight={250}
        listStyle={listStyle}
      >
        {options.map(item => <MenuItem key={item} value={item} primaryText={item} />)}
        {isDivider && <Divider />}
        {isSecondary && secondaryOptions.map(item => <MenuItem key={item} value={item} primaryText={item} />)}
      </IconMenu>
    );
  }
}
//
