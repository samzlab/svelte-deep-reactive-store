import { writable } from 'svelte/store';

function rootStore(data) {
	const store = writable(data);
	return {
		...store,
		refresh: () => store.update(data => data)
	}
}

const mutations = {
	'Array': new Set(['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']),
	'Set': new Set(['add', 'clear', 'delete']),
	'Map': new Set(['set', 'clear', 'delete']),
};

function reactive(obj, store = rootStore(obj)) {
	const objMutations = mutations[obj.constructor.name];
	const proxiedMethods = {};
	const cache = new WeakMap();
	let disabled = false;

	return new Proxy(obj, {
		set(target, key, val) {
			if (key === 'subscribe' || key === 'set' || key === 'update') {
				console.warn('The store methods are protected!')
				return;
			}

			
			const old = target[key];
			if (old !== val) {
				if (cache.has(old)) {
					cache.remove(old);
				}
				target[key] = val;
				store.refresh()
			}
			return true;
		},
		get(target, key) {
			if (key in store) {
				return store[key];
			} else {
				if (proxiedMethods[key]) return proxiedMethods[key];

				if (objMutations && objMutations.has(key)) {
					proxiedMethods[key] = (...args) => {
						target[key](...args);
						store.refresh();
					}
					return proxiedMethods[key];
				} else {
					const val = target[key];
					if (typeof val === 'object') {
						if (cache.has(val)) {
							return cache.get(val);
						}

						const result = reactive(val, store);
						cache.set(val, result);
						return result;
					}
					return val;
				}
			}
		}
	});
}

export default reactive;
