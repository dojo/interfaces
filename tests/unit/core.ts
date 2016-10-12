import * as fs from 'fs';
import * as assert from 'intern/chai!assert';
import * as registerSuite from 'intern!object';
import { getTypeForFiles } from '../support/util';

registerSuite({
	name: 'core.d',
	'check types'() {
		const file = 'src/core.d.ts';
		const types = getTypeForFiles(file);
		const core = fs.readFileSync('tests/fixtures/core.d.json', 'utf8');
		assert.deepEqual(types[file], JSON.parse(core));
	}
});
