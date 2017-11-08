const { registerSuite  } = intern.getInterface('object');
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite('vdom.d', {
	'validate types'() {
		const file = 'src/vdom.d.ts';
		const types = getTypeForFiles(file);
		const observablesTypes = types[file];
		assertType.isType(observablesTypes, 'ProjectorOptions', 'ProjectorOptions');
		assertType.isType(observablesTypes, 'ProjectionOptions', 'ProjectionOptions');
		assertType.isType(observablesTypes, 'TransitionStrategy', 'TransitionStrategy');
		assertType.isType(observablesTypes, 'VNode', 'VNode');
		assertType.isType(observablesTypes, 'VNodeProperties', 'VNodeProperties');
	}
});
