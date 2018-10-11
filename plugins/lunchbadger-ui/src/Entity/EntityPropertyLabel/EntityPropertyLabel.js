import React from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import IconButton from 'material-ui/IconButton';
import ActionHelp from 'material-ui/svg-icons/action/info-outline';
import {ContextualInformationMessage} from '../../';
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

const EntityPropertyLabel = ({children, className, plain, description = '', noMargin}) => (
  <div className={cs('EntityPropertyLabel', className, {plain, noMargin})}>
    {children}
    {!!description && (
      <ContextualInformationMessage
        tooltip={description}
        direction="top"
      >
        <IconButton
          className="EntityPropertyLabel__help"
          style={helpRootStyle}
          iconStyle={helpIconStyle}
        >
          <ActionHelp />
        </IconButton>
      </ContextualInformationMessage>
    )}
  </div>
);

EntityPropertyLabel.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default EntityPropertyLabel;
