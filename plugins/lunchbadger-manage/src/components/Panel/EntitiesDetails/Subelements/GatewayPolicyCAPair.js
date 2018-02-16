import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {EntityPropertyLabel, CollapsibleProperties, IconButton} from '../../../../../../lunchbadger-ui/src';
import './GatewayPolicyCAPair.scss';

export default class GatewayPolicyCAPair extends PureComponent {
  static propTypes = {
    renderCondition: PropTypes.func,
    renderAction: PropTypes.func,
    nr: PropTypes.number,
    onRemove: PropTypes.func,
    onMoveDown: PropTypes.func,
    onMoveUp: PropTypes.func,
    moveDownDisabled: PropTypes.bool,
    moveUpDisabled: PropTypes.bool,
    prefix: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      horizontal: true,
    };
  }

  renderCA = () => {
    const {renderCondition, renderAction} = this.props;
    const {horizontal} = this.state;
    return (
      <div>
        <div className="GatewayPolicyCAPair__wrapper">
          <div className="GatewayPolicyCAPair__section">
            <EntityPropertyLabel noMargin>Condition</EntityPropertyLabel>
            {renderCondition(horizontal)}
          </div>
        </div>
        <div className="GatewayPolicyCAPair__wrapper">
          <div className="GatewayPolicyCAPair__section">
            <EntityPropertyLabel noMargin>Action</EntityPropertyLabel>
            {renderAction(horizontal)}
          </div>
        </div>
      </div>
    )
  };

  toggleMode = () => this.setState({horizontal: !this.state.horizontal});

  render() {
    const {
      nr,
      onRemove,
      onMoveDown,
      onMoveUp,
      moveDownDisabled,
      moveUpDisabled,
      prefix,
    } = this.props;
    const {horizontal} = this.state;
    const bar = (
      <EntityPropertyLabel plain className={`CAPair${nr}Label`}>
        C/A Pair {nr}
      </EntityPropertyLabel>
    );
    return (
      <div className={cs('GatewayPolicyCAPair', {horizontal, vertical: !horizontal})}>
        <CollapsibleProperties
          bar={bar}
          collapsible={this.renderCA()}
          button={(
            <span>
              <IconButton
                icon="iconDelete"
                name={`remove__${prefix}`}
                onClick={onRemove}
              />
              <IconButton
                icon="iconArrowDown"
                name={`moveDown__${prefix}`}
                onClick={onMoveDown}
                disabled={moveDownDisabled}
              />
              <IconButton
                icon="iconArrowUp"
                name={`moveUp__${prefix}`}
                onClick={onMoveUp}
                disabled={moveUpDisabled}
              />
              <IconButton
                icon="iconModeHorizontal"
                name={`modeHorizontal__${prefix}`}
                onClick={this.toggleMode}
                disabled={horizontal}
              />
              <IconButton
                icon="iconModeVertical"
                name={`modeVertical__${prefix}`}
                onClick={this.toggleMode}
                disabled={!horizontal}
              />
            </span>
          )}
          barToggable
          defaultOpened
          space="10px 0"
        />
      </div>
    )
  }
}
