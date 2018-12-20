import React, {Component} from 'react';
import cs from 'classnames';
import Config from '../../../../../src/config';
import './ApiExplorerPanel.scss';

const {
  components: {Panel},
  UI: {IconButton, ContextualInformationMessage},
} = LunchBadgerCore;
const RELOAD_DELAY = 5000;

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
    apiExplorerRef.src = apiExplorerRef.src;
    this.setState({loading: true});
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
