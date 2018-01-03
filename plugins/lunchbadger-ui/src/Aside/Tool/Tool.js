import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import SubmenuItem from './SubmenuItem';
import {IconSVG, ContextualInformationMessage} from '../../';
import * as icons from '../../../../../src/icons';
import './Tool.scss';

class Tool extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  toggleOpen = opened => this.setState({opened});

  onClick = () => {
    const {onClick, submenu, action} = this.props;
    if (submenu.length === 0) {
      onClick(action);
    } else {
      this.toggleOpen(true);
    }
  }

  onMenuItemClick = () => this.toggleOpen(false);

  render() {
    const {icon, selected, onClick, submenu, plain, tooltip, name} = this.props;
    const {opened} = this.state;
    const style = {
      width: '100%',
      height: '100%',
      border: 'none',
      padding: 0,
    };
    const isSubmenu = submenu.length > 0;
    const Button = (
      <IconButton style={style}>
        <IconSVG className="Tool__icon" svg={icons[icon]} />
      </IconButton>
    );
    return (
      <div className={cs('Tool', name, {opened, selected})}>
        <ContextualInformationMessage
          tooltip={tooltip}
        >
          <div
            className={cs('Tool__box', {opened, selected})}
            onClick={this.onClick}
          >
            {isSubmenu && (
              <IconMenu
                className="Tool__menu"
                style={style}
                iconButtonElement={Button}
                open={opened}
                onRequestChange={this.toggleOpen}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                targetOrigin={{vertical: 'top', horizontal: 'left'}}
              >
                {submenu.map((props, idx) => (
                  <SubmenuItem
                    key={idx}
                    {...props}
                    onMenuItemClick={this.onMenuItemClick}
                    plain={plain}
                    onClick={onClick}
                  />
                ))}
              </IconMenu>
            )}
            {!isSubmenu && Button}
          </div>
        </ContextualInformationMessage>
        {isSubmenu && <IconSVG className="Tool__arrow" svg={icons.iconArrow} />}
      </div>
    );
  }
}

Tool.propTypes = {
  icon: PropTypes.string,
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  submenu: PropTypes.array,
  plain: PropTypes.bool,
  tooltip: PropTypes.string,
  name: PropTypes.string,
};

Tool.defaultProps = {
  submenu: [],
};

export default Tool;
