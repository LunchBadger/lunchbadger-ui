import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {SmoothCollapse} from '../';
import {IconSVG} from '../';
import iconArrow from '../../../../src/icons/icon-arrow.svg';
import userStorage from '../../../lunchbadger-core/src/utils/userStorage';
import './CollapsibleProperties.scss';

class CollapsibleProperties extends Component {
  static propTypes = {
    name: PropTypes.string,
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
    classes: PropTypes.string,
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
    const expanded = userStorage.getObjectKey('CollapsibleExpanded', props.id);
    if (props.id && expanded !== undefined) {
      this.state.expanded = expanded;
    }
  }

  handleToggleCollapse = (val) => {
    const {id, onToggleCollapse} = this.props;
    const expanded = typeof val === 'boolean' ? val : !this.state.expanded
    this.setState({expanded});
    if (id) {
      userStorage.setObjectKey('CollapsibleExpanded', id, expanded);
    }
    onToggleCollapse();
  }

  render() {
    const {
      name,
      bar,
      collapsible,
      plain,
      barToggable,
      button,
      untoggable,
      space,
      noDividers,
      buttonOnHover,
      classes,
    } = this.props;
    const {expanded} = this.state;
    const classNames = cs('CollapsibleProperties', name, {
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
      <div className={cs(classNames, classes)}>
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
