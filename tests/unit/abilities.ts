const { registerSuite  } = intern.getInterface('object');
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite('abilities.d', {
	'validate types'() {
		const file = 'src/abilities.d.ts';
		const types = getTypeForFiles(file);
		const abilitiesTypes = types[file];
		assertType.isType(abilitiesTypes, 'Actionable', 'Actionable<T, E>');
		assertType.isType(abilitiesTypes, 'ActionableOptions', 'ActionableOptions<T, E>');
	}
});
