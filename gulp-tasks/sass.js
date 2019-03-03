/**
 *
 * @param {object} path - path
 * @param gulp
 * @param {object} plugins - gulp plugins
 * @param {boolean} isDev - flag
 * @returns {Function} - return task
 */

module.exports = function (path, gulp, plugins, isDev) {
  return function () {
    return gulp.src(path.src.sass)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError({
          message: '<%= error.message %>',
          title: 'SASS Error!',
        }),
      }))
      .pipe(plugins.if(isDev, plugins.sourcemaps.init()))
      .pipe(plugins.sass({
        precision: 20,
      }))
      .pipe(plugins.postcss([
        require('css-mqpacker'),
        require('autoprefixer')({
          browsers: ['> 1%', 'last 20 versions', 'Firefox ESR', 'Opera 12.1'],
          cascade: true,
        }),
      ]))
      .pipe(plugins.if(isDev, plugins.sourcemaps.write('../maps')))
      .pipe(plugins.if(!isDev, plugins.cssnano({
        autoprefixer: { remove: false },
      })))
      .pipe(plugins.rename({ dirname: '' }))
      .pipe(gulp.dest(path.build.sass));
  };
};