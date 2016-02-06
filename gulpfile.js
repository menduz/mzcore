
var license = '/* #fileVersion=' + (new Date()).toISOString() + ' */\n\n';


var argv = process.argv.splice(4);

//console.log("Argv: ", process.argv);


// import
var gulp = require('gulp');
var transform = require('vinyl-transform');
var uglify = require('gulp-uglify');
var prepend = require('gulp-insert').prepend;
var append = require('gulp-insert').append;
var concat = require('gulp-concat');
var order = require('gulp-order');
var path = require('path');
var ts = require('gulp-typescript');
var concat = require('gulp-concat-sourcemap');
var sourcemaps = require('gulp-sourcemaps');
var merge = require('merge2');
var svn = require('gulp-svn');
var tsc_f = require('gulp-tsconfig-files')
var qunit = require('gulp-qunit');
var through = require('through');
var File = require('vinyl');

var minimist = require('minimist');

var knownOptions = {
    string: ['file', 'path'],
    default: { file: './', path: './' }
};

var commandLineOptions = minimist(argv, knownOptions);

var spawn = require('child_process').spawn;


var ts_files = ['src/**/*.ts', 'src/**/*.tsx', '!src/mz.d.ts'];

// build
gulp.task('default', ['min'], function () {
    return merge([
        gulp.src(['./src/TSD/*.ts']).pipe(gulp.dest('./dist/src/TSD')),
        gulp.src(['./src/mz.js']).pipe(gulp.dest('./dist')),
        gulp.src(['./mz.d.ts']).pipe(gulp.dest('./dist'))
    ]);
});

gulp.task('test_full', ['default'], function () {
    return gulp.src('./test/index.html').pipe(qunit()).on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
    });
})


gulp.task('test', function () {
    return gulp.src('./test/index.html').pipe(qunit({ 'verbose': true })).on('error', function (err) {
        console.log(err.toString());
        this.emit('end');
    });
})

gulp.task('tsconfig_files', function () {
    gulp.src(ts_files).pipe(tsc_f());
    return gulp.src(ts_files).pipe(tsc_f());
});

gulp.task('typescript', ['tsconfig_files'], function () {
    var tsProject = ts.createProject('tsconfig.json', {
        typescript: require('typescript')
    });

    var tsResult = tsProject.src()
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(ts(tsProject, undefined, ts.reporter.longReporter()));

    return merge([
        // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        
        tsResult.dts.pipe(gulp.dest('./')),

        tsResult.js
            .pipe(concat('mz.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('src'))
    ]);
});

// build
gulp.task('min', ['typescript'], function () {
    return gulp.src('./src/mz.js')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat('mz.min.js'))
        .pipe(
            uglify({
                output: { // http://lisperator.net/uglifyjs/codegen
                    beautify: false
                },
                compress: { // http://lisperator.net/uglifyjs/compress, http://davidwalsh.name/compress-uglify
                    sequences: true,
                    booleans: true,
                    conditionals: true,
                    hoist_funs: false,
                    hoist_vars: false,
                    warnings: true
                },
                mangle: true,
                outSourceMap: true
            })
                .on('error', function (e) {
                    console.log('\x07', e.message);
                    return this.end();
                })
            )
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('code', ['min'], function () { });

gulp.task('vs', ['default'], function () { });