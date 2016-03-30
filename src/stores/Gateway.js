import BaseStore from 'stores/BaseStore';
import { register } from '../dispatcher/AppDispatcher';

const Gateways = [];

class Gateway extends BaseStore {
	constructor() {
		super();
		register((action) => {
			switch (action.type) {
				case 'AddGateway':
					action.gateway.name += ' ' + (Gateways.length + 1); 
					Gateways.push(action.gateway);
					this.emitChange();
					break;
			}
		});
	}

	getData() {
		return Gateways;
	}
}

export default new Gateway;