import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite({
	name: 'abilities.d',
	'validate types'() {
		const file = 'src/abilities.d.ts';
		const types = getTypeForFiles(file);
		const abilitiesTypes = types[file];
		assertType.isType(abilitiesTypes, 'Actionable', 'Actionable<T, E>');
		assertType.isType(abilitiesTypes, 'ActionableOptions', 'ActionableOptions<T, E>');
		assertType.isType(abilitiesTypes, 'Invalidatable', 'Invalidatable');
		assertType.isType(abilitiesTypes, 'Renderable', 'Renderable');
		assertType.isType(abilitiesTypes, 'RenderableParent', 'RenderableParent');
		assertType.isType(abilitiesTypes, 'StoreObservable', 'StoreObservable<T>');
		assertType.isType(abilitiesTypes, 'StorePatchable', 'StorePatchable<T>');
	}
});
