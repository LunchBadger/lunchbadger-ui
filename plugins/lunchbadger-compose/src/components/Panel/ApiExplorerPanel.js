import React, {Component} from 'react';
import cs from 'classnames';
import './ApiExplorerPanel.scss';

const {
  utils: {Config, getUser},
  components: {Panel},
  UI: {IconButton, ContextualInformationMessage},
} = LunchBadgerCore;
const RELOAD_DELAY = 5000;

const setRequestHeaders = (obj, headers) =>
  headers.forEach(([key, value]) => obj.setRequestHeader(key, value));

class ApiExplorerPanel extends Component {
  static type = 'ApiExplorerPanel';

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    props.parent.storageKey = 'API_EXPLORER_PANEL';
    this.apiExplorerUrl = Config.get('apiExplorerUrl');
  }

  componentDidMount() {
    window.addEventListener('ReloadApiExplorer', this.refreshPanelWithDelay);
  }

  componentWillUnmount() {
    window.removeEventListener('ReloadApiExplorer', this.refreshPanelWithDelay);
  }

  handlePanelRefresh = () => {
    const {apiExplorerRef} = this;
    if (!apiExplorerRef) return;
    this.setState({loading: true});
    if (Config.get('oauth')) {
      const appUrl = Config.get('oauth').redirect_uri;
      const headers = [
        ['Authorization', 'Bearer ' + getUser().id_token],
        ['Origin', appUrl],
        ['Referer', appUrl],
        ['cache-control', 'no-cache'],
      ];
      const xhr = new XMLHttpRequest();
      xhr.open('GET', this.apiExplorerUrl);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'blob';
      setRequestHeaders(xhr, headers);
      console.log({xhr, headers});
      xhr.send();
      function handler() {
        console.log('handler', this.readyState, this.DONE, this.status);
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            const dataUrl = URL.createObjectURL(this.response);
            console.log(dataUrl, this.response);
            apiExplorerRef.src = dataUrl;
          } else {
            console.error('Error accessing Api Explorer');
          }
        }
      }
    } else {
      apiExplorerRef.src = apiExplorerRef.src;
    }
  };

  handleApiExplorerLoaded = () => this.setState({loading: false});

  refreshPanelWithDelay = () => {
    this.setState({loading: true});
    setTimeout(this.handlePanelRefresh, RELOAD_DELAY);
  };

  /* uncomment, when ApiExplorer should be auto-reloaded on each panel opening */
  // onPanelOpen = () => this.handlePanelRefresh();

  render() {
    const {loading} = this.state;
    return (
      <div className={cs('panel__body', 'ApiExplorerPanel', {loading})}>
        <div className="ApiExplorerPanel__loader">
          Loading Api Explorer, please wait...
          <div className="spinner__overlay">
            <div className="spinner"></div>
          </div>
        </div>
        <iframe
          ref={r => this.apiExplorerRef = r}
          src={this.apiExplorerUrl}
          onLoad={this.handleApiExplorerLoaded}
        />
        <div className="ApiExplorerPanel__refresh">
          <ContextualInformationMessage
            tooltip="Refresh Api Explorer"
            direction="left"
          >
            <div>
              <IconButton
                icon="iconReload"
                name="reloadApiExplorer"
                onClick={this.handlePanelRefresh}
              />
            </div>
          </ContextualInformationMessage>
        </div>
      </div>
    );
  }
}

export default Panel(ApiExplorerPanel);
