import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {SmoothCollapse} from '../';
import {IconSVG} from '../';
import iconArrow from '../../../../src/icons/icon-arrow.svg';
import './CollapsibleProperties.scss';

class CollapsibleProperties extends Component {
  static propTypes = {
    bar: PropTypes.node.isRequired,
    collapsible: PropTypes.node.isRequired,
    onToggleCollapse: PropTypes.func,
    defaultOpened: PropTypes.bool,
    plain: PropTypes.bool,
    barToggable: PropTypes.bool,
    button: PropTypes.node,
    untoggable: PropTypes.bool,
    space: PropTypes.string,
    noDividers: PropTypes.bool,
    buttonOnHover: PropTypes.bool,
  }

  static defaultProps = {
    onToggleCollapse: () => {},
    defaultOpened: false,
    plain: false,
    barToggable: false,
    untoggable: false,
    noDividers: false,
    buttonOnHover: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.defaultOpened,
    };
  }

  handleToggleCollapse = (expanded) => {
    this.setState({expanded: typeof expanded === 'boolean' ? expanded : !this.state.expanded});
    this.props.onToggleCollapse();
  }

  render() {
    const {
      bar,
      collapsible,
      plain,
      barToggable,
      button,
      untoggable,
      space,
      noDividers,
      buttonOnHover,
    } = this.props;
    const {expanded} = this.state;
    const classNames = cs('CollapsibleProperties', {
      expanded,
      plain,
      nonEditable: typeof bar === 'string',
      barToggable,
      withButton: !!button,
      untoggable,
      noDividers,
      buttonOnHover,
    });
    const barRightStyle = {};
    if (space) {
      barRightStyle.padding = space;
    }
    return (
      <div className={classNames}>
        <div className="CollapsibleProperties__bar">
          {!untoggable && (
            <div
              className="CollapsibleProperties__bar__left"
              onClick={this.handleToggleCollapse}
            >
              <div className="CollapsibleProperties__bar__left--arrow">
                <IconSVG svg={iconArrow} />
              </div>
            </div>
          )}
          <div className="CollapsibleProperties__bar__right" style={barRightStyle}>
            <div onClick={barToggable ? this.handleToggleCollapse : undefined}>
              {bar}
            </div>
            {!!button && (
              <div className="CollapsibleProperties__bar__right--button">
                {button}
              </div>
            )}
          </div>
        </div>
        {!untoggable && (
          <SmoothCollapse expanded={expanded} heightTransition="800ms ease">
            <div className="CollapsibleProperties__collapsible">
              {collapsible}
            </div>
          </SmoothCollapse>
        )}
        {untoggable && (
          <div className="CollapsibleProperties__collapsible">
            {collapsible}
          </div>
        )}
      </div>
    );
  }
}

export default CollapsibleProperties;
