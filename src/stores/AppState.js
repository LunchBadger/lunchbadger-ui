import BaseStore from './BaseStore';
import _ from 'lodash';

const state = {};

class AppState extends BaseStore {
  constructor() {
    super();

    this.subscribe(() => this._registerActions.bind(this));
  }

  setStateKey(key, value) {
    state[key] = value;
    this.emitChange();
  }

  getStateKey(key) {
    return state[key];
  }

  _registerActions(action) {
    switch (action.type) {
      case 'AddElement':
        this.setStateKey('recentElement', action.element);
        break;

      case 'TogglePanel':
        const currentPanel = this.getStateKey('currentlyOpenedPanel');
        let panel = action.panelKey;

        if (currentPanel === panel) {
          panel = null;
        }

        if (panel !== null) {
          this.setStateKey('currentEditElement', null);
        }

        this.setStateKey('currentlyOpenedPanel', panel);
        this.setStateKey('isPanelOpened', panel ? true : false);
        this.emitChange();

        break;

      case 'ToggleHighlight':
        this.setStateKey('currentElement', action.element);
        this.emitChange();
        break;

      case 'RemoveEntity':
        const currentlyHighlighted = this.getStateKey('currentElement');

        if (currentlyHighlighted && currentlyHighlighted.id === action.entity.id) {
          this.setStateKey('currentElement', null);
          this.emitChange();
        }

        break;

      case 'ToggleEdit':
        this.setStateKey('currentEditElement', action.element);
        this.emitChange();
        break;

      case 'ToggleSubelement':
        const {parent, subelement} = action;

        const currentParent = this.getStateKey('currentlySelectedParent');
        const currentSubelements = this.getStateKey('currentlySelectedSubelements') || [];

        if (currentParent && parent.id === currentParent.id) {
          if (_.find(currentSubelements, {id: subelement.id})) {
            _.remove(currentSubelements, {id: subelement.id});
          } else {
            currentSubelements.push(subelement);
          }
        } else {
          _.remove(currentSubelements, () => true);
          this.setStateKey('currentlySelectedParent', parent);
          currentSubelements.push(subelement);
        }

        this.setStateKey('currentlySelectedSubelements', currentSubelements);

        this.emitChange();
        break;

      case 'SetProject':
        this.setStateKey('currentProject', action.project);
        break;

      case 'SetForecast':
        this.setStateKey('currentForecast', action.forecastData);
        this.setStateKey('currentForecastInformation', {
          id: action.forecastData.forecast.id,
          expanded: action.forecastData.expanded || false,
          selectedDate: action.forecastData.selectedDate
        });

        break;

      case 'InitializeAppState':
        const {serializedState} = action;

        if (serializedState['currentlyOpenedPanel']) {
          this.setStateKey('currentlyOpenedPanel', serializedState['currentlyOpenedPanel']);
          this.setStateKey('isPanelOpened', true);
        }

        if (serializedState['currentElement']) {
          this.setStateKey('currentElement', serializedState['currentElement']);
        }

        if (serializedState['currentForecast']) {
          this.setStateKey('currentForecastInformation', serializedState['currentForecast']);
        }

        this.emitInit();
        break;

      case 'ChangePanelStatus':
        this.setStateKey('panelEditingStatus', action.status ? true : false);
        this.setStateKey('panelEditingStatusSave', action.saveAction || null);
        this.setStateKey('panelEditingStatusDiscard', action.discardAction || null);

        this.emitChange();
        break;
    }
  }

  getData() {
    return state;
  }
}

export default new AppState();
