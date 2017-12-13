import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import IconButton from 'material-ui/IconButton';
import ActionHelp from 'material-ui/svg-icons/action/info-outline';
import './EntityPropertyLabel.scss';

const iconSize = 16;

const helpRootStyle = {
  verticalAlign: 'bottom',
  padding: 0,
  width: iconSize,
  height: iconSize,
  marginLeft: 5,
  zIndex: 9,
};

const helpIconStyle = {
  width: iconSize,
  height: iconSize,
  color: '#aaa',
};

const helpTooltipStyle = {
  transform: 'translate(20px, 12px)',
  minWidth: 400,
  maxWidth: 600,
  lineHeight: 'normal',
  textAlign: 'left',
  padding: '5px 16px',
  opacity: 1,
};

const EntityPropertyLabel = ({children, className, plain, description = '', noMargin}) => (
  <div className={cs('EntityPropertyLabel', className, {plain, noMargin})}>
    {children}
    {description !== '' && (
      <IconButton
        className="EntityPropertyLabel__help"
        tooltip={description}
        touch
        tooltipPosition="top-right"
        style={helpRootStyle}
        iconStyle={helpIconStyle}
        tooltipStyles={helpTooltipStyle}
      >
        <ActionHelp />
      </IconButton>
    )}
  </div>
);

EntityPropertyLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default EntityPropertyLabel;
