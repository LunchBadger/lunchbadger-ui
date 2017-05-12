import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import './Clickable.scss';

class Clickable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    }
  }

  onClick = () => this.setState({clicked: !this.state.clicked});

  render() {
    const {title, children} = this.props;
    const {clicked} = this.state;
    return (
      <div className={cs('Clickable', {['clicked']: clicked})}>
        <div className="Clickable__box" onClick={this.onClick}>
          {title}
        </div>
        {children}
      </div>
    )
  }
}

Clickable.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
}

export default Clickable;
