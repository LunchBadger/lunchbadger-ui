import App from './components/App/App';
import BaseTools from './plugs/BaseTools';

LunchBadgerCore.actions.registerPlugin(BaseTools);

// export
let LunchBadgerCompose = {
  components: {
    App: App
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerCompose = LunchBadgerCompose;
}

module.exports = LunchBadgerCompose;
