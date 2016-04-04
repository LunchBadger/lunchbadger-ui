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
        case 'AddProduct':
          action.product.name += ' ' + (Publics.length + 1);
          Publics.push(action.product);
          this.emitChange();
          break;
			}
		});
	}

	getData() {
		return Publics;
	}
}

export default new Public;
