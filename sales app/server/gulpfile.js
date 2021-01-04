const gulp = require('gulp');
const ts = require('gulp-typescript');
const nodemon = require('gulp-nodemon');

// While development
// gulp.task("default", ["watch", "compile", "nodemon"]);

// While deployment
gulp.task('default', ['compile']);

//Watch chosen files
gulp.task('watch', function () {
  return gulp.watch('src/**/*.*', ['compile']);
});

//Compile chosen files from .ts to .js
gulp.task('compile', function () {
  return gulp
    .src('src/**/*.ts')
    .pipe(
      ts({
        module: 'commonjs',
        esModuleInterop: true,
        target: 'es6',
        noImplicitAny: true,
        moduleResolution: 'node',
        typeRoots: ['node_modules/@types'],
        baseUrl: '.',
        paths: {
          '*': ['node_modules/*', 'src/types/*'],
        },
        lib: ['es2015', 'dom'],
      })
    )
    .pipe(gulp.dest('lib'));
});

//Monitor application bootstrap file
gulp.task('nodemon', function () {
  nodemon({ script: 'dist/www.js' });
});
