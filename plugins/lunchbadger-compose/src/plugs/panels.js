import ApiExplorerPanel from '../components/Panel/ApiExplorerPanel';

const {
  utils: {Config},
} = LunchBadgerCore;

const panels = [];
if (Config.get('features').apiExplorer) {
  panels.push(ApiExplorerPanel);
}

export default panels;
