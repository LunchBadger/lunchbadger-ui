import React, {PureComponent} from 'react';
import SLSService from '../../../services/SLSService';
import {IconButton, ResizableWrapper} from '../../../../../lunchbadger-ui/src';
import './FunctionLogs.scss';

const errorMessage = 'Loading logs failed with error:';

export default class FunctionLogs extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logs: '',
      error: null,
      counter: '',
    };
  }

  componentWillMount() {
    this.reloadLogs(false);
    this.interval = setInterval(this.autorefreshInterval, 1000);
    this.tick = 0;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  autorefreshInterval = () => {
    const {autorefresh, period} = this.props;
    const refresh = autorefresh && (this.tick % period === 0);
    const counter = period - this.tick % period;
    autorefresh && this.setState({counter});
    refresh && this.reloadLogs();
    this.tick += 1;
  };

  reloadLogs = async (softLoad) => {
    if (softLoad && this.state.loading) return;
    const state = {
      loading: true,
      error: null,
    };
    if (this.state.logs === errorMessage) {
      state.logs = '';
    }
    this.setState(state, this.scrollDown);
    try {
      const {body: {logs}} = await SLSService.loadLogs(this.props.name);
      this.setState({
        logs,
        loading: false,
      }, this.scrollDown);
    } catch ({message: error}) {
      this.setState({
        logs: errorMessage,
        error,
        loading: false,
      }, this.scrollDown);
    }
  };

  scrollDown = () => this.contentRef.scrollTop = 10e5;

  render() {
    const {
      loading,
      logs,
      error,
      counter,
    } = this.state;
    const {autorefresh} = this.props;
    return (
      <ResizableWrapper>
        <div className="FunctionLogs">
          <div
            ref={r => this.contentRef = r}
            className="FunctionLogs__content"
          >
            <pre>
              {logs}
            </pre>
            {loading && <pre>Loading...</pre>}
            {error && <code dangerouslySetInnerHTML={{__html: error}} />}
          </div>
        </div>
        {autorefresh && (
          <div className="FunctionLogs__counter">
            {counter}
          </div>
        )}
      </ResizableWrapper>
    );
  }
}
