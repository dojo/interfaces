const { registerSuite  } = intern.getInterface('object');
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite('shim.d', {
	'validate types'() {
		const file = 'src/shim.d.ts';
		const types = getTypeForFiles(file);
		const observablesTypes = types[file];
		assertType.isType(observablesTypes, 'ArrayLike', 'ArrayLike<T>');
		assertType.isType(observablesTypes, 'Thenable', 'Thenable<T>');
	}
});
