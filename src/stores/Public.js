import BaseStore from 'stores/BaseStore';
import { register } from '../dispatcher/AppDispatcher';

const Publics = [];

class Public extends BaseStore {
	constructor() {
		super();
		register((action) => {
			switch (action.type) {
				case 'AddPublicEndpoint':
					action.endpoint.name += ' ' + (Publics.length + 1);
					Publics.push(action.endpoint);
					this.emitChange();
					break;

        case 'UpdatePublicEndpoint':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
			}
		});
	}

	getData() {
		return Publics;
	}

  findEntity(id) {
    return _.find(Publics, {id: id});
  }
}

export default new Public;
