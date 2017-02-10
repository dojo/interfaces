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
		distTasks
	});
};
