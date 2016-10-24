import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite({
	name: 'loader.d',
	'validate types'() {
		const file = 'src/loader.d.ts';
		const types = getTypeForFiles(file);
		const coreTypes = types[file];
		assertType.isType(coreTypes, 'Config', 'Config');
		assertType.isType(coreTypes, 'Define', 'Define');
		assertType.isType(coreTypes, 'Factory', 'Factory');
		assertType.isType(coreTypes, 'Has', 'Has');
		assertType.isType(coreTypes, 'ModuleMap', 'ModuleMap');
		assertType.isType(coreTypes, 'ModuleMapItem', 'ModuleMapItem');
		assertType.isType(coreTypes, 'ModuleMapReplacement', 'ModuleMapReplacement');
		assertType.isType(coreTypes, 'Package', 'Package');
		assertType.isType(coreTypes, 'Require', 'Require');
		assertType.isType(coreTypes, 'RequireCallback', 'RequireCallback');
		assertType.isType(coreTypes, 'RootRequire', 'RootRequire');
		assertType.isType(coreTypes, 'SignalType', '"error"');
	}
});
