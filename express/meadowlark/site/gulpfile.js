const gulp = require('gulp')
const jshint = require('gulp-jshint')
const gmocha = require('gulp-mocha')
const exec = require('gulp-exec')

gulp.task('test', () =>
    gulp.src('./public/qa/*.js', {read: false})
        .pipe(gmocha({
            reporter: 'nyan',
            globals:['*']
        }))
);

gulp.task('lint', () =>
    gulp.src('./meadowlark.js')
        .pipe(jshint())
        .pipe(jshint.reporter('YOU_REPORTER_HERE'))
);

gulp.task('reset', () => {
    const options = {
        continueOnError: false,
        pepeStdout: false,
        customTemplatingThing: 'test'
    };
    const reportOptions = {
        err: true,
        stderr: true,
        stdout: true
    }
    return gulp.src('./meadowlark.js')
        .pipe(exec('git checkout <%= file.path %> <%= options.customTemplatingThing %>', option))
        .pipe(exec.reporter(reportOptions));
})

gulp.task('default', ['test', 'lint', 'reset']);