
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

var through = require('through');
var File = require('vinyl');

var minimist = require('minimist');

var knownOptions = {
    string: ['file', 'path'],
    default: { file: './', path: './' }
};

var commandLineOptions = minimist(argv, knownOptions);

var refList = function (out, options) {

    options = options || {};

    var files = [];
    var filePaths = [];

    var onFile = function (file) {
        files.push(file);
        var path
        if (options.absolute) {
            path = file.path;
        }
        else {
            path = file.path.replace(process.cwd(), '');
            path = path.replace(new RegExp('^[/\\\\]'), '');
        }
        filePaths.push(path.replace(/\\/g, '/'));
    };

    var onEnd = function () {

        var file = new File({
            path: out,
            contents: new Buffer(filePaths.map(function (a, b, i) {
                return '\n/// <reference path="' + a + '" />';
            }).join(""))
        });

        this.emit('data', file);
        this.emit('end');

    };

    return through(onFile, onEnd);

};

var spawn = require('child_process').spawn;



var ts_files = ['src/**/*.ts', 'src/**/*.tsx'];

// build
gulp.task('default', ['debug', 'min'], function () {

});

gulp.task('tsconfig_files', function () {
    gulp.src(ts_files).pipe(tsc_f());
    return gulp.src(ts_files).pipe(tsc_f());
})

gulp.task('typescript', ['tsconfig_files'], function () {

    var tsProject = ts.createProject({
        target: 'ES5',
        declarationFiles: true,
        declaration: true,
        noImplicitAny: false,
        noExternalResolve: false,
        orderOutput: true,
        typescript: require('typescript'),
        experimentalDecorators: true,
        noEmitOnError: true,
        emitBOM: false,
        emitDecoratorMetadata: true,
        diagnostics: true
    });

    var tsResult = gulp.src(ts_files)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(ts(tsProject, undefined, ts.reporter.longReporter()));

    tsResult.dts.pipe(refList('definitions.d.ts')).pipe(gulp.dest('./dist'));

    return merge([
        // Merge the two output streams, so this task is finished when the IO of both operations are done. 
        
        tsResult.dts.pipe(gulp.dest('./dist/src')),

        tsResult.js
            .pipe(concat('mz.js'))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest('src'))
    ]);
});

// build
gulp.task('min', ['typescript'], function () {
    return gulp.src('mz.js')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat('mz.min.js', {
            newLine: '\n;' // the newline is needed in case the file ends with a line comment, the semi-colon is needed if the last statement wasn't terminated
        }))
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

// uncompressed build, with sourcemaps
gulp.task('debug', ['typescript'], function () {
    return gulp.src(includeListTS)
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(concat('mzcore.js', {
            newLine: '\n;' // the newline is needed in case the file ends with a line comment, the semi-colon is needed if the last statement wasn't terminated
        }))
        .pipe(prepend(license))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('code', ['min', 'debug'], function () { });


gulp.task('dist_code', ['code'], function () {
    svn.commit('Build automatico. Only code. Tarea gulp dist_code', { args: 'dist' }, function (err) {
        if (err) {
            throw err;
        }
    })
})

gulp.task('dist', ['default'], function () {
    svn.commit('Build automatico. Tarea gulp dist', { args: 'dist' }, function (err) {
        if (err) {
            throw err;
        }
    })
})

gulp.task('vs', ['default'], function () { });