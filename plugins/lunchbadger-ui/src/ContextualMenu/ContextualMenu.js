import React, {Component} from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import './ContextualMenu.scss';

class ContextualMenu extends Component {
  render() {
    const {options} = this.props;
    return (
      <Menu>
        {options.map((item, idx) => (
          <MenuItem key={idx} primaryText={item} />
        ))}
      </Menu>
    );
  };
}

export default ContextualMenu;
