import BaseStore from 'stores/BaseStore';
import { register } from '../dispatcher/AppDispatcher';

const PrivateEndpoints = [];

class PrivateEndpoint extends BaseStore {
	constructor() {
		super();
		register((action) => {
			switch (action.type) {
				case 'AddPrivateEndpoint':
					PrivateEndpoints.push(action.endpoint);
					this.emitChange();
					break;
			}
		});
	}

	getData() {
		return PrivateEndpoints;
	}
}

export default new PrivateEndpoint;