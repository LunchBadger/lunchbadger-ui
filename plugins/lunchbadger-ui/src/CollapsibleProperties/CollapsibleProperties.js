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
  }

  static defaultProps = {
    onToggleCollapse: () => {},
    defaultOpened: false,
    plain: false,
    barToggable: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      expanded: props.defaultOpened,
    };
  }

  handleToggleCollapse = () => {
    this.setState({expanded: !this.state.expanded});
    this.props.onToggleCollapse();
  }

  render() {
    const {bar, collapsible, plain, barToggable} = this.props;
    const {expanded} = this.state;
    const classNames = cs('CollapsibleProperties', {
      expanded,
      plain,
      nonEditable: typeof bar === 'string',
      barToggable,
    });
    return (
      <div className={classNames}>
        <div className="CollapsibleProperties__bar">
          <div
            className="CollapsibleProperties__bar__left"
             onClick={this.handleToggleCollapse}
          >
            <div className="CollapsibleProperties__bar__left--arrow">
              <IconSVG svg={iconArrow} />
            </div>
          </div>
          <div
            className="CollapsibleProperties__bar__right"
            onClick={barToggable ? this.handleToggleCollapse : undefined}
          >
            {bar}
          </div>
        </div>
        <SmoothCollapse expanded={expanded} heightTransition="800ms ease">
          <div className="CollapsibleProperties__collapsible">
            {collapsible}
          </div>
        </SmoothCollapse>
      </div>
    );
  }
}

export default CollapsibleProperties;
