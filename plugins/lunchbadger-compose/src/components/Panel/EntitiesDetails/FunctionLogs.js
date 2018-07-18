import React, {PureComponent} from 'react';
import cs from 'classnames';
import SLSService from '../../../services/SLSService';
import {IconButton} from '../../../../../lunchbadger-ui/src';
import './FunctionLogs.scss';

export default class FunctionLogs extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logs: '',
    };
  }

  componentWillMount() {
    this.reloadLogs(false);
  }

  reloadLogs = async (softLoad) => {
    if (softLoad && this.state.loading) return;
    this.setState({loading: true}, this.scrollDown);
    const {body: {logs}} = await SLSService.loadLogs(this.props.name);
    this.setState({logs, loading: false}, this.scrollDown);
  };

  scrollDown = () => this.contentRef.scrollTop = 10e5;

  render() {
    const {
      loading,
      logs,
    } = this.state;
    return (
      <div className="FunctionLogs">
        <IconButton
          icon="iconReload"
          name="reloadLogs"
          onClick={this.reloadLogs}
        />
        <div
          ref={r => this.contentRef = r}
          className="FunctionLogs__content"
        >
          <pre>
            {logs}
          </pre>
          {loading && <pre>Loading...</pre>}
        </div>
      </div>
    );
  }
}
