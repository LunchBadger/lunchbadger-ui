import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
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
    onClick: PropTypes.func,
  };

  static defaultProps = {
    icon: 'iconPlus',
  };

  handleClick = (_, value) => this.props.onClick(value);

  render() {
    const {icon, options} = this.props;
    return (
      <IconMenu
        iconButtonElement={<IconButton><Icon icon={icon} /></IconButton>}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        onChange={this.handleClick}
        touchTapCloseDelay={1}
        desktop
        maxHeight={250}
        listStyle={listStyle}
      >
        {options.map(item => <MenuItem key={item} value={item} primaryText={item} />)}
      </IconMenu>
    );
  }
}
//
