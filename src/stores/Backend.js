import BaseStore from 'stores/BaseStore';
import { register } from '../dispatcher/AppDispatcher';

const Backends = [];

class Backend extends BaseStore {
	constructor() {
		super();
		register((action) => {
			switch (action.type) {
				case 'AddDataSource':
					action.dataSource.name += ' ' + (Backends.length + 1);
					Backends.push(action.dataSource);
					this.emitChange();
					break;
			}
		});
	}

	getData() {
		return Backends;
	}
}

export default new Backend;
