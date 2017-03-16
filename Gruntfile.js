module.exports = function (grunt) {
	const distTasks = [
		'clean:typings',
		'typings:dist',
		'tslint',
		'clean:dist',
		'dojo-ts:dist',
		'fixSourceMaps',
		'copy:staticDefinitionFiles'
	];

	require('grunt-dojo2').initConfig(grunt, {
		distTasks,
		typedoc: {
			options: {
				ignoreCompilerErrors: true // Remove this once compile errors are resolved
			}
		}
	});
};
