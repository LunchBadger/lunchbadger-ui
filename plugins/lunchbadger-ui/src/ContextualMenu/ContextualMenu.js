import React, {Component} from 'react';
import './ContextualMenu.scss';

class ContextualMenu extends Component {
  render() {
    const {options} = this.props;
    return (
      <div className="ContextualMenu">
        {options.map((item, idx) => (
          <div key={idx} className="ContextualMenu__option">
            {item}
          </div>
        ))}
      </div>
    );
  };
}

export default ContextualMenu;
