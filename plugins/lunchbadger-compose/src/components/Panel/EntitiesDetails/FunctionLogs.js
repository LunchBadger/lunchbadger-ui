import React, {PureComponent} from 'react';
import cs from 'classnames';
import SLSService from '../../../services/SLSService';
import {IconButton, ResizableWrapper} from '../../../../../lunchbadger-ui/src';
import './FunctionLogs.scss';

export default class FunctionLogs extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      logs: '',
      error: null,
    };
  }

  componentWillMount() {
    this.reloadLogs(false);
  }

  reloadLogs = async (softLoad) => {
    if (softLoad && this.state.loading) return;
    this.setState({
      loading: true,
      error: null,
    }, this.scrollDown);
    try {
      const {body: {logs}} = await SLSService.loadLogs(this.props.name);
      this.setState({
        logs,
        loading: false,
      }, this.scrollDown);
    } catch ({message: error}) {
      this.setState({
        logs: 'Loading logs failed with error:',
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
    } = this.state;
    return (
      <ResizableWrapper>
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
            {error && <code dangerouslySetInnerHTML={{__html: error}} />}
          </div>
        </div>
      </ResizableWrapper>
    );
  }
}
