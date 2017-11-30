const { registerSuite  } = intern.getInterface('object');
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite('loader.d', {
	'validate types'() {
		const file = 'src/loader.d.ts';
		const types = getTypeForFiles(file);
		const loaderTypes = types[file];
		assertType.isType(loaderTypes, 'Config', 'Config');
		assertType.isType(loaderTypes, 'Define', 'Define');
		assertType.isType(loaderTypes, 'Factory', 'Factory');
		assertType.isType(loaderTypes, 'Has', 'Has');
		assertType.isType(loaderTypes, 'ModuleMap', 'ModuleMap');
		assertType.isType(loaderTypes, 'ModuleMapItem', 'ModuleMapItem');
		assertType.isType(loaderTypes, 'ModuleMapReplacement', 'ModuleMapReplacement');
		assertType.isType(loaderTypes, 'NodeRequire', 'NodeRequire');
		assertType.isType(loaderTypes, 'Package', 'Package');
		assertType.isType(loaderTypes, 'Require', 'Require');
		assertType.isType(loaderTypes, 'RequireCallback', 'RequireCallback');
		assertType.isType(loaderTypes, 'RootRequire', 'RootRequire');
		assertType.isType(loaderTypes, 'SignalType', '"error"');
	}
});
