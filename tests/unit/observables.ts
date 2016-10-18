import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';
import assertType from '../support/assertType';

registerSuite({
	name: 'observables.d',
	'validate types'() {
		const file = 'src/observables.d.ts';
		const types = getTypeForFiles(file);
		const observablesTypes = types[file];
		assertType.isType(observablesTypes, 'NextObserver', 'NextObserver<T>');
		assertType.isType(observablesTypes, 'ErrorObserver', 'ErrorObserver<T>');
		assertType.isType(observablesTypes, 'CompletionObserver', 'CompletionObserver<T>');
		assertType.isType(observablesTypes, 'PartialObserver', 'PartialObserver<T>');
		assertType.isType(observablesTypes, 'Observable', 'Observable<T>');
		assertType.isType(observablesTypes, 'AnonymousSubscription', 'AnonymousSubscription');
		assertType.isType(observablesTypes, 'Subscription', 'Subscription');
	}
});
