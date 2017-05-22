import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import {SmoothCollapse} from '../';
import {IconSVG} from '../';
import iconArrow from '../../../../src/icons/icon-arrow.svg';
import './CollapsibleProperties.scss';

class CollapsibleProperties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleToggleCollapse = () => {
    this.setState({expanded: !this.state.expanded});
    this.props.onToggleCollapse();
  }

  render() {
    const {bar, collapsible} = this.props;
    const {expanded} = this.state;
    const classNames = cs('CollapsibleProperties', {
      ['expanded']: expanded,
      ['nonEditable']: typeof bar === 'string',
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
          <div className="CollapsibleProperties__bar__right">
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
};

CollapsibleProperties.propTypes = {
  bar: PropTypes.node.isRequired,
  collapsible: PropTypes.node.isRequired,
  onToggleCollapse: PropTypes.func,
}

CollapsibleProperties.defaultProps = {
  onToggleCollapse: () => {},
}

export default CollapsibleProperties;
