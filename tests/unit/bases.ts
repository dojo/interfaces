import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite({
	name: 'bases.d',
	'validate types'() {
		const file = 'src/bases.d.ts';
		const types = getTypeForFiles(file);
		const basesTypes = types[file];
		assertType.isType(basesTypes, 'Destroyable', 'Destroyable');
		assertType.isType(basesTypes, 'Evented', 'Evented');
		assertType.isType(basesTypes, 'EventedCallback', 'EventedCallback<E>');
		assertType.isType(basesTypes, 'EventedListenersMap', 'EventedListenersMap<T>');
		assertType.isType(basesTypes, 'EventedListenerOrArray', 'EventedListenerOrArray<T, E>');
		assertType.isType(basesTypes, 'StateChangeEvent', 'StateChangeEvent<S>');
		assertType.isType(basesTypes, 'Stateful', 'Stateful<S>');
		assertType.isType(basesTypes, 'StatefulMixin', 'StatefulMixin<S>');
		assertType.isType(basesTypes, 'StatefulOptions', 'StatefulOptions<S>');
	}
});
