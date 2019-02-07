import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import slug from 'slug';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';
import './ContextualInformationMessage.scss';

export default class ContextualInformationMessage extends PureComponent {
  static propTypes = {
    children: PropTypes.node,
    tooltip: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    direction: PropTypes.string,
    clickable: PropTypes.bool,
    onTooltipVisibleChange: PropTypes.func,
  };

  static defaultProps = {
    tooltip: '',
    direction: 'right',
    clickable: false,
    onTooltipVisibleChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  setVisible = () => this.onVisibleChange(true);

  setInvisible = () => this.onVisibleChange(false);

  onVisibleChange = (visible) => this.setState({visible}, () =>
    this.props.onTooltipVisibleChange(visible));

  render() {
    const {children, direction, tooltip, clickable} = this.props;
    const {visible} = this.state;
    if (tooltip === '') return <span>{children}</span>;
    const overlayStyle = {};
    if (!visible) {
      overlayStyle.display = 'none';
    }
    return (
      <span
        onClick={clickable ? this.setVisible : this.setInvisible}
        onMouseEnter={this.setVisible}
      >
        <Tooltip
          placement={direction}
          overlay={tooltip}
          mouseEnterDelay={0.5}
          transitionName="rc-tooltip-zoom"
          overlayStyle={overlayStyle}
          overlayClassName={cs('ContextualInformationMessage', slug(tooltip))}
          destroyTooltipOnHide
          // onVisibleChange={this.onVisibleChange}
        >
          {children}
        </Tooltip>
      </span>
    );
  }
}
