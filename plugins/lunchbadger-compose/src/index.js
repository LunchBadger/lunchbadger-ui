window.deb('COMPOSE');
import reducers from './reducers';
import plugs from './plugs';

const {registerPlugin} = LunchBadgerCore.utils;
registerPlugin(reducers, plugs);

let LunchBadgerCompose = {};
if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCompose = LunchBadgerCompose;
}

window.deb('compose: ' + typeof registerPlugin);
window.deb('compose: ' + Object.keys(reducers).join(', '));
window.deb('compose: ' + Object.keys(plugs).join(', '));
window.deb('compose: ' + Object.values(plugs.tools).map(t => t.map(({name}) => name)).join(', '));

module.exports = LunchBadgerCompose;
