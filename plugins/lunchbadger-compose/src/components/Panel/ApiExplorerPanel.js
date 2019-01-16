import React, {Component} from 'react';
import cs from 'classnames';
import {ApiExplorerService} from '../../services';
import './ApiExplorerPanel.scss';

const {
  utils: {Config, getUser},
  components: {Panel},
  UI: {Button, CopyOnHover},
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
    this.refreshPanelWithDelay();
  }

  componentWillUnmount() {
    window.removeEventListener('ReloadApiExplorer', this.refreshPanelWithDelay);
  }

  handlePanelRefresh = async () => {
    this.setState({loading: true});
    try {
      const {body: spec} = await ApiExplorerService.loadSwaggerJson();
      const token = getUser().id_token;
      Object.assign(spec, {
        host: Config.get('apiExplorerHost'),
        schemes: [token ? 'https' : 'http'],
      });
      if (token) {
        Object.assign(spec, {
          securityDefinitions: {
            Bearer: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
            },
          },
          security: [{Bearer: []}],
        });
      }
      const {SwaggerUIBundle} = window;
      const ui = SwaggerUIBundle({
        dom_id: '#swaggerContainer',
        spec,
        // docExpansion: 'none',
        // presets: [
        //   SwaggerUIBundle.presets.apis,
        //   SwaggerUIBundle.SwaggerUIStandalonePreset,
        // ],
        // layout: 'StandaloneLayout',
      });
      if (token) {
        ui.authActions.authorize({
          Bearer: {
            name: 'Bearer',
            schema: {
              type: 'apiKey',
              in: 'header',
              name: 'Authorization',
              description: 'Bearer Token',
            },
            value: `Bearer ${getUser().id_token}`,
          },
        });
      }
      this.setState({loading: false});
    } catch (e) {
      this.refreshPanelWithDelay();
    }
  };

  refreshPanelWithDelay = () => {
    this.setState({loading: true});
    setTimeout(this.handlePanelRefresh, RELOAD_DELAY);
  };

  render() {
    const {loading} = this.state;
    const token = getUser().id_token;
    const isToken = !!token;
    const tokenTxt = isToken ? `Bearer ${token}` : '[None]';
    return (
      <div className={cs('panel__body', 'ApiExplorerPanel', {loading})}>
        <div className="ApiExplorerPanel__loader">
          Loading API Explorer, please wait...
          <div className="spinner__overlay">
            <div className="spinner"></div>
          </div>
        </div>
        <div className="ApiExplorerPanel__refresh">
          <code className="ApiExplorerPanel__token">
            <strong>Authorization token</strong>
            {isToken && (
              <CopyOnHover copy={tokenTxt}>
                {tokenTxt}
              </CopyOnHover>
            )}
            {isToken && <CopyOnHover copy={tokenTxt} />}
            {!isToken && <pre>{tokenTxt}</pre>}
          </code>
          <Button
            name="submit"
            onClick={this.handlePanelRefresh}
          >
            Reload API Explorer
          </Button>
        </div>
        <div
          id="swaggerContainer"
          className="ApiExplorerPanel__swagger"
        />
      </div>
    );
  }
}

export default Panel(ApiExplorerPanel);
