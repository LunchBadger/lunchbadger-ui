import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import './ContextualInformationMessage.scss';

export default class ContextualInformationMessage extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    tooltip: PropTypes.string,
    direction: PropTypes.string,
  };

  static defaultProps = {
    tooltip: '',
    direction: 'right',
  };

  render() {
    const {children, direction, tooltip} = this.props;
    if (tooltip === '') return <span>{children}</span>;
    return (
      <Tooltip
        placement={direction}
        overlay={tooltip}
        mouseEnterDelay={0.5}
        transitionName="rc-tooltip-zoom"
      >
        {children}
      </Tooltip>
    );
  }
}
