import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
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

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  setVisible = () => this.setState({visible: true});

  setInvisible = () => this.setState({visible: false});

  render() {
    const {children, direction, tooltip} = this.props;
    const {visible} = this.state;
    if (tooltip === '') return <span>{children}</span>;
    const overlayStyle = {};
    if (!visible) {
      overlayStyle.display = 'none';
    }
    return (
      <span
        onClick={this.setInvisible}
        onMouseEnter={this.setVisible}
      >
        <Tooltip
          placement={direction}
          overlay={tooltip}
          mouseEnterDelay={0.5}
          transitionName="rc-tooltip-zoom"
          overlayStyle={overlayStyle}
        >
          {children}
        </Tooltip>
      </span>
    );
  }
}
