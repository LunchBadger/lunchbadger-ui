import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';

export default class CollapsableDetails extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      collapsed: false
    }
  }

  render() {
    const collapsedClass = classNames({collapsed: this.state.collapsed});

    return (
      <div className="details-panel__details">
        <h2 className={`${collapsedClass} details-panel__title`}
            onClick={() => {this.setState({collapsed: !this.state.collapsed});}}>
          <i className="fa fa-caret-down"/>
          {this.props.title}
        </h2>
        <div className={collapsedClass}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
