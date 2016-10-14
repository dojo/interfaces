import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite({
	name: 'core.d',
	'validate types'() {
		const file = 'src/core.d.ts';
		const types = getTypeForFiles(file);
		const coreTypes = types[file];
		assertType.isType(coreTypes, 'EventCancelableObject', 'EventCancelableObject<T, U>');
		assertType.isType(coreTypes, 'EventErrorObject', 'EventErrorObject<T>');
		assertType.isType(coreTypes, 'EventObject', 'EventObject');
		assertType.isType(coreTypes, 'EventTargettedObject', 'EventTargettedObject<T>');
		assertType.isType(coreTypes, 'EventTypedObject', 'EventTypedObject<T>');
		assertType.isType(coreTypes, 'Factory', 'Factory<T, O>');
		assertType.isType(coreTypes, 'InsertPosition', 'InsertPosition');
		assertType.isType(coreTypes, 'Handle', 'Handle');
		assertType.isType(coreTypes, 'StylesMap', 'StylesMap');
	}
});
