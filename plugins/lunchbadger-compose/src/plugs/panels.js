import ApiExplorerPanel from '../components/Panel/ApiExplorerPanel';
import Config from '../../../../src/config';

const panels = [];
if (Config.get('features').apiExplorer) {
  panels.push(ApiExplorerPanel);
}

export default panels;
