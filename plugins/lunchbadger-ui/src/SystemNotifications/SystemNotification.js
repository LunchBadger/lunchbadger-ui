import React, {Component} from 'react';
import cs from 'classnames';
import './SystemNotifications.scss';

class SystemNotification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    }
  }

  toggleOpen = () => this.setState({opened: !this.state.opened});

  render() {
    const {revision, output} = this.props;
    const {opened} = this.state;
    return (
      <div className="SystemNotification">
        <button className="SystemNotification__close">Close</button>
        <div className="SystemNotification__title">
          The workspace crashed
        </div>
        <div className="SystemNotification__details">
          <span className="SystemNotification__details__link" onClick={this.toggleOpen}>
            {`${opened ? 'Hide' : 'Show'} server output details`}
          </span>
          <pre className={cs('SystemNotification__details__output', {opened})}>
            {output}
          </pre>
        </div>
      </div>
    );
  }
}

export default SystemNotification;
