module.exports = function (grunt) {
	require('grunt-dojo2').initConfig(grunt, {
		/* any custom configuration goes here */
	});

	function setCombined(combined) {
		if (combined) {
			grunt.config('intern.options.reporters', [
				{ id: 'tests/support/Reporter', file: 'coverage-unmapped.json' }
			]);
		}
	}
	setCombined(grunt.option('combined'));

	grunt.registerTask('test', function () {
		const flags = Object.keys(this.flags);

		if (!flags.length) {
			flags.push('node');
		}

		grunt.option('force', true);
		grunt.task.run('dev');
		setCombined(true);
		flags.forEach((flag) => {
			grunt.task.run('intern:' + flag);
		});
	});
};
