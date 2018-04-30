import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import './Transitioning.scss';

class Transitioning extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    const {children} = this.props;
    return (
      <CSSTransitionGroup
        transitionName="Transitioning"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
      >
        {children}
      </CSSTransitionGroup>
    );
  }
}

export default Transitioning;
