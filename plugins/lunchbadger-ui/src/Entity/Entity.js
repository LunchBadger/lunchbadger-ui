import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import {SmoothCollapse} from '../';
import EntityHeader from './EntityHeader/EntityHeader';
import './Entity.scss';

class Entity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      highlighted: false,
    };
  }

  handleToggleExpand = () => this.setState({expanded: !this.state.expanded});

  handleToggleHighlight = () => this.setState({highlighted: this.state.expanded ? true: !this.state.highlighted});

  render() {
    const {icon} = this.props;
    const {expanded, highlighted} = this.state;
    const classNames = cs('Entity', {['expanded']: expanded, ['highlighted']: highlighted});
    return (
      <div className={classNames} onClick={this.handleToggleHighlight}>
        <EntityHeader icon={icon} onToggleExpand={this.handleToggleExpand} />
        <SmoothCollapse expanded={expanded} heightTransition="800ms ease">
          ...
        </SmoothCollapse>
      </div>
    );
  }
}

Entity.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default Entity;
