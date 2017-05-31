import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class CollapsableDetails extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    class: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: props.collapsed || false,
    }
  }

  render() {
    const extraClasses = this.props.class ? this.props.class.split(/\s+/) : [];
    const collapsedClass = classNames({collapsed: this.state.collapsed});
    const containerClass = classNames({collapsed: this.state.collapsed},
                                      ...extraClasses)

    return (
      <div className="details-panel__details">
        <h2 className={`${collapsedClass} details-panel__title`}
            onClick={() => {this.setState({collapsed: !this.state.collapsed});}}>
          <i className="fa fa-caret-down"/>
          {this.props.title}
        </h2>
        {!this.state.collapsed && (
          <div className={containerClass}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}
