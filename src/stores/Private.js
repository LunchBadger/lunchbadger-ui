import BaseStore from 'stores/BaseStore';
import { register } from '../dispatcher/AppDispatcher';

const Privates = [];

class Private extends BaseStore {
	constructor() {
		super();
		register((action) => {
			switch (action.type) {
				case 'AddPrivateEndpoint':
					action.endpoint.name += ' ' + (Privates.length + 1);
					Privates.push(action.endpoint);
					this.emitChange();
					break;
			}
		});
	}

	getData() {
		return Privates;
	}
}

export default new Private;