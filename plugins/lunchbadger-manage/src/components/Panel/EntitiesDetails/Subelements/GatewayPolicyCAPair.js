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
    prefix: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      horizontal: true,
    };
  }

  renderCA = () => {
    const {renderCondition, renderAction, fake} = this.props;
    const {horizontal} = this.state;
    return (
      <div className="GatewayPolicyCAPair__box">
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
      prefix,
      fake,
      entityId,
    } = this.props;
    const {horizontal} = this.state;
    let title = `C/A Pair ${nr}`;
    if (fake) {
      title = 'Implicit C/A Pair';
    }
    const bar = (
      <EntityPropertyLabel plain className={`CAPairLabel CAPair${nr}Label`}>
        {title}
      </EntityPropertyLabel>
    );
    return (
      <div className={cs('GatewayPolicyCAPair', `${prefix}CAPair`, {
        horizontal,
        vertical: !horizontal,
        fake,
      })}>
        <CollapsibleProperties
          id={`${entityId}/${prefix}`}
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
          space="20px 0"
          buttonOnHover
        />
      </div>
    )
  }
}
